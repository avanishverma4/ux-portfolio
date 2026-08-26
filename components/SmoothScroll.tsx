'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { registerLenis } from '@/lib/scroll';

export function SmoothScroll() {
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let animationFrameId = 0;

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });
      registerLenis(lenis);

      const raf = (time: number) => {
        lenis?.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      };
      animationFrameId = requestAnimationFrame(raf);
    };

    const stop = () => {
      cancelAnimationFrame(animationFrameId);
      lenis?.destroy();
      lenis = null;
      registerLenis(null);
    };

    if (!motionQuery.matches) start();

    // React to the preference changing mid-session instead of only at mount.
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) stop();
      else start();
    };

    motionQuery.addEventListener('change', handleChange);
    return () => {
      motionQuery.removeEventListener('change', handleChange);
      stop();
    };
  }, []);

  return null;
}
