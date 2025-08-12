import { useTheme } from './ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-600">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <path
            d="m12 1-3 6 3-6zm0 18-3 6 3-6zM4.22 4.22l1.42 1.42-1.42-1.42zm15.56 15.56l1.42 1.42-1.42-1.42zM1 12l6-3-6 3zm18 0l6-3-6 3zM4.22 19.78l1.42-1.42-1.42 1.42zM18.36 5.64l1.42-1.42-1.42 1.42z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}