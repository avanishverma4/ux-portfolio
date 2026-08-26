'use client';

import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Star, CheckCircle2, Cpu, Maximize2 } from 'lucide-react';
import { Project } from '@/data/portfolioData';
import { useModalBehavior } from '@/hooks/use-modal-behavior';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const TABS = [
  { id: 'overview', label: 'Overview & Scope' },
  { id: 'architecture', label: 'Architecture & Tech' },
  { id: 'features', label: 'Key Features' },
  { id: 'gallery', label: 'Visual Gallery' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const isOpen = project !== null;
  const containerRef = useModalBehavior(isOpen, onClose);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  /*
   * The lightbox is a second dialog stacked on the first, so it gets its own
   * trap rather than borrowing the dialog's. `useModalBehavior` stacks layers:
   * while this one is open it owns Escape and Tab, and closing it hands both
   * back to the case study underneath instead of closing everything at once.
   */
  const lightboxRef = useModalBehavior(lightboxIndex !== null, closeLightbox);

  /*
   * Reset per project — a tab left on "Gallery" used to persist into the next
   * case study the visitor opened. Adjusting during render rather than from an
   * effect means the incoming case study's very first paint already shows
   * Overview, with no flash of the previous tab. `lastProject` tracks null too,
   * so closing and reopening the same case study still resets it.
   */
  const [lastProject, setLastProject] = useState<Project | null>(project);
  if (project !== lastProject) {
    setLastProject(project);
    // Closing clears the lightbox too. Leaving an index set would keep
    // `useModalBehavior` below believing the lightbox is open, so its cleanup
    // never runs and the ref-counted body scroll lock never unwinds.
    setLightboxIndex(null);
    if (project) setActiveTab('overview');
  }

  const handleTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const next = TABS[(index + offset + TABS.length) % TABS.length];
    setActiveTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    // AnimatePresence must live outside the null check, otherwise the component
    // unmounts before the exit animation can run.
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Window */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
          >
            {/* Top Bar Header */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border-main)] bg-[var(--bg-subtle)]">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full border truncate"
                  style={{ color: 'var(--accent-text)', borderColor: 'var(--accent)' }}
                >
                  {project.category}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:inline">Case Study</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="p-1.5 rounded-md hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body Content */}
            <div className="overflow-y-auto p-6 space-y-6 flex-1" data-lenis-prevent>
              {/* Title & Tagline */}
              <div className="space-y-2">
                <h2
                  id="project-modal-title"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]"
                >
                  {project.title}
                </h2>
                <p className="text-base text-[var(--text-secondary)] leading-relaxed">{project.tagline}</p>
              </div>

              {/* Impact Metric Banner */}
              <div
                className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3"
                style={{ borderLeftColor: 'var(--accent)', borderLeftWidth: '4px' }}
              >
                <div>
                  <span className="text-xs uppercase font-mono tracking-wider text-[var(--text-muted)] block">
                    Key business / product outcome
                  </span>
                  <span className="text-base font-bold text-[var(--text-primary)] font-mono">
                    {project.impactMetric}
                  </span>
                </div>
                {project.stars != null && (
                  <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
                    <span>{project.stars} stars</span>
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              <div
                role="tablist"
                aria-label="Case study sections"
                className="flex flex-wrap border-b border-[var(--border-main)] gap-4 text-xs font-medium"
              >
                {TABS.map((tab, index) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      ref={(el) => {
                        tabRefs.current[tab.id] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`tab-${tab.id}`}
                      aria-selected={isActive}
                      aria-controls={`panel-${tab.id}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setActiveTab(tab.id)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                      className={`pb-3 font-mono transition-all relative ${
                        isActive
                          ? 'text-[var(--text-primary)] font-bold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {tab.label}
                      {isActive && (
                        <motion.span
                          layoutId="modalTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          style={{ backgroundColor: 'var(--accent)' }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="space-y-4">
                {activeTab === 'overview' && (
                  <div
                    role="tabpanel"
                    id="panel-overview"
                    aria-labelledby="tab-overview"
                    tabIndex={0}
                    className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed"
                  >
                    <p>{project.overview}</p>
                    <p>{project.description}</p>

                    <div className="pt-2 space-y-2">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-bold">
                        Technologies &amp; frameworks
                      </h3>
                      <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                        {project.techStack.map((tech) => (
                          <li
                            key={tech}
                            className="px-2.5 py-1 text-xs font-mono rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'architecture' && (
                  <div
                    role="tabpanel"
                    id="panel-architecture"
                    aria-labelledby="tab-architecture"
                    tabIndex={0}
                    className="space-y-4 text-sm text-[var(--text-secondary)]"
                  >
                    <div className="p-4 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-subtle)] space-y-2">
                      <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--text-primary)]">
                        <Cpu className="w-4 h-4" style={{ color: 'var(--accent-text)' }} aria-hidden="true" />
                        <span>Process &amp; system overview</span>
                      </h3>
                      <p className="leading-relaxed">{project.architecture}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-md">
                        <div className="text-xs font-bold text-[var(--text-primary)] mb-1">Design foundations</div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          Token-driven theming, reusable component states, documented handoff specs.
                        </div>
                      </div>
                      <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-md">
                        <div className="text-xs font-bold text-[var(--text-primary)] mb-1">Quality bar</div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          WCAG AA contrast, keyboard-complete flows, responsive from 320px up.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div
                    role="tabpanel"
                    id="panel-features"
                    aria-labelledby="tab-features"
                    tabIndex={0}
                    className="space-y-2"
                  >
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-bold mb-3">
                      Key capabilities
                    </h3>
                    <ul className="grid grid-cols-1 gap-2.5 list-none p-0 m-0">
                      {project.keyFeatures.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 p-3 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-md text-sm text-[var(--text-primary)]"
                        >
                          <CheckCircle2
                            className="w-4 h-4 mt-0.5 shrink-0"
                            style={{ color: 'var(--accent-text)' }}
                            aria-hidden="true"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div
                    role="tabpanel"
                    id="panel-gallery"
                    aria-labelledby="tab-gallery"
                    tabIndex={0}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {project.galleryImages.map((imgUrl, index) => (
                      <button
                        key={imgUrl}
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        aria-label={`Enlarge ${project.title} image ${index + 1} of ${project.galleryImages.length}`}
                        className="relative h-48 rounded-lg overflow-hidden border border-[var(--border-main)] group cursor-pointer"
                      >
                        <Image
                          /* Descriptive rather than empty: the button's
                             aria-label already names the control, so this text
                             is read by image search without double-announcing
                             to screen readers. */
                          src={imgUrl}
                          alt={`${project.title} — ${project.category} case study visual ${index + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white" aria-hidden="true" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-6 border-t border-[var(--border-main)] bg-[var(--bg-subtle)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-md bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
                  >
                    <Github className="w-4 h-4" aria-hidden="true" />
                    <span>Source code</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-md shadow-xs transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--accent-solid)', color: 'var(--accent-contrast)' }}
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    <span>View live case study</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Close
              </button>
            </div>
          </motion.div>

          {/* Gallery lightbox — the previous build stored the selected image but
              never rendered anything, so clicking a thumbnail did nothing. */}
          <AnimatePresence>
            {lightboxIndex !== null && project.galleryImages[lightboxIndex] && (
              <motion.div
                ref={lightboxRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                aria-label={`${project.title} image ${lightboxIndex + 1} enlarged`}
                className="fixed inset-0 z-20 flex items-center justify-center bg-black/90 p-4 sm:p-10"
                onClick={closeLightbox}
              >
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close enlarged image"
                  className="absolute top-4 right-4 p-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>

                <motion.div
                  initial={{ scale: 0.96 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.96 }}
                  className="relative w-full max-w-5xl aspect-[16/10]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Image
                    src={project.galleryImages[lightboxIndex]}
                    alt={`${project.title} — gallery image ${lightboxIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {project.galleryImages.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {project.galleryImages.map((img, index) => (
                      <button
                        key={img}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setLightboxIndex(index);
                        }}
                        aria-label={`Show image ${index + 1}`}
                        aria-current={index === lightboxIndex}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          index === lightboxIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
