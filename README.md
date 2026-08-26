# Awanish Verma — UI/UX Designer & Product Architect

An editorial single-page portfolio built as a **working demonstration of the
thing it advertises**: a design-token architecture. Visitors don't just read
that the author builds design systems — they retune this one live (accent,
radius, type scale, density), watch the whole page respond, and copy the result
out as CSS custom properties or a Tailwind v4 `@theme` block.

Built with Next.js 15 (App Router), React 19, Tailwind CSS 4, Motion, and Lenis.

---

## Table of contents

1. [What the site is](#1-what-the-site-is)
2. [Quick start](#2-quick-start)
3. [Architecture at a glance](#3-architecture-at-a-glance)
4. [The design-token engine](#4-the-design-token-engine-the-core-idea)
5. [Theming, hydration, and the flash-of-wrong-theme problem](#5-theming-hydration-and-the-flash-of-wrong-theme-problem)
6. [Accessibility engineering](#6-accessibility-engineering)
7. [Scrolling: Lenis as the single owner](#7-scrolling-lenis-as-the-single-owner)
8. [Modals: stacked layers, one hook](#8-modals-stacked-layers-one-hook)
9. [The printable CV](#9-the-printable-cv)
10. [SEO and structured data](#10-seo-and-structured-data)
11. [Content model](#11-content-model)
12. [Section-by-section walkthrough](#12-section-by-section-walkthrough)
13. [Configuration reference](#13-configuration-reference)
14. [Extending the site](#14-extending-the-site)

---

## 1. What the site is

A single route (`/`) composed of six numbered sections that share one editorial
"spine" — an index rule (`01`, `02`, …), a hairline, and a status label:

| # | Section | `id` | What it does |
|---|---------|------|--------------|
| 01 | Hero | `hero` | Headline, stats, **and the interactive token sandbox** |
| 02 | Selected work | `projects` | Filterable case-study list + hover cover preview + detail modal |
| 03 | Career | `experience` | Multi-open accordion of roles |
| 04 | Craft | `skills` | Searchable, filterable skill matrix |
| 05 | Endorsements | `testimonials` | Pull quotes with typographic monograms |
| 06 | Contact | `contact` | Engagement types, availability, social links |

Plus three cross-cutting pieces: a fixed three-island header dock, a scroll
progress bar, and a print-ready CV modal.

**Nothing is fetched.** All content lives in `data/portfolioData.ts` as a typed
constant. That is deliberate — it makes the whole site statically renderable, it
makes the JSON-LD in `lib/site.ts` derivable from the same source the UI reads,
and it means there is exactly one place to edit content.

---

## 2. Quick start

**Prerequisites:** Node.js 20+

```bash
npm install
cp .env.example .env.local   # optional — the site renders with none of these set
npm run dev
```

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (`output: 'standalone'`) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run clean` | Clear the `.next` cache |

---

## 3. Architecture at a glance

```
app/
  layout.tsx            Metadata, JSON-LD, fonts, pre-paint theme script, ThemeProvider
  page.tsx              Composes the six sections; owns the CV modal's open state
  globals.css           Token declarations, dynamic-radius utilities, focus rings, print rules
  fonts/                Self-hosted Google Sans (latin), plus NOTICE.md on provenance
  icon.tsx              Generated favicon (next/og)
  apple-icon.tsx        Generated iOS touch icon
  opengraph-image.tsx   Generated 1200×630 share card
  twitter-image.tsx     Re-export of the OG card under X's slot
  manifest.ts           /manifest.webmanifest
  robots.ts             /robots.txt
  sitemap.ts            /sitemap.xml

components/             One file per section, plus Header/Footer/modals/scroll utilities
context/ThemeContext.tsx   Theme mode + design tokens + derived accessible colours
hooks/use-modal-behavior.ts  Focus trap, Escape, scroll lock, layer stacking
lib/color.ts            WCAG luminance/contrast maths and accent correction
lib/scroll.ts           Lenis registry + header-aware anchor scrolling
lib/site.ts             Canonical URL, titles, and the schema.org @graph builder
data/portfolioData.ts   All content, fully typed
```

### Why the page is a client component

`app/page.tsx` is `'use client'` because every section subscribes to the theme
context, and the token sandbox mutates it on every keystroke and drag. The
server-rendered value would be stale the moment a visitor touches a control.

What *stays* on the server matters more: `app/layout.tsx` is a server component,
so the metadata, the `<head>` JSON-LD, `robots.txt`, `sitemap.xml`, the manifest
and all four generated images are produced without shipping a byte of JS for
them. Crawlers get everything they need in the first response.

### Why `MotionConfig reducedMotion="user"`

```tsx
<MotionConfig reducedMotion="user">
```

One wrapper in `page.tsx` makes *every* Motion animation on the page honour
`prefers-reduced-motion` — rather than each component remembering to check. The
CSS side is handled in parallel by a global `@media (prefers-reduced-motion:
reduce)` block in `globals.css` that flattens transitions and animations to
0.01ms, and `SmoothScroll` tears Lenis down entirely. Three layers, one
preference, no gaps.

---

## 4. The design-token engine (the core idea)

Five tokens are live at all times:

| Token | Values | CSS variable |
|---|---|---|
| Accent colour | any hex | `--accent`, plus three derived (below) |
| Corner radius | `0 / 4 / 8 / 12 / 20px` | `--radius-custom` |
| Base type scale | `14–18px` | `--base-font-size` |
| Spacing density | compact / comfortable / spacious | `--space-multiplier` |
| Theme | dark / light / system | `.dark` / `.light` class on `<html>` |

### How a token reaches the pixels

`ThemeContext` writes them straight onto the document element:

```ts
root.style.setProperty('--accent', tokens.accentColor);
root.style.setProperty('--accent-text', accentText);      // contrast-corrected
root.style.setProperty('--accent-solid', accentSolid);    // …see §4 below
root.style.setProperty('--accent-contrast', onAccent);
root.style.setProperty('--radius-custom', tokens.radiusToken);
root.style.setProperty('--base-font-size', `${tokens.baseFontSize}px`);
root.style.setProperty('--space-multiplier', DENSITY_MULTIPLIER[tokens.spacingDensity]);
```

Setting inline custom properties on `:root` — rather than re-rendering styled
components — means a token change costs one style recalculation, not a React
tree walk. Every consumer reads `var(--…)`, including the corrected accent
values, so a slider drag stays smooth and most sections don't subscribe to the
theme context at all.

Then each token is wired to real layout:

**Radius** overrides Tailwind's rounding utilities globally, scaled off one base:

```css
.rounded-3xl { border-radius: calc(var(--radius-custom) * 2.5) !important; }
.rounded-2xl { border-radius: calc(var(--radius-custom) * 2)   !important; }
.rounded-xl  { border-radius: calc(var(--radius-custom) * 1.5) !important; }
/* … down to .rounded-xs */
```

This is the one place `!important` is load-bearing: the rules must beat the
Tailwind utilities already on every card and button. Keeping the whole ramp
proportional to a single value is what makes the site feel *designed* at 0px and
at 20px, instead of merely different.

**Type scale** sets `html { font-size: var(--base-font-size) }`, so every `rem`
in the design — which is nearly every dimension Tailwind emits — rescales
together.

**Density** was the subtle one. It began as a bare `section { padding-block: … }`
rule, which every section's own `py-20` utility silently beat, so the control did
nothing. The fix was to make sections opt in explicitly and drop their padding
utility:

```css
.section-rhythm {
  padding-top:    calc(5rem * var(--space-multiplier, 1));
  padding-bottom: calc(5rem * var(--space-multiplier, 1));
}
```

### The accent colour is corrected, not trusted

A visitor can type `#f5f500` into the hex field. `lib/color.ts` exists so the
interface never degrades below WCAG 2.1 AA when they do. It implements the real
spec maths — sRGB linearisation, relative luminance, the `(L1+0.05)/(L2+0.05)`
contrast ratio — and exposes two corrections:

**`ensureContrast(color, background, target)`** — converts to HSL, holds hue and
saturation, and walks lightness *away* from the background one step at a time
until the ratio clears the target. Amber text on a white page darkens into a
readable ochre; the hue the visitor chose survives.

**`accentFill(accent)`** — produces a `{ background, foreground }` pair for solid
buttons, in a deliberate order of preference:

1. White on the raw accent already passes → use it, untouched.
2. It's *close* (≥ 3:1) → darken the fill just enough for white to pass. This
   handles the indigo dead zone where neither white nor black quite reaches
   4.5:1, and it keeps the button looking like the colour that was picked.
3. Otherwise near-black passes → use that.
4. Otherwise → correct the fill for near-black.

The context publishes the three derived values as CSS custom properties on
`<html>`, so components never do this maths themselves:

- `--accent-text` — the accent, safe as **text on the page background**
- `--accent-solid` — the accent, safe as a **fill**
- `--accent-contrast` — the foreground that sits **on top of** `--accent-solid`

The pattern throughout the components is `style={{ color: 'var(--accent-text)' }}`
for type and `style={{ backgroundColor: 'var(--accent-solid)', color:
'var(--accent-contrast)' }}` for solid controls. Note that `--accent` (raw) is
still used for decorative work — glows, the progress bar, the radial wash behind
the hero — where contrast is not a legibility concern.

They are read as variables rather than as the `accentText` / `accentSolid` /
`onAccent` values the context also returns, and that is the whole point: an
inline style computed in JS can only exist once React has run, so a visitor with
a customised accent would load the *default* blue and watch it snap. Going
through variables lets the pre-paint script (below) set them first, and it drops
most sections' subscription to the theme context entirely. The JS values remain
on the context for `exportTokensAsCSS()`, which has no stylesheet to read from.

Pairing matters: `--accent-contrast` is only guaranteed against `--accent-solid`,
never against raw `--accent`. `.skip-link` and `::selection` fill with
`--accent-solid` for exactly that reason — amber's correct foreground is
near-black, and white on raw amber is ~2.1:1.

There's a nice detail in the sandbox's preview switch: the thumb is filled with
`--accent-contrast` rather than hardcoded white, precisely *because* the visitor
can break that one contrast pair from the swatch row above it.

### Export

`exportTokensAsCSS()` and `exportTokensAsTailwind()` serialise the current state
into something you can paste into a real project. The Tailwind export targets v4's
`@theme` block, matching how this repo itself declares its font stack. This closes
the loop: play → tune → take it with you.

### Input handling: the hex field keeps a draft

```ts
const [hexDraft, setHexDraft] = useState<string | null>(null);
const hexValue = hexDraft ?? tokens.accentColor;
```

Typing `#6366f1` passes through `#6`, `#63`, `#636`… If each keystroke wrote to
the live token, `#636` would parse as a valid 3-digit hex and the accent would
lurch mid-word. So the field owns a local draft, commits only on a `normalizeHex`
success, and marks itself invalid (with `aria-invalid` and a `role="alert"`
message) in between.

`null` is the load-bearing part of that type: it means *no draft in flight,
mirror the token*, so the field follows an external change — a preset click, the
colour picker, a reset — with no synchronisation step at all. Blur clears the
draft back to `null`, which doubles as the revert for a half-typed value. An
earlier version kept a second `dirty` boolean and an effect to copy the token
into the draft whenever it was false; that pairing had a bug (typing once left
the flag set, so a later preset click changed the accent while the field went on
showing the typed value) and, because the effect wrote state React had just
rendered, it also tripped `react-hooks/set-state-in-effect`. Deriving the
displayed value removed the flag, the effect and the bug together.

---

## 5. Theming, hydration, and the flash-of-wrong-theme problem

Persisted theme state and server rendering are fundamentally in tension: the
server cannot read `localStorage`, so it must guess, and any guess it gets wrong
produces a visible flash.

**The wrong fix** is reading storage in the `useState` initialiser — the client's
first render then differs from the server's HTML and React throws a hydration
mismatch.

**The fix used here** is a two-part split:

**Part 1 — an inline script in `<head>`, before first paint** (`app/layout.tsx`).
It runs synchronously ahead of any rendering, reads the storage keys, and applies
everything expressible as a CSS variable: the theme class, `colorScheme`, the
accent group, `--radius-custom`, `--base-font-size`, `--space-multiplier`.
Crucially it **re-validates** as it goes — every hex is regex-checked, the radius
is checked against the allowed list, density against a lookup, and the font size
is clamped to the same 14–18 range `sanitizeTokens` enforces — because
`localStorage` is attacker- and typo-writable and the script sets styles
directly. The whole body is wrapped in `try/catch`: in private mode where storage
throws, the page must still render.

The accent is applied as a **group or not at all**: `--accent` together with the
corrected `--accent-text`, `--accent-solid` and `--accent-contrast` that come
from the derived cache described under [Storage keys](#storage-keys). Setting a
customised `--accent` while the corrected values stayed at their blue-derived
defaults is not a cosmetic mismatch — it painted the skip link, the first thing a
keyboard user reaches, white-on-amber at ~2.1:1 for the whole pre-hydration
window. If the cache is missing or was derived from a different colour, the
script leaves every accent variable to the stylesheet: a default-blue first paint
is a far better failure than an unreadable one.

**Part 2 — `ThemeProvider` starts at the exact server defaults** and pulls the
stored values through `useSyncExternalStore`, which exists for precisely this
shape of problem: it hands back the *server* snapshot while hydrating and re-reads
the real one immediately afterwards. By the time that happens the pre-paint script
has already made the page *look* right, so there's nothing to see.

That hook is also what keeps the read out of an effect. Loading storage in a
`useEffect` and calling `setState` works, but it is a cascading render by
construction — the pattern `react-hooks/set-state-in-effect` is there to catch —
and it leaves a window where the provider holds defaults the page has already
painted past. State is now *derived* rather than loaded:

```ts
const theme = themeOverride ?? (isThemeMode(storedTheme) ? storedTheme : 'dark');
const tokens = tokenOverride ?? storedTokens ?? DEFAULT_TOKENS;
```

The `*Override` halves are what the visitor changes this session; `null` means
"nothing chosen yet". They double as the write gate — a visit that touches no
control never rewrites storage — and `updateToken` must stay a *functional*
update, because applying a colour preset calls it twice in one handler and a
value captured from the render closure would let the second call overwrite the
first with a stale base.

`systemPrefersDark` comes through the same hook, subscribed to the media query
rather than sampled once at mount.

The two parts, plus the `:root` block in `globals.css`, describe the same starting
point — that's what makes a first load with nothing stored flash-free.

Other decisions in the theme layer:

- **`sanitizeTokens()`** merges anything found in storage onto the defaults and
  drops bad fields — an older token shape or a hand-edited value cannot render
  the site with `undefined` colours. Font size is additionally clamped to 14–18.
- **`toggleTheme()` flips from `resolvedTheme`, not `theme`.** Toggling out of
  `system` used to always land on `dark` — so on a machine already in dark mode,
  the button appeared broken.
- **The `system` mode re-resolves when the OS flips mid-session**, rather than
  only sampling at mount — see `subscribeToColorScheme` above.
- **`suppressHydrationWarning`** on `<html>` and `<body>` is expected here: the
  pre-paint script mutates those exact nodes before React sees them.

### Fonts

**SF Pro on Apple platforms, Google Sans everywhere else.**

```ts
const googleSans = localFont({
  src: [
    { path: './fonts/GoogleSans-Variable-latin.woff2', weight: '400 700', style: 'normal' },
    { path: './fonts/GoogleSans-VariableItalic-latin.woff2', weight: '400 700', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-google-sans',
  preload: false,
});
```

`preload: false` is intentional. The `--font-sans` stack in `globals.css` puts
`-apple-system, BlinkMacSystemFont` first, so every Mac, iPad and iPhone resolves
to SF Pro and never touches the webfont. Preloading would make the majority of
visitors download a font they'll never paint. Non-Apple clients fetch it on first
use, and `display: 'swap'` keeps that from blocking text. Next generates a
metric-matched Arial fallback (`size-adjust: 101.55%`) so the swap costs no
layout shift.

Two related subtleties in that stack: the system keywords are the only way to
reach SF Pro (it isn't licensed for webfont delivery), and asking for `"SF Pro
Text"` by name would lose the automatic optical-size switch between Text and
Display. And `system-ui` sits *after* Google Sans deliberately — ahead of it,
Windows would take Segoe UI and never reach Google Sans at all.

It is `next/font/local` rather than `next/font/google` because Google Sans is not
in that loader's catalogue (only Google Sans Code is), even though the Fonts API
serves it. The two `latin` woff2 files live in `app/fonts/`; `app/fonts/NOTICE.md`
records where they came from, how to refresh them, and the one open question —
Google's metadata marks the family `isOpenSource: true`, but it is also a Google
*brand* font and is absent from the open `google/fonts` repository, so no licence
text ships beside it. Swapping `localFont` for a `fonts.googleapis.com` link is
the fallback if that matters for a given deployment; it would also pick up
subsets beyond latin.

The `html` rule carries no `font-feature-settings`. It used to request `cv02`,
`cv03`, `cv04` and `cv11` — Inter-specific character variants that mean nothing
to either font now in the stack.

---

## 6. Accessibility engineering

Accessibility here is structural rather than retrofitted.

**Focus rings** are declared with `!important` and no `border-radius`:

```css
:focus-visible {
  outline: 2px solid var(--accent-text) !important;
  outline-offset: 2px !important;
}
```

The `!important` is needed because several controls carry `focus:outline-none`
from Tailwind. The *absence* of a radius is the more interesting call: because
this rule is unlayered it outranks every Tailwind utility regardless of
specificity, so setting a radius here squared off every `rounded-full` control —
the theme toggle, nav pills, swatch dots — the instant it took focus. Left alone,
the outline follows each element's own radius.

Also note the ring colour is `--accent-text` (the contrast-corrected value), not
raw `--accent` — a focus ring nobody can see is not a focus ring.

**Other patterns used consistently:**

- A `.skip-link` that is off-screen until focused.
- `<main tabIndex={-1}>` so the skip link has a real landing target.
- Every section is `aria-labelledby` its own heading; decorative index numbers,
  rules and dots are `aria-hidden`.
- Groups of controls use `<fieldset aria-labelledby>` rather than `<legend>` —
  a `<legend>` is only valid as the fieldset's *first* child, and these headings
  sit inside a flex row next to their current value. Nesting one there is invalid
  markup that leaves the group with no accessible name at all.
- Toggle-style buttons carry `aria-pressed`; the demo switch uses
  `role="switch"` + `aria-checked`.
- Async results are announced via `aria-live="polite"` (clipboard copy, filter
  result counts).
- External links get `rel="noreferrer noopener"` and an `sr-only` "(opens in a
  new tab)".
- Stats use `<dl>/<dt>/<dd>` with the label in `sr-only` so screen readers get
  "7+ years" rather than a bare number.
- The scroll progress bar is `aria-hidden`. It previously carried
  `role="progressbar"` with no `aria-valuenow`, which announced an empty widget.
- Tabs in the case-study modal implement arrow-key roving focus.
- The experience accordion animates height with the panel **still mounted**, and
  uses `inert` to keep the collapsed content out of the tab order — so the text
  stays available to crawlers and in-page search without becoming a keyboard trap.
- `formatDetection: { telephone: false }` stops Safari linkifying stray numbers
  in the CV as phone numbers.

---

## 7. Scrolling: Lenis as the single owner

Smooth scrolling has exactly one owner, and everything else routes through it.

`SmoothScroll` instantiates Lenis, drives it from a `requestAnimationFrame`
loop, and registers the instance into `lib/scroll.ts`. It also subscribes to
`prefers-reduced-motion` and **destroys** Lenis when the preference turns on
mid-session — not merely at mount.

`globals.css` deliberately does *not* set `scroll-behavior: smooth` on `html`,
because native smooth scrolling and Lenis fight each other. The reduced-motion
block restores native behaviour for the case where Lenis is gone.

`lib/scroll.ts` is the registry and the API:

```ts
export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const offset = headerOffset();          // measured, not hardcoded
  const reduced = prefersReducedMotion();
  if (lenisInstance && !reduced) {
    lenisInstance.scrollTo(element, { offset: -offset, duration: 1.1 });
    return;
  }
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}
```

Two things worth noting. The header offset is **measured** from
`#main-header`'s live `offsetHeight` plus a 16px gap, so the dock can change
height (mobile vs desktop, scrolled vs not) without stranding a section title
underneath it. And the fallback path is complete: with Lenis absent the function
still works, just natively.

`setLenisStopped()` completes the picture — modals call it so the page doesn't
scroll away behind an open dialog.

**Active-section tracking** in `Header` follows the same "measure, don't guess"
principle:

```ts
const marker = (document.getElementById('main-header')?.offsetHeight ?? 0) + 24;
if (element && element.getBoundingClientRect().top <= marker) current = id;
```

`getBoundingClientRect()` rather than `offsetTop`, because `offsetTop` is
relative to the nearest positioned ancestor and every section here lives inside
a `relative` `<main>` — the two agree only by accident. The listener is
rAF-throttled and `passive`, it runs once on mount (a reload restores the scroll
offset *without* firing a scroll event, which used to leave the header
transparent over content), and anything within a viewport of the bottom counts
as the final section so short last sections still highlight.

---

## 8. Modals: stacked layers, one hook

`hooks/use-modal-behavior.ts` gives any dialog the full expected behaviour set:
Escape to close, focus moved in and trapped, focus restored to the trigger on
close, and the page behind it locked.

The design problem it solves is **nesting**. The case-study modal contains an
image lightbox — a dialog on a dialog. Two independent traps would fight: the
lightbox opens, and the dialog underneath yanks focus back down to something the
visitor can't even see.

The solution is two module-level pieces of shared state.

**A layer stack.** Every open dialog pushes its container ref; only the top layer
answers the keyboard:

```ts
const layerStack: RefObject<HTMLElement | null>[] = [];
// …inside the keydown handler:
if (layerStack[layerStack.length - 1] !== containerRef) return;
```

**A reference-counted scroll lock**, for the same reason — the inner layer
closing must not hand scrolling back to the page while the outer dialog is still
open:

```ts
function lockScroll() {
  if (lockCount === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    bodyStyleBeforeLock = { overflow: …, paddingRight: … };
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    setLenisStopped(true);
  }
  lockCount += 1;
}
```

The scrollbar-width compensation prevents the whole page shifting sideways when
the scrollbar disappears. The original inline styles are captured by whichever
layer locks first and restored only when the last one unlocks.

Three further details in the hook:

- **`onClose` is read through a ref, not depended on.** Callers pass inline
  arrows (`onClose={() => setSelected(null)}`), so depending on its identity tore
  the trap down and rebuilt it on *every parent render* — each teardown throwing
  focus back to the trigger behind the open dialog.
- **Focus is only restored to an element still in the document.** The trigger may
  have been unmounted by the same interaction that opened the dialog — the mobile
  drawer closing as it launches the CV is the exact case.
- **Focus that escapes the layer is pulled back**, so a click on the backdrop
  doesn't let the next Tab walk into the page behind.

Both modals also wrap their open check *inside* `AnimatePresence` rather than
outside — the other way round, the component unmounts before the exit animation
can run. And scrollable modal bodies carry `data-lenis-prevent` so inner
scrolling doesn't leak out to the page scroller.

---

## 9. The printable CV

`ResumeModal` renders an ATS-friendly CV and calls `window.print()`. It's worth
its own section because printing a modal out of a long single-page site is
genuinely awkward.

**The content decisions** target automated parsers: one shared, literal section
heading style (no icons, no invented section names, since ATS software flattens
a PDF to text and looks for conventional headings); `stripEmoji()` applied to
data that might carry decorative characters; URLs rendered scheme-less so they
read as labels on paper; and a keyword-dense skills block grouped by discipline.

**The print CSS** in `globals.css` is the fiddly part. `window.print()` prints
the whole document, and the CV lives deep in the page tree rather than directly
under `<body>`, so the page around it has to be *collapsed*, not merely hidden:

```css
body :not(:has(.print-root)):not(.print-root):not(.print-root *) {
  display: none !important;
}
body * { visibility: hidden !important; }
.print-root, .print-root * { visibility: visible !important; }
```

`visibility: hidden` preserves an element's box — and a 7,000px portfolio's worth
of invisible boxes still paginates, which is how a one-page CV printed as ten
pages, nine of them blank. So the first rule removes them from flow entirely,
using `:has()` to keep the CV's ancestor chain alive without assuming how deeply
the modal is nested. The `visibility` rules stay as belt-and-braces: in a browser
without `:has()` the first rule is dropped wholesale, and the page still blanks.

Then `.print-root` and `.print-sheet` are forced to `position: static` —
out-of-flow elements are *clipped* at a page break instead of continuing onto the
next sheet — with `max-height`, `transform` and `overflow` all neutralised so the
modal's on-screen constraints don't survive onto paper. `.print-hide` removes
chrome (backdrop, buttons, header, progress bar), and `.break-inside-avoid` keeps
entries from splitting across sheets.

---

## 10. SEO and structured data

`lib/site.ts` is the single source of truth for everything a crawler reads. The
canonical URL, metadata, `robots.txt`, `sitemap.xml`, the manifest and the JSON-LD
all derive from it, so they cannot drift apart — a canonical URL that disagrees
with the sitemap is one of the quieter ways to lose a ranking.

```ts
url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.awanishverma.com').replace(/\/+$/, '')
```

Trailing slashes are stripped so `${SITE.url}${path}` never doubles up, and the
value is per-environment: a preview deploy inheriting the production URL tells
Google two hosts serve the same page.

### One `@graph`, not several scripts

`buildJsonLd()` emits a single `@graph` containing a `Person`, a `WebSite`, a
`ProfilePage` and an `ItemList` of case studies, cross-referenced by `@id`. Stacked
separate `<script>` blocks would describe three strangers; one graph describes one
connected entity. (The `Person` block previously also lived in the footer — two
`Person` blocks on one URL is an ambiguity crawlers have to guess their way out
of, so it was consolidated.)

Details inside the graph:

- **`sameAs` is filtered through `isProfileUrl()`.** `sameAs` is how an engine
  resolves *which* Awanish Verma this is — it merges the entity with the profiles
  listed. A bare domain root (`https://github.com`) therefore asserts this person
  *is* GitHub, which is worse than saying nothing. Placeholders are dropped.
- **`alumniOf` names institutions; `hasCredential` carries the qualifications.**
  That's both schema-correct and where a résumé parser expects certifications.
- **`knowsAbout` is flattened from the live skill data**, so it can't go stale.
- The graph is rendered in the server `<head>`, so every crawler sees it in the
  first response without waiting on hydration.

### Generated images

`icon.tsx`, `apple-icon.tsx` and `opengraph-image.tsx` all use `next/og` rather
than checked-in binaries, so they track `lib/site.ts` and the live profile data.
`twitter-image.tsx` re-exports the OG card because not every X client falls back
to the Open Graph slot. Before this existed, `summary_large_image` was declared
with no image behind it — every share rendered as a grey box, and tabs showed a
blank globe.

### robots and sitemap

`robots.ts` disallows `/api/` (it would only return JSON) and advertises the
sitemap, which is the one discovery path Bing — and therefore Yahoo and
DuckDuckGo — reads without a webmaster account. `sitemap.ts` lists exactly **one**
URL: the site is a single document, and listing `#projects`-style fragments would
be worse than useless, since engines drop fragments and all entries would collapse
into duplicates of `/`.

The `robots` metadata also raises Google's preview limits — `max-image-preview:
large` and `max-snippet: -1` — because clipping a visual portfolio to a thumbnail
throws away its strongest signal.

---

## 11. Content model

`data/portfolioData.ts` exports typed interfaces (`Project`, `Experience`,
`SkillCategory`, `Education`, `Certification`, `Testimonial`) and one
`PORTFOLIO_DATA` constant. Everything else derives from it.

The consequence worth stating: **UI options are computed from the data, never
hardcoded.** Project filter categories come from
`new Set(projects.map(p => p.category))`; skill filters come from
`skillCategories`; the skills headline stats are computed
(`Math.max(...ALL_SKILLS.map(s => s.experienceYears))`). Earlier versions
hardcoded these lists and drifted — the filter bar advertised a category no
project used, so selecting it emptied the grid with no explanation, and skill
icons were keyed off category strings that had since been renamed, so no icon
ever rendered. Icons are now keyed by an explicit `iconName` field.

`avatar` on a testimonial is optional by design: with none, the section renders a
typographic monogram (`"Sham Banerji"` → `SB`) rather than attaching an unrelated
stock photo to a named person.

---

## 12. Section-by-section walkthrough

### Header — three islands, not one capsule

The `<header>` itself is `pointer-events-none`; only the three dock islands
capture clicks, so the gaps between them never block the page underneath. Because
those gaps let page text scroll through visually, a blurred scrim sits behind
them. The shared surface/border/shadow treatment is extracted into a `dock`
template string — that shared skin is the only thing making three detached
elements read as one component.

The mobile drawer closes on Escape (restoring focus to its trigger) and on any
outside `pointerdown`, with an explicit exemption for the trigger itself so its
own `onClick` isn't double-fired into a no-op.

### Hero — editorial column + sandbox card

A 12-column grid: 7 columns of editorial type, 5 for the token sandbox. Header
clearance is applied to the inner `<div>`, not as `pt-*` on the `<section>` —
`.section-rhythm` is a plain rule outside Tailwind's `@layer`, so its
`padding-top` beats any utility set on the section itself, and a `pt-32` there
would be silently dead.

### Selected work — hover preview and grouping

A cover-image card follows the cursor on hover, implemented with Motion's
`useMotionValue` + `useSpring`. Two decisions:

- **It only exists where a hovering pointer does.** A `(hover: hover) and
  (pointer: fine)` media query gates it; on touch the rows carry the story alone.
- **The first position of a new hover `jump()`s rather than springs**, otherwise
  the card comes flying in from wherever it was last dismissed. Both the source
  motion values *and* the springs are jumped — springing only the source would
  still animate.

The preview also flips to the other side of the cursor near a viewport edge
rather than being clipped.

Featured projects lead the list with everything else in a quieter tier below —
but **only in the unfiltered view**. Inside a single category the split would
strand a group (Interactive Prototypes has no featured entry, which would render
an empty lead tier).

### Case-study modal

A tabbed dialog (Overview / Architecture / Features / Gallery) with arrow-key tab
navigation and a nested image lightbox. Tab state resets per project — a tab left
on "Gallery" used to persist into the next case study opened.

That reset happens **during render**, comparing `project` against a `lastProject`
state value, rather than from an effect. React documents this for adjusting state
when a prop changes, and it means the incoming case study's first paint already
shows Overview instead of flashing the previous tab. `lastProject` tracks `null`
as well, so closing and reopening the *same* case study still resets — and the
lightbox index is cleared on every transition, including the close, because a
stale index would leave `useModalBehavior` believing the lightbox is still open
and its ref-counted scroll lock would never unwind.

### Career — multi-open accordion

The current role opens on load, falling back to the first entry so the section
never renders fully closed if nothing is flagged `current`. **Several roles can
sit open at once**, because a reader comparing two jobs shouldn't have one snap
shut to open the other. Panels animate height while staying mounted, marked
`inert` when closed.

### Craft — searchable skills

Search matches skill names and highlight text; category filters compose with the
search. The counts beside each filter **reflect the active query**, so a filter
never promises results the search has already ruled out.

### Contact & Footer

Contact splits the offer into three named engagement types — they were previously
a single paragraph, easy to skim past. The footer mirrors the header nav as a
second page index, and deliberately omits the email since the contact section sits
directly above it. Its copyright year carries `suppressHydrationWarning`: the
server renders it in its timezone and the browser in the visitor's, which around
New Year is a genuine hydration mismatch rather than a cosmetic one.

---

## 13. Configuration reference

### Environment variables (all optional)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, no trailing slash. Drives the canonical link, sitemap, robots.txt, manifest and JSON-LD. **Set this per environment.** |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console token |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools token — also covers Yahoo and DuckDuckGo |

Both verification tags are emitted only when set.

### `next.config.ts`

| Option | Why |
|---|---|
| `outputFileTracingRoot: import.meta.dirname` | An unrelated `package.json` in the home directory makes Next's workspace inference walk up and pick `~`, tracing the wrong tree into the standalone output. Pinning it fixes the bundle. |
| `output: 'standalone'` | Self-contained deployable server output |
| `reactStrictMode: true` | Double-invokes effects in dev — which is what surfaces the effect-cleanup bugs the modal hook and Lenis lifecycle were written to avoid |
| `typescript.ignoreBuildErrors: false` | Type errors fail the build. This is the real safety net. |
| `eslint.ignoreDuringBuilds: true` | Lint runs as its own step (`npm run lint`) rather than gating deploys |
| `images.remotePatterns` | Allowlists `picsum.photos` and `images.unsplash.com` for placeholder imagery |
| `transpilePackages: ['motion']` | Motion ships modern ESM that needs transpiling for the build target |

### Storage keys

`av_portfolio_theme` (a mode string) and `av_portfolio_tokens` (JSON). Both are
read by the pre-paint script *and* by `ThemeContext`, and both are re-validated
on every read.

`av_portfolio_accent_cache` (JSON) is a third, derived key: `ThemeContext` writes
the contrast-corrected accent trio there for the *next* load's pre-paint script,
which has no way to run `lib/color.ts` itself and must not carry a second copy of
that maths. Each entry is stamped with the accent it came from, and the script
applies the whole accent group or none of it — a stale or missing cache paints
the stylesheet defaults, which are consistent, rather than a mismatched pair. It
is a cache, so deleting it costs one default-blue paint and nothing else.

---

## 14. Extending the site

**Add a project / role / skill / testimonial** → edit `data/portfolioData.ts`.
Filter lists, counts, headline stats and the JSON-LD graph all update themselves.

**Add a section** → create the component, give it a unique `id`, apply
`.section-rhythm` (and no vertical padding utility), label it with
`aria-labelledby`, continue the index-rule numbering, mount it in `page.tsx`, and
add the `id` to `SECTION_IDS` in `Header.tsx` if it should participate in
active-section tracking.

**Add a token** → add it to `ThemeTokens`, extend `sanitizeTokens()` with its
validation, write it in the `setProperty` effect, mirror the fallback in the
pre-paint script *and* the `:root` block in `globals.css`, add a control to the
Hero sandbox, and include it in both export functions. All six places, or it
drifts.

**Add a colour that touches text** → derive it through `ensureContrast()` or
`accentFill()`. Don't reach for raw `--accent` unless the use is purely
decorative.

**Add a dialog** → use `useModalBehavior(isOpen, onClose)` and put
`AnimatePresence` outside the open check. Nesting inside another dialog already
works.
