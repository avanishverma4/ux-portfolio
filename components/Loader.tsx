'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COUNTER_DURATION = 2.8 // seconds

export default function Loader() {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const start = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const t = Math.min((now - start) / (COUNTER_DURATION * 1000), 1)
      setCount(Math.floor(t * 100))
      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setVisible(false), 500)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col bg-ink px-6 py-8 md:px-10 lg:px-16"
        >
          {/* Top row — brand + role */}
          <div className="flex items-center justify-between">
            <span className="font-heading text-base font-semibold tracking-tight text-paper">
              Awanish.
            </span>
            <span className="font-heading text-[0.65rem] font-medium uppercase tracking-[0.22em] text-paper/40">
              UI/UX Designer
            </span>
          </div>

          {/* Counter — large display number */}
          <div className="flex flex-1 items-end pb-10">
            <span
              className="font-heading font-semibold leading-none tracking-tighter text-paper"
              style={{ fontSize: 'clamp(5rem, 18vw, 16rem)' }}
            >
              {String(count).padStart(2, '0')}
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-px w-full bg-paper/10">
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 h-full bg-paper"
              style={{ width: `${count}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
