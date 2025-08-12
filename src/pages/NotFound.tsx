import { Link } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";

export default function NotFound() {
  return (
    <PageLayout className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="rounded-3xl p-8 shadow-xl border border-ring-beige bg-card-beige backdrop-blur">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Страница не найдена
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Запрашиваемая страница не существует или была перемещена.
          </p>
          <Link
            to="/"
            className="inline-block bg-accent-teal text-white px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}