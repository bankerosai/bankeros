/**
 * ThemeToggle — Light/Dark theme switcher.
 * Persists choice in localStorage; applies via <html data-theme="...">.
 */
import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'bankeros.admin.theme';

export function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(STORAGE_KEY, t); } catch {}
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = (document.documentElement.dataset.theme as Theme) || getInitialTheme();
    return t;
  });

  useEffect(() => { applyTheme(theme); }, [theme]);

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        width: 36, height: 32,
        borderRadius: 8,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-hover)';
        e.currentTarget.style.color = 'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      {isDark ? '☾' : '☀'}
    </button>
  );
}
