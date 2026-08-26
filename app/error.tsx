'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Home, RotateCw } from 'lucide-react';
import { ErrorScreen } from '@/components/ErrorScreen';

/**
 * Route-level error boundary: catches anything thrown while rendering the page
 * or its components. Errors thrown by the root layout itself escape this
 * boundary — `app/global-error.tsx` is the net underneath it.
 *
 * `reset()` re-renders the segment rather than reloading the document, so a
 * transient failure recovers without the visitor losing their place.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production Next strips the message client-side and leaves only the
    // digest, which is the id to match against the server log.
    console.error('[portfolio] route error:', error);
  }, [error]);

  return (
    <ErrorScreen
      code="500"
      eyebrow="Something broke"
      title={
        <>
          This section didn&apos;t{' '}
          <span style={{ color: 'var(--accent-text)' }}>render</span>.
        </>
      }
      description="An unexpected error interrupted the page. Trying again usually clears it — the fault is on this end, not with anything you did."
      actions={
        <>
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center gap-2.5 pl-5 pr-4 py-3.5 text-sm font-semibold rounded-md shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: 'var(--accent-solid)', color: 'var(--accent-contrast)' }}
          >
            <RotateCw
              className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180"
              aria-hidden="true"
            />
            <span>Try again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-md bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all duration-200 shadow-2xs"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Reload the portfolio</span>
          </Link>
        </>
      }
      detail={
        error.digest ? (
          /* The digest is the only handle on the server-side stack trace, so
             it's worth showing — someone reporting the fault can quote it. */
          <p className="font-mono text-[11px] text-[var(--text-muted)] break-all">
            <span className="uppercase tracking-[0.16em]">Reference</span>{' '}
            <span className="text-[var(--text-secondary)]">{error.digest}</span>
          </p>
        ) : null
      }
    />
  );
}
