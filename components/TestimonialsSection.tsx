'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

/** "Sham Banerji" → "SB". Falls back to a single letter for mononyms. */
function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function TestimonialsSection() {

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="section-rhythm border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section header — same index rule as the hero, work, career and craft sections */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent-text)' }} aria-hidden="true">
              05
            </span>
            <span className="h-px flex-1 bg-[var(--border-main)]" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Endorsements &amp; peer reviews
            </span>
          </div>

          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-[3rem] font-bold tracking-[-0.03em] leading-[1.02] text-[var(--text-primary)] max-w-3xl"
          >
            Trusted by founders &amp; <span style={{ color: 'var(--accent-text)' }}>engineering leaders</span>.
          </h2>
        </div>

        {/* Pull quotes — the words carry the section, so they get the type scale
            rather than sitting inside a bordered card. */}
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 xl:gap-x-16 gap-y-14 list-none p-0 m-0">
          {PORTFOLIO_DATA.testimonials.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.08 }}
              className="flex"
            >
              <figure className="relative w-full flex flex-col gap-7 m-0 pt-7 border-t border-[var(--border-main)]">
                {/* The index and the oversized quote mark share a baseline row,
                    echoing the numbered rules used across the page. */}
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="font-mono text-[10px] font-bold tabular-nums"
                    style={{ color: 'var(--accent-text)' }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-bold leading-[0.6] text-[2.5rem] sm:text-[3.5rem] select-none"
                    style={{ color: 'color-mix(in srgb, var(--accent) 28%, transparent)' }}
                  >
                    &rdquo;
                  </span>
                </div>

                <blockquote className="m-0 flex-1">
                  <p className="text-lg sm:text-xl lg:text-[1.4rem] leading-[1.45] tracking-[-0.015em] text-[var(--text-primary)]">
                    {item.quote}
                  </p>
                </blockquote>

                <figcaption className="flex items-center gap-4 pt-6 border-t border-[var(--border-subtle)]">
                  {item.avatar ? (
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[var(--border-main)] shrink-0 bg-[var(--bg-subtle)]">
                      <Image
                        src={item.avatar}
                        alt={`${item.author}, ${item.role} at ${item.company}`}
                        fill
                        sizes="44px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid place-items-center w-11 h-11 rounded-full shrink-0 font-mono text-xs font-bold border"
                      style={{
                        color: 'var(--accent-text)',
                        backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                        borderColor: 'color-mix(in srgb, var(--accent) 24%, transparent)',
                      }}
                    >
                      {initialsOf(item.author)}
                    </span>
                  )}

                  <div className="min-w-0">
                    <div className="text-sm font-bold tracking-[-0.01em] text-[var(--text-primary)]">
                      {item.author}
                    </div>
                    <div className="font-mono text-[11px] text-[var(--text-muted)]">
                      {item.role}, {item.company}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
