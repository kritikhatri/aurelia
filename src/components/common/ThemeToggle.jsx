import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useThemeStore from '../../features/useThemeStore';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-300 text-plum hover:bg-plum/5 dark:text-gold dark:hover:bg-gold/5 focus:outline-none"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
      )}
    </button>
  );
};

export default ThemeToggle;
