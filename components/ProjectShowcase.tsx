'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, Star, SearchX } from 'lucide-react';
import { PORTFOLIO_DATA, Project } from '@/data/portfolioData';
import { ProjectDetailModal } from './ProjectDetailModal';

const PREVIEW_W = 288;
const PREVIEW_H = 180;
const CURSOR_OFFSET = 24;

export function ProjectShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // The floating cover preview is a pointer affordance, so it only exists on
  // devices that actually have a hovering pointer. On touch the rows carry the
  // whole story on their own.
  const [canHover, setCanHover] = useState(false);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const springX = useSpring(previewX, { stiffness: 320, damping: 32, mass: 0.5 });
  const springY = useSpring(previewY, { stiffness: 320, damping: 32, mass: 0.5 });
  const previewSeeded = useRef(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setCanHover(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Derived from the data rather than hard-coded: the old list advertised a
  // category no project used, so choosing it emptied the grid with no explanation.
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(PORTFOLIO_DATA.projects.map((p) => p.category)))],
    []
  );

  const countFor = useCallback(
    (category: string) =>
      category === 'All'
        ? PORTFOLIO_DATA.projects.length
        : PORTFOLIO_DATA.projects.filter((p) => p.category === category).length,
    []
  );

  const filteredProjects = useMemo(
    () =>
      selectedCategory === 'All'
        ? PORTFOLIO_DATA.projects
        : PORTFOLIO_DATA.projects.filter((p) => p.category === selectedCategory),
    [selectedCategory]
  );

  /*
   * `featured` leads the section, with everything else in a quieter tier below.
   * The split only applies to the unfiltered view — inside a single category it
   * would strand a group on its own (Interactive Prototypes has no featured
   * entry at all, which would render an empty lead tier).
   */
  const isGrouped = selectedCategory === 'All';

  const orderedProjects = useMemo(() => {
    if (!isGrouped) return filteredProjects;
    return [
      ...filteredProjects.filter((p) => p.featured),
      ...filteredProjects.filter((p) => !p.featured),
    ];
  }, [filteredProjects, isGrouped]);

  const firstQuietIndex = useMemo(
    () => (isGrouped ? orderedProjects.findIndex((p) => !p.featured) : -1),
    [orderedProjects, isGrouped]
  );

  const movePreview = useCallback(
    (clientX: number, clientY: number) => {
      const flipX = clientX + CURSOR_OFFSET + PREVIEW_W > window.innerWidth;
      const flipY = clientY + CURSOR_OFFSET + PREVIEW_H > window.innerHeight;
      const x = flipX ? clientX - CURSOR_OFFSET - PREVIEW_W : clientX + CURSOR_OFFSET;
      const y = flipY ? clientY - CURSOR_OFFSET - PREVIEW_H : clientY + CURSOR_OFFSET;

      // Jump (rather than spring) to the first position of a new hover, so the
      // card doesn't come flying in from wherever it was last dismissed. The
      // springs are jumped too — springing only the source would still animate.
      if (!previewSeeded.current) {
        previewX.jump(x);
        previewY.jump(y);
        springX.jump(x);
        springY.jump(y);
        previewSeeded.current = true;
        return;
      }
      previewX.set(x);
      previewY.set(y);
    },
    [previewX, previewY, springX, springY]
  );

  const openPreview = useCallback(
    (project: Project, clientX: number, clientY: number) => {
      if (!canHover) return;
      movePreview(clientX, clientY);
      setPreviewProject(project);
    },
    [canHover, movePreview]
  );

  const closePreview = useCallback(() => {
    setPreviewProject(null);
    previewSeeded.current = false;
  }, []);

  const closeProject = useCallback(() => setSelectedProject(null), []);

  // Keyboard users get the same preview, anchored to the focused row instead of
  // to a cursor they aren't using.
  const previewFromElement = useCallback(
    (project: Project, element: HTMLElement) => {
      if (!canHover) return;
      const rect = element.getBoundingClientRect();
      const x = Math.max(16, Math.min(rect.right - PREVIEW_W, window.innerWidth - PREVIEW_W - 16));
      const y = Math.max(16, Math.min(rect.top, window.innerHeight - PREVIEW_H - 16));
      previewX.jump(x);
      previewY.jump(y);
      springX.jump(x);
      springY.jump(y);
      previewSeeded.current = true;
      setPreviewProject(project);
    },
    [canHover, previewX, previewY, springX, springY]
  );

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="section-rhythm border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section header — mirrors the hero's index rule */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent-text)' }} aria-hidden="true">
              02
            </span>
            <span className="h-px flex-1 bg-[var(--border-main)]" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Selected case studies
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2
              id="projects-heading"
              className="text-3xl sm:text-4xl lg:text-[3rem] font-bold tracking-[-0.03em] leading-[1.02] text-[var(--text-primary)] max-w-3xl"
            >
              Crafted for user delight, accessibility, and{' '}
              <span style={{ color: 'var(--accent-text)' }}>design clarity</span>.
            </h2>

            {/* Filters as inline editorial text rather than a pill box */}
            <div
              role="group"
              aria-label="Filter case studies by category"
              className="flex flex-wrap items-center gap-x-5 gap-y-2 shrink-0"
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={isActive}
                    className={`group/filter relative pb-1 font-mono text-[11px] transition-colors ${
                      isActive
                        ? 'font-bold text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{cat === 'All' ? 'All work' : cat}</span>
                    <span className="ml-1.5 text-[10px] opacity-60">{countFor(cat)}</span>
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
          </div>
        </div>

        {/* Result count for screen readers */}
        <p aria-live="polite" className="sr-only">
          {filteredProjects.length} case {filteredProjects.length === 1 ? 'study' : 'studies'} shown
          {selectedCategory === 'All' ? '' : ` in ${selectedCategory}`}.
        </p>

        {orderedProjects.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center border border-dashed border-[var(--border-main)] rounded-xl">
            <SearchX className="w-8 h-8 text-[var(--text-muted)]" aria-hidden="true" />
            <p className="text-sm font-medium text-[var(--text-primary)]">
              No case studies in this category yet.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-mono underline underline-offset-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Show all work
            </button>
          </div>
        ) : (
          <ul
            className="list-none p-0 m-0 border-b border-[var(--border-subtle)]"
            onMouseLeave={closePreview}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {orderedProjects.map((project, idx) => {
                const isQuiet = isGrouped && !project.featured;
                const startsQuietTier = idx === firstQuietIndex && firstQuietIndex > 0;

                return (
                  <motion.li
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(idx, 6) * 0.04 }}
                    className={
                      startsQuietTier
                        ? 'border-t border-[var(--border-main)] mt-10'
                        : 'border-t border-[var(--border-subtle)]'
                    }
                  >
                    <button
                      type="button"
                      onClick={() => {
                        // The pointer never leaves the row when the dialog opens
                        // over it, so the hover preview would otherwise linger
                        // underneath for as long as the dialog is up.
                        closePreview();
                        setSelectedProject(project);
                      }}
                      onMouseEnter={(e) => openPreview(project, e.clientX, e.clientY)}
                      onMouseMove={(e) => movePreview(e.clientX, e.clientY)}
                      onFocus={(e) => previewFromElement(project, e.currentTarget)}
                      onBlur={closePreview}
                      aria-haspopup="dialog"
                      aria-label={`Open case study: ${project.title}`}
                      className={`group relative block w-full text-left transition-colors duration-300 ${
                        isQuiet ? 'py-5' : 'py-7 sm:py-8'
                      }`}
                    >
                      {/* Accent wash on hover, inset so it reads as a row highlight */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-[-1rem] inset-y-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 7%, transparent)' }}
                      />

                      <span className="relative flex items-start gap-4 sm:gap-6 lg:gap-10">
                        <span
                          className={`font-mono font-bold pt-1 shrink-0 tabular-nums transition-colors ${
                            isQuiet ? 'text-[10px] w-6' : 'text-xs w-7'
                          } text-[var(--text-muted)] group-hover:text-[var(--text-primary)]`}
                          aria-hidden="true"
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        <span className="flex-1 min-w-0 space-y-1.5">
                          <span className="flex items-center gap-3">
                            <span
                              className={`block font-bold tracking-[-0.02em] text-[var(--text-primary)] transition-transform duration-300 motion-safe:group-hover:translate-x-1 ${
                                isQuiet ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl lg:text-[1.75rem]'
                              }`}
                            >
                              {project.title}
                            </span>
                            {project.stars != null && (
                              <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-500 shrink-0">
                                <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                                <span>{project.stars}</span>
                              </span>
                            )}
                          </span>

                          {!isQuiet && (
                            <span className="font-mono text-[11px] leading-relaxed text-[var(--text-secondary)] line-clamp-1">
                              {project.impactMetric}
                            </span>
                          )}

                          {/* Category rides under the title on small screens,
                              where there is no room for a right-hand column. */}
                          <span className="block sm:hidden font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                            {project.category}
                          </span>
                        </span>

                        <span className="flex items-center gap-5 lg:gap-8 shrink-0 pt-1">
                          {/* Category rides under the title on small screens, but
                              the arrow stays at every width — it is the only cue
                              that the row is tappable. */}
                          <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] text-right">
                            {project.category}
                          </span>
                          <span
                            className="relative grid place-items-center w-9 h-9 rounded-full border border-[var(--border-main)] text-[var(--text-muted)] transition-colors duration-300 group-hover:border-transparent group-hover:text-[var(--accent-contrast)]"
                            aria-hidden="true"
                          >
                            <span
                              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                              style={{ backgroundColor: 'var(--accent)' }}
                            />
                            <ArrowUpRight className="relative w-4 h-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
                          </span>
                        </span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Floating cover preview — decorative, mirrors the row already announced */}
      {canHover && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-40 print-hide"
          style={{ x: springX, y: springY }}
        >
          <AnimatePresence>
            {previewProject && (
              <motion.div
                key={previewProject.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-xl border border-[var(--border-main)] shadow-2xl shadow-black/20 dark:shadow-black/60 bg-[var(--bg-subtle)]"
                style={{ width: PREVIEW_W, height: PREVIEW_H }}
              >
                <Image
                  src={previewProject.coverImage}
                  alt=""
                  fill
                  sizes="288px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* The clamp lives on the inner span: absolute positioning
                    blockifies `-webkit-box` away, so line-clamp silently does
                    nothing when applied to the positioned element itself. */}
                <span className="absolute inset-x-0 bottom-0 px-3 pt-6 pb-2.5 bg-gradient-to-t from-black/85 via-black/55 to-transparent">
                  <span className="line-clamp-2 font-mono text-[10px] leading-snug font-bold text-white">
                    {previewProject.tagline}
                  </span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Project Detail Modal */}
      <ProjectDetailModal project={selectedProject} onClose={closeProject} />
    </section>
  );
}
