import { Link } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";

const questionnaires = [
  {
    id: "rm-er18",
    title: "Опросник ценностей — РМ_ЭР18",
    description: "Комплексный инструмент для исследования личных ценностей и жизненных приоритетов. Включает 14 категорий ценностей с возможностью добавления собственных пунктов.",
    status: "active",
    gradient: "from-emerald-500 to-blue-600"
  }
  // Future questionnaires can be added here
];

export default function Questionnaires() {
  return (
    <PageLayout className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Link
              to="/"
              className="inline-block text-accent-teal hover:underline mb-4"
            >
              ← Назад на главную
            </Link>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100">
              Все опросники
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Выберите опросник для прохождения
            </p>
          </div>

          <div className="grid gap-6 md:gap-8">
            {questionnaires.map((questionnaire) => (
              <div
                key={questionnaire.id}
                className="rounded-3xl p-8 shadow-xl border border-ring-beige bg-card-beige backdrop-blur"
              >
                <div className={`bg-gradient-to-r ${questionnaire.gradient} rounded-2xl p-6 text-white text-left`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl md:text-2xl font-bold">
                      {questionnaire.title}
                    </h3>
                    {questionnaire.status === "active" && (
                      <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                        Доступен
                      </span>
                    )}
                  </div>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    {questionnaire.description}
                  </p>
                  <Link
                    to={`/questionnaire/${questionnaire.id}`}
                    className="inline-block bg-white text-accent-teal px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg"
                  >
                    Начать опросник →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl p-8 shadow-xl border border-ring-beige bg-card-beige backdrop-blur">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
                Скоро появятся новые опросники
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Мы работаем над добавлением новых психологических инструментов и опросников.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}