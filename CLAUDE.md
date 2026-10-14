# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Public site for **nueve2siete**, a new venture in Colombia (started October 2026) that makes custom pieces:
party favors and keepsakes ("recordatorios"), corporate merchandising, and one-off themed pieces (e.g. animals
for a jungle-themed party). The current catalog is a branded handheld adapter for wireless mics, a flower
clicker fidget and a daisy photo holder, plus a hidden name keychain; it will grow, and the pitch is "we make
anything". There is no checkout: every order ends as a prefilled WhatsApp message. Prices are in COP.

**Positioning:** the pieces are 3D-printed (Bambu Lab A1 with AMS Lite, up to 4 colors per piece), but
customer-facing copy must not say "3D" or "impresión 3D": that market is saturated and the brand competes on
design, color and the occasion. Don't present it as a "studio" either.

Single-page app: Vite 8, React 19, TypeScript 6, Tailwind CSS v4, React Router 7, React Three Fiber 9 + drei,
framer-motion, Lenis. Deployed on Vercel (`vercel.json` rewrites every path to `index.html`).

## Commands

- `npm run dev`: dev server on http://localhost:5173
- `npm run build`: `tsc -b` then `vite build`. This is the typecheck; there is no separate one.
- `npm run lint`: oxlint (config in `.oxlintrc.json`).
- `npm test`: Vitest, for pure logic only (`src/**/*.test.ts`, node environment). One file:
  `npx vitest run src/lib/order.test.ts`.

## Architecture

- **Routes** live in `src/App.tsx`: `/` (Home), `/catalogo` and `/catalogo/:slug` (product page with the 3D
  configurator). `/personalizar*` and unknown paths redirect. The catalog and product pages are lazy-loaded
  so three.js stays out of the Home bundle; keep it that way (don't import `ProductViewer3D` or `three`
  from Home or shared components).
- **Products are data.** `src/data/products.ts` holds `PRODUCTS` and `FILAMENT_COLORS`. Each product has
  `parts` (each with a default color id), an optional `customTextConfig`, a `hidden` flag (excluded from
  the catalog and the "other models" bar, still reachable by URL), and a `modelType`.
- **`modelType` picks a component** in `src/components/3d/ProductViewer3D.tsx`:
  - `mic-cube` and `keychain` are built from primitives in code (the mic box renders `customText` on its
    four sides).
  - `clicker` and `frame` load GLB files from `public/models/`. Their meshes must be named after the part
    ids (`base`, `center`); the component replaces those meshes' materials with the selected colors.
    Pressing the clicker plays a synthesized switch sound (`src/utils/sound.ts`) once per press; the
    press logic is `src/lib/press.ts` (a browser fires click after pointerup, so click must not play again).
  - Adding a product means: an entry in `PRODUCTS`, a `modelType` value, and its model component.
- **Product page** (`src/pages/ProductDetailPage.tsx`): `findProduct(slug)` (with old-slug aliases) or a
  redirect to `/catalogo`. The configurator below it is keyed by product id, so switching models resets its
  state (part id → hex color, custom text) without effects.
- **Orders and contact:** `src/lib/order.ts` builds the WhatsApp order message (`buildOrderMessage`) and
  formats COP; `src/lib/contact.ts` reads the phone, email and Instagram from `.env` and builds every wa.me
  link (`whatsappUrl`). Never hardcode them elsewhere.
- **Theme:** `ThemeContext` toggles a `dark` class on `<html>`. Only an explicit choice from the toggle is
  saved (`localStorage` key `n2s_theme`); until then the site follows the system theme, live. An inline
  script in `index.html` applies the same choice before the first paint; keep the two in sync.
- **Home** (`src/pages/Home.tsx`) is being rebuilt section by section (see the roadmap). The first screen
  is `src/components/home/Hero.tsx`, then the magazine; the sections below it are still Gemini's until phase 4.
- **Magazine** (`src/components/magazine/`, section `#proyectos`): the project portfolio as a book whose
  rigid leaves turn on the spine.
  - Data: `src/data/projects.ts`, made-up placeholders for now (`docs/deuda.md`).
  - `FlipBook` is generic. It takes `pages` in reading order and has two layouts:
    - Spread (from 768px): the first page is the left page of the first spread.
    - Single (phones): one page per leaf, with the last page lying under them all.
  - Each leaf's angle is a framer-motion value: 0 lies on the right, -180 on the left.
  - The geometry is pure and tested in `src/lib/book.ts`:
    - `dragAngle`: the grabbed point follows the pointer.
    - `settleAngle`: past halfway or a flick completes the turn.
    - `leafLayer`: z-order.
    - `visibleFaces`: covered pages are not painted.
  - Faces that are not on the open spread are `inert`.
  - Page content (`pages.tsx`) is sized in `cqi` units, so a page scales like print.
  - Ribbons that cross the spine are drawn once at spread size; each page shows its half.
- **Ribbon** (`src/components/Ribbon.tsx`) is the brand motif: one thick round-capped line that draws
  itself on load and can wind back and turn with a scroll-progress `MotionValue`. Write each path starting
  at the screen edge it comes from, so winding back retracts it into that edge. In the hero, a faint
  ribbon (`text-ribbon`) loops behind the motto, and the corner ribbons write the 9 (orange) and the 2
  (lavender) of the name. Below the first screen, pass `play` so a ribbon draws itself when it is seen.
- **Navigation** (`Navbar.tsx`) is a plain bar in the page flow, not fixed, so pages need no top padding
  for it. `/#proyectos` links are scrolled to by `ScrollToTop` once the section renders.
- **Motion helpers** in `src/index.css`: `.reveal-line` (masked headline lines) and `.rise`, staggered with
  a `--i` custom property; both are off under reduced motion, as is every Ribbon animation.
- **Tokens** live in `src/index.css` (Tailwind v4 `@theme`; there is no `tailwind.config`):
  - Brand colors from the PDF as utilities: `orange`, `coral`, `lavender`, `violet`, `mustard`, `pine`,
    `pink`, `lime`; light neutrals `cream`, `paper`, `sand`, `ink`, `muted`; dark neutrals `night` (true
    black for OLED), `night-1..3`, `muted-night`.
  - Theme-aware roles that switch with `.dark` by themselves: `ground`, `surface`, `fg`, `fg-muted`,
    `accent`. Prefer these in new sections over pairs like `bg-cream dark:bg-night`.
  - Fonts: `font-display` is Cal Sans (headlines; one weight, and `font-synthesis-weight: none` stops fake
    bold), `font-sans` is Figtree Variable (everything else). Both are self-hosted via Fontsource.
- **Smooth scroll:** Lenis (`src/lib/smoothScroll.ts`, started by `SmoothScroll` in `App.tsx`), off when the
  visitor prefers reduced motion. Elements that need the wheel themselves (the 3D viewer) carry
  `data-lenis-prevent`.
- **Supabase** (`src/lib/supabase.ts`) is the planned backend (Vercel + Supabase free tiers while the
  business starts). Nothing uses it yet.

## Environment

`.env` (gitignored; template in `.env.example`):
- Required: `VITE_WHATSAPP_PHONE` (digits; spaces and `+` are stripped), `VITE_CONTACT_EMAIL`,
  `VITE_INSTAGRAM_URL`. `vite.config.ts` fails the build (and dev server and tests) when one is missing, and
  Vercel needs the same three in its project settings.
- Optional: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Code reads the contact only through `src/lib/contact.ts`. Its tests stub the env with `vi.stubEnv`, so
  they never depend on the real values.

## Brand

- Logo: `public/logo.svg`. Hand-drawn letters with loops (the "n", "v" and "t"); the brand reads as art,
  maximalism and color. **Rounded everything, no straight edges or sharp corners.**
- Brand guide: `logo nueve2siete (1).pdf` (repo root). Page 3 is the main version: cream ground `#F0EEE8`,
  orange `#DE5B2B` ("nueve"), lavender `#9FAFE9` ("2"), mustard `#EFBB29` ("siete"). Behind the wordmark
  runs a faint ribbon: one thick round-capped stroke, a shade darker than the ground, that enters left,
  loops once above the letters and curls out right. Page 5 extends the palette with green `#336F52`, pink
  `#E890B3`, light orange `#E87440` and lime `#CCD65F`. These are the token values in `src/index.css`.
- Color names in `FILAMENT_COLORS` are what the customer sees and what gets sent on WhatsApp, so they double
  as real filament names.
- `public/photos/*.jpg` are AI-generated mood images. They do **not** show the real products (wrong shapes,
  other brands' text on them). Never present them as product photos; the 3D models are the only faithful
  depiction of the products.

## Design work

- The **`design-taste-frontend`** skill is installed for this project (`.claude/skills/`, tracked by
  `skills-lock.json`), and the `frontend-design` plugin is disabled here in `.claude/settings.json`
  because the two conflict. Use the skill for any page design, redesign or polish.
- Its gate: `node .claude/skills/design-taste-frontend/scripts/lint.mjs src` and
  `node .claude/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:5173/<path>` (needs the
  dev server running; screenshots land in `.taste-skill/inspect/`).
- The brand overrides the skill where they collide: draw with `--keep palette,type`, and pass the inspector
  `--allow palette-claude,palette-cream,palette-terracotta,palette-purple` (cream + orange and the violet
  are the brand's own colors).

## Plan and open questions

- The redesign runs in phases: `docs/superpowers/plans/2026-10-14-hoja-de-ruta.md` (Spanish). Each phase gets
  its own detailed plan before work starts.
- `docs/deuda.md` lists business facts not yet confirmed (shipping, prices, lead times, payment, packaging,
  quality claims, real projects). Never publish an open item as fact; use neutral copy or leave it out. Add new
  unknowns there instead of inventing them.
- Contact: WhatsApp +57 321 3527921, nueve2siete@outlook.com, https://instagram.com/nueve2siete (set in
  `.env`).

## Conventions

- Dark mode is required: every section is designed in both themes, and the visitor toggles it.
- Customer-facing text is Spanish (Colombia), and so are the public URLs.
- No semicolons, single quotes, 2-space indent.
- Commit or push only when asked. The main branch is `master`.

## History

The repo was restarted from scratch at commit `ed20325`. Earlier commits hold a larger pnpm monorepo
(Next.js site, Payload CMS admin, a Python logo-vectorizing engine, a keychain text-to-shape library). Look
there with `git show <commit>:<path>` before rebuilding something it already solved.
