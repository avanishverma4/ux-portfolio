'use client';

import React, { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

/**
 * The current role opens on load; everything older starts collapsed. Falling
 * back to the first entry keeps the section from rendering fully closed if no
 * role is ever flagged `current`.
 */
function initialOpenIds() {
  const current = PORTFOLIO_DATA.experiences.filter((exp) => exp.current).map((exp) => exp.id);
  if (current.length > 0) return new Set(current);
  const first = PORTFOLIO_DATA.experiences[0];
  return new Set(first ? [first.id] : []);
}

export function ExperienceSection() {
  const [openIds, setOpenIds] = useState<Set<string>>(initialOpenIds);

  // Several roles can sit open at once — a reader comparing two jobs shouldn't
  // have one snap shut to open the other.
  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="section-rhythm border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section header — same index rule as the hero and work sections */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent-text)' }} aria-hidden="true">
              03
            </span>
            <span className="h-px flex-1 bg-[var(--border-main)]" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Career history
            </span>
          </div>

          <h2
            id="experience-heading"
            className="text-3xl sm:text-4xl lg:text-[3rem] font-bold tracking-[-0.03em] leading-[1.02] text-[var(--text-primary)] max-w-3xl"
          >
            Professional journey &amp; <span style={{ color: 'var(--accent-text)' }}>impact</span>.
          </h2>
        </div>

        <ol className="list-none p-0 m-0 border-b border-[var(--border-subtle)]">
          {PORTFOLIO_DATA.experiences.map((exp, index) => {
            const isOpen = openIds.has(exp.id);
            const panelId = `experience-panel-${exp.id}`;
            const triggerId = `experience-trigger-${exp.id}`;

            return (
              <motion.li
                key={exp.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: Math.min(index, 3) * 0.07 }}
                className="border-t border-[var(--border-subtle)]"
              >
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    onClick={() => toggle(exp.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group relative block w-full text-left py-6 sm:py-7 transition-colors duration-300"
                  >
                    {/* Accent wash on hover/focus only. Tinting the open row too
                        would paint a filled block that stops dead at the panel,
                        since the wash lives on the trigger and not the row. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-[-1rem] inset-y-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 6%, transparent)' }}
                    />

                    <span className="relative flex items-start gap-4 sm:gap-6 lg:gap-10">
                      <span
                        className="font-mono text-xs font-bold pt-1.5 w-7 shrink-0 tabular-nums text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="flex-1 min-w-0 space-y-1.5">
                        <span className="block text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-[-0.02em] text-[var(--text-primary)] transition-transform duration-300 motion-safe:group-hover:translate-x-1">
                          {exp.role}
                        </span>
                        <span className="block font-mono text-[11px] sm:text-xs text-[var(--text-secondary)]">
                          {exp.company}
                          <span className="mx-2 text-[var(--text-muted)]" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-[var(--text-muted)]">{exp.location}</span>
                        </span>

                        {/* The period rides under the company on small screens,
                            where there is no room for a right-hand column. */}
                        <span className="flex sm:hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                          {exp.current && (
                            <span
                              className="w-1.5 h-1.5 rounded-full motion-safe:animate-pulse"
                              style={{ backgroundColor: 'var(--accent)' }}
                              aria-hidden="true"
                            />
                          )}
                          {exp.period}
                        </span>
                      </span>

                      <span className="flex items-center gap-4 sm:gap-6 lg:gap-8 shrink-0 pt-1">
                        <span className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] whitespace-nowrap">
                          {exp.current && (
                            <>
                              <span
                                className="w-1.5 h-1.5 rounded-full motion-safe:animate-pulse"
                                style={{ backgroundColor: 'var(--accent)' }}
                                aria-hidden="true"
                              />
                              <span className="sr-only">Current role. </span>
                            </>
                          )}
                          {exp.period}
                        </span>

                        <span
                          className="relative grid place-items-center w-9 h-9 rounded-full border border-[var(--border-main)] text-[var(--text-muted)] transition-colors duration-300 group-hover:border-transparent group-hover:text-[var(--accent-contrast)]"
                          aria-hidden="true"
                        >
                          <span
                            className={`absolute inset-0 rounded-full transition-opacity duration-300 group-hover:opacity-100 ${
                              isOpen ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{ backgroundColor: 'var(--accent)' }}
                          />
                          <ChevronDown
                            className={`relative w-4 h-4 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </span>
                      </span>
                    </span>
                  </button>
                </h3>

                {/*
                 * The panel stays mounted and animates its height rather than
                 * unmounting, so a collapsed role's text is still in the DOM for
                 * crawlers and in-page search. `inert` keeps it out of the tab
                 * order and the accessibility tree while closed.
                 */}
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    inert={!isOpen}
                    /* flex + gap rather than space-y: the lists below carry
                       `m-0`, which would override space-y's margin and collapse
                       every gap in this panel to zero. */
                    className="flex flex-col gap-6 pb-8 pl-0 sm:pl-[3.25rem] lg:pl-[4.5rem]"
                  >
                    <p className="text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-3xl">
                      {exp.description}
                    </p>

                    {exp.achievements.length > 0 && (
                      <ul className="list-none p-0 m-0 space-y-2.5 max-w-3xl">
                        {exp.achievements.map((achievement) => (
                          <li key={achievement} className="flex gap-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                            <span
                              aria-hidden="true"
                              className="mt-2.5 h-px w-5 shrink-0"
                              style={{ backgroundColor: 'var(--accent)' }}
                            />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.skills && exp.skills.length > 0 && (
                      <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                        {exp.skills.map((skill) => (
                          <li
                            key={skill}
                            className="px-3 py-1 text-[11px] font-mono rounded-full border border-[var(--border-main)] text-[var(--text-secondary)]"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
