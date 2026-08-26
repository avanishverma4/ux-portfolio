import { PORTFOLIO_DATA } from '@/data/portfolioData';

/**
 * Single source of truth for everything crawlers read: the canonical origin,
 * the titles, and the structured-data graph. Metadata, robots.txt, the
 * sitemap, the manifest and the JSON-LD all derive from here so they can never
 * drift apart — a canonical URL that disagrees with the sitemap is one of the
 * quieter ways to lose a ranking.
 */

/**
 * Set NEXT_PUBLIC_SITE_URL per environment. Preview deployments that inherit
 * the production URL end up telling Google that two hosts serve the same page.
 * Trailing slashes are stripped so `${SITE.url}${path}` never doubles up.
 */
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.awanishverma.com').replace(/\/+$/, ''),
  name: 'Awanish Verma — UI/UX Designer & Design Systems Architect',
  shortName: 'Awanish Verma',
  /**
   * Keyword-first, and kept under ~60 characters so Google renders it whole
   * rather than clipping it mid-phrase. "Senior Lead" was dropped from the old
   * title for the same reason: it consumed nine characters of a hard budget
   * and nobody searches for it. Anyone searching the name still matches — an
   * exact-name query hits this page on the <h1>, the JSON-LD Person and the
   * domain regardless of word order.
   */
  title: 'UI/UX Designer & Design Systems Architect — Awanish Verma',
  /**
   * ~155 characters. The previous description ran past 250, so search engines
   * truncated it mid-sentence and the call to action never rendered. The city
   * is in here deliberately: it is the term local queries actually turn on.
   */
  description:
    'UI/UX designer and design systems architect in Bengaluru, available worldwide. 7+ years of product design case studies, design tokens and interaction design.',
  locale: 'en_US',
  twitterHandle: '@awanishverma',
  themeColor: { light: '#fafafa', dark: '#050505' },
  accent: '#3b82f6',
  /** Drives the local-intent terms and the `areaServed` in structured data. */
  geo: {
    city: 'Bengaluru',
    region: 'Karnataka',
    country: 'IN',
  },
} as const;

/**
 * Keyword map, grouped by search intent rather than dumped in one list.
 *
 * An honest note on where these actually do work: Google dropped
 * `<meta name="keywords">` as a ranking signal in 2009 and Bing treats it as a
 * spam indicator at worst, ignored at best. It is emitted below because a few
 * engines (Yandex, Baidu, Naver) still parse it and it costs one tag — but no
 * ranking follows from this list on its own.
 *
 * The terms earn their keep by being reused where engines *do* read them: the
 * <title>, the meta description, the <h1>, and `knowsAbout` / `serviceType` in
 * the JSON-LD graph. Keeping one source for all of those is the point of this
 * export — a keyword that appears only in the meta tag is a keyword the site
 * does not actually rank for.
 */
export const SEO_KEYWORDS = {
  /** Brand queries. The one tier this site can realistically own outright. */
  brand: [
    'Awanish Verma',
    'Awanish Verma designer',
    'Awanish Verma portfolio',
    'Awanish Verma UI UX',
  ],
  /**
   * Head terms. Enormous volume, informational intent, and the first page is
   * held by Coursera / Adobe / IxDF. Included for topical relevance, not
   * because a portfolio outranks an encyclopedia on them.
   */
  role: [
    'UI/UX designer',
    'UI UX designer',
    'UX designer',
    'UI designer',
    'product designer',
    'design systems architect',
    'lead product designer',
    'senior UX designer',
    'interaction designer',
  ],
  /**
   * Local intent. Realistically winnable, and the highest-converting tier —
   * "designer in <city>" is a hiring query, not a homework query.
   */
  local: [
    'UI UX designer Bengaluru',
    'UX designer Bangalore',
    'product designer Bengaluru',
    'UI UX designer India',
    'freelance UI UX designer India',
    'remote product designer',
  ],
  /**
   * Long-tail service queries. Low volume, high intent, low competition —
   * where a specialist portfolio genuinely reaches page one.
   */
  services: [
    'design system consultant',
    'design tokens consultant',
    'design token architecture',
    'multi-brand design system',
    'Figma design system',
    'design system audit',
    'UX case study portfolio',
    'design engineer portfolio',
    'accessibility WCAG audit',
    'user research and usability testing',
  ],
} as const;

/** Flattened for the `keywords` metadata field, order preserved by tier. */
export const ALL_KEYWORDS: string[] = [
  ...SEO_KEYWORDS.brand,
  ...SEO_KEYWORDS.role,
  ...SEO_KEYWORDS.local,
  ...SEO_KEYWORDS.services,
];

const { profile, projects, experiences, skillCategories, education, certifications } =
  PORTFOLIO_DATA;

/**
 * `sameAs` is how a search engine resolves "which Awanish Verma is this" — it
 * merges the entity with the profiles listed. A bare domain root
 * ("https://github.com") therefore asserts that this person *is* GitHub, which
 * is worse than saying nothing, so placeholders are dropped until real profile
 * URLs land in portfolioData.ts.
 */
function isProfileUrl(href: string): boolean {
  try {
    const { pathname } = new URL(href);
    return pathname.replace(/\/+$/, '').length > 0;
  } catch {
    return false;
  }
}

const socialProfiles = [profile.github, profile.linkedin, profile.behance, profile.instagram].filter(
  isProfileUrl
);

/**
 * One `@graph` rather than several stacked `<script>` blocks: nodes can then
 * reference each other by `@id`, so the ProfilePage, the Person and each case
 * study are understood as one connected entity instead of three strangers.
 */
export function buildJsonLd() {
  const personId = `${SITE.url}/#person`;
  const siteId = `${SITE.url}/#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: profile.name,
        alternateName: SITE.shortName,
        jobTitle: profile.title,
        description: profile.longBio,
        url: `${SITE.url}/`,
        image: `${SITE.url}/opengraph-image`,
        email: `mailto:${profile.email}`,
        ...(socialProfiles.length > 0 ? { sameAs: socialProfiles } : {}),
        /**
         * `knowsAbout` is the closest thing to a keyword field that engines
         * still read, so the service terms join the skill list here rather
         * than living only in the ignored meta tag. Deduped — a repeated topic
         * adds nothing and reads as padding.
         */
        knowsAbout: Array.from(
          new Set([
            ...skillCategories.flatMap((category) => category.skills.map((skill) => skill.name)),
            ...SEO_KEYWORDS.services,
            ...SEO_KEYWORDS.role,
          ])
        ),
        knowsLanguage: ['en', 'hi'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: SITE.geo.city,
          addressRegion: SITE.geo.region,
          addressCountry: SITE.geo.country,
        },
        /**
         * Separate from `address`: where he *works*, which for a remote
         * practice is a wider claim than where he is registered. Both are
         * true and they answer different queries.
         */
        workLocation: [
          { '@type': 'Place', name: `${SITE.geo.city}, India` },
          { '@type': 'VirtualLocation', name: 'Remote — worldwide' },
        ],
        worksFor: experiences
          .filter((experience) => experience.current)
          .map((experience) => ({ '@type': 'Organization', name: experience.company })),
        /**
         * `alumniOf` names the *institution*, not the qualification — the
         * credential itself belongs in `hasCredential`, which is also where a
         * resume parser reading the page expects certifications to live.
         */
        alumniOf: education.map((entry) => ({
          '@type': 'EducationalOrganization',
          name: entry.institution,
        })),
        hasCredential: [
          ...education.map((entry) => ({
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'diploma',
            name: entry.qualification,
            recognizedBy: { '@type': 'EducationalOrganization', name: entry.institution },
          })),
          ...certifications.map((cert) => ({
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'certificate',
            name: cert.name,
            recognizedBy: { '@type': 'Organization', name: cert.issuer },
            dateCreated: cert.year,
          })),
        ],
        hasOccupation: {
          '@type': 'Occupation',
          name: 'UI/UX Designer & Design Systems Architect',
          occupationalCategory: '27-1024.00', // O*NET: Graphic / Digital Designers
          skills: skillCategories.map((category) => category.category).join(', '),
          occupationLocation: { '@type': 'City', name: SITE.geo.city },
        },
      },
      /**
       * The design practice as a service, distinct from the person offering
       * it. This is the node that answers "UI UX designer in <city>" — a
       * Person has no `areaServed`, so without it the graph describes someone
       * with a location but no stated catchment.
       *
       * Deliberately no `aggregateRating` or `Review` nodes, even though real
       * testimonials sit in the page data: reviews you host about yourself are
       * self-serving under Google's review-snippet policy, and marking them up
       * risks a manual action for a rich result that would not be granted.
       */
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE.url}/#practice`,
        name: `${profile.name} — UI/UX & Design Systems`,
        description: profile.availability,
        url: `${SITE.url}/`,
        image: `${SITE.url}/opengraph-image`,
        provider: { '@id': personId },
        founder: { '@id': personId },
        email: `mailto:${profile.email}`,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: SITE.geo.city,
          addressRegion: SITE.geo.region,
          addressCountry: SITE.geo.country,
        },
        areaServed: [
          { '@type': 'City', name: SITE.geo.city },
          { '@type': 'Country', name: 'India' },
          { '@type': 'Place', name: 'Worldwide (remote)' },
        ],
        serviceType: [...SEO_KEYWORDS.services],
        /**
         * The catalogue restates the practice's offers as discrete items, which
         * is what lets an engine match a single narrow query ("design system
         * audit") instead of only the broad service description.
         */
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Design services',
          itemListElement: [
            'End-to-end product UI/UX design',
            'Multi-brand design system architecture',
            'Design token pipelines and Figma tooling',
            'Design system and accessibility audits',
            'User research and usability testing',
          ].map((serviceName) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: serviceName, provider: { '@id': personId } },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': siteId,
        url: `${SITE.url}/`,
        name: SITE.name,
        description: SITE.description,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE.url}/#profilepage`,
        url: `${SITE.url}/`,
        name: SITE.title,
        description: SITE.description,
        isPartOf: { '@id': siteId },
        about: { '@id': personId },
        mainEntity: { '@id': personId },
        inLanguage: 'en',
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE.url}/#work`,
        name: 'Selected case studies',
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            '@id': `${SITE.url}/#project-${project.slug}`,
            name: project.title,
            headline: project.tagline,
            description: project.description,
            abstract: project.overview,
            image: project.coverImage,
            genre: project.category,
            keywords: project.techStack.join(', '),
            url: project.liveUrl ?? `${SITE.url}/`,
            author: { '@id': personId },
            creator: { '@id': personId },
          },
        })),
      },
    ],
  };
}
