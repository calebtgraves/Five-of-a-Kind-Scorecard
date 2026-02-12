import { useState, useEffect, useRef } from 'preact/hooks';
import { THEMES, type ThemeId } from '../hooks/useTheme';

interface ThemeSwitcherProps {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

export function ThemeSwitcher({ theme, setTheme }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click/tap
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  return (
    <div ref={containerRef} class="relative flex items-end">
      {/* Toggle button (palette icon) */}
      <button
        onClick={() => setOpen((v) => !v)}
        class={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border border-border-strong shrink-0 ${
          open
            ? 'bg-accent text-on-accent shadow-lg'
            : 'bg-control hover:bg-control-hover text-text-muted hover:text-text'
        }`}
        aria-label="Theme picker"
        title="Change theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4.5 h-4.5">
          <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10a2.5 2.5 0 0 0 2.5-2.5c0-.61-.23-1.21-.64-1.67a.528.528 0 0 1-.13-.33c0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9m-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11m3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7m5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7m3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5"/>
        </svg>
      </button>

      {/* Slide-out panel (horizontal) */}
      <div
        class="flex items-center gap-2 ml-2 transition-all duration-300 ease-out"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateX(0)' : 'translateX(-12px)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            class={`w-7 h-7 rounded-full transition-all duration-200 cursor-pointer overflow-hidden ${
              theme === t.id
                ? 'scale-110 shadow-lg'
                : 'hover:scale-110 opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: t.bg,
              border: `3px solid ${t.accent}`,
            }}
            aria-label={`Switch to ${t.label} theme`}
            title={t.label}
          />
        ))}
      </div>
    </div>
  );
}
