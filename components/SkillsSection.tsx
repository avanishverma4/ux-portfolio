'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Code2, Layout, Palette, Search, SearchX, X } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

/**
 * Icons are keyed off the `iconName` field in the data. The previous version
 * matched on category strings ("Frontend & UI Systems", …) that no longer exist
 * in the dataset, so no icon ever rendered.
 */
const ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Palette,
  Layout,
  Code2,
};

/** Short but unambiguous filter labels — `split(' ')[0]` produced "UI/UX", "Design", "Frontend". */
const SHORT_LABELS: Record<string, string> = {
  'UI/UX & Product Design': 'Product design',
  'Design Systems & Token Architecture': 'Design systems',
  'Frontend Implementation (Design-Led)': 'Frontend',
};

const ALL_SKILLS = PORTFOLIO_DATA.skillCategories.flatMap((cat) => cat.skills);

/** Headline stats sit beside the intro copy; all of them derive from the data. */
const STATS = [
  { value: String(ALL_SKILLS.length), label: 'Disciplines' },
  { value: String(PORTFOLIO_DATA.skillCategories.length), label: 'Practice areas' },
  {
    value: `${Math.max(...ALL_SKILLS.map((s) => s.experienceYears))}+`,
    label: 'Years hands-on',
  },
];

export function SkillsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(
    () => ['All', ...PORTFOLIO_DATA.skillCategories.map((cat) => cat.category)],
    []
  );

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PORTFOLIO_DATA.skillCategories
      .filter((cat) => selectedCategory === 'All' || cat.category === selectedCategory)
      .map((cat) => ({
        ...cat,
        skills: cat.skills.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            (s.highlight?.toLowerCase().includes(query) ?? false)
        ),
      }))
      .filter((cat) => cat.skills.length > 0);
  }, [searchQuery, selectedCategory]);

  const resultCount = filteredCategories.reduce((total, cat) => total + cat.skills.length, 0);

  /** Counts shown next to each filter reflect the search, so a filter never
      promises results the current query has already ruled out. */
  const countFor = (cat: string) => {
    const query = searchQuery.trim().toLowerCase();
    return PORTFOLIO_DATA.skillCategories
      .filter((c) => cat === 'All' || c.category === cat)
      .reduce(
        (total, c) =>
          total +
          c.skills.filter(
            (s) =>
              s.name.toLowerCase().includes(query) ||
              (s.highlight?.toLowerCase().includes(query) ?? false)
          ).length,
        0
      );
  };

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="section-rhythm border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section header — same index rule as the hero, work and career sections */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent-text)' }} aria-hidden="true">
              04
            </span>
            <span className="h-px flex-1 bg-[var(--border-main)]" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Craft &amp; capability
            </span>
          </div>

          <h2
            id="skills-heading"
            className="text-3xl sm:text-4xl lg:text-[3rem] font-bold tracking-[-0.03em] leading-[1.02] text-[var(--text-primary)] max-w-3xl"
          >
            Design systems thinking, <span style={{ color: 'var(--accent-text)' }}>end to end</span>.
          </h2>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <p className="text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-2xl">
              7+ years spanning user research, Figma token variable systems, interaction wireframing,
              and the frontend implementation that ships them.
            </p>

            {/* `dt` before `dd` — a description list only pairs them in that
                order, whatever the visual stacking. `flex-col-reverse` keeps the
                figure above its label. */}
            <dl className="flex items-end gap-8 sm:gap-10 shrink-0">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {stat.label}
                  </dt>
                  <dd className="m-0 font-mono text-2xl sm:text-3xl font-bold tabular-nums tracking-[-0.02em] text-[var(--text-primary)]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Controls — inline editorial filters plus a hairline search field */}
        <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-5 border-y border-[var(--border-subtle)] py-4">
          <div
            role="group"
            aria-label="Filter skills by category"
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={isActive}
                  className={`relative pb-1 font-mono text-[11px] transition-colors ${
                    isActive
                      ? 'font-bold text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{cat === 'All' ? 'All skills' : SHORT_LABELS[cat] ?? cat}</span>
                  <span className="ml-1.5 text-[10px] opacity-60 tabular-nums">{countFor(cat)}</span>
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-0 h-px transition-opacity"
                    style={{
                      backgroundColor: isActive ? 'var(--accent)' : 'var(--border-main)',
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <label htmlFor="skill-search" className="sr-only">
              Search skills
            </label>
            <Search
              className="w-3.5 h-3.5 absolute left-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="skill-search"
              type="search"
              placeholder="Search skills — Figma, tokens…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="peer w-full bg-transparent border-0 border-b border-[var(--border-main)] pl-6 pr-7 py-1.5 font-mono text-[11px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear skill search"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {resultCount} {resultCount === 1 ? 'skill' : 'skills'} matching the current filters.
        </p>

        {/* Skill roster — a sticky category rail beside full-width skill rows */}
        {filteredCategories.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
            <SearchX className="w-6 h-6 text-[var(--text-muted)]" aria-hidden="true" />
            <p className="text-base font-medium text-[var(--text-primary)]">
              No skills match {searchQuery ? `“${searchQuery}”` : 'this filter'}.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="font-mono text-[11px] underline underline-offset-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredCategories.map((category, categoryIndex) => {
              const Icon = ICONS[category.iconName] ?? Code2;
              const headingId = `skills-${category.category.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

              return (
                <section
                  key={category.category}
                  aria-labelledby={headingId}
                  className="grid grid-cols-1 lg:grid-cols-[minmax(0,15rem)_1fr] gap-y-6 gap-x-10"
                >
                  {/* Category rail — stays in view while its rows scroll past */}
                  <div className="lg:sticky lg:top-24 self-start space-y-3">
                    <span
                      className="font-mono text-[10px] font-bold tabular-nums"
                      style={{ color: 'var(--accent-text)' }}
                      aria-hidden="true"
                    >
                      {String(categoryIndex + 1).padStart(2, '0')}
                    </span>
                    <h3
                      id={headingId}
                      className="flex items-start gap-2.5 text-lg sm:text-xl font-bold tracking-[-0.02em] leading-snug text-[var(--text-primary)]"
                    >
                      <Icon className="w-4 h-4 mt-1.5 shrink-0" style={{ color: 'var(--accent-text)' }} />
                      <span>{category.category}</span>
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {category.skills.length} {category.skills.length === 1 ? 'discipline' : 'disciplines'}
                    </p>
                  </div>

                  <ul className="list-none p-0 m-0 border-t border-[var(--border-subtle)]">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.li
                        key={skill.name}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.4, delay: Math.min(skillIndex, 4) * 0.05 }}
                        className="group relative border-b border-[var(--border-subtle)]"
                      >
                        {/* Accent wash on hover, matching the career rows */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-[-1rem] inset-y-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 6%, transparent)' }}
                        />

                        <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 py-5">
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <p className="text-base sm:text-lg font-bold tracking-[-0.01em] text-[var(--text-primary)] transition-transform duration-300 motion-safe:group-hover:translate-x-1">
                              {skill.name}
                            </p>
                            {skill.highlight && (
                              <p className="font-mono text-[11px] leading-relaxed text-[var(--text-muted)]">
                                {skill.highlight}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] tabular-nums text-[var(--text-muted)] whitespace-nowrap">
                              {skill.experienceYears} yrs
                            </span>

                            {/* Proficiency reads as a hairline rule that fills on
                                scroll — a meter, not a chunky progress bar. The
                                fill inherits the row's in-view state: a 1px-tall
                                element is too small for its own reliable
                                IntersectionObserver threshold. */}
                            <div className="flex items-center gap-3">
                              <div
                                role="meter"
                                aria-valuenow={skill.level}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${skill.name} proficiency`}
                                className="w-20 sm:w-28 h-0.5 rounded-full bg-[var(--border-main)] overflow-hidden"
                              >
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: 'var(--accent)' }}
                                  variants={{ hidden: { width: 0 }, visible: { width: `${skill.level}%` } }}
                                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                                />
                              </div>
                              <span className="font-mono text-[11px] font-bold tabular-nums text-[var(--text-secondary)] w-8 text-right">
                                {skill.level}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
