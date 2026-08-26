/**
 * Colour utilities used by the design-token engine.
 *
 * The token sandbox lets a visitor pick any accent colour, including ones that
 * are unreadable behind white text (amber on white is ~2.1:1). These helpers
 * derive a guaranteed-readable foreground so the UI never degrades below
 * WCAG 2.1 AA regardless of what the visitor picks.
 */

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Returns a normalised `#rrggbb` string, or null when the input isn't a hex colour. */
export function normalizeHex(input: string): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!HEX_RE.test(trimmed)) return null;

  let hex = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${hex.toLowerCase()}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = normalizeHex(hex) ?? '#000000';
  const int = parseInt(normalized.slice(1), 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** WCAG 2.1 relative luminance. */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const channel = v / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.1 contrast ratio between two hex colours (1 – 21). */
function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const LIGHT_FG = '#ffffff';
const DARK_FG = '#0a0a0b';

/**
 * Produces a solid-fill pair (background + foreground) that always clears AA.
 *
 * Some accents — indigo is the classic case — sit in a dead zone where neither
 * white nor black quite reaches 4.5:1. Rather than flipping to black text and
 * losing the intended look, the fill is nudged darker just enough for white to
 * pass, preserving the accent's hue.
 */
export function accentFill(accent: string, target = 4.5): { background: string; foreground: string } {
  const base = normalizeHex(accent);
  if (!base) return { background: accent, foreground: LIGHT_FG };

  const onWhite = contrastRatio(LIGHT_FG, base);
  if (onWhite >= target) return { background: base, foreground: LIGHT_FG };

  // Close enough that darkening the fill keeps the design intent intact.
  if (onWhite >= 3) {
    return { background: ensureContrast(base, LIGHT_FG, target), foreground: LIGHT_FG };
  }

  if (contrastRatio(DARK_FG, base) >= target) return { background: base, foreground: DARK_FG };

  return { background: ensureContrast(base, DARK_FG, target), foreground: DARK_FG };
}

function hexToHsl(hex: string): [number, number, number] {
  const [r255, g255, b255] = hexToRgb(hex);
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / delta + 2) / 6;
    else h = ((r - g) / delta + 4) / 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;

  let rgb: [number, number, number];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];

  return rgbToHex((rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255);
}

/**
 * Returns a variant of `color` (same hue/saturation, shifted lightness) that
 * meets `target` contrast against `background`. Used so the accent stays usable
 * as *text* on the page background in both themes — e.g. amber text on white
 * darkens to a readable ochre instead of disappearing.
 */
export function ensureContrast(color: string, background: string, target = 4.5): string {
  const base = normalizeHex(color);
  if (!base) return color;
  if (contrastRatio(base, background) >= target) return base;

  const [h, s] = hexToHsl(base);
  // Move lightness away from the background's luminance.
  const backgroundIsDark = relativeLuminance(background) < 0.5;
  const direction = backgroundIsDark ? 1 : -1;
  const [, , startL] = hexToHsl(base);

  let best = base;
  let bestRatio = contrastRatio(base, background);

  for (let step = 1; step <= 100; step += 1) {
    const l = startL + direction * step;
    if (l < 0 || l > 100) break;

    const candidate = hslToHex(h, s, l);
    const ratio = contrastRatio(candidate, background);

    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
    if (ratio >= target) return candidate;
  }

  return best;
}
