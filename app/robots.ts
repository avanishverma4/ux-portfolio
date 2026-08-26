import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * Served at /robots.txt.
 *
 * `/api/` is disallowed — it returns JSON, so indexing it can only produce a
 * junk result. Everything else is open, and the sitemap is advertised here
 * because that is the one discovery path Bing (and therefore Yahoo and
 * DuckDuckGo) reads without a webmaster account.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
