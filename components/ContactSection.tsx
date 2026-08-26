'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Mail, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

const SOCIAL_LINKS = [
  { label: 'GitHub', handle: 'Code & token pipelines', href: PORTFOLIO_DATA.profile.github },
  { label: 'LinkedIn', handle: 'Career & writing', href: PORTFOLIO_DATA.profile.linkedin },
  { label: 'Behance', handle: 'Case studies', href: PORTFOLIO_DATA.profile.behance },
  { label: 'Instagram', handle: 'Interface shots', href: PORTFOLIO_DATA.profile.instagram },
];

/** The three shapes an engagement usually takes — the old single paragraph
    listed these inline, where they were easy to skim past. */
const ENGAGEMENTS = [
  {
    title: 'Product design leadership',
    detail: 'Owning a new product vision end to end — research, IA, interaction, and the shipped interface.',
  },
  {
    title: 'Design system architecture',
    detail: 'Token pipelines, component libraries, and the governance that keeps them alive after launch.',
  },
  {
    title: 'Design advisory & audits',
    detail: 'Short engagements: UX audits, accessibility reviews, and direction for in-house design teams.',
  },
];

export function ContactSection() {

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-rhythm border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section header — same index rule as the hero, work, career, craft
            and endorsement sections. This section used to opt out with a
            centred badge, which broke the page's editorial spine. */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent-text)' }} aria-hidden="true">
              06
            </span>
            <span className="h-px flex-1 bg-[var(--border-main)]" aria-hidden="true" />
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <span
                className="w-1.5 h-1.5 rounded-full motion-safe:animate-pulse"
                style={{ backgroundColor: 'var(--accent)' }}
                aria-hidden="true"
              />
              Availability &amp; contact
            </span>
          </div>

          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl lg:text-[3rem] font-bold tracking-[-0.03em] leading-[1.02] text-[var(--text-primary)] max-w-3xl"
          >
            Let&apos;s discuss your <span style={{ color: 'var(--accent-text)' }}>next digital product</span>.
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
            I take on work where design decisions still matter — early product vision, systems
            that need structure, teams that need direction. Tell me what you&apos;re building and
            where it&apos;s stuck; a paragraph is plenty to start.
          </p>
        </div>

        {/* The card leads in the DOM so that on a narrow screen — and in the tab
            order — the one action this section wants isn't buried under the
            supporting detail. `lg:order-*` puts it back on the right at width. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12 items-start">

          {/* ── Direct contact card (5 of 12) ───────────────────────────── */}
          <motion.div
            className="lg:col-span-5 lg:order-2 lg:sticky lg:top-28"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-5 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/40 space-y-6">

              <div className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
                <h3 className="flex items-center gap-2.5 font-mono text-xs font-bold text-[var(--text-primary)]">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-text)' }} aria-hidden="true" />
                  <span className="tracking-tight">Direct email</span>
                </h3>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                  No forms
                </span>
              </div>

              {/* The single way to reach the address. It is the one element
                  that both shows the address — so it can be read or selected
                  by hand — and opens a mail client on click, which is why the
                  "Send an email" and "Copy address" buttons were redundant. */}
              <a
                href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                className="group flex items-start gap-2 rounded font-mono text-xl sm:text-2xl font-bold tracking-[-0.02em] leading-snug break-all hover:underline decoration-2 underline-offset-4"
                style={{ color: 'var(--accent-text)' }}
              >
                <span>{PORTFOLIO_DATA.profile.email}</span>
                <ArrowUpRight
                  className="w-5 h-5 shrink-0 mt-1.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>

              {/* Spec strip — the practical facts a client checks before writing.
                  The icons live inside the <dt>: a <div> wrapper in a <dl> may
                  only contain <dt>/<dd>, so a bare <svg> sibling is invalid
                  nesting. `location` holds a city and a working arrangement in
                  one string, so it is labelled "Location" rather than asserting
                  anyone is "based in" Remote Worldwide. */}
              <dl className="grid grid-cols-1 gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-lg overflow-hidden font-mono text-[11px]">
                <div className="flex items-center gap-2.5 bg-[var(--bg-subtle)] px-3.5 py-3">
                  <dt className="flex items-center gap-2.5 shrink-0 text-[var(--text-muted)]">
                    <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Reply time</span>
                  </dt>
                  <dd className="ml-auto text-right font-medium text-emerald-700 dark:text-emerald-400">
                    Within 24 hours
                  </dd>
                </div>
                <div className="flex items-center gap-2.5 bg-[var(--bg-subtle)] px-3.5 py-3">
                  <dt className="flex items-center gap-2.5 shrink-0 text-[var(--text-muted)]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Location</span>
                  </dt>
                  <dd className="ml-auto text-right text-[var(--text-primary)]">
                    {PORTFOLIO_DATA.profile.location}
                  </dd>
                </div>
              </dl>

              <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                {PORTFOLIO_DATA.profile.availability}
              </p>
            </div>
          </motion.div>

          {/* ── Engagement column (7 of 12) ─────────────────────────────── */}
          <div className="lg:col-span-7 lg:order-1 space-y-9">
            {/* Rule-topped rows rather than cards, matching the hero stats and
                the endorsement figures. */}
            <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-8">
              {ENGAGEMENTS.map((engagement, index) => (
                <motion.li
                  key={engagement.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="border-t border-[var(--border-main)] pt-4 space-y-2"
                >
                  <span
                    className="block font-mono text-[10px] font-bold tabular-nums"
                    style={{ color: 'var(--accent-text)' }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-bold tracking-[-0.01em] text-[var(--text-primary)]">
                    {engagement.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[var(--text-muted)]">
                    {engagement.detail}
                  </p>
                </motion.li>
              ))}
            </ul>

            {/* Social links as an editorial index — the four equal chips gave
                every profile the same weight as the email, which is the one
                action this section actually wants. */}
            <ul className="list-none p-0 m-0 pt-2">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label} className="border-t border-[var(--border-subtle)] last:border-b">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-baseline gap-4 py-3.5 -mx-2 px-2 rounded transition-colors hover:bg-[var(--bg-subtle)]"
                  >
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] w-24 shrink-0">
                      {link.label}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)] flex-1 min-w-0 truncate">
                      {link.handle}
                    </span>
                    <ArrowUpRight
                      className="w-4 h-4 shrink-0 self-center text-[var(--text-muted)] transition-all duration-200 group-hover:text-[var(--text-primary)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
