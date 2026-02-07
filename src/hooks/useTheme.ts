import { useState, useEffect } from 'preact/hooks';

export type ThemeId = 'dark-warm' | 'dark-cool' | 'dark-vibrant' | 'light-soft';

const THEME_KEY = 'yahtzee-theme';
const DEFAULT_THEME: ThemeId = 'dark-vibrant';

export const THEMES: { id: ThemeId; label: string; preview: string }[] = [
  { id: 'dark-warm',    label: 'Warm',    preview: '#d49e2e' },
  { id: 'dark-cool',    label: 'Cool',    preview: '#0eb4b4' },
  { id: 'dark-vibrant', label: 'Vibrant', preview: '#8b5cf6' },
  { id: 'light-soft',   label: 'Light',   preview: '#f5f3f0' },
];

const META_COLORS: Record<ThemeId, string> = {
  'dark-warm':    '#1a1710',
  'dark-cool':    '#0f1a1d',
  'dark-vibrant': '#1a1a2e',
  'light-soft':   '#f5f3f0',
};

function getStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && THEMES.some((t) => t.id === stored)) return stored as ThemeId;
  } catch {}
  return DEFAULT_THEME;
}

function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', META_COLORS[id]);
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (id: ThemeId) => {
    try { localStorage.setItem(THEME_KEY, id); } catch {}
    setThemeState(id);
  };

  return { theme, setTheme };
}
