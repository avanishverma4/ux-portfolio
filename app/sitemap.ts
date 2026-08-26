import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * Served at /sitemap.xml.
 *
 * The portfolio is a single document, so this lists exactly one URL. Listing
 * `#projects`-style fragments would be worse than useless: engines drop
 * fragments, so they would all collapse to duplicates of `/` and read as a
 * padded sitemap.
 *
 * `lastModified` is stamped at build time, which is honest — the content only
 * changes when the site is rebuilt and redeployed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE.url}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      /**
       * The one asset worth surfacing to image search. Case-study imagery is
       * hotlinked from Unsplash, so it belongs in Unsplash's sitemap, not
       * this one — an engine credits the hosting origin, and listing images
       * served from another domain wins nothing here.
       */
      images: [`${SITE.url}/opengraph-image`],
    },
  ];
}
