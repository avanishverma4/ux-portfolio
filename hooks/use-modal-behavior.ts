'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { setLenisStopped } from '@/lib/scroll';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Every open dialog pushes its container here, so layers stack instead of
 * fighting. Only the top layer answers Escape and traps Tab — otherwise a
 * lightbox opened on top of a dialog has its focus dragged back down into the
 * dialog underneath, where the visitor can't see what is focused.
 */
const layerStack: RefObject<HTMLElement | null>[] = [];

/*
 * Scroll locking is reference-counted for the same reason: the inner layer
 * closing must not hand scrolling back to the page while an outer dialog is
 * still open. The body's original inline styles are captured once, by whichever
 * layer locked first.
 */
let lockCount = 0;
let bodyStyleBeforeLock: { overflow: string; paddingRight: string } | null = null;

function lockScroll() {
  if (lockCount === 0) {
    // Lock without the layout shifting as the scrollbar goes.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    bodyStyleBeforeLock = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    setLenisStopped(true);
  }
  lockCount += 1;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0 && bodyStyleBeforeLock) {
    document.body.style.overflow = bodyStyleBeforeLock.overflow;
    document.body.style.paddingRight = bodyStyleBeforeLock.paddingRight;
    bodyStyleBeforeLock = null;
    setLenisStopped(false);
  }
}

/**
 * Gives a dialog the behaviour keyboard and screen-reader users expect:
 * Escape closes it, focus moves in and is trapped, focus returns to whatever
 * opened it, and the page behind it stops scrolling.
 *
 * Safe to nest — see `layerStack` above.
 */
export function useModalBehavior(isOpen: boolean, onClose: () => void) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  /*
   * The close callback is read through a ref rather than depended on. Callers
   * pass an inline arrow (`onClose={() => setSelected(null)}`), so depending on
   * its identity tore the trap down and rebuilt it on every parent render —
   * each teardown throwing focus back to the trigger behind the open dialog and
   * briefly unlocking the page behind it.
   */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    restoreFocusRef.current =
      previouslyFocused instanceof HTMLElement ? previouslyFocused : null;

    lockScroll();
    layerStack.push(containerRef);

    // Move focus into the dialog.
    const focusTimer = window.setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      const first = container.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? container).focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      // A deeper layer is open — let it handle the keyboard.
      if (layerStack[layerStack.length - 1] !== containerRef) return;

      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // Focus escaped the layer entirely (a click on the backdrop, say) — pull
      // it back to the start rather than letting Tab walk the page behind.
      if (!(active instanceof HTMLElement) || !container.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);

      const index = layerStack.indexOf(containerRef);
      if (index !== -1) layerStack.splice(index, 1);

      unlockScroll();

      // Only restore focus to something still in the document: the trigger may
      // have been unmounted by the same interaction that opened the dialog
      // (the mobile drawer closing as it launches the CV, for instance).
      const restore = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (restore && document.contains(restore)) restore.focus();
    };
  }, [isOpen]);

  return containerRef;
}
