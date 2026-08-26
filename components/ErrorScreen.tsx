import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/**
 * Shared shell for the 404 and runtime-error routes.
 *
 * These routes render inside the root layout but *without* <Header />, so the
 * page loses its navigation exactly when the visitor most needs it. The index
 * column below stands in for it — same rule-topped rows as the footer, so a
 * dead end still reads as part of the site rather than a browser default.
 *
 * Deliberately hook-free and directive-free: `app/not-found.tsx` renders it on
 * the server, `app/error.tsx` renders it inside a client boundary, and one
 * presentational component serves both. Anything interactive is passed in as
 * `actions` by the caller that owns the handler.
 */

/** Mirrors the header and footer navigation, pointed back at the home route. */
const SITE_INDEX = [
  { href: '/#projects', label: 'Work' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#contact', label: 'Contact' },
];

interface ErrorScreenProps {
  /** Editorial folio figure — '404', '500'. Decorative; the <h1> carries meaning. */
  code: string;
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  /** Buttons/links owned by the caller, so this component stays server-safe. */
  actions: React.ReactNode;
  /** Optional technical footnote, e.g. the error digest. */
  detail?: React.ReactNode;
}

export function ErrorScreen({
  code,
  eyebrow,
  title,
  description,
  actions,
  detail,
}: ErrorScreenProps) {
  return (
    /*
     * `id="main-content"` keeps the root layout's skip link functional here —
     * it targets that id, and on these routes nothing else claims it.
     */
    <main
      id="main-content"
      tabIndex={-1}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Same dot mesh and accent field as the hero, so the page still feels
          like the portfolio rather than a bare framework screen. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]"
      />
      <div
        aria-hidden="true"
        className="absolute -z-10 pointer-events-none top-0 right-0 h-[40rem] w-[40rem] translate-x-1/4 -translate-y-1/3 rounded-full blur-3xl opacity-60 dark:opacity-40"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 lg:gap-x-12 items-start">

          {/* ── Editorial column ───────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-8">

            {/* Stands in for the missing header: the mark is the way home. */}
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded group"
              aria-label="Awanish Verma — back to the portfolio home page"
            >
              <span
                className="w-9 h-9 rounded bg-[var(--bg-subtle)] border flex items-center justify-center font-mono font-bold text-xs shrink-0"
                style={{ color: 'var(--accent-text)', borderColor: 'var(--accent)' }}
                aria-hidden="true"
              >
                AV
              </span>
              <span aria-hidden="true" className="min-w-0">
                <span className="block text-sm font-bold tracking-[-0.01em] text-[var(--text-primary)]">
                  Awanish Verma
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-secondary)]">
                  UI/UX &amp; Design Systems
                </span>
              </span>
            </Link>

            {/* Index rule — the same editorial spine every section opens with. */}
            <div className="flex items-center gap-4">
              <span
                className="font-mono text-xs font-bold"
                style={{ color: 'var(--accent-text)' }}
                aria-hidden="true"
              >
                {code}
              </span>
              <span className="h-px flex-1 bg-[var(--border-main)]" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {eyebrow}
              </span>
            </div>

            {/* The folio figure is decoration; the heading carries the message,
                so screen readers hear "Page not found", not "four oh four". */}
            <p
              aria-hidden="true"
              className="font-mono font-bold leading-[0.85] tracking-[-0.05em] text-[4.5rem] sm:text-[7rem] lg:text-[8.5rem] select-none"
              style={{ color: 'var(--accent-text)' }}
            >
              {code}
            </p>

            <h1 className="text-[2.1rem] sm:text-5xl font-bold tracking-[-0.035em] leading-[1.02] text-[var(--text-primary)]">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-3">{actions}</div>

            {detail}
          </div>

          {/* ── Index column ───────────────────────────────────────────── */}
          <nav aria-label="Site sections" className="lg:col-span-4 lg:col-start-9">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">
              Index
            </h2>
            <ul className="list-none p-0 m-0">
              {SITE_INDEX.map((item) => (
                <li key={item.href} className="border-t border-[var(--border-subtle)] last:border-b">
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between gap-3 py-3 -mx-2 px-2 rounded text-[13px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight
                      className="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)] transition-all duration-200 group-hover:text-[var(--text-primary)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
