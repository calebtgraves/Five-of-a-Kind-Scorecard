import { useState, useEffect } from 'preact/hooks';

export type ThemeId =
  | 'dark-warm'
  | 'dark-cool'
  | 'dark-vibrant'
  | 'light-soft'
  | 'light-warm'
  | 'light-cool';

const THEME_KEY = 'five-of-a-kind-theme';
const DEFAULT_THEME: ThemeId = 'dark-vibrant';

export const THEMES: { id: ThemeId; label: string; bg: string; accent: string }[] = [
  { id: 'dark-warm',    label: 'Warm',    bg: '#1a1710', accent: '#d49e2e' },
  { id: 'dark-cool',    label: 'Cool',    bg: '#0f1a1d', accent: '#0eb4b4' },
  { id: 'dark-vibrant', label: 'Vibrant', bg: '#1a1a2e', accent: '#8b5cf6' },
  { id: 'light-warm',   label: 'Warm',    bg: '#faf7f2', accent: '#c48a1a' },
  { id: 'light-cool',   label: 'Cool',    bg: '#f0f8f8', accent: '#0a9e9e' },
  { id: 'light-soft',   label: 'Soft',    bg: '#f5f3f0', accent: '#7c5cbf' },
];

export const THEME_COLORS: Record<ThemeId, string> = {
  'dark-warm':    '#1a1710',
  'dark-cool':    '#0f1a1d',
  'dark-vibrant': '#1a1a2e',
  'light-soft':   '#f5f3f0',
  'light-warm':   '#faf7f2',
  'light-cool':   '#f0f8f8',
};

export function isLightTheme(id: ThemeId): boolean {
  return id.startsWith('light-');
}

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
  if (meta) meta.setAttribute('content', THEME_COLORS[id]);
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
