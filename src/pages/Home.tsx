import { Link } from "react-router-dom";
import { LeafBadge, Bubbles } from "../components/DecorativeComponents";
import { PageLayout } from "../components/PageLayout";
import { Disclaimer } from "../components/Disclaimer";

export default function Home() {
  return (
    <PageLayout className="min-h-screen">
      {/* Additional bubbles for Home page */}
      <Bubbles className="pointer-events-none absolute right-1/4 bottom-24 w-16 opacity-60" />

      <div className="relative mx-auto max-w-5xl px-6 py-14 md:px-10 md:py-20">
        <header className="mb-8 text-center md:mb-12">
          <h1 className="text-4xl font-black tracking-tight text-fg md:text-6xl">
            PsyCollective
          </h1>
          <p className="mt-3 text-lg pc-muted md:text-2xl">
            Психологические инструменты и опросники
          </p>
        </header>

        {/* основная карточка */}
        <section className="pc-card rounded-[32px] p-6 shadow-[0_8px_40px_rgba(31,41,55,0.08)] md:p-10">
          {/* выделенный опросник */}
          <div className="relative overflow-hidden rounded-3xl bg-accent p-6 text-on-accent md:p-8">
            <LeafBadge className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 opacity-30" />
            <h3 className="text-xl font-bold md:text-2xl text-on-accent">Опросник ценностей — РМ_ЭР18</h3>
            <p className="mt-3 max-w-3xl md:mt-4 text-on-accent opacity-90">
              Комплексный инструмент для исследования личных ценностей и жизненных приоритетов.
              Включает 14 категорий ценностей с возможностью добавления собственных пунктов.
            </p>
            <div className="mt-6">
              <Link
                to="/questionnaire/rm-er18"
                className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-accent shadow-md transition hover:bg-white/90"
              >
                Начать опросник →
              </Link>
            </div>
          </div>

          <Disclaimer variant="general" className="mt-8 md:mt-10" />
        </section>
      </div>
    </PageLayout>
  );
}

