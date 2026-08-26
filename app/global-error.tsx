'use client';

import React, { useEffect } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import './globals.css';

/**
 * Last resort: catches errors thrown by the root layout itself, which
 * `app/error.tsx` sits inside and therefore cannot catch.
 *
 * This component *replaces* the root layout, so everything the layout normally
 * provides is gone — it has to ship its own <html>/<body>, import the
 * stylesheet, and re-apply the theme class. It also runs in production only;
 * in dev the error overlay takes precedence.
 *
 * Deliberately inert: no <Link>, no icon package, no ThemeProvider, no hooks
 * beyond the log. The layout that would normally supply that context is exactly
 * what failed, so the recovery screen leans on nothing but the stylesheet, a
 * plain anchor, and a static data import that cannot itself throw.
 */

/**
 * A pared-back copy of the layout's theme script. Only the light/dark class
 * matters here — accent customisation is skipped, so the stylesheet's default
 * blue paints instead, which is the safe direction (see the note in
 * layout.tsx about unreadable accent pairings).
 */
const themeClassScript = `
(function () {
  try {
    var stored = localStorage.getItem('av_portfolio_theme');
    var mode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'dark';
    var resolved = mode === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;
    var root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.classList.toggle('light', resolved === 'light');
    root.style.colorScheme = resolved;
  } catch (e) {}
})();
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[portfolio] global error:', error);
  }, [error]);

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>Something went wrong — Awanish Verma</title>
        <meta name="robots" content="noindex" />
        <script dangerouslySetInnerHTML={{ __html: themeClassScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]"
      >
        <main className="min-h-screen flex items-center">
          <div className="w-full max-w-2xl mx-auto px-6 py-20 space-y-8">

            <div className="flex items-center gap-4">
              <span
                className="font-mono text-xs font-bold"
                style={{ color: 'var(--accent-text)' }}
                aria-hidden="true"
              >
                500
              </span>
              <span className="h-px flex-1 bg-[var(--border-main)]" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Application error
              </span>
            </div>

            <p
              aria-hidden="true"
              className="font-mono font-bold leading-[0.85] tracking-[-0.05em] text-[4.5rem] sm:text-[7rem] select-none"
              style={{ color: 'var(--accent-text)' }}
            >
              500
            </p>

            <h1 className="text-[2.1rem] sm:text-5xl font-bold tracking-[-0.035em] leading-[1.02]">
              The site failed to load.
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              Something went wrong before the page could be built. Reloading usually
              clears it. If it doesn&apos;t, the fault is on this end — reach me at{' '}
              <a
                href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                className="underline underline-offset-4 rounded"
                style={{ color: 'var(--accent-text)' }}
              >
                {PORTFOLIO_DATA.profile.email}
              </a>
              .
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2.5 px-5 py-3.5 text-sm font-semibold rounded-md shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: 'var(--accent-solid)', color: 'var(--accent-contrast)' }}
              >
                Try again
              </button>

              {/* A plain anchor, not <Link> — a full document request is the
                  point when the app shell itself is the thing that broke, and
                  next/link is part of what may have failed. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-md bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all duration-200 shadow-2xs"
              >
                Reload the portfolio
              </a>
            </div>

            {error.digest ? (
              <p className="font-mono text-[11px] text-[var(--text-muted)] break-all">
                <span className="uppercase tracking-[0.16em]">Reference</span>{' '}
                <span className="text-[var(--text-secondary)]">{error.digest}</span>
              </p>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  );
}
