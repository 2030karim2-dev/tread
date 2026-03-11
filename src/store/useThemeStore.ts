import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const stored = localStorage.getItem('theme');
  const isDark = stored === 'dark';
  if (isDark) document.documentElement.classList.add('dark');

  return {
    isDark,
    toggle: () =>
      set((state) => {
        const next = !state.isDark;
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
        return { isDark: next };
      }),
  };
});
