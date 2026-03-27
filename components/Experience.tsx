'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EXPERIENCES } from '@/lib/data'
import { stagger, fadeInUp } from '@/lib/animations'
import { ease } from '@/lib/animations'

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null)
  const listInView = useInView(listRef, { once: true, amount: 0 })

  return (
    <section
      id="experience"
      aria-label="Work experience"
      className="bg-ink px-6 py-28 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={stagger}
          className="mb-20"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-3 block font-heading text-[0.65rem] font-medium uppercase tracking-[0.22em] text-paper/50"
          >
            Career
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-4xl font-semibold tracking-tight text-paper md:text-5xl"
          >
            Work History
          </motion.h2>
        </motion.div>

        {/* Timeline entries */}
        <motion.ol
          ref={listRef}
          initial="hidden"
          animate={listInView ? 'visible' : 'hidden'}
          variants={stagger}
          aria-label="Work timeline"
        >
          {EXPERIENCES.map((exp, i) => (
            <motion.li
              key={i}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease, delay: i * 0.08 },
                },
              }}
              className="group relative border-t border-paper/12 py-10 last:border-b last:border-paper/12"
            >
              {/* Index + period row */}
              <div className="mb-6 flex items-center gap-4">
                <span className="font-heading text-[0.6rem] font-semibold tracking-[0.25em] text-pink-eraser/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-pink-eraser/20 to-transparent" />
                {exp.period && (
                  <span className="rounded-full border border-paper/15 bg-paper/8 px-3 py-1 font-heading text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-paper/65">
                    {exp.period}
                  </span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:gap-12">
                <div>
                  {/* Role — slides slightly on hover */}
                  <h3 className="mb-2 font-heading text-2xl font-semibold leading-tight tracking-tight text-paper transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl lg:text-4xl">
                    {exp.role}
                  </h3>

                  {/* Company + location */}
                  <p className="mb-5 font-heading text-sm font-medium text-paper/70">
                    {exp.company}
                    {exp.location && (
                      <span className="font-normal text-paper/40">
                        {' '}· {exp.location}
                      </span>
                    )}
                  </p>

                  {/* Description */}
                  <p className="max-w-2xl font-body text-[0.9rem] leading-relaxed text-paper/60">
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
