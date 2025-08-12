import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

// LocalStorage key
const LS_KEY = "rm_er18_react_v1";

// Default questionnaire definition
const DEFAULT_SECTIONS_RAW = [
  { key: "A", title: "А. Заботиться об отношениях", items: [
    "Восстанавливать старые отношения.",
    "Завести новые отношения.",
    "Работать над нынешними отношениями.",
    "Завершить деструктивные отношения."
  ]},
  { key: "B", title: "Б. Быть частью группы", items: [
    "Иметь близкие и удовлетворительные отношения с людьми.",
    "Испытывать чувство принадлежности.",
    "Получать любовь и внимание.",
    "Принимать участие в жизни людей; состоять с ними в близких отношениях; иметь близких друзей.",
    "Быть рядом и проводить время с членами своей семьи.",
    "Делать что-либо вместе с кем-то."
  ]},
  { key: "V", title: "В. Быть сильным и влиять на людей", items: [
    "Иметь полномочия одобрять/не одобрять то, что делают люди, или контролировать то, как они используют ресурсы.",
    "Быть лидером.",
    "Зарабатывать много денег.",
    "Быть уважаемым.",
    "Считаться успешным; стать хорошо известным; получать признание и статус.",
    "Успешно конкурировать с другими людьми.",
    "Быть популярным и принятым."
  ]},
  { key: "G", title: "Г. Достигнуть чего-то в жизни", items: [
    "Достигнуть значимых целей; участвовать в начинаниях, которые я считаю важными.",
    "Быть эффективным.",
    "Стремиться к достижению цели; усердно работать.",
    "Быть амбициозным."
  ]},
  { key: "D", title: "Д. Жить в радости и удовлетворении", items: [
    "Хорошо проводить время.",
    "Жить в поисках удовольствий и среди вещей, которые их приносят.",
    "Иметь свободное время.",
    "Наслаждаться своей работой."
  ]},
  { key: "E", title: "Е. Жить насыщенно и искать новизну", items: [
    "Наполнять жизнь захватывающими событиями, отношениями и вещами.",
    "Вносить новые и разные вещи в жизнь.",
    "Быть смелым и искать приключений; жить насыщенной жизнью."
  ]},
  { key: "K", title: "К. Вести себя уважительно", items: [
    "Быть скромным и смиренным; не привлекать к себе внимания.",
    "Следовать традициям и обычаям; вести себя подобающим образом.",
    "Делать то, что мне говорят, и соблюдать правила.",
    "Хорошо относиться к людям."
  ]},
  { key: "Z", title: "З. Быть самостоятельным", items: [
    "Идти своим путём по жизни.",
    "Быть новатором, придумывать новые идеи и быть творческой личностью.",
    "Принимать собственные решения и быть свободным.",
    "Быть независимым; заботиться о себе и о тех, за кого я несу ответственность.",
    "Иметь свободу мысли и действий; действовать в собственных интересах."
  ]},
  { key: "L", title: "Л. Быть духовным человеком", items: [
    "Оставлять место для духовности; жить согласно духовным принципам.",
    "Использовать религию или веру.",
    "Развиваться, понимать себя, своё призвание и свою реальную цель.",
    "Почитать и исполнять волю Бога (или иной божественной сущности)."
  ]},
  { key: "I", title: "И. Заботиться о благополучии и безопасности", items: [
    "Жить в безопасных условиях.",
    "Быть физически здоровым.",
    "Иметь стабильный доход, который удовлетворяет мои основные потребности и потребности моей семьи."
  ]},
  { key: "J", title: "Й. Видеть во всём хорошее", items: [
    "Быть честным, обращаться со всеми людьми одинаково и предоставлять им равные возможности.",
    "Понимать разных людей; быть открытым.",
    "Заботиться о природе и окружающей среде."
  ]},
  { key: "M", title: "М. Вносить вклад в общество в более широком смысле", items: [
    "Помогать людям и нуждающимся; заботиться о благополучии окружающих; улучшать общество.",
    "Быть снисходительным к друзьям и посвящать себя близким; быть приверженным группе, разделяющей мои убеждения, ценности и этические принципы.",
    "Быть приверженным делу или группе, цель которой намного шире моей собственной цели.",
    "Идти на жертвы ради других."
  ]},
  { key: "N", title: "Н. Работать над саморазвитием", items: [
    "Разрабатывать личную философию жизни.",
    "Узнавать и выполнять сложные вещи, которые помогают мне расти и развиваться как человеку."
  ]},
  { key: "O", title: "О. Быть добродетельным", items: [
    "Быть честным; осознавать и заявлять свои личные убеждения.",
    "Быть ответственным; держать своё слово.",
    "Быть смелым; преодолевать жизненные препятствия.",
    "Быть человеком, который отдаёт долги другим и исправляет причинённый вред.",
    "Принимать себя, других и жизнь такой, какая она есть; жить без обмана."
  ]}
];

function makeDefaultState() {
  return {
    sections: DEFAULT_SECTIONS_RAW.map((s) => ({
      key: s.key,
      title: s.title,
      items: s.items.map((t, i) => ({ id: `${s.key}-${i}`, text: t, checked: false, custom: false })),
    })),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return makeDefaultState();
    const parsed = JSON.parse(raw);

    // Soft-merge with defaults: ensure any new default items appear
    const map = new Map(parsed.sections.map((s) => [s.key, s]));
    const mergedSections = DEFAULT_SECTIONS_RAW.map((def) => {
      const have = map.get(def.key);
      if (!have) {
        return {
          key: def.key,
          title: def.title,
          items: def.items.map((t, i) => ({ id: `${def.key}-${i}` , text: t, checked: false, custom: false })),
        };
      }
      const ids = new Set(have.items.map((i) => i.id));
      const extra = def.items
        .map((t, i) => ({ id: `${def.key}-${i}`, text: t, checked: false, custom: false }))
        .filter((i) => !ids.has(i.id));
      return { key: def.key, title: def.title, items: [...have.items, ...extra] };
    });

    return { sections: mergedSections };
  } catch (e) {
    console.warn("Failed to parse localStorage, using defaults.", e);
    return makeDefaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function buildExportText(state, mode = "checked") {
  const lines = [];
  const title = "Опросник ценностей — РМ_ЭР18";
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

function downloadText(filename, text) {
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

// URL state encoding/decoding functions
function encodeStateToURL(state) {
  try {
    // Create a compressed version with only essential data
    const compressedState = {
      createdAt: new Date().toISOString(),
      sections: state.sections.map(section => ({
        key: section.key,
        items: section.items
          .filter(item => item.checked || item.custom)
          .map(item => ({
            id: item.id,
            text: item.custom ? item.text : undefined, // Only store text for custom items
            checked: item.checked,
            custom: item.custom
          }))
      })).filter(section => section.items.length > 0) // Only include sections with data
    };
    
    const jsonString = JSON.stringify(compressedState);
    const encoded = btoa(encodeURIComponent(jsonString));
    return encoded;
  } catch (e) {
    console.error("Failed to encode state to URL:", e);
    return null;
  }
}

function decodeStateFromURL(encoded) {
  try {
    const jsonString = decodeURIComponent(atob(encoded));
    const compressedState = JSON.parse(jsonString);
    
    // Reconstruct full state by merging with defaults
    const fullState = makeDefaultState();
    
    // Create a map for easy lookup
    const compressedMap = new Map(compressedState.sections.map(s => [s.key, s]));
    
    fullState.sections = fullState.sections.map(section => {
      const compressed = compressedMap.get(section.key);
      if (!compressed) return section;
      
      // Create maps for efficient lookup
      const compressedItemsMap = new Map(compressed.items.map(item => [item.id, item]));
      const customItems = compressed.items.filter(item => item.custom);
      
      // Update existing items
      const updatedItems = section.items.map(item => {
        const compressedItem = compressedItemsMap.get(item.id);
        return compressedItem ? { ...item, checked: compressedItem.checked } : item;
      });
      
      // Add custom items
      const existingIds = new Set(updatedItems.map(item => item.id));
      const newCustomItems = customItems
        .filter(item => !existingIds.has(item.id))
        .map(item => ({
          id: item.id,
          text: item.text,
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

function ExportModal({ open, text, filename, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-bold">Экспорт в текст</h3>
            <button onClick={onClose} className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800">Закрыть</button>
          </div>
          <div className="p-4 md:p-6 space-y-3">
            <p className="text-sm text-slate-500">Содержимое ниже можно скопировать или скачать как .txt</p>
            <textarea
              readOnly
              value={text}
              className="w-full h-80 md:h-96 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={async () => {
                  try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false), 1500); } catch {}
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:brightness-110"
              >{copied ? "Скопировано!" : "Копировать"}</button>
              <button
                onClick={() => downloadText(filename, text)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:brightness-110"
              >Скачать .txt</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ section, onToggle, onAdd, onRemove }) {
  const [input, setInput] = useState("");

  return (
    <section className="w-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-2xl p-4 md:p-6 shadow-sm">
      <h2 className="text-lg md:text-xl font-extrabold tracking-tight mb-3">{section.title}</h2>

      <ul className="space-y-3">
        {section.items.map((it) => (
          <li key={it.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60">
            <input
              id={it.id}
              type="checkbox"
              checked={!!it.checked}
              onChange={(e) => onToggle(section.key, it.id, e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-300 dark:border-slate-600"
            />
            <label htmlFor={it.id} className="select-none leading-6">
              {it.text}
            </label>
            {it.custom && (
              <span className="ml-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">добавлено</span>
            )}
            {it.custom && (
              <button
                onClick={() => onRemove(section.key, it.id)}
                title="Удалить пользовательский пункт"
                className="ml-auto -mr-1 inline-flex items-center justify-center rounded-md p-1 text-slate-500 hover:text-red-600"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>

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
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
        />
        <button
          onClick={() => {
            if (input.trim()) {
              onAdd(section.key, input.trim());
              setInput("");
            }
          }}
          className="px-4 py-2 font-semibold rounded-xl bg-blue-600 text-white hover:brightness-110"
        >
          Добавить
        </button>
      </div>
    </section>
  );
}

// --- Minimal self-tests to guard against regressions in export formatting ---
function runSelfTests() {
  try {
    const sample = {
      sections: [
        {
          key: "T",
          title: "Тестовый раздел",
          items: [
            { id: "t-1", text: "Item 1", checked: true, custom: false },
            { id: "t-2", text: "Item 2", checked: false, custom: true },
          ],
        },
        { key: "U", title: "Пустой раздел", items: [] },
      ],
    };

    const txtChecked = buildExportText(sample, "checked");
    console.assert(txtChecked.includes("Тестовый раздел"), "Checked: section title should be present");
    console.assert(txtChecked.includes("- [x] Item 1"), "Checked: marked item should be present");
    console.assert(!txtChecked.includes("Item 2"), "Checked: unchecked items should be omitted");
    console.assert(!txtChecked.includes("Пустой раздел"), "Checked: empty sections should be omitted");

    const txtAll = buildExportText(sample, "all");
    console.assert(txtAll.includes("- [x] Item 1"), "All: checked item present");
    console.assert(txtAll.includes("- [ ] Item 2 (добавлено)"), "All: unchecked custom item with tag present");
    console.assert(txtAll.split("\n").length > 5, "Text should contain multiple newline-separated lines");

    console.log("Self-tests passed ✔");
  } catch (e) {
    console.error("Self-tests failed ✖", e);
  }
}

export default function RmEr18Questionnaire() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [urlMetadata, setUrlMetadata] = useState(null);
  const [state, setState] = useState(() => {
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
  useEffect(() => { runSelfTests(); }, []);

  const totalChecked = useMemo(() =>
    state.sections.reduce((acc, s) => acc + s.items.filter((i) => i.checked).length, 0),
  [state]);

  const toggleItem = (sectionKey, itemId, checked) => {
    setState((prev) => ({
      sections: prev.sections.map((s) =>
        s.key !== sectionKey ? s : {
          ...s,
          items: s.items.map((i) => (i.id === itemId ? { ...i, checked } : i)),
        }
      ),
    }));
  };

  const addCustomItem = (sectionKey, text) => {
    setState((prev) => ({
      sections: prev.sections.map((s) =>
        s.key !== sectionKey ? s : {
          ...s,
          items: [...s.items, { id: uid(sectionKey), text, checked: false, custom: true }],
        }
      ),
    }));
  };

  const removeCustomItem = (sectionKey, itemId) => {
    setState((prev) => ({
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

  const openExport = (mode) => {
    const text = buildExportText(state, mode);
    setExportText(text);
    setExportFile(`РМ_ЭР18_${mode}_${nowStamp()}.txt`);
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
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-4 md:py-6">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-semibold"
            >
              ← Назад
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Опросник ценностей — РМ_ЭР18</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden sm:inline text-sm text-slate-500">Выбрано: {totalChecked}</span>
            <button onClick={shareState} className="px-3 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:brightness-110">Поделиться</button>
            <button onClick={() => openExport('checked')} className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:brightness-110">Экспорт выбранного</button>
            <button onClick={() => openExport('all')} className="px-3 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 font-semibold hover:brightness-110">Экспорт всего</button>
            <button onClick={resetAll} className="px-3 py-2 rounded-xl bg-red-600 text-white font-semibold hover:brightness-110">Сбросить всё</button>
          </div>
        </header>

        {/* URL sharing notification */}
        {urlMetadata && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <span className="text-sm font-medium">📤 Загружено из поделённой ссылки</span>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Создано: {new Date(urlMetadata.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
          </div>
        )}

        {/* localStorage disclaimer */}
        <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            💾 <strong>Автосохранение включено.</strong> Все ваши данные сохраняются только в браузере и не передаются на сервер.
          </p>
        </div>

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

        {/* Export section at the end */}
        <div className="mt-8 p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Завершение опросника
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Вы можете поделиться ссылкой с выбранными пунктами, экспортировать результаты в текстовый файл для сохранения или анализа.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-slate-500">Выбрано пунктов: {totalChecked}</span>
              <button 
                onClick={shareState} 
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:brightness-110 transition-all"
              >
                Поделиться
              </button>
              <button 
                onClick={() => openExport('checked')} 
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:brightness-110 transition-all"
              >
                Экспорт выбранного
              </button>
              <button 
                onClick={() => openExport('all')} 
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 font-semibold hover:brightness-110 transition-all"
              >
                Экспорт всего
              </button>
              <button 
                onClick={resetAll} 
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:brightness-110 transition-all"
              >
                Сбросить всё
              </button>
            </div>
          </div>
        </div>
      </div>

      <ExportModal
        open={isExportOpen}
        text={exportText}
        filename={exportFile}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}