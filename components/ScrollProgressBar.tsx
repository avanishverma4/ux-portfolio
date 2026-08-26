'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    // Purely decorative: the previous role="progressbar" carried no aria-valuenow,
    // so screen readers announced an empty, meaningless widget.
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-black/5 dark:bg-white/5 print-hide"
    >
      <motion.div
        className="h-full w-full origin-left transition-colors duration-200"
        style={{
          scaleX,
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 10px var(--accent)',
        }}
      />
    </div>
  );
}
