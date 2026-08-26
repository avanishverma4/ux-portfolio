import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * Served at /manifest.webmanifest. Bing reads it for app-style results and it
 * gives the page a proper name and icon when someone saves it to a home
 * screen. Icons resolve to the generated app/icon.tsx and app/apple-icon.tsx.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: SITE.themeColor.dark,
    theme_color: SITE.themeColor.dark,
    lang: 'en',
    categories: ['design', 'portfolio', 'productivity'],
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
