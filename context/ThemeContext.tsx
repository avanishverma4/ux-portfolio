'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { accentFill, ensureContrast, normalizeHex } from '@/lib/color';

export type ThemeMode = 'dark' | 'light' | 'system';
export type RadiusToken = '0px' | '4px' | '8px' | '12px' | '20px';
export type SpacingDensity = 'compact' | 'comfortable' | 'spacious';

export interface ColorPreset {
  name: string;
  hex: string;
  hoverHex: string;
  rgb: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Emerald Minimalist', hex: '#10b981', hoverHex: '#059669', rgb: '16 185 129' },
  { name: 'Cobalt Blue', hex: '#3b82f6', hoverHex: '#2563eb', rgb: '59 130 246' },
  { name: 'Sunset Amber', hex: '#f59e0b', hoverHex: '#d97706', rgb: '245 158 11' },
  { name: 'Crimson Rose', hex: '#f43f5e', hoverHex: '#e11d48', rgb: '244 63 94' },
];

export interface ThemeTokens {
  accentColor: string;
  accentHoverColor: string;
  radiusToken: RadiusToken;
  baseFontSize: number;
  spacingDensity: SpacingDensity;
}

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  tokens: ThemeTokens;
  /** Accent guaranteed readable as text on the current page background. */
  accentText: string;
  /** Accent fill for solid buttons, adjusted where needed so `onAccent` clears AA. */
  accentSolid: string;
  /** Foreground (white/near-black) guaranteed readable on top of `accentSolid`. */
  onAccent: string;
  updateToken: <K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) => void;
  resetTokens: () => void;
  exportTokensAsCSS: () => string;
  exportTokensAsTailwind: () => string;
}

// Kept in sync with the :root block in app/globals.css and the pre-paint
// fallbacks in app/layout.tsx — all three describe the same starting point, so
// a visitor with nothing stored gets one consistent look with no flash.
const DEFAULT_TOKENS: ThemeTokens = {
  accentColor: '#3b82f6',
  accentHoverColor: '#2563eb',
  radiusToken: '4px',
  baseFontSize: 16,
  spacingDensity: 'comfortable',
};

const RADIUS_VALUES: RadiusToken[] = ['0px', '4px', '8px', '12px', '20px'];
const DENSITY_VALUES: SpacingDensity[] = ['compact', 'comfortable', 'spacious'];

const PAGE_BG: Record<'dark' | 'light', string> = {
  light: '#fafafa',
  dark: '#050505',
};

const DENSITY_MULTIPLIER: Record<SpacingDensity, string> = {
  compact: '0.7',
  comfortable: '1',
  spacious: '1.3',
};

export const THEME_STORAGE_KEY = 'av_portfolio_theme';
export const TOKENS_STORAGE_KEY = 'av_portfolio_tokens';
/*
 * Derived-value cache, written here and read by the pre-paint script in
 * app/layout.tsx. `accentText` / `accentSolid` / `onAccent` come out of the
 * contrast maths in lib/color.ts, which is far too much code to restate inside
 * an inline <script> — and a second copy of it would drift. Caching the results
 * instead lets the script restore a customised accent *and* its readable
 * foreground together, with no maths of its own.
 *
 * `accent` stamps which colour the entries were derived from: the script
 * applies them only when it still matches the stored accent, so a stale cache
 * degrades to the defaults instead of painting a mismatched pair.
 */
export const ACCENT_CACHE_STORAGE_KEY = 'av_portfolio_accent_cache';

interface AccentCache {
  accent: string;
  solid: string;
  contrast: string;
  textLight: string;
  textDark: string;
}

/**
 * Anything can end up in localStorage (an older token shape, a half-written
 * value, a hand-edited string). Merge onto the defaults and drop bad fields so
 * a corrupt entry can't render the site with `undefined` colours.
 */
function sanitizeTokens(raw: unknown): ThemeTokens {
  if (typeof raw !== 'object' || raw === null) return DEFAULT_TOKENS;
  const input = raw as Partial<Record<keyof ThemeTokens, unknown>>;

  const accentColor = normalizeHex(String(input.accentColor ?? '')) ?? DEFAULT_TOKENS.accentColor;
  const accentHoverColor =
    normalizeHex(String(input.accentHoverColor ?? '')) ?? accentColor;

  const radiusToken = RADIUS_VALUES.includes(input.radiusToken as RadiusToken)
    ? (input.radiusToken as RadiusToken)
    : DEFAULT_TOKENS.radiusToken;

  const spacingDensity = DENSITY_VALUES.includes(input.spacingDensity as SpacingDensity)
    ? (input.spacingDensity as SpacingDensity)
    : DEFAULT_TOKENS.spacingDensity;

  const parsedFontSize = Number(input.baseFontSize);
  const baseFontSize = Number.isFinite(parsedFontSize)
    ? Math.min(18, Math.max(14, Math.round(parsedFontSize)))
    : DEFAULT_TOKENS.baseFontSize;

  return { accentColor, accentHoverColor, radiusToken, baseFontSize, spacingDensity };
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'dark' || value === 'light' || value === 'system';
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // Blocked or unavailable storage (private mode) — behave as if empty.
    return null;
  }
}

/*
 * Nothing outside this provider writes the two keys, so a stored snapshot only
 * ever changes once — from the server's `null` to the real value React reads
 * back straight after hydration. There is nothing to subscribe to.
 */
const neverChanges = () => () => {};

function subscribeToColorScheme(onChange: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /*
   * Rendering must start from the same defaults the server sent — reading
   * localStorage or matchMedia during render would make the client's first
   * paint disagree with the static HTML. `useSyncExternalStore` is what makes
   * that safe without a load-then-setState effect: it returns the server
   * snapshot while hydrating and re-reads the real one immediately after. The
   * inline script in app/layout.tsx covers the gap for everything expressible
   * as a CSS variable (theme class, --accent, radius, type scale, density), so
   * the page still paints correctly the first time.
   */
  const storedTheme = useSyncExternalStore(
    neverChanges,
    () => readStorage(THEME_STORAGE_KEY),
    () => null
  );
  const storedTokensRaw = useSyncExternalStore(
    neverChanges,
    () => readStorage(TOKENS_STORAGE_KEY),
    () => null
  );
  const systemPrefersDark = useSyncExternalStore(
    subscribeToColorScheme,
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => true
  );

  // What the visitor picks this session outranks whatever was stored. Null
  // means "nothing chosen yet", which is also what gates the writes below —
  // a visit that touches no control never rewrites storage.
  const [themeOverride, setThemeOverride] = useState<ThemeMode | null>(null);
  const [tokenOverride, setTokenOverride] = useState<ThemeTokens | null>(null);

  const theme: ThemeMode = themeOverride ?? (isThemeMode(storedTheme) ? storedTheme : 'dark');

  const storedTokens = useMemo(() => {
    if (!storedTokensRaw) return null;
    try {
      return sanitizeTokens(JSON.parse(storedTokensRaw));
    } catch {
      // Corrupt entry — defaults are fine.
      return null;
    }
  }, [storedTokensRaw]);

  const baseTokens = storedTokens ?? DEFAULT_TOKENS;
  const tokens = tokenOverride ?? baseTokens;

  const resolvedTheme: 'dark' | 'light' = useMemo(
    () => (theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme),
    [theme, systemPrefersDark]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.classList.toggle('light', resolvedTheme === 'light');
    root.style.colorScheme = resolvedTheme;

    if (themeOverride === null) return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeOverride);
    } catch {
      /* storage unavailable */
    }
  }, [themeOverride, resolvedTheme]);

  // Both themes are derived, not just the active one: the cache below has to
  // answer for whichever theme the next visit resolves to before React runs.
  const accentTextByTheme = useMemo(
    () => ({
      light: ensureContrast(tokens.accentColor, PAGE_BG.light, 4.5),
      dark: ensureContrast(tokens.accentColor, PAGE_BG.dark, 4.5),
    }),
    [tokens.accentColor]
  );
  const accentText = accentTextByTheme[resolvedTheme];

  const fill = useMemo(() => accentFill(tokens.accentColor), [tokens.accentColor]);
  const accentSolid = fill.background;
  const onAccent = fill.foreground;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', tokens.accentColor);
    root.style.setProperty('--accent-hover', tokens.accentHoverColor);
    root.style.setProperty('--accent-text', accentText);
    root.style.setProperty('--accent-solid', accentSolid);
    root.style.setProperty('--accent-contrast', onAccent);
    root.style.setProperty('--radius-custom', tokens.radiusToken);
    root.style.setProperty('--base-font-size', `${tokens.baseFontSize}px`);
    root.style.setProperty('--space-multiplier', DENSITY_MULTIPLIER[tokens.spacingDensity]);

    if (tokenOverride === null) return;
    try {
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokenOverride));
    } catch {
      /* storage unavailable */
    }
  }, [tokens, tokenOverride, accentText, accentSolid, onAccent]);

  useEffect(() => {
    const cache: AccentCache = {
      accent: tokens.accentColor,
      solid: accentSolid,
      contrast: onAccent,
      textLight: accentTextByTheme.light,
      textDark: accentTextByTheme.dark,
    };
    const serialized = JSON.stringify(cache);
    try {
      // Not gated on the visitor having changed anything — the whole point is
      // for this to be on disk before the *next* load's pre-paint script runs.
      // Re-reading first keeps a no-op visit from writing at all.
      if (localStorage.getItem(ACCENT_CACHE_STORAGE_KEY) !== serialized) {
        localStorage.setItem(ACCENT_CACHE_STORAGE_KEY, serialized);
      }
    } catch {
      /* storage unavailable — the script falls back to the CSS defaults */
    }
  }, [tokens.accentColor, accentSolid, onAccent, accentTextByTheme]);

  const setTheme = useCallback((newTheme: ThemeMode) => setThemeOverride(newTheme), []);

  // Toggle from what the visitor actually sees. Toggling off 'system' used to
  // land on 'dark' even when the system was already dark, so the button did nothing.
  const toggleTheme = useCallback(() => {
    setThemeOverride(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme]);

  const updateToken = useCallback(
    <K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) => {
      // Must stay a functional update: applying a colour preset calls this
      // twice in one handler, and reading `tokens` from the render closure
      // would make the second call overwrite the first with a stale base.
      // `baseTokens` only stands in for the very first edit of the session,
      // so that one builds on what was stored rather than on the defaults.
      setTokenOverride((prev) => ({ ...(prev ?? baseTokens), [key]: value }));
    },
    [baseTokens]
  );

  const resetTokens = useCallback(() => setTokenOverride(DEFAULT_TOKENS), []);

  const exportTokensAsCSS = useCallback(
    () => `:root {
  --accent: ${tokens.accentColor};
  --accent-hover: ${tokens.accentHoverColor};
  --accent-text: ${accentText};
  --accent-solid: ${accentSolid};
  --accent-contrast: ${onAccent};
  --radius-custom: ${tokens.radiusToken};
  --base-font-size: ${tokens.baseFontSize}px;
  --space-multiplier: ${DENSITY_MULTIPLIER[tokens.spacingDensity]};
}`,
    [tokens, accentText, accentSolid, onAccent]
  );

  const exportTokensAsTailwind = useCallback(
    () => `/* Tailwind CSS v4 Theme Config */
@theme {
  --color-accent: ${tokens.accentColor};
  --color-accent-hover: ${tokens.accentHoverColor};
  --color-accent-text: ${accentText};
  --color-accent-solid: ${accentSolid};
  --color-accent-contrast: ${onAccent};
  --radius-custom: ${tokens.radiusToken};
  --text-base: ${tokens.baseFontSize}px;
  --spacing-multiplier: ${DENSITY_MULTIPLIER[tokens.spacingDensity]};
}`,
    [tokens, accentText, accentSolid, onAccent]
  );

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      tokens,
      accentText,
      accentSolid,
      onAccent,
      updateToken,
      resetTokens,
      exportTokensAsCSS,
      exportTokensAsTailwind,
    }),
    [
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      tokens,
      accentText,
      accentSolid,
      onAccent,
      updateToken,
      resetTokens,
      exportTokensAsCSS,
      exportTokensAsTailwind,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
