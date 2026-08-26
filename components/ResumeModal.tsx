'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { SITE } from '@/lib/site';
import { useModalBehavior } from '@/hooks/use-modal-behavior';

/** Strip the scheme and any trailing slash so a URL reads as a label on paper. */
const bareUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

const PROFILE_LINKS = [
  { href: SITE.url, label: bareUrl(SITE.url) },
  { href: PORTFOLIO_DATA.profile.linkedin, label: bareUrl(PORTFOLIO_DATA.profile.linkedin) },
  { href: PORTFOLIO_DATA.profile.github, label: bareUrl(PORTFOLIO_DATA.profile.github) },
  { href: PORTFOLIO_DATA.profile.behance, label: bareUrl(PORTFOLIO_DATA.profile.behance) },
];

/**
 * Applicant tracking systems flatten a PDF to plain text and then look for
 * conventional section headings. Every section therefore uses one shared,
 * literal heading style — no icons, no invented section names.
 */
const SECTION_HEADING =
  'text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 border-b border-zinc-200 pb-1';

const SKILL_GROUPS = [
  {
    label: 'Product & Interaction Design',
    keywords:
      'UI/UX Design, Product Design, Interaction Design, Wireframing, Interactive Prototyping, Information Architecture, Visual Design, Responsive Design, Mobile App Design',
  },
  {
    label: 'Design Systems',
    keywords:
      'Design Systems, Design Tokens, Component Libraries, Figma (Auto Layout, Variables, Components), Style Dictionary, Multi-Brand Theming, Design-to-Code Handoff',
  },
  {
    label: 'User Research',
    keywords:
      'User Research, User Interviews, Usability Testing, Personas, Journey Mapping, Empathy Mapping, A/B Testing, Competitive Analysis, Heuristic Evaluation',
  },
  {
    label: 'Frontend & Tools',
    keywords:
      'React, Next.js, TypeScript, HTML5, CSS3, Tailwind CSS, WCAG 2.1 AA Accessibility, Adobe Creative Suite (Photoshop, Illustrator, After Effects), Git',
  },
] as const;

/** Emoji survive PDF-to-text extraction as noise, so the CV strips them. */
const stripEmoji = (text: string) =>
  text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2190}-\u{21FF}]/gu, '').trim();

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const containerRef = useModalBehavior(isOpen, onClose);

  const handlePrint = () => {
    window.print();
  };

  return (
    // AnimatePresence sits outside the open check so the modal can animate out.
    <AnimatePresence>
      {isOpen && (
        <div className="print-root fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm print-hide"
            aria-hidden="true"
          />

          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="print-sheet relative w-full max-w-4xl bg-white text-zinc-900 border border-zinc-200 rounded-xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-zinc-200 bg-zinc-50 print-hide">
              <div className="flex flex-wrap items-center gap-x-2 text-xs font-mono font-bold text-zinc-600">
                <span>Curriculum Vitae</span>
                <span className="hidden sm:inline">— {PORTFOLIO_DATA.profile.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-100 transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close curriculum vitae"
                  className="p-1.5 rounded-md hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Printable Resume Body */}
            <div className="print-scroll overflow-y-auto p-6 sm:p-8 space-y-8 print:p-0 font-sans text-sm text-zinc-800" data-lenis-prevent>

              {/* CV Header */}
              <div className="border-b border-zinc-200 pb-6 space-y-3">
                {/* Stacked on paper: a two-column masthead interleaves into
                    "Awanish Verma avanishverma4@gmail.com" style noise when a
                    parser reads the flattened PDF line by line. */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 print:block print:space-y-1">
                  <div>
                    {/* h2, not h1: the page's only h1 is the hero headline, and
                        a second one competing with it muddies the document
                        outline crawlers build. */}
                    <h2 id="resume-modal-title" className="text-3xl font-bold tracking-tight text-zinc-900">
                      {PORTFOLIO_DATA.profile.name}
                    </h2>
                    <p className="text-base font-medium text-emerald-700 font-mono pt-1">
                      {PORTFOLIO_DATA.profile.title}
                    </p>
                  </div>

                  <div className="text-xs font-mono text-zinc-600 space-y-1 sm:text-right print:text-left">
                    <div>
                      <a href={`mailto:${PORTFOLIO_DATA.profile.email}`} className="text-emerald-800 underline underline-offset-2 hover:text-emerald-900">
                        {PORTFOLIO_DATA.profile.email}
                      </a>
                    </div>
                    <div>{PORTFOLIO_DATA.profile.location}</div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 sm:justify-end print:justify-start">
                      {PROFILE_LINKS.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-800 underline underline-offset-2 hover:text-emerald-900"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* An ATS looks for a literal "Summary" heading before it will
                  treat this paragraph as the professional summary. */}
              <section className="space-y-2">
                <h3 className={SECTION_HEADING}>Professional Summary</h3>
                <p className="text-xs leading-relaxed text-zinc-700">
                  {PORTFOLIO_DATA.profile.longBio}
                </p>
              </section>

              {/* Experience — reverse-chronological, newest role first. */}
              <section className="space-y-4">
                <h3 className={SECTION_HEADING}>Professional Experience</h3>

                <div className="space-y-6">
                  {PORTFOLIO_DATA.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-2 break-inside-avoid">
                      {/* Role and employer stay on one text line so a parser
                          reading top-to-bottom keeps them together. */}
                      <div className="flex flex-wrap justify-between items-start gap-x-4">
                        <div className="font-bold text-zinc-900">
                          {exp.role}, {exp.company}
                        </div>
                        <span className="text-xs font-mono text-zinc-700">{exp.period}</span>
                      </div>

                      <div className="text-xs text-zinc-600">{exp.location}</div>

                      <p className="text-xs text-zinc-700">{exp.description}</p>

                      <ul className="list-disc list-outside text-xs text-zinc-700 space-y-1 pl-5">
                        {exp.achievements.map((ach) => (
                          <li key={ach}>{ach}</li>
                        ))}
                      </ul>

                      <p className="text-xs text-zinc-600">
                        <strong className="text-zinc-800">Skills:</strong> {exp.skills.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Selected Projects — single column on paper. Side-by-side
                  cards read as interleaved gibberish once an ATS flattens the
                  PDF into a single text stream. */}
              <section className="space-y-4">
                <h3 className={SECTION_HEADING}>Selected Projects</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-1 gap-4 print:gap-3">
                  {PORTFOLIO_DATA.projects.slice(0, 4).map((p) => {
                    const url = p.liveUrl ?? p.githubUrl;

                    return (
                      <div key={p.id} className="p-3 bg-zinc-50 rounded border border-zinc-200 space-y-1 break-inside-avoid print:p-0 print:bg-transparent print:border-0">
                        <div className="font-bold text-xs text-zinc-900">
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-800 underline underline-offset-2 hover:text-emerald-900"
                            >
                              {p.title}
                            </a>
                          ) : (
                            p.title
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-700">{p.tagline}</div>
                        {/* Emoji survive as tofu or get dropped entirely by
                            resume parsers, so the metric is stripped to text. */}
                        <div className="text-[11px] text-zinc-700">
                          <strong className="text-zinc-800">Impact:</strong> {stripEmoji(p.impactMetric)}
                        </div>
                        <div className="text-[11px] text-zinc-700">
                          <strong className="text-zinc-800">Tools:</strong> {p.techStack.join(', ')}
                        </div>
                        {/* Printed CVs lose the hyperlink, so the URL is spelled
                            out in the print layout only. */}
                        {url && (
                          <div className="hidden print:block text-[10px] font-mono text-zinc-600 break-all">
                            {bareUrl(url)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Skills — one labelled keyword line per group. Keyword-match
                  scoring reads plain comma-separated text far more reliably
                  than any chart, rating bar or column split. */}
              <section className="space-y-2 break-inside-avoid">
                <h3 className={SECTION_HEADING}>Core Skills</h3>
                <div className="text-xs text-zinc-700 space-y-1">
                  {SKILL_GROUPS.map((group) => (
                    <div key={group.label}>
                      <strong className="text-zinc-800">{group.label}:</strong> {group.keywords}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2 break-inside-avoid">
                <h3 className={SECTION_HEADING}>Education</h3>
                <div className="text-xs text-zinc-700 space-y-2">
                  {PORTFOLIO_DATA.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="font-bold text-zinc-900">{edu.qualification}</div>
                      <div>
                        {edu.institution}, {edu.location} | {edu.period}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2 break-inside-avoid">
                <h3 className={SECTION_HEADING}>Certifications</h3>
                <ul className="list-disc list-outside text-xs text-zinc-700 space-y-1 pl-5">
                  {PORTFOLIO_DATA.certifications.map((cert) => (
                    <li key={cert.id}>
                      <span className="font-bold text-zinc-900">{cert.name}</span>
                      <span> — {cert.issuer} | {cert.year}</span>
                    </li>
                  ))}
                </ul>
              </section>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
