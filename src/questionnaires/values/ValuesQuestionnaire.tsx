import {useEffect, useMemo, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {z} from "zod";
import {PageLayout} from "../../components/PageLayout";
import {Disclaimer} from "../../components/Disclaimer";
import questionnaireData from "./data.json";

// Color scheme now defined in tailwind.config.js

// ================== Zod Schemas with versioning ==================
const QuestionnaireItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  checked: z.boolean(),
  custom: z.boolean(),
});

const QuestionnaireSectionSchema = z.object({
  key: z.string(),
  title: z.string(),
  items: z.array(QuestionnaireItemSchema),
});

const QuestionnaireStateSchemaV1 = z.object({
  version: z.literal("1").optional().default("1"),
  sections: z.array(QuestionnaireSectionSchema),
});

const SaveDataSchema = z.object({
  createdAt: z.string(),
  isFromURL: z.boolean(),
});

const CURRENT_STATE_VERSION = "1";

// ================== Types (inferred from Zod schemas) ==================
export type QuestionnaireItem = z.infer<typeof QuestionnaireItemSchema>;
export type QuestionnaireSection = z.infer<typeof QuestionnaireSectionSchema>;
export type QuestionnaireState = z.infer<typeof QuestionnaireStateSchemaV1>;
export type SaveData = z.infer<typeof SaveDataSchema>;

interface RawSection {
  key: string;
  title: string;
  items: string[];
}

// ================== LocalStorage key ==================
const LS_KEY = "rm_er18_react_v1";

// ================== Default questionnaire definition ==================
const DEFAULT_SECTIONS_RAW: RawSection[] = questionnaireData.sections;

function makeDefaultState(): QuestionnaireState {
  return {
    version: CURRENT_STATE_VERSION,
    sections: DEFAULT_SECTIONS_RAW.map((s) => ({
      key: s.key,
      title: s.title,
      items: s.items.map((t, i) => ({ id: `${s.key}-${i}`, text: t, checked: false, custom: false })),
    })),
  };
}

function loadState(): QuestionnaireState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return makeDefaultState();

    const jsonData = JSON.parse(raw);

    // Validate with Zod schema
    const parseResult = QuestionnaireStateSchemaV1.safeParse(jsonData);
    if (!parseResult.success) {
      console.warn("Invalid state format, using defaults:", parseResult.error);
      return makeDefaultState();
    }

    const parsed = parseResult.data;

    // Soft-merge with defaults: ensure any new default items appear
    const map = new Map(parsed.sections.map((s) => [s.key, s]));
    const mergedSections = DEFAULT_SECTIONS_RAW.map((def) => {
      const have = map.get(def.key);
      if (!have) {
        return {
          key: def.key,
          title: def.title,
          items: def.items.map((t, i) => ({ id: `${def.key}-${i}`, text: t, checked: false, custom: false })),
        };
      }
      const ids = new Set(have.items.map((i) => i.id));
      const extra = def.items
        .map((t, i) => ({ id: `${def.key}-${i}`, text: t, checked: false, custom: false }))
        .filter((i) => !ids.has(i.id));
      return { key: def.key, title: def.title, items: [...have.items, ...extra] };
    });

    return { version: CURRENT_STATE_VERSION, sections: mergedSections };
  } catch (e) {
    console.warn("Failed to parse localStorage, using defaults.", e);
    return makeDefaultState();
  }
}

function saveState(state: QuestionnaireState): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function buildExportText(state: QuestionnaireState, mode: "all" | "checked" = "checked"): string {
  const lines: string[] = [];
  const title = "Опросник ценностей";
  lines.push(title);
  lines.push(`Экспорт: ${new Date().toLocaleString()}`);
  lines.push(`Режим: ${mode === "all" ? "все пункты" : "только отмеченные"}`);
  lines.push("");

  state.sections.forEach((section) => {
    const items = section.items.filter((i) => (mode === "all" ? true : i.checked));
    if (items.length === 0) return; // в режиме checked пропускаем пустые
    lines.push(section.title);
    items.forEach((it) => {
      const mark = it.checked ? "[x]" : "[ ]";
      const custom = it.custom ? " (добавлено)" : "";
      lines.push(`- ${mark} ${it.text}${custom}`);
    });
    lines.push("");
  });

  // FIX: join with proper newline escape
  return lines.join("\n");
}

function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ================== URL state encoding/decoding ==================
interface CompressedItem { id: string; text?: string; checked: boolean; custom: boolean; }
interface CompressedSection { key: string; items: CompressedItem[]; }
interface CompressedState { createdAt: string; sections: CompressedSection[]; }

function encodeStateToURL(state: QuestionnaireState): string | null {
  try {
    const compressedState: CompressedState = {
      createdAt: new Date().toISOString(),
      sections: state.sections
        .map((section) => ({
          key: section.key,
          items: section.items
            .filter((item) => item.checked || item.custom)
            .map((item) => ({
              id: item.id,
              text: item.custom ? item.text : undefined,
              checked: item.checked,
              custom: item.custom,
            })),
        }))
        .filter((section) => section.items.length > 0),
    };

    const jsonString = JSON.stringify(compressedState);
    return btoa(encodeURIComponent(jsonString));
  } catch (e) {
    console.error("Failed to encode state to URL:", e);
    return null;
  }
}

function decodeStateFromURL(encoded: string): { state: QuestionnaireState; metadata: SaveData } | null {
  try {
    const jsonString = decodeURIComponent(atob(encoded));
    const compressedState = JSON.parse(jsonString) as CompressedState;

    // Reconstruct full state by merging with defaults
    const fullState = makeDefaultState();

    // Create a map for easy lookup
    const compressedMap = new Map(compressedState.sections.map((s) => [s.key, s]));

    fullState.sections = fullState.sections.map(section => {
      const compressed = compressedMap.get(section.key);
      if (!compressed) return section;

      // Create maps for efficient lookup
      const compressedItemsMap = new Map(compressed.items.map((item) => [item.id, item]));
      const customItems = compressed.items.filter((item) => item.custom);

      // Update existing items
      const updatedItems = section.items.map(item => {
        const compressedItem = compressedItemsMap.get(item.id);
        return compressedItem ? { ...item, checked: compressedItem.checked } : item;
      });

      // Add custom items
      const existingIds = new Set(updatedItems.map(item => item.id));
      const newCustomItems: QuestionnaireItem[] = customItems
        .filter((item) => !existingIds.has(item.id) && item.text !== undefined)
        .map((item) => ({
          id: item.id,
          text: item.text as string, // Safe because we filtered for undefined above
          checked: item.checked,
          custom: true
        }));

      return {
        ...section,
        items: [...updatedItems, ...newCustomItems]
      };
    });

    // Return both the state and metadata
    return {
      state: fullState,
      metadata: {
        createdAt: compressedState.createdAt,
        isFromURL: true
      }
    };
  } catch (e) {
    console.error("Failed to decode state from URL:", e);
    return null;
  }
}

interface ExportModalProps {
  open: boolean;
  text: string;
  filename: string;
  onClose: () => void;
}

function ExportModal({ open, text, filename, onClose }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-overlay" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_10px_50px_rgba(2,6,23,0.6)]">
          <div className="flex items-center justify-between gap-3 border-b border-ring-beige px-5 py-4">
            <h3 className="text-lg font-bold text-fg">Экспорт в текст</h3>
            <button
              onClick={onClose}
              className="rounded-xl px-3 py-1 text-fg ring-1 bg-note border-border"
            >
              Закрыть
            </button>
          </div>
          <div className="space-y-3 p-5">
            <p className="text-sm pc-muted">Содержимое ниже можно скопировать или скачать как .txt</p>
            <textarea
              readOnly
              value={text}
              className="h-80 w-full rounded-2xl border border-border bg-surface p-3 font-mono text-sm text-fg"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} }}
                className="rounded-xl px-4 py-2 font-semibold text-white shadow-sm hover:brightness-110 bg-accent"
              >
                {copied ? "Скопировано!" : "Копировать"}
              </button>
              <button
                onClick={() => downloadText(filename, text)}
                className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:brightness-110 dark:bg-slate-700"
              >
                Скачать .txt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  section: QuestionnaireSection;
  onToggle: (sectionKey: string, itemId: string, checked: boolean) => void;
  onAdd: (sectionKey: string, text: string) => void;
  onRemove: (sectionKey: string, itemId: string) => void;
}

function Section({ section, onToggle, onAdd, onRemove }: SectionProps) {
  const [input, setInput] = useState("");

  return (
    <section className="pc-card p-4 shadow-sm md:p-6">
      <h2 className="mb-3 text-lg font-extrabold tracking-tight text-fg md:text-xl">{section.title}</h2>

      <div className="space-y-1.5">
        {section.items.map((it) => (
          <div key={it.id} className="flex items-center gap-2">
            <div
              className="pc-row group flex items-center gap-3 rounded-2xl p-2 min-h-[2.5rem] cursor-pointer flex-1"
              onClick={() => onToggle(section.key, it.id, !it.checked)}
            >
              <input
                id={it.id}
                type="checkbox"
                checked={it.checked}
                onChange={(e) => onToggle(section.key, it.id, e.target.checked)}
                className="pc-checkbox pointer-events-none"
              />
              <label htmlFor={it.id} className="select-none leading-6 text-fg flex-1 pointer-events-none">
                {it.text}
              </label>
              {it.custom && (
                <span className="rounded-full px-2 py-0.5 text-xs pc-muted bg-note">
                  добавлено
                </span>
              )}
            </div>
            {it.custom && (
              <button
                onClick={() => onRemove(section.key, it.id)}
                title="Удалить пользовательский пункт"
                className="inline-flex items-center justify-center rounded-full p-1 w-6 h-6 text-fg-muted hover:text-red-500 hover:bg-red-50 bg-note transition cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (input.trim()) {
                onAdd(section.key, input.trim());
                setInput("");
              }
            }
          }}
          placeholder="Другое — добавьте свой пункт и нажмите «Добавить»"
          aria-label="Другое"
          className="flex-1 rounded-xl border border-border bg-surface text-fg px-3 py-2"
        />
        <button
          onClick={() => { if (input.trim()) { onAdd(section.key, input.trim()); setInput(""); } }}
          className="rounded-xl px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110 bg-accent"
        >
          Добавить
        </button>
      </div>
    </section>
  );
}

export default function ValuesQuestionnaire() {
  const [searchParams] = useSearchParams();
  const [urlMetadata, setUrlMetadata] = useState<SaveData | null>(null);
  const [state, setState] = useState<QuestionnaireState>(() => {
    // First try to load from URL, then from localStorage
    const urlState = searchParams.get('data');
    if (urlState) {
      const decoded = decodeStateFromURL(urlState);
      if (decoded) {
        // We'll set the metadata in useEffect to avoid state update during render
        setTimeout(() => setUrlMetadata(decoded.metadata), 0);
        return decoded.state;
      }
    }
    return loadState();
  });
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportText, setExportText] = useState("");
  const [exportFile, setExportFile] = useState("");

  useEffect(() => { saveState(state); }, [state]);

  const totalChecked = useMemo(() =>
    state.sections.reduce((acc, s) => acc + s.items.filter((i) => i.checked).length, 0),
  [state]);

  const toggleItem = (sectionKey: string, itemId: string, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.key !== sectionKey ? s : {
          ...s,
          items: s.items.map((i) => (i.id === itemId ? { ...i, checked } : i)),
        }
      ),
    }));
  };

  const addCustomItem = (sectionKey: string, text: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.key !== sectionKey ? s : {
          ...s,
          items: [...s.items, { id: uid(sectionKey), text, checked: true, custom: true }],
        }
      ),
    }));
  };

  const removeCustomItem = (sectionKey: string, itemId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.key !== sectionKey ? s : { ...s, items: s.items.filter((i) => i.id !== itemId) }
      ),
    }));
  };

  const resetAll = () => {
    if (confirm("Очистить сохранённые данные и восстановить исходные пункты?")) {
      localStorage.removeItem(LS_KEY);
      setState(makeDefaultState());
    }
  };

  const openExport = (mode: "all" | "checked") => {
    const text = buildExportText(state, mode);
    setExportText(text);
    setExportFile(`Опросник_ценностей_${mode}_${nowStamp()}.txt`);
    setIsExportOpen(true);
  };

  const shareState = async () => {
    const encoded = encodeStateToURL(state);
    if (!encoded) {
      alert("Не удалось создать ссылку для обмена");
      return;
    }

    const shareUrl = new URL(window.location.origin + window.location.pathname);
    shareUrl.searchParams.set('data', encoded);
    const urlString = shareUrl.toString();

    try {
      await navigator.clipboard.writeText(urlString);
      alert("Ссылка скопирована в буфер обмена!\n\nВы можете поделиться этой ссылкой, чтобы другие увидели ваши выбранные пункты.");
    } catch (e) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = urlString;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert("Ссылка скопирована в буфер обмена!");
      } catch (err) {
        console.error('Could not copy text: ', err);
        prompt("Скопируйте эту ссылку:", urlString);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <PageLayout>

      <div className="relative mx-auto max-w-4xl px-4 py-6 md:py-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="rounded-xl px-3 py-2 font-semibold text-fg ring-1 backdrop-blur transition bg-surface hover:brightness-105 border-border">
              ← Назад
            </Link>
            <h1 className="text-2xl font-black tracking-tight text-fg md:text-3xl">
              Опросник ценностей
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden sm:inline text-sm pc-muted">Выбрано: {totalChecked}</span>
            <button onClick={shareState} className="rounded-xl px-3 py-2 font-semibold text-white shadow-sm transition hover:brightness-110 bg-accent">Поделиться</button>
            <button onClick={() => openExport("checked")} className="rounded-xl bg-emerald-600 px-3 py-2 font-semibold text-white shadow-sm transition hover:brightness-110">Экспорт выбранного</button>
            <button onClick={() => openExport("all")} className="rounded-xl bg-slate-900 px-3 py-2 font-semibold text-white shadow-sm transition hover:brightness-110">Экспорт всего</button>
            <button onClick={resetAll} className="rounded-xl bg-red-600 px-3 py-2 font-semibold text-white shadow-sm transition hover:brightness-110">Сбросить всё</button>
          </div>
        </header>

        {urlMetadata && (
          <div className="mb-4 rounded-2xl border border-border p-3 text-fg bg-surface">
            <span className="mr-2">📤</span>
            <span className="text-sm">Загружено из поделённой ссылки • Создано: {new Date(urlMetadata.createdAt).toLocaleString("ru-RU")}</span>
          </div>
        )}

        <Disclaimer variant="autosave" className="mb-6" />

        {/* One column — sections under another */}
        <main className="space-y-4 md:space-y-6">
          {state.sections.map((section) => (
            <Section
              key={section.key}
              section={section}
              onToggle={toggleItem}
              onAdd={addCustomItem}
              onRemove={removeCustomItem}
            />
          ))}
        </main>

        <div className="mt-8 rounded-[28px] border border-border bg-surface p-6 text-center shadow-[0_8px_40px_rgba(31,41,55,0.08)]">
          <h3 className="text-lg font-bold text-fg">Завершение опросника</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm pc-muted">
            Поделитесь ссылкой с выбранными пунктами или экспортируйте результаты в текстовый файл.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm pc-muted">Выбрано пунктов: {totalChecked}</span>
            <button onClick={shareState} className="rounded-xl px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110 bg-accent">Поделиться</button>
            <button onClick={() => openExport("checked")} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110">Экспорт выбранного</button>
            <button onClick={() => openExport("all")} className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110">Экспорт всего</button>
            <button onClick={resetAll} className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110">Сбросить всё</button>
          </div>
        </div>
      </div>

      <ExportModal open={isExportOpen} text={exportText} filename={exportFile} onClose={() => setIsExportOpen(false)} />
    </PageLayout>
  );
}
