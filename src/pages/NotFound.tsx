import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Страница не найдена
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Запрашиваемая страница не существует или была перемещена.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}