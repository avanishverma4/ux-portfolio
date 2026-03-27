'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Copy } from 'lucide-react'
import { stagger, fadeInUp, fadeIn } from '@/lib/animations'
import { copyToClipboard } from '@/lib/utils'
import { EMAIL } from '@/lib/data'

const HEADLINE_WORDS = 'Crafting Experiences that People Love to Use.'.split(' ')

export default function Hero() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const ok = await copyToClipboard(EMAIL)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } else {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-paper pt-16"
    >
      {/* Subtle grid — fades out toward the bottom before Projects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgba(40,40,40,0.05) 1px, transparent 1px)',
            'linear-gradient(to bottom, rgba(40,40,40,0.05) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '64px 64px',
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 30%, transparent 90%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 md:px-10 lg:px-16">
        {/* Label row */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-10"
        >
          <motion.span
            variants={fadeIn}
            className="font-heading text-[0.65rem] font-medium uppercase tracking-[0.22em] text-ink/40"
          >
            UI/UX Designer
          </motion.span>
        </motion.div>

        {/* Display headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={stagger}
          aria-label="Crafting Experiences that People Love to Use."
          className="mb-10 font-heading font-semibold leading-[0.93] tracking-tight text-ink"
          style={{ fontSize: 'clamp(3.2rem, 7.5vw, 7.5rem)' }}
        >
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={i}
              variants={fadeInUp}
              className="mr-[0.18em] inline-block last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 h-px bg-ink/12"
        />

        {/* Sub-headline + CTAs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <motion.p
            variants={fadeInUp}
            className="max-w-lg font-body text-lg leading-relaxed text-ink/60"
          >
            Senior UX Specialist blending empathy with data-driven research to
            turn complex user journeys into simple, elegant interfaces.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex shrink-0 flex-col gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Email copied to clipboard' : `Copy email: ${EMAIL}`}
              className="flex items-center justify-center gap-2 rounded-full bg-cobalt px-7 py-3 font-heading text-sm font-medium text-paper transition-all hover:bg-cobalt/85 active:scale-95"
            >
              {copied ? (
                <Check size={14} strokeWidth={2} />
              ) : (
                <Copy size={14} strokeWidth={1.75} />
              )}
              {copied ? 'Copied!' : "Let's Connect"}
            </button>

            <a
              href="#work"
              className="flex items-center justify-center gap-2 rounded-full border border-ink/20 px-7 py-3 font-heading text-sm font-medium text-ink transition-all hover:border-cobalt hover:text-cobalt active:scale-95"
            >
              View Work
              <ArrowRight size={14} strokeWidth={1.75} />
            </a>
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mt-20 flex gap-12 border-t border-ink/8 pt-8"
        >
          {[
            { value: '8+', label: 'Years experience' },
            { value: '50+', label: 'Projects shipped' },
            { value: '10+', label: 'Case studies' },
          ].map(({ value, label }) => (
            <motion.div key={label} variants={fadeInUp} className="flex flex-col gap-1">
              <span className="font-heading text-3xl font-semibold text-ink">
                {value}
              </span>
              <span className="font-heading text-xs font-medium uppercase tracking-[0.15em] text-ink/40">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
