import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ALL_KEYWORDS, SITE, buildJsonLd } from '@/lib/site';

/**
 * Google Sans only ever renders on non-Apple platforms — the `--font-sans`
 * stack in globals.css resolves to SF Pro via `-apple-system` long before it
 * reaches here. `preload: false` is deliberate: preloading would make every
 * Mac, iPad and iPhone download a webfont they never paint. Non-Apple clients
 * fetch it on first use, which `display: 'swap'` keeps from blocking text.
 *
 * Self-hosted rather than linked from fonts.googleapis.com so there is no
 * third-party stylesheet on the critical path; see app/fonts/NOTICE.md for
 * where the files came from and how to refresh them. Both files are the
 * variable (400–700) latin cut, matching the subset Inter was loaded with.
 */
const googleSans = localFont({
  src: [
    {
      path: './fonts/GoogleSans-Variable-latin.woff2',
      weight: '400 700',
      style: 'normal',
    },
    {
      path: './fonts/GoogleSans-VariableItalic-latin.woff2',
      weight: '400 700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-google-sans',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    // Any future route gets the name appended rather than standing alone.
    template: `%s — ${SITE.shortName}`,
  },
  description: SITE.description,
  applicationName: SITE.shortName,
  // Sourced from lib/site.ts so the meta tag, the <h1> and the JSON-LD
  // `knowsAbout` can never drift apart. See SEO_KEYWORDS there for what this
  // tag is actually worth (little, on its own) and where the terms do work.
  keywords: ALL_KEYWORDS,
  authors: [{ name: 'Awanish Verma', url: SITE.url }],
  creator: 'Awanish Verma',
  publisher: 'Awanish Verma',
  category: 'Design',
  // Tells Google which URL to credit when the page is reached with tracking
  // params or from a preview host, and stops those from splitting the ranking.
  alternates: {
    canonical: '/',
  },
  // Safari otherwise linkifies stray numbers in the CV as phone numbers.
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: 'profile',
    firstName: 'Awanish',
    lastName: 'Verma',
    username: 'awanishverma',
    locale: SITE.locale,
    url: '/',
    title: SITE.title,
    description: SITE.description,
    siteName: SITE.name,
    countryName: 'India',
    // Images come from app/opengraph-image.tsx automatically, alt included.
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    creator: SITE.twitterHandle,
    site: SITE.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Without these Google clips previews to a thumbnail and ~160 chars,
      // which for a visual portfolio throws away the strongest signal it has.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Paste the tokens from Search Console / Bing Webmaster Tools here. Bing
  // feeds Yahoo and DuckDuckGo, so verifying it covers three engines at once.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: SITE.themeColor.light },
    { media: '(prefers-color-scheme: dark)', color: SITE.themeColor.dark },
  ],
  colorScheme: 'dark light',
};

/**
 * Applies the stored theme and design tokens before first paint. Without this
 * the page renders in the default dark theme and then snaps to the visitor's
 * saved preference — a visible flash on every load.
 *
 * The accent is applied as a group or not at all. `--accent-text`,
 * `--accent-solid` and `--accent-contrast` are contrast-corrected variants that
 * only ThemeContext can compute (see lib/color.ts), so they arrive here via the
 * cache it writes. Setting a customised `--accent` while those stayed at their
 * blue-derived defaults is what used to paint the skip link white-on-amber at
 * ~2.1:1 for the whole pre-hydration window. If the cache is missing or was
 * derived from a different colour, everything accent-related is left to the
 * stylesheet: a default-blue first paint is a far better failure than an
 * unreadable one, and the cache is rewritten on this very load.
 */
const themeInitScript = `
(function () {
  try {
    var root = document.documentElement;
    var stored = localStorage.getItem('av_portfolio_theme');
    var mode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'dark';
    var resolved = mode === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;

    root.classList.toggle('dark', resolved === 'dark');
    root.classList.toggle('light', resolved === 'light');
    root.style.colorScheme = resolved;

    var tokens = JSON.parse(localStorage.getItem('av_portfolio_tokens') || '{}');
    var hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

    if (hex.test(tokens.accentColor || '')) {
      var cache = JSON.parse(localStorage.getItem('av_portfolio_accent_cache') || '{}');
      var text = resolved === 'dark' ? cache.textDark : cache.textLight;
      if (cache.accent === tokens.accentColor && hex.test(text || '') &&
          hex.test(cache.solid || '') && hex.test(cache.contrast || '')) {
        root.style.setProperty('--accent', tokens.accentColor);
        root.style.setProperty('--accent-text', text);
        root.style.setProperty('--accent-solid', cache.solid);
        root.style.setProperty('--accent-contrast', cache.contrast);
        if (hex.test(tokens.accentHoverColor || '')) {
          root.style.setProperty('--accent-hover', tokens.accentHoverColor);
        }
      }
    }

    if (['0px', '4px', '8px', '12px', '20px'].indexOf(tokens.radiusToken) !== -1) {
      root.style.setProperty('--radius-custom', tokens.radiusToken);
    }
    // Clamped to the same 14–18 range sanitizeTokens enforces, so a hand-edited
    // entry can't paint the whole document at 40px and then snap back.
    var size = Math.round(Number(tokens.baseFontSize));
    if (Number.isFinite(size)) {
      root.style.setProperty('--base-font-size', Math.min(18, Math.max(14, size)) + 'px');
    }
    var density = { compact: '0.7', comfortable: '1', spacious: '1.3' }[tokens.spacingDensity];
    if (density) root.style.setProperty('--space-multiplier', density);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${googleSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/*
         * Structured data lives in the server-rendered <head> so every crawler
         * sees it in the first response, without waiting on hydration. One
         * `@graph` describes the person, the site, the profile page and the
         * case studies as connected nodes.
         */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
