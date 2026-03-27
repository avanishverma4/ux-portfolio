'use client'

import { motion } from 'framer-motion'
import { SKILLS } from '@/lib/data'
import { stagger, fadeInUp, fadeIn } from '@/lib/animations'

export default function About() {
  return (
    <section
      id="about"
      aria-label="About Awanish"
      className="bg-paper py-28 px-6 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-3 block font-heading text-[0.65rem] font-medium uppercase tracking-[0.22em] text-ink/40"
          >
            The Person
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-4xl font-semibold tracking-tight text-ink md:text-5xl"
          >
            About Me
          </motion.h2>
        </motion.div>

        {/* Pull quote */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="mb-20 border-l-2 border-cobalt pl-8"
        >
          <motion.blockquote
            variants={fadeInUp}
            className="font-body text-2xl italic leading-snug text-ink/70 md:text-3xl"
          >
            "I believe that design is the silent ambassador of your brand."
          </motion.blockquote>
        </motion.div>

        {/* Bio + stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="mb-20 grid gap-12 lg:grid-cols-[1fr_auto]"
        >
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl font-body text-lg leading-relaxed text-ink/60"
          >
            With over 8 years of experience, I&apos;ve learned that the most
            powerful digital experiences are those that feel invisible. My work
            sits at the intersection of human psychology and technical
            precision. I don&apos;t just design screens; I architect journeys.
            Whether it&apos;s a complex enterprise dashboard or a minimalist
            mobile utility, my goal is always to reduce friction and amplify
            delight.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex gap-12 self-start lg:flex-col lg:gap-8"
          >
            {[
              { value: '08', label: 'Years' },
              { value: '50+', label: 'Projects' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-heading text-5xl font-semibold tracking-tight text-ink">
                  {value}
                </span>
                <span className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-ink/35">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="mb-20"
        >
          <motion.h3
            variants={fadeInUp}
            className="mb-8 font-heading text-sm font-medium uppercase tracking-[0.18em] text-ink/40"
          >
            Expertise
          </motion.h3>
          <div className="flex flex-wrap gap-3">
            {SKILLS.map((skill) => (
              <motion.span
                key={skill}
                variants={fadeInUp}
                className="rounded-full border border-ink/12 px-5 py-2 font-heading text-sm font-medium text-ink transition-colors hover:border-cobalt hover:text-cobalt"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.figure
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
          className="rounded-2xl bg-ink p-8 md:p-10"
          aria-label="Client testimonial"
        >
          <blockquote>
            <p className="font-body text-xl italic leading-relaxed text-paper/80 md:text-2xl">
              "Awanish has an uncanny ability to translate complex business
              requirements into elegant, user-friendly interfaces."
            </p>
          </blockquote>
          <figcaption className="mt-6 font-heading text-xs font-medium uppercase tracking-[0.18em] text-paper/30">
            — Client Feedback
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
