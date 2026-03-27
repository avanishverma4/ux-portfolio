# Awanish Verma — UX Portfolio

A modern editorial-tech portfolio for Senior UX Specialist Awanish Verma. Built with a typography-first design system, purposeful motion, and a production-ready frontend architecture.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Icons | lucide-react |
| Font loading | next/font/google |

---

## Design System

### Palette
| Token | Hex | Usage |
|---|---|---|
| Ink | `#282828` | Text, dark backgrounds |
| Paper | `#F9F6EF` | Page background, light cards |
| Cobalt | `#193497` | CTA, active states, accents |
| Pink Eraser | `#EDA398` | Decorative accent (reserved for future use) |

### Typography
- **Headings** — Manrope (variable font, loaded via `next/font/google`)
- **Body** — Lora (variable font, loaded via `next/font/google`)

Font families are exposed as CSS custom properties (`--font-manrope`, `--font-lora`) on `<html>` and mapped to Tailwind utilities (`font-heading`, `font-body`) via `@theme` in `globals.css`.

---

## Features

- **Editorial hero** — large display headline with word-level stagger animation, copy-to-clipboard CTA with animated "Copied!" feedback
- **Bento grid** — 3-column responsive project grid with mixed card sizes (featured: 2-col, small: 1-col), three card variants (dark / light / cobalt), hover lift + shadow
- **Experience timeline** — vertical timeline with IntersectionObserver-triggered stagger
- **About** — pull quote, bio, stats, skill chips, testimonial block
- **Contact** — copy-to-clipboard email + mailto fallback, social links
- **Navbar** — sticky with `backdrop-blur` on scroll, IntersectionObserver active section detection, mobile full-screen overlay
- **Accessibility** — skip-to-content link, semantic HTML, ARIA labels, `:focus-visible` ring, keyboard-navigable
- **Scroll animations** — Framer Motion `whileInView` with `once: true` (no re-trigger, no layout shift)

---

## Folder Structure

```
/
├── app/
│   ├── globals.css         # Tailwind v4 @theme + global resets
│   ├── layout.tsx          # Root layout, Google Fonts, metadata
│   └── page.tsx            # Page assembly (Server Component)
├── components/
│   ├── Navbar.tsx          # Sticky nav, scroll + active section detection
│   ├── Hero.tsx            # Editorial hero, word stagger, clipboard CTA
│   ├── Projects.tsx        # Bento grid with ProjectCard
│   ├── Experience.tsx      # Work history timeline
│   ├── About.tsx           # Bio, stats, skills, testimonial
│   ├── Contact.tsx         # Contact CTA, clipboard, social links
│   └── Footer.tsx          # Minimal footer (Server Component)
├── lib/
│   ├── animations.ts       # Centralized Framer Motion variants
│   ├── data.ts             # All content — single source of truth
│   └── utils.ts            # cn() helper, copyToClipboard()
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## Setup & Installation

```bash
# Install dependencies
npm install

# Development server (Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Script | Description |
|---|---|
| `dev` | Development server with Turbopack |
| `build` | Production build |
| `start` | Serve production build |
| `lint` | ESLint via Next.js config |
| `type-check` | TypeScript strict check (no emit) |

---

## Performance Notes

- **Server Components by default** — only components with interactivity or animations are Client Components
- **`next/font/google`** — fonts self-hosted at build time, zero FOUT
- **`whileInView` with `once: true`** — animations trigger once, no re-paint on scroll up
- **Passive scroll listeners** — `{ passive: true }` on all scroll event handlers
- **No runtime CSS-in-JS** — all styles are Tailwind utility classes resolved at build time
- **Turbopack** — used in development for fast HMR

---

## Accessibility

- Skip-to-content link (visible on focus)
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<figure>`
- All interactive elements have descriptive `aria-label`
- `:focus-visible` ring styled with Cobalt colour
- Keyboard-navigable mobile menu with `aria-expanded`
- `lang="en"` on `<html>`
- `alt` / `aria-label` on all icon-only buttons

---

## Future Improvements (YAGNI-aligned)

The following are intentionally deferred until there is a concrete need:

- **Dark mode** — design tokens are in place; a `prefers-color-scheme` media query can be added to `globals.css` when required
- **Individual case study pages** — App Router supports nested routes; add `app/work/[slug]/page.tsx` when case studies are ready
- **CMS integration** — `lib/data.ts` is the single source of truth; swap static arrays for a fetcher function when content needs to be managed externally
- **OG image** — add `app/opengraph-image.tsx` with `ImageResponse` when brand assets are available
# ux-portfolio
