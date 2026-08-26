import type Lenis from 'lenis';

/**
 * The Lenis instance is registered by <SmoothScroll /> so anchor navigation can
 * drive the same scroller. Without this, `scrollIntoView` fights Lenis and the
 * page lands in the wrong place (or jumps).
 */
let lenisInstance: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

/** Height of the sticky header, so anchored sections aren't hidden beneath it. */
function headerOffset(): number {
  const header = document.getElementById('main-header');
  const height = header?.offsetHeight ?? 0;
  return height + 16; // small breathing gap under the header
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Scrolls a section into view, accounting for the fixed header and routing
 * through Lenis when smooth scrolling is active.
 */
export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const offset = headerOffset();
  const reduced = prefersReducedMotion();

  if (lenisInstance && !reduced) {
    lenisInstance.scrollTo(element, { offset: -offset, duration: 1.1 });
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}

export function scrollToTop() {
  const reduced = prefersReducedMotion();

  if (lenisInstance && !reduced) {
    lenisInstance.scrollTo(0, { duration: 1.1 });
    return;
  }
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
}

/** Pauses/resumes Lenis so it doesn't scroll the page behind an open modal. */
export function setLenisStopped(stopped: boolean) {
  if (!lenisInstance) return;
  if (stopped) lenisInstance.stop();
  else lenisInstance.start();
}
