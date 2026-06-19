import { create } from 'zustand';

const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem('theme') || 'light',

  initTheme: () => {
    const currentTheme = get().theme;
    if (currentTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    set({ theme: nextTheme });
  },

  setTheme: (newTheme) => {
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    set({ theme: newTheme });
  }
}));

export default useThemeStore;
