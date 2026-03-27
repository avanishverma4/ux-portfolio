'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Mail } from 'lucide-react'
import { stagger, fadeInUp } from '@/lib/animations'
import { copyToClipboard } from '@/lib/utils'
import { EMAIL, SOCIAL_LINKS } from '@/lib/data'

export default function Contact() {
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
      id="contact"
      aria-label="Contact"
      className="bg-paper py-28 px-6 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="max-w-3xl"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-3 block font-heading text-[0.65rem] font-medium uppercase tracking-[0.22em] text-ink/40"
          >
            Get in Touch
          </motion.span>

          <motion.h2
            variants={fadeInUp}
            className="mb-4 font-heading text-4xl font-semibold tracking-tight text-ink md:text-5xl lg:text-6xl"
          >
            Ready to start a project?
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mb-3 font-heading text-xl font-medium text-ink/60 md:text-2xl"
          >
            Let's build something meaningful together.
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="mb-12 max-w-xl font-body text-base leading-relaxed text-ink/50"
          >
            Currently open to new opportunities and collaborations. Feel free to
            reach out for a chat.
          </motion.p>

          {/* Email actions */}
          <motion.div
            variants={fadeInUp}
            className="mb-16"
          >
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Email copied' : `Copy ${EMAIL} to clipboard`}
              className="flex items-center justify-center gap-2 rounded-full bg-cobalt px-7 py-3.5 font-heading text-sm font-medium text-paper transition-all hover:bg-cobalt/85 active:scale-95"
            >
              {copied ? (
                <Check size={15} strokeWidth={2} />
              ) : (
                <Mail size={15} strokeWidth={1.75} />
              )}
              {copied ? 'Copied to clipboard!' : "Let's Connect"}
            </button>
          </motion.div>

          {/* Social links */}
          <motion.div variants={fadeInUp} className="border-t border-ink/8 pt-10">
            <p className="mb-5 font-heading text-xs font-medium uppercase tracking-[0.18em] text-ink/35">
              Find me on
            </p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in new tab)`}
                  className="flex items-center gap-1.5 rounded-full border border-ink/12 px-5 py-2 font-heading text-sm font-medium text-ink/60 transition-all hover:border-cobalt hover:text-cobalt active:scale-95"
                >
                  {label}
                  <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
