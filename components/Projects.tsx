'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { stagger, fadeInUp, scaleIn } from '@/lib/animations'
import { PROJECTS, BEHANCE_URL, type Project } from '@/lib/data'
import { cn } from '@/lib/utils'

function ProjectCard({ project }: { project: Project }) {
  const { title, tags, description, size, image, link } = project

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} — view project`}
      variants={scaleIn}
      whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
      className={cn(
        // Block display is required — <a> is inline by default
        'group relative block overflow-hidden rounded-2xl',
        'transition-shadow duration-300 hover:shadow-2xl',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt',
        size === 'featured'
          ? 'min-h-[280px] sm:col-span-2 lg:col-span-2 lg:min-h-[360px]'
          : 'min-h-[260px]',
      )}
    >
      {/*
        Background image layer — a <div> with background-image CSS is the most
        reliable way to fill a container that only has min-height. It avoids the
        containing-block height-resolution issue that affects next/image fill.
        The div itself is scaled on hover; overflow-hidden on the card clips it.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        style={{ backgroundImage: `url("${image}")` }}
      />

      {/* Two-layer overlay: base tint keeps the whole image darker,
          gradient concentrates opacity at the bottom where text sits */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content — sits above gradient via DOM stacking order */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/15 px-2.5 py-1 font-heading text-[0.6rem] font-medium uppercase tracking-[0.12em] text-white/85 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description + title */}
        <div className="space-y-1.5">
          <p className="line-clamp-2 font-body text-sm leading-relaxed text-white/75">
            {description}
          </p>
          <h3 className="font-heading text-lg font-semibold leading-snug text-white">
            {title}
          </h3>
        </div>
      </div>

      {/* Arrow */}
      <div
        aria-hidden="true"
        className="absolute right-5 top-5 rounded-full bg-white/15 p-1.5 text-white opacity-40 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
      >
        <ArrowUpRight size={13} strokeWidth={2} />
      </div>
    </motion.a>
  )
}

export default function Projects() {
  const gridRef = useRef<HTMLDivElement>(null)
  const gridInView = useInView(gridRef, { once: true, amount: 0 })

  return (
    <section
      id="work"
      aria-label="Featured projects"
      className="bg-paper px-6 py-28 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={stagger}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <motion.span
              variants={fadeInUp}
              className="mb-3 block font-heading text-[0.65rem] font-medium uppercase tracking-[0.22em] text-ink/40"
            >
              Selected Work
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-4xl font-semibold tracking-tight text-ink md:text-5xl"
            >
              Featured Projects
            </motion.h2>
          </div>

          <motion.a
            variants={fadeInUp}
            href={BEHANCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 font-heading text-sm font-medium text-ink/50 transition-colors hover:text-cobalt sm:flex"
          >
            Explore All
            <ArrowUpRight size={14} strokeWidth={2} />
          </motion.a>
        </motion.div>

        {/*
          Bento grid:
          - 3 cols on lg, 2 on sm, 1 on mobile
          - grid-flow-row-dense fills holes left by col-span-2 featured cards
          - animate (not whileInView) propagates variants to child motion elements
        */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:grid-flow-row-dense lg:grid-cols-3"
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>

        {/* Mobile Explore All */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="mt-8 flex justify-center sm:hidden"
        >
          <a
            href={BEHANCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-heading text-sm font-medium text-ink/50 transition-colors hover:text-cobalt"
          >
            Explore All on Behance
            <ArrowUpRight size={14} strokeWidth={2} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
