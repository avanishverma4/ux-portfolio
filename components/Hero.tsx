'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDownRight,
  FileText,
  Layers,
  Copy,
  Check,
  RotateCcw,
  Palette,
  Layout,
  Type,
  Sliders,
} from 'lucide-react';
import { useTheme, COLOR_PRESETS, RadiusToken, SpacingDensity } from '@/context/ThemeContext';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { normalizeHex } from '@/lib/color';
import { scrollToSection } from '@/lib/scroll';

interface HeroProps {
  onOpenResume: () => void;
}

const RADIUS_OPTIONS: RadiusToken[] = ['0px', '4px', '8px', '12px', '20px'];
const DENSITY_OPTIONS: { value: SpacingDensity; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfy' },
  { value: 'spacious', label: 'Spacious' },
];

export function Hero({ onOpenResume }: HeroProps) {
  const {
    tokens,
    updateToken,
    resetTokens,
    exportTokensAsCSS,
    exportTokensAsTailwind,
  } = useTheme();

  const [copied, setCopied] = useState<'css' | 'tailwind' | null>(null);
  const [demoToggle, setDemoToggle] = useState(true);
  const [demoInput, setDemoInput] = useState('Design System Generator');

  /*
   * The hex field keeps its own draft so half-typed values ("#6", "#63") don't
   * get written to the live token — that used to blank the accent mid-keystroke.
   * `null` means "no draft in flight, mirror the token", which is what lets a
   * preset swatch, the colour picker or Reset move the field without an effect
   * syncing the two copies after the fact.
   */
  const [hexDraft, setHexDraft] = useState<string | null>(null);
  const hexValue = hexDraft ?? tokens.accentColor;
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const hexIsValid = normalizeHex(hexValue) !== null;

  // Named presets collapse to swatch dots below, so the active preset's full
  // name is surfaced once in the fieldset header instead of once per swatch.
  const activePreset = COLOR_PRESETS.find(
    (preset) => preset.hex.toLowerCase() === tokens.accentColor.toLowerCase()
  );

  const applyAccent = (hex: string, hoverHex?: string) => {
    updateToken('accentColor', hex);
    updateToken('accentHoverColor', hoverHex ?? hex);
  };

  const handleHexChange = (value: string) => {
    setHexDraft(value);
    const normalized = normalizeHex(value);
    if (normalized) applyAccent(normalized);
  };

  const handleCopy = async (kind: 'css' | 'tailwind') => {
    const text = kind === 'css' ? exportTokensAsCSS() : exportTokensAsTailwind();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission) — no-op.
    }
  };

  const segment = (isSelected: boolean) =>
    `text-xs font-mono rounded-lg border transition-all ${
      isSelected
        ? 'border-[var(--text-primary)] font-bold text-[var(--text-primary)] bg-[var(--bg-subtle)] shadow-2xs'
        : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-main)] hover:text-[var(--text-primary)]'
    }`;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="section-rhythm relative overflow-hidden"
    >
      {/* Background: dot mesh plus a soft accent field behind the card column. */}
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]" />
      <div
        aria-hidden="true"
        className="absolute -z-10 pointer-events-none top-0 right-0 h-[46rem] w-[46rem] translate-x-1/4 -translate-y-1/3 rounded-full blur-3xl opacity-60 dark:opacity-40"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 70%)',
        }}
      />

      {/*
       * Clearance for the fixed header lives here, not as a `pt-*` utility on
       * the <section>. `.section-rhythm` is a plain rule outside Tailwind's
       * @layer, so its padding-top beats any utility set on the section itself
       * — a `pt-32` there is silently dead and the dock ends up 10px from the
       * first line of content on mobile.
       */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-12 items-start">

          {/* ── Editorial column (7 of 12) ──────────────────────────────── */}
          {/* Pushed down at lg so the sandbox card reads as floating above the
              text baseline, rather than negatively offsetting the card into
              the fixed header. */}
          <motion.div
            className="lg:col-span-7 lg:mt-14 space-y-9"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Index rule — the editorial spine of the section */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent-text)' }} aria-hidden="true">
                01
              </span>
              <span className="h-px flex-1 bg-[var(--border-main)]" aria-hidden="true" />
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <span
                  className="w-1.5 h-1.5 rounded-full motion-safe:animate-pulse"
                  style={{ backgroundColor: 'var(--accent)' }}
                  aria-hidden="true"
                />
                Open to work
              </span>
            </div>

            {/*
              * Main editorial headline.
              *
              * The kicker is inside the <h1> on purpose. The heading is the
              * strongest on-page term signal a document has, and the editorial
              * line below it — good as it is — contains none of the words
              * anyone actually types to find a designer. Rather than rewrite
              * the line, the role and city ride above it in the site's own
              * mono-eyebrow idiom.
              *
              * It is visible text, at a legible size, stating something true.
              * The sr-only trick that gets recommended for this is hidden text
              * for ranking purposes, which is precisely what Google's spam
              * policy names — and it would deny a first-time visitor the one
              * fact the page never says out loud above the fold anyway.
              */}
            <h1
              id="hero-heading"
              className="text-[2.6rem] sm:text-6xl lg:text-[4.25rem] font-bold tracking-[-0.035em] text-[var(--text-primary)] leading-[0.98]"
            >
              <span className="block mb-5 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] leading-relaxed text-[var(--text-muted)]">
                Awanish Verma — UI/UX Designer &amp; Design Systems Architect,{' '}
                <span className="whitespace-nowrap">Bengaluru</span>
              </span>
              Complex problems,
              <br className="hidden sm:block" /> shaped into{' '}
              <span style={{ color: 'var(--accent-text)' }}>clear</span>, human-centered products.
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              {PORTFOLIO_DATA.profile.shortBio}
            </p>

            {/* Discipline line — replaces the old eyebrow tag, reading as a
                spec strip rather than a badge. */}
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-[var(--text-muted)]">
              {['User research', 'Token pipelines', 'Interaction architecture', 'Design systems'].map(
                (discipline, index) => (
                  <React.Fragment key={discipline}>
                    {index > 0 && <li aria-hidden="true" className="text-[var(--border-main)]">&bull;</li>}
                    <li>{discipline}</li>
                  </React.Fragment>
                )
              )}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('projects')}
                className="group inline-flex items-center gap-2.5 pl-5 pr-4 py-3.5 text-sm font-semibold rounded-md shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: 'var(--accent-solid)', color: 'var(--accent-contrast)' }}
              >
                <span>Explore selected work</span>
                <ArrowDownRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-md bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all duration-200 shadow-2xs"
                title="View formatted curriculum vitae"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Resume</span>
              </button>
            </div>

            {/* Stats — rule-topped editorial figures rather than cards */}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 pt-2">
              {PORTFOLIO_DATA.profile.stats.map((stat) => (
                <div key={stat.label} className="border-t border-[var(--border-main)] pt-3.5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <div className="text-2xl sm:text-[1.75rem] font-bold font-mono tracking-tight text-[var(--text-primary)]">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[11px] leading-tight text-[var(--text-muted)]" aria-hidden="true">
                      {stat.label}
                    </div>
                  </dd>
                </div>
              ))}
            </dl>

            {/* Social links */}
            <div className="flex items-center gap-4 pt-1 text-xs font-mono text-[var(--text-muted)]">
              <span className="uppercase tracking-[0.18em] text-[10px]">Connect</span>
              <span className="h-px w-6 bg-[var(--border-main)]" aria-hidden="true" />
              {[
                { label: 'GitHub', href: PORTFOLIO_DATA.profile.github },
                { label: 'LinkedIn', href: PORTFOLIO_DATA.profile.linkedin },
                { label: 'Behance', href: PORTFOLIO_DATA.profile.behance },
              ].map((link, index) => (
                <React.Fragment key={link.label}>
                  {index > 0 && <span aria-hidden="true">/</span>}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* ── Token sandbox column (5 of 12) ──────────────────────────── */}
          <motion.div
            id="token-sandbox-card"
            className="lg:col-span-5"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <section
              aria-labelledby="token-sandbox-heading"
              className="relative p-5 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/40 space-y-5"
            >
              {/* Card header */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
                <h2
                  id="token-sandbox-heading"
                  className="flex items-center gap-2.5 font-mono text-xs font-bold text-[var(--text-primary)]"
                >
                  <Sliders className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-text)' }} aria-hidden="true" />
                  <span className="tracking-tight">Design System Generator</span>
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    resetTokens();
                    setHexDraft(null);
                  }}
                  className="p-1.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all"
                  title="Reset design system to defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="sr-only">Reset design system to defaults</span>
                </button>
              </div>

              {/*
               * 1. Primary accent token.
               *
               * Named with `aria-labelledby` rather than a <legend>: a legend is
               * only a legend when it is the fieldset's first child, and these
               * headings sit inside a flex row alongside the current value. A
               * <legend> nested in that wrapper is invalid markup and leaves the
               * group with no accessible name at all.
               */}
              <fieldset className="space-y-3" aria-labelledby="token-accent-label">
                <div className="flex justify-between items-center text-xs gap-2">
                  <span
                    id="token-accent-label"
                    className="flex items-center gap-2 font-medium text-[var(--text-primary)]"
                  >
                    <Palette className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                    <span>Accent</span>
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)] truncate">
                    {activePreset ? activePreset.name : 'Custom'}
                  </span>
                </div>

                {/* Swatch dots — a compact row keeps the card narrow at 5/12. */}
                <div className="flex items-center gap-2.5">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = tokens.accentColor.toLowerCase() === preset.hex.toLowerCase();
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        aria-pressed={isSelected}
                        title={preset.name}
                        onClick={() => {
                          applyAccent(preset.hex, preset.hoverHex);
                          setHexDraft(null);
                        }}
                        className={`relative grid place-items-center w-8 h-8 rounded-full border transition-all ${
                          isSelected
                            ? 'border-[var(--text-primary)] scale-105'
                            : 'border-[var(--border-subtle)] hover:border-[var(--border-main)] hover:scale-105'
                        }`}
                      >
                        <span
                          className={`rounded-full shadow-2xs transition-all ${
                            isSelected ? 'w-4 h-4' : 'w-5 h-5'
                          }`}
                          style={{ backgroundColor: preset.hex }}
                          aria-hidden="true"
                        />
                        <span className="sr-only">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom colour input */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 w-full p-1.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-lg">
                    <label htmlFor="accent-swatch" className="sr-only">
                      Pick accent colour
                    </label>
                    <input
                      id="accent-swatch"
                      type="color"
                      value={normalizeHex(tokens.accentColor) ?? '#3b82f6'}
                      onChange={(e) => {
                        applyAccent(e.target.value);
                        setHexDraft(null);
                      }}
                      className="w-7 h-7 rounded border border-[var(--border-main)] cursor-pointer bg-transparent p-0 shrink-0"
                    />
                    <label
                      htmlFor="accent-hex"
                      className="text-xs font-mono text-[var(--text-muted)] uppercase shrink-0 whitespace-nowrap"
                    >
                      Hex
                    </label>
                    <input
                      id="accent-hex"
                      type="text"
                      inputMode="text"
                      spellCheck={false}
                      value={hexValue}
                      onChange={(e) => handleHexChange(e.target.value)}
                      onBlur={() => setHexDraft(null)}
                      aria-invalid={!hexIsValid}
                      aria-describedby={hexIsValid ? undefined : 'accent-hex-error'}
                      className={`px-2 py-1 text-xs font-mono rounded bg-[var(--bg-card)] border text-[var(--text-primary)] w-full min-w-0 focus:outline-none ${
                        hexIsValid
                          ? 'border-[var(--border-subtle)] focus:border-[var(--text-primary)]'
                          : 'border-rose-500'
                      }`}
                      placeholder="#3b82f6"
                    />
                  </div>
                  {!hexIsValid && (
                    <p id="accent-hex-error" role="alert" className="text-[11px] font-mono text-rose-500">
                      Enter a valid hex colour, e.g. #3b82f6
                    </p>
                  )}
                </div>
              </fieldset>

              {/* 2. Corner radius scale */}
              <fieldset
                className="space-y-3 pt-4 border-t border-[var(--border-subtle)]"
                aria-labelledby="token-radius-label"
              >
                <div className="flex justify-between items-center text-xs">
                  <span
                    id="token-radius-label"
                    className="flex items-center gap-2 font-medium text-[var(--text-primary)]"
                  >
                    <Layout className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                    <span>Radius</span>
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)] font-semibold">
                    {tokens.radiusToken}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {RADIUS_OPTIONS.map((radius) => (
                    <button
                      key={radius}
                      type="button"
                      aria-pressed={tokens.radiusToken === radius}
                      onClick={() => updateToken('radiusToken', radius)}
                      className={`py-2 ${segment(tokens.radiusToken === radius)}`}
                    >
                      {radius}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* 3. Typography & density */}
              <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs gap-2">
                    <label
                      htmlFor="base-font-size"
                      className="flex items-center gap-2 font-medium text-[var(--text-primary)]"
                    >
                      <Type className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                      <span>Type scale</span>
                    </label>
                    <span className="font-mono text-[11px] text-[var(--text-muted)] font-semibold">
                      {tokens.baseFontSize}px
                    </span>
                  </div>
                  <input
                    id="base-font-size"
                    type="range"
                    min={14}
                    max={18}
                    step={1}
                    value={tokens.baseFontSize}
                    onChange={(e) => updateToken('baseFontSize', parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-[var(--bg-subtle)] rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: 'var(--accent)' }}
                  />
                </div>

                <fieldset className="space-y-2.5" aria-labelledby="token-density-label">
                  <div className="flex justify-between items-center text-xs gap-2">
                    <span
                      id="token-density-label"
                      className="flex items-center gap-2 font-medium text-[var(--text-primary)]"
                    >
                      <Layers className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                      <span>Density</span>
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)] capitalize font-semibold">
                      {tokens.spacingDensity}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {DENSITY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={tokens.spacingDensity === option.value}
                        onClick={() => updateToken('spacingDensity', option.value)}
                        className={`py-2 ${segment(tokens.spacingDensity === option.value)}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Live preview */}
              <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-3">
                <div className="flex items-center justify-between gap-3 text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.18em]">
                  <span>Live preview</span>
                  <span className="font-normal normal-case tracking-normal">Site-wide sync</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    className="px-4 py-2 text-xs font-semibold shadow-2xs transition-all active:scale-95"
                    style={{
                      backgroundColor: 'var(--accent-solid)',
                      color: 'var(--accent-contrast)',
                      borderRadius: tokens.radiusToken,
                    }}
                  >
                    Token Action
                  </button>

                  <span
                    className="px-3.5 py-1.5 text-xs font-mono font-bold border shadow-2xs"
                    style={{
                      borderColor: 'var(--accent)',
                      color: 'var(--accent-text)',
                      borderRadius: tokens.radiusToken,
                    }}
                  >
                    Active Tag
                  </span>

                  {/* A real track-and-thumb switch. This used to be a 10px dot
                      that only changed colour, which read as a status light
                      rather than a control — nothing about it said "flip me",
                      and in the off state it was a grey dot on a grey border.
                      The radius token drives the shell like its two siblings do
                      (the sandbox is meant to show radius changing on every
                      preview component); the track stays a pill, because a
                      square switch at 0px radius stops reading as a switch. */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={demoToggle}
                    onClick={() => setDemoToggle((value) => !value)}
                    className="inline-flex items-center gap-2.5 px-3.5 py-1.5 text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)]"
                    style={{ borderRadius: tokens.radiusToken }}
                  >
                    <span>Toggle</span>
                    {/* 32×18 track, 14px thumb, 2px inset on every side — so the
                        thumb travels exactly 14px and can never crowd or spill
                        past the rounded ends. */}
                    <span
                      className="relative shrink-0 w-8 h-[18px] rounded-full transition-colors duration-200"
                      style={{ backgroundColor: demoToggle ? 'var(--accent-solid)' : 'var(--border-main)' }}
                      aria-hidden="true"
                    >
                      {/* `--accent-contrast` rather than a hardcoded white: on a light
                          accent (amber, sky) a white thumb all but vanishes,
                          and this is the one contrast pair the visitor can
                          break from the swatch row above.

                          The hairline ring carries the off state, where the
                          knob and its track are inherently close: #ffffff on
                          #e4e4e7 is 1.13:1 in light, and #080808 on the dark
                          track is ~1.5:1. Fill alone leaves the knob a rumour
                          in both themes; the ring gives it an edge. */}
                      <span
                        className="absolute top-1/2 left-0.5 w-3.5 h-3.5 rounded-full shadow-2xs ring-1 ring-black/10 dark:ring-white/25 transition-transform duration-200 motion-reduce:transition-none"
                        style={{
                          backgroundColor: demoToggle ? 'var(--accent-contrast)' : 'var(--bg-card)',
                          transform: `translate(${demoToggle ? '14px' : '0px'}, -50%)`,
                        }}
                      />
                    </span>
                  </button>
                </div>

                <label htmlFor="token-demo-input" className="sr-only">
                  Sample text input using the current tokens
                </label>
                <input
                  id="token-demo-input"
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-all"
                  style={{ borderRadius: tokens.radiusToken }}
                />
              </div>

              {/* Export */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Export
                </div>
                <div className="flex items-center gap-2">
                  {(['css', 'tailwind'] as const).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => handleCopy(kind)}
                      className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--text-primary)] flex items-center gap-1.5 shadow-2xs transition-colors"
                      title={kind === 'css' ? 'Copy CSS custom properties' : 'Copy Tailwind CSS v4 theme config'}
                    >
                      {copied === kind ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>{copied === kind ? 'Copied' : kind === 'css' ? 'CSS' : 'Tailwind'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Announce copy success to assistive tech. */}
              <p aria-live="polite" className="sr-only">
                {copied === 'css' ? 'CSS tokens copied to clipboard' : ''}
                {copied === 'tailwind' ? 'Tailwind tokens copied to clipboard' : ''}
              </p>
            </section>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
