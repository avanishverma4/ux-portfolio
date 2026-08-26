# SEO

Everything a crawler reads derives from `lib/site.ts`. Change a term there and
the `<title>`, the meta description, the keyword tag and the JSON-LD graph all
move together. That is deliberate — the usual way portfolios lose rankings is a
canonical, a sitemap and an OG tag quietly disagreeing about what the site is.

## What is realistic

Search intent decides which queries a one-page portfolio can win, and no amount
of markup overrides it.

| Tier | Example | Realistic outcome |
|---|---|---|
| **Brand** | `Awanish Verma`, `Awanish Verma designer` | **Position 1.** Should already hold once indexed. |
| **Long-tail service** | `design token architecture consultant`, `multi-brand design system audit` | **Page 1 achievable.** Low competition, high hiring intent. |
| **Local** | `UI UX designer Bengaluru`, `product designer Bangalore` | **Page 1 achievable**, but needs the off-page work below — mainly a Google Business Profile and local citations. |
| **Head** | `UI/UX designer` | **Not winnable.** See below. |

### Why the head term is not winnable

`UI/UX designer` returns Coursera, Adobe, the Interaction Design Foundation,
Indeed and Wikipedia. Google classifies that query as *informational* — people
typing it want to know what the job is, not to hire one person. The pages that
satisfy it are encyclopedia entries with six-figure backlink counts. A portfolio
is the wrong document type for the query, so it cannot rank there regardless of
its markup, and pursuing it costs attention that the winnable tiers repay.

The terms are still carried across the page for topical relevance — they are
what makes the *qualified* variants (`UI/UX designer Bengaluru`, `freelance
UI/UX designer India`) match.

## What is implemented

- **`lib/site.ts` — `SEO_KEYWORDS`.** The keyword map, grouped by intent tier,
  and the single source for every other surface.
- **Title, 56 chars.** Keyword-first, under Google's ~60-character render
  budget. The old one ran to 69 and was clipped mid-phrase.
- **Description, 157 chars.** The old one ran past 250, so the call to action
  never rendered in a result. The city is in it because that is the term local
  queries turn on.
- **`<h1>` kicker** (`components/Hero.tsx`). The heading is a document's
  strongest on-page term signal, and the editorial line in it names no
  discipline. The role and city now ride above that line, visibly, in the
  site's own mono-eyebrow idiom. Before this change, `profile.title` appeared
  nowhere in the rendered page — only in the OG image and the CV modal.
- **JSON-LD graph** (`buildJsonLd`). One `@graph` so nodes reference each
  other by `@id` instead of reading as unrelated strangers:
  - `Person` — with `knowsAbout` (skills + service terms), `knowsLanguage`,
    `workLocation`, and a full `PostalAddress`.
  - `ProfessionalService` — **the node that answers local queries.** A `Person`
    has no `areaServed`, so without it the graph described someone with a
    location but no stated catchment. Carries `areaServed`, `serviceType` and
    an `OfferCatalog` of five discrete services, which is what lets one narrow
    query match instead of only the broad description.
  - `WebSite`, `ProfilePage`, `ItemList` of case studies.
- **`sitemap.xml`** with the OG image for image search. **`robots.txt`**
  advertising the sitemap — the one discovery path Bing reads without an
  account, and Bing feeds Yahoo and DuckDuckGo.
- **404 metadata** — `noindex, follow` and no canonical, so a dead URL cannot
  claim to be the home page.

### Two things deliberately *not* done

- **No `Review` / `aggregateRating` markup**, despite real testimonials in the
  page data. Reviews you host about yourself are self-serving under Google's
  review-snippet policy. The rich result would not be granted and the markup
  risks a manual action.
- **No hidden `sr-only` keyword text.** Hidden text for ranking is precisely
  what the spam policy names. The `<h1>` kicker is visible for that reason.

## What actually decides the ranking (not code)

The site is now technically complete. Everything left is off-page, and it is
the part that determines whether any of the above converts into positions.

1. **Verify in [Search Console](https://search.google.com/search-console) and
   [Bing Webmaster Tools](https://www.bing.com/webmasters).** Paste the tokens
   into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and
   `NEXT_PUBLIC_BING_SITE_VERIFICATION` (see `.env.example`), then submit
   `/sitemap.xml` in both. Nothing else on this list matters until the site is
   indexed, and indexing is not automatic.
2. **Set `NEXT_PUBLIC_SITE_URL` per environment.** If a preview deployment
   inherits the production URL, it tells Google two hosts serve the same page
   and splits the ranking between them.
3. **Google Business Profile.** This, not markup, is what puts a person in the
   local pack for `UI UX designer Bengaluru`. Service-area business, no
   storefront needed.
4. **Backlinks, in descending order of value.** Behance, Dribbble, LinkedIn
   (featured link), GitHub profile README, Medium/Substack posts linking back,
   podcast or conference bios, and any client site crediting the work. This is
   the single largest remaining factor and the slowest.
5. **Fill in the real social URLs** in `data/portfolioData.ts`. `sameAs` is how
   an engine resolves *which* Awanish Verma this is; `isProfileUrl` in
   `lib/site.ts` drops bare domain roots rather than assert he *is* GitHub.
6. **Publish writing.** Case studies as their own indexable routes, or articles
   on design tokens, would multiply the long-tail surface. Right now the entire
   site is one URL competing for every query at once.

Expect nothing for 2–4 weeks after verification, brand queries first, then
long-tail. Local follows the Business Profile.
