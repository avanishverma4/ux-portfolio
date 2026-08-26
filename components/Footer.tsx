'use client';

import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { scrollToSection, scrollToTop } from '@/lib/scroll';

/*
 * The Person JSON-LD used to live here. It now sits in the root layout's
 * <head> as part of one `@graph` — two separate Person blocks on the same URL
 * is an ambiguity crawlers have to guess their way out of.
 */

/** Mirrors the header's nav so the footer works as a second index of the page. */
const SITE_INDEX = [
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const ELSEWHERE = [
  { label: 'GitHub', href: PORTFOLIO_DATA.profile.github },
  { label: 'LinkedIn', href: PORTFOLIO_DATA.profile.linkedin },
  { label: 'Behance', href: PORTFOLIO_DATA.profile.behance },
  { label: 'Instagram', href: PORTFOLIO_DATA.profile.instagram },
];

export function Footer() {

  return (
    <footer
      aria-labelledby="footer-heading"
      className="relative border-t border-[var(--border-main)] bg-[var(--bg-card)] print-hide"
    >
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      {/* A hairline of accent across the top edge, so the footer reads as the
          page's closing rule rather than a detached grey bar. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background: 'linear-gradient(to right, transparent, var(--accent), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 sm:pt-16">

        {/* ── Upper deck ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10">

          {/* Identity + the one action worth repeating this far down the page. */}
          <div className="col-span-2 lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <span
                className="w-9 h-9 rounded bg-[var(--bg-subtle)] border flex items-center justify-center font-mono font-bold text-xs shrink-0"
                style={{ color: 'var(--accent-text)', borderColor: 'var(--accent)' }}
                aria-hidden="true"
              >
                AV
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold tracking-[-0.01em] text-[var(--text-primary)]">
                  {PORTFOLIO_DATA.profile.name}
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  UI/UX &amp; Design Systems
                </span>
              </span>
            </div>

            {/* No email here: the contact section sits directly above the
                footer and already shows the address at display size. Repeating
                it a screen later reads as a second, competing call to action —
                the Index link below scrolls back to the real one. */}
            <p className="flex items-start gap-2.5 font-mono text-[11px] leading-relaxed text-[var(--text-muted)] max-w-sm">
              <span
                className="w-1.5 h-1.5 rounded-full mt-[0.4rem] shrink-0 motion-safe:animate-pulse"
                style={{ backgroundColor: 'var(--accent)' }}
                aria-hidden="true"
              />
              <span>{PORTFOLIO_DATA.profile.availability}</span>
            </p>
          </div>

          {/* Page index — same rule-topped rows as the engagement and social
              lists above, so the footer belongs to the same system. */}
          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">
              Index
            </h3>
            <ul className="list-none p-0 m-0">
              {SITE_INDEX.map((item) => (
                <li key={item.id} className="border-t border-[var(--border-subtle)] last:border-b">
                  <button
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="group w-full flex items-center justify-between gap-3 py-2.5 -mx-2 px-2 rounded text-left text-[13px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                  >
                    <span>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-[10px] text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      ↓
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">
              Elsewhere
            </h3>
            <ul className="list-none p-0 m-0">
              {ELSEWHERE.map((link) => (
                <li key={link.label} className="border-t border-[var(--border-subtle)] last:border-b">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between gap-3 py-2.5 -mx-2 px-2 rounded text-[13px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight
                      className="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)] transition-all duration-200 group-hover:text-[var(--text-primary)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Lower deck: colophon ───────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-[var(--border-main)] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-5 font-mono text-[11px] text-[var(--text-muted)]">

          {/* The server renders this in its own timezone and the browser in the
              visitor's, so around New Year the two disagree — which is a
              hydration mismatch, not a cosmetic one. */}
          <p className="m-0 leading-relaxed text-[var(--text-secondary)]" suppressHydrationWarning>
            © {new Date().getFullYear()} {PORTFOLIO_DATA.profile.name}
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
            >
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span aria-hidden="true">Top</span>
              <span className="sr-only">Scroll back to top of page</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
