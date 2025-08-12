import { Link } from "react-router-dom";
import { LeafBadge, Bubbles } from "../components/DecorativeComponents";
import { PageLayout } from "../components/PageLayout";

export default function Home() {
  return (
    <PageLayout className="min-h-screen">
      {/* Additional bubbles for Home page */}
      <Bubbles className="pointer-events-none absolute right-1/4 bottom-24 w-16 opacity-60" />

      <div className="relative mx-auto max-w-5xl px-6 py-14 md:px-10 md:py-20">
        <header className="mb-8 text-center md:mb-12">
          <h1 className="text-4xl font-black tracking-tight text-slate-800 md:text-6xl">
            PsyCollective
          </h1>
          <p className="mt-3 text-lg text-slate-700 md:text-2xl">
            Психологические инструменты и опросники
          </p>
        </header>

        {/* основная карточка */}
        <section className="rounded-[32px] border border-[#eadbcb] bg-[#FFF9F2]/90 p-6 shadow-[0_8px_40px_rgba(31,41,55,0.08)] backdrop-blur md:p-10">
          <h2 className="mb-6 text-2xl font-bold text-slate-800 md:mb-8 md:text-3xl">
            Опросник ценностей
          </h2>

          {/* выделенный опросник */}
          <div className="relative overflow-hidden rounded-3xl bg-[#2E8A84] p-6 text-white md:p-8">
            <LeafBadge className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 opacity-30" />
            <h3 className="text-xl font-bold md:text-2xl">Опросник ценностей — РМ_ЭР18</h3>
            <p className="mt-3 max-w-3xl text-white/90 md:mt-4">
              Комплексный инструмент для исследования личных ценностей и жизненных приоритетов.
              Включает 14 категорий ценностей с возможностью добавления собственных пунктов.
            </p>
            <div className="mt-6">
              <Link
                to="/questionnaire/rm-er18"
                className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-[#2E8A84] shadow-md transition hover:bg-white/90"
              >
                Начать опросник →
              </Link>
            </div>
          </div>


          {/* дисклеймер */}
          <div className="mt-8 rounded-2xl bg-[#FFF3E4] p-4 text-sm text-slate-700 ring-1 ring-[#eadbcb] md:mt-10 md:p-5">
            Все опросники проходят <span className="font-semibold">локально</span> в вашем браузере; результаты
            <span className="font-semibold"> не отправляются</span> на сервер.
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

