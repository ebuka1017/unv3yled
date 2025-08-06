import { writable } from 'svelte/store';

type Theme = 'light' | 'dark' | 'system';

function createThemeStore() {
  // Get initial theme from localStorage or default to 'system'
  const initialTheme: Theme = typeof window !== 'undefined' ? 
    (localStorage.getItem('theme') as Theme) || 'system' : 'system';

  const { subscribe, set, update } = writable<Theme>(initialTheme);

  return {
    subscribe,
    set: (theme: Theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
      set(theme);
      applyTheme(theme);
    },
    toggle: () => update(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
      applyTheme(newTheme);
      return newTheme;
    })
  };
}

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.remove('light', 'dark');
    root.classList.add(systemTheme);
  } else {
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }
}

export const themeStore = createThemeStore();

// Initialize theme on app start
if (typeof window !== 'undefined') {
  const unsubscribe = themeStore.subscribe(theme => {
    applyTheme(theme);
  });
}