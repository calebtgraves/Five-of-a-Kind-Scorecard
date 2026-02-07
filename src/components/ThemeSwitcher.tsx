import { THEMES, type ThemeId } from '../hooks/useTheme';

interface ThemeSwitcherProps {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

export function ThemeSwitcher({ theme, setTheme }: ThemeSwitcherProps) {
  return (
    <div class="flex items-center gap-2">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          class={`w-6 h-6 rounded-full transition-all cursor-pointer border-2 ${
            theme === t.id
              ? 'scale-110 border-current'
              : 'border-transparent hover:scale-110 opacity-60 hover:opacity-100'
          }`}
          style={{ backgroundColor: t.preview }}
          aria-label={`Switch to ${t.label} theme`}
          title={t.label}
        />
      ))}
    </div>
  );
}
