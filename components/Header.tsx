'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X, Sparkles, FileText, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { scrollToSection } from '@/lib/scroll';

interface HeaderProps {
  onOpenResume: () => void;
  onOpenSandbox: () => void;
}

const NAV_ITEMS = [
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const SECTION_IDS = ['hero', 'projects', 'experience', 'skills', 'contact'];

export function Header({ onOpenResume, onOpenSandbox }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 20);

      // Compare against the header line rather than a fixed 200px guess, so the
      // highlight matches whichever section actually sits under the header.
      const marker = (document.getElementById('main-header')?.offsetHeight ?? 0) + 24;
      let current = SECTION_IDS[0];

      for (const id of SECTION_IDS) {
        const element = document.getElementById(id);
        // Measured against the viewport rather than `offsetTop`, which is
        // relative to the nearest positioned ancestor — every section here sits
        // inside a `relative` <main>, so the two only agree by accident.
        if (element && element.getBoundingClientRect().top <= marker) current = id;
      }

      // Anything within a viewport of the bottom counts as the last section.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        current = SECTION_IDS[SECTION_IDS.length - 1];
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    // Run once on mount: after a reload the browser restores the scroll offset
    // without firing a scroll event, which used to leave the header transparent
    // over page content.
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Escape closes the mobile drawer and returns focus to its trigger. A tap
  // anywhere outside closes it too — the drawer floats over the page with the
  // rest of the header inert, so without this it sat open over whatever the
  // visitor was trying to read.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMobileMenuOpen(false);
      mobileToggleRef.current?.focus();
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (mobileDrawerRef.current?.contains(target)) return;
      if (mobileToggleRef.current?.contains(target)) return; // its own onClick toggles
      setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [mobileMenuOpen]);

  const goToSection = useCallback((id: string) => {
    setMobileMenuOpen(false);
    scrollToSection(id);
  }, []);

  /*
   * The dock is three detached islands rather than one capsule, so the surface,
   * border and shadow treatment lives here and gets applied to each piece —
   * that shared skin is the only thing making them read as one component.
   */
  const dock = `pointer-events-auto rounded-full border backdrop-blur-xl transition-all duration-300 ${
    scrolled
      ? 'border-[var(--border-main)] shadow-lg shadow-black/5 dark:shadow-black/40'
      : 'border-[var(--border-subtle)] shadow-md shadow-black/[0.03] dark:shadow-black/25'
  }`;

  const dockSurface = { background: 'var(--nav-surface)' } as const;

  const iconButton =
    'grid place-items-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors';

  return (
    <header
      id="main-header"
      /* The bar itself is inert; only the three islands capture clicks, so the
         gaps between them never block the page underneath. */
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none print-hide"
    >
      {/*
       * Scrim. Three narrow islands leave even more open space than a single
       * capsule did, so page text would scroll through the gaps between them.
       * This fades and blurs whatever passes underneath.
       */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-28 backdrop-blur-sm transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to bottom, var(--bg-page) 25%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent)',
          maskImage: 'linear-gradient(to bottom, black 55%, transparent)',
        }}
      />

      <div
        className={`relative mx-auto w-full max-w-7xl px-3 sm:px-6 transition-all duration-300 ${
          scrolled ? 'pt-2.5' : 'pt-4 sm:pt-6'
        }`}
      >
        <div className="relative flex items-center justify-between gap-3">

          {/* ── Island 1: brand ─────────────────────────────────────────── */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              goToSection('hero');
            }}
            className={`${dock} group flex items-center gap-2.5 shrink-0 ${
              scrolled ? 'py-1.5 pl-1.5 pr-3 md:pr-1.5 lg:pr-4' : 'py-2 pl-2 pr-3.5 md:pr-2 lg:pr-5'
            }`}
            style={dockSurface}
            aria-label={`${PORTFOLIO_DATA.profile.name} — back to top`}
          >
            <span className="relative shrink-0">
              <span
                className={`grid place-items-center rounded-full border-2 font-mono font-bold tracking-tighter transition-all duration-300 group-hover:scale-105 ${
                  scrolled ? 'w-8 h-8 text-[11px]' : 'w-9 h-9 text-xs'
                }`}
                style={{ borderColor: 'var(--accent)', color: 'var(--accent-text)' }}
              >
                AV
              </span>
              {/* Availability indicator — a dot plus screen-reader text, which
                  keeps the brand island down to a single row. */}
              <span
                className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5"
                title={PORTFOLIO_DATA.profile.availability}
              >
                <span
                  className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: 'var(--accent)' }}
                  aria-hidden="true"
                />
                <span
                  className="relative inline-flex h-2.5 w-2.5 rounded-full ring-2 ring-[var(--bg-page)]"
                  style={{ backgroundColor: 'var(--accent)' }}
                  aria-hidden="true"
                />
                <span className="sr-only">Available for contract and senior roles</span>
              </span>
            </span>

            {/*
             * Visible on mobile (the nav island is a drawer there, so nothing
             * competes for the space) and again at lg. Hidden only in the md
             * band, where the centred nav island would otherwise collide.
             */}
            <span
              className={`block md:hidden lg:flex flex-col leading-none whitespace-nowrap transition-all duration-300 ${
                scrolled ? 'lg:max-w-0 lg:opacity-0 lg:overflow-hidden' : 'lg:max-w-[14rem] lg:opacity-100'
              }`}
            >
              <span className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
                {PORTFOLIO_DATA.profile.name}
              </span>
              <span className="hidden lg:block mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Design Systems
              </span>
            </span>
          </a>

          {/* ── Island 2: navigation ────────────────────────────────────── */}
          {/* Absolutely centred so it stays on the page axis no matter how wide
              the brand and action islands grow. */}
          <nav
            aria-label="Section navigation"
            className={`${dock} hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 ${
              scrolled ? 'p-1' : 'p-1.5'
            }`}
            style={dockSurface}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-[var(--text-primary)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavTab"
                      /* z-0 (not -z-10) so the indicator paints above the
                         island's own surface instead of behind it. */
                      className="absolute inset-0 z-0 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-main)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* ── Island 3: actions ───────────────────────────────────────── */}
          <div
            className={`${dock} flex items-center gap-1 shrink-0 ${scrolled ? 'p-1' : 'p-1.5'}`}
            style={dockSurface}
          >
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              className={`${iconButton} w-8 h-8`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
              )}
            </button>

            <span
              aria-hidden="true"
              className="hidden md:block w-px h-5 mx-0.5 bg-[var(--border-main)]"
            />

            {/* Single accent CTA anchors the right island; collapses to "CV"
                below lg so the island never wraps. */}
            <button
              type="button"
              onClick={onOpenResume}
              title="View formatted curriculum vitae"
              className="hidden md:inline-flex items-center gap-1.5 h-8 px-3.5 text-xs font-semibold rounded-full shadow-2xs transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: 'var(--accent-solid)', color: 'var(--accent-contrast)' }}
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden lg:inline">CV / Resume</span>
              <span className="lg:hidden">CV</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className={`${iconButton} md:hidden w-8 h-8 bg-[var(--bg-subtle)] text-[var(--text-primary)]`}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Menu className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer — a fourth island, dropping from the actions side */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              ref={mobileDrawerRef}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto md:hidden mt-2.5 rounded-2xl border border-[var(--border-main)] backdrop-blur-xl shadow-xl p-2 space-y-2"
              style={dockSurface}
            >
              <nav aria-label="Mobile section navigation" className="flex flex-col gap-0.5">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goToSection(item.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl text-left transition-colors ${
                        isActive
                          ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-[var(--text-muted)]" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                    </button>
                  );
                })}
              </nav>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSandbox();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                >
                  <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-text)' }} aria-hidden="true" />
                  <span>Interactive token sandbox</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenResume();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl shadow-2xs"
                  style={{ backgroundColor: 'var(--accent-solid)', color: 'var(--accent-contrast)' }}
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  <span>View CV / Resume</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
