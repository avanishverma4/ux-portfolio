import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDownRight, Home } from 'lucide-react';
import { ErrorScreen } from '@/components/ErrorScreen';

/**
 * 404 for any URL that isn't the single portfolio route.
 *
 * A server component: nothing here is interactive, so it costs no client JS
 * beyond the links, and the response still carries a real 404 status.
 */

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Head back to the portfolio home page.',
  // Keeping the inherited `canonical: '/'` here would tell crawlers this 404 IS
  // the home page, and noindex stops the dead URL from earning an entry of its
  // own. `follow` stays on so the links below are still crawled back to '/'.
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      eyebrow="Page not found"
      title={
        <>
          This page isn&apos;t part of the{' '}
          <span style={{ color: 'var(--accent-text)' }}>portfolio</span>.
        </>
      }
      description="The link may be outdated, or the address slightly off. Everything — case studies, experience, the token sandbox — lives on a single page, one link away."
      actions={
        <>
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 pl-5 pr-4 py-3.5 text-sm font-semibold rounded-md shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: 'var(--accent-solid)', color: 'var(--accent-contrast)' }}
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Back to the portfolio</span>
          </Link>

          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-md bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all duration-200 shadow-2xs"
          >
            <span>Selected work</span>
            <ArrowDownRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </>
      }
    />
  );
}
