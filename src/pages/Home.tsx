import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              PsyCollective
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium">
              Психологические инструменты и опросники
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border border-white/20 dark:border-slate-700/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Доступные опросники
            </h2>
            
            <div className="grid gap-6 md:gap-8">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-6 text-white text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-3">
                  Опросник ценностей — РМ_ЭР18
                </h3>
                <p className="text-emerald-50 mb-6 leading-relaxed">
                  Комплексный инструмент для исследования личных ценностей и жизненных приоритетов. 
                  Включает 14 категорий ценностей с возможностью добавления собственных пунктов.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/questionnaire/rm-er18"
                    className="inline-block bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
                  >
                    Начать опросник →
                  </Link>
                  <Link
                    to="/questionnaires"
                    className="inline-block bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
                  >
                    Все опросники
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Все данные сохраняются локально в вашем браузере и не передаются на сервер.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}