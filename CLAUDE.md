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
framer-motion, Lenis. Deployed on Cloudflare at nueve2siete.com, as an assets-only Worker built from GitHub (free plan; Vercel Hobby
forbids commercial use). `wrangler.jsonc` serves `dist/` and answers every path that is not a file with
`index.html` (`not_found_handling: single-page-application`). Node 22 comes from `.nvmrc`. The step-by-step
deploy and GoDaddy guide is `docs/despliegue.md`.

## Commands

- `npm run dev`: dev server on http://localhost:5173
- `npm run build`: `tsc -b` then `vite build`. This is the typecheck; there is no separate one.
- `npm run lint`: oxlint (config in `.oxlintrc.json`).
- `npm test`: Vitest, for pure logic only (`src/**/*.test.ts`, node environment). One file:
  `npx vitest run src/lib/order.test.ts`.
- `npm run models`: compresses every GLB in `models/` into `public/models/` (see the 3D models below).

## Architecture

- **Routes** live in `src/App.tsx`: `/` (Home), `/catalogo` and `/catalogo/:slug` (product page with the 3D
  configurator). `/personalizar*` and unknown paths redirect. The catalog and product pages are lazy-loaded
  so three.js stays out of the Home bundle; keep it that way (don't import `ProductViewer3D` or `three`
  from Home or shared components).
- **Products are data.** `src/data/products.ts` holds `PRODUCTS` and `COLORS`.
  - `COLORS` are common colour names (Rojo, Vinotinto, Azul cielo…), not an inventory: the team has many
    filaments and buys any colour it lacks. Name and hex travel in the WhatsApp order.
  - Each product has `parts`, `colorways` (a colour id for every part; the first is where the configurator
    starts), the `field` colour of its poster and stage, an `occasion` line, an optional `customTextConfig`,
    a `hidden` flag (left out of the catalog, still reachable by URL) and a `modelType`.
  - Names are set huge on the posters, so they stay at 20 characters or fewer (tested).
- **The 3D viewer** (`src/components/3d/ProductViewer3D.tsx`) is how the site shows the pieces, and the owners
  value it; keep it. `modelType` picks the model:
  - `mic-cube` and `keychain` are built from primitives in code (the mic box renders `customText` on its
    four sides).
  - `clicker` and `frame` load GLBs converted from the Bambu Lab `.3mf` files. The converted originals live in
    `models/`; `npm run models` compresses them with meshopt (decoder bundled, no outside server) into
    `public/models/`, the files the site loads. Their meshes must be named after the part ids (`base`,
    `center`); the viewer gives each its own material and sets the chosen colours.
  - Compression moves each part's rest position into its node, so the clicker's press sinks the centre from
    the height the file brings (kept in `userData.restY`), never from 0. Pressing it clicks once going down
    and, softer, once coming back up (`src/lib/press.ts`; a browser fires click after pointerup, so click never
    counts). The click is synthesized in `src/utils/sound.ts` from short bursts of filtered noise, the sound of
    plastic on plastic; the theme switch uses the same one.
  - `interactive={false}` (the catalog posters) drops the camera controls and lets touches through, so a
    finger on the piece still scrolls the page; the piece sways instead of turning, so a flat flower never
    shows its edge. `Framing` pulls the camera back on narrow stages.
  - Adding a product means: an entry in `PRODUCTS`, a `modelType` value, and its model component (plus its
    GLB in `models/` and `npm run models`).
- **Catalog** (`src/pages/CatalogPage.tsx`, `src/components/catalog/`): one loud poster per piece on its
  colour field (`fields.ts`), with the name huge, the 3D piece and a row of colour combinations that repaint
  it. A poster's canvas exists only while the poster is near the screen. "Personalízala" carries the chosen
  combination as `?colores=negro,lavanda,negro` (one colour id per part, `src/lib/colorway.ts`). The last
  poster is for anything not in the catalog. Search and filters were removed with three pieces; bring them
  back when the catalog grows.
- **Product page** (`src/pages/ProductDetailPage.tsx`): `findProduct(slug)` (with old-slug aliases) or a
  redirect to `/catalogo`. The configurator is keyed by product id, so switching models resets its state
  (part id → colour id, custom text) without effects; it starts from the `?colores` link.
  - The stage is sticky, so the piece stays in sight while colours are chosen (above them on a phone). Keep
    its sizes in whole pixels (`round()`): at a fractional size Chrome draws a hairline of the field along the
    edge of the sticky layer.
  - Three questions in large type (`src/components/product/Pickers.tsx`): "¿Qué parte?", "¿De qué color?"
    (a ribbon loop draws itself round each colour picked) and, for the mic, "¿Qué dice?". The price and
    "Pedir por WhatsApp" ride the bottom of the screen.
- **Orders and contact:** `src/lib/order.ts` builds the WhatsApp order message (`buildOrderMessage`, from
  colour ids; it promises no lead time) and formats COP; `src/lib/contact.ts` reads the phone, email and
  Instagram from `.env` and builds every wa.me link (`whatsappUrl`). Never hardcode them elsewhere.
- **Theme:** `ThemeContext` toggles a `dark` class on `<html>`. Only an explicit choice from the switch is
  saved (`localStorage` key `n2s_theme`); until then the site follows the system theme, live. An inline
  script in `index.html` applies the same choice before the first paint; keep the two in sync.
  - The switch (`ThemeSwitch.tsx`) is the clicker flower, pinned to the bottom right of every page (on a
    product page it rides above the order bar on a phone and moves to the bottom left on a wide screen). It
    clicks like the clicker, its petals turn a step, and its face sleeps in the dark theme.
  - The new theme blooms out of it: a View Transition whose new view shows through a flower-shaped mask that
    grows until it covers the screen (`.blooming` rules in `src/index.css`, sizes in `src/lib/bloom.ts`).
    `setTheme` sets the class at once so the transition catches it, and colour transitions are off meanwhile.
    Without View Transitions, or under reduced motion, the theme just changes.
- **Home** (`src/pages/Home.tsx`) has three parts, then the site footer:
  - The hero (`src/components/home/Hero.tsx`).
  - The project garland.
  - "Cómo se pide" (`HowToOrder.tsx`, `#como-pedir`).

  Keep `overflow-x-clip` (not `overflow-hidden`) on the Home wrapper: a scroll container there stops the
  garland from pinning.
- **Cómo se pide:** four steps on fields of colour, zigzagging from 768px.
  - One orange ribbon threads them, measured from the steps' centres (`threadPath` in `src/lib/thread.ts`),
    and draws itself with the scroll. It ties a loop between each pair of steps.
  - The last step gets wrapped like a present: two bands and a bow.
  - The step texts promise no lead time, shipping or payment terms (`docs/deuda.md`).
- **Footer** (`Footer.tsx`) is the close of every page: "Hablemos de tu idea", the three contacts, then the
  logo across the full width with the faint ribbon behind it, as on page 3 of the brand guide.
- **Garland** (`src/components/garland/`, section `#proyectos`): the projects as gift tags hanging from one
  long ribbon, like a party garland. It replaced a pictoric-style magazine (commits `aca7009` and `6617b77`),
  on purpose: the brand should not copy its references.
  - Data: the Supabase `projects` table, read by `useProjects` (`src/lib/useProjects.ts`, rows mapped and
    checked in `projectRows.ts`). Until Supabase answers, and whenever it cannot, the garland shows the local
    list in `src/data/projects.ts` (made-up placeholders for now, `docs/deuda.md`). The tag count can change
    when the real list arrives; `droppedCount` speeds up so every tag hangs by the time the section pins.
  - Layout: the section is pinned (`sticky` stage) for as long as the strip is wider than the screen, and
    scrolling down carries the strip sideways.
  - The string is one SVG path (`garlandPath`). It comes down from over the hero and draws itself as the
    section arrives, and the tags drop onto it one by one (`droppedCount`).
  - Each tag (`Hanger`) moves in three ways:
    - It swings behind the strip's speed (`swingFor`, on an underdamped spring).
    - It rocks when dragged sideways (`rockAngle`).
    - It turns over when tapped. A project tag's back redraws its ribbon on every turn.
  - Taps on links and buttons never rock or turn a tag. A mostly vertical drag is left to page scroll.
  - Keyboard focus inside a tag scrolls it to the middle (`scrollToCenter`). Turning a tag from its button
    moves focus to the button on the other face.
  - Faces are sized in `cqi`. Their eyelet is a hole cut with a CSS mask.
  - Under reduced motion it is a plain horizontal scroller and nothing swings or drops.
  - The math lives in `src/lib/garland.ts` and is tested.
- **Ribbon** (`src/components/Ribbon.tsx`) is the brand motif: one thick round-capped line that draws
  itself on load and can wind back and turn with a scroll-progress `MotionValue`. Write each path starting
  at the screen edge it comes from, so winding back retracts it into that edge. In the hero, a faint
  ribbon (`text-ribbon`) loops behind the motto, and the corner ribbons write the 9 (orange) and the 2
  (lavender) of the name. Below the first screen, pass `play` so a ribbon draws itself when it is seen.
- **Navigation** (`Navbar.tsx`) is a plain bar in the page flow, not fixed, so pages need no top padding
  for it (the hero subtracts its height). The links sit on the left (a "Menú" button below 1024px), the
  wordmark large in the middle (`public/wordmark.svg`, cropped to its letters) and the bow and WhatsApp on the
  right; the two sides share the leftover width, so the wordmark stays centred.
  - The bow (`RibbonBurst.tsx`) lets loose six ribbons in the brand colours: each comes in from past a screen
    edge, ties one loop and winds back out (`src/lib/ribbonBurst.ts`, tested). It is left out under reduced
    motion.
  - Links to `/#proyectos` and `/#como-pedir` are scrolled to by `ScrollToTop` one frame after the page
  renders: the garland sets its height in its first frame, and Lenis must re-measure a page that grew
  (`lenis.resize()` in `scrollToElement`). The garland's projects can arrive later from Supabase and change its
  length, so `ScrollToTop` follows the section for 3 seconds, until the visitor scrolls.
- **Search and sharing:** each page sets its title, description and canonical address with `usePageMeta`
  (`src/lib/meta.ts` holds the provisional copy; hidden pieces get `noindex`). The share preview (WhatsApp,
  social) comes from the static Open Graph tags and `public/og.jpg` in `index.html`, since those crawlers do
  not run the script. `public/sitemap.xml` lists every page; a test fails if a visible piece is missing.
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
- **Supabase** (free plan) holds the garland's `projects`, a public `projects` storage bucket for their photos,
  and the `orders` log. The schema is `supabase/migrations/*.sql`, run by hand in the SQL Editor; the owner's
  how-to is `docs/supabase.md` (Spanish).
  - `getSupabase()` (`src/lib/supabase.ts`) loads supabase-js lazily, so it stays out of the first paint; it
    resolves to null when the env vars are missing, and every caller then falls back.
  - The site holds only the publishable key, so row level security is the whole permission model: anyone may
    read published projects and insert orders (only the listed columns), nobody may read orders.
  - Each "Pedir por WhatsApp" logs a row (`src/lib/orderLog.ts`) after WhatsApp opens; its code
    (`N2S-XXXX`) is also in the message. A failed log never blocks the order.

## Environment

`.env` (gitignored; template in `.env.example`):
- Required: `VITE_WHATSAPP_PHONE` (digits; spaces and `+` are stripped), `VITE_CONTACT_EMAIL`,
  `VITE_INSTAGRAM_URL`. `vite.config.ts` fails the build (and dev server and tests) when one is missing, and
  Cloudflare needs the same variables as **build** variables (Settings → Build), since Vite inlines them.
- Optional: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (the publishable or anon key, never the secret one).
  Without them the garland shows the local projects and orders are not logged.
- Code reads the contact only through `src/lib/contact.ts`. Its tests stub the env with `vi.stubEnv`, so
  they never depend on the real values.

## Brand

- Logo: `public/logo.svg` (with the margin of the brand guide; the footer uses it), `public/wordmark.svg` (the
  same letters cropped tight, for the top bar) and the compact logo for the browser tab, the "2" in cream on
  an orange tile with the mustard dot of the "i" (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`).
  Hand-drawn letters with loops (the "n", "v" and "t"); the brand reads as art,
  maximalism and color. **Rounded everything, no straight edges or sharp corners.**
- Brand guide: `logo nueve2siete (1).pdf` (repo root). Page 3 is the main version: cream ground `#F0EEE8`,
  orange `#DE5B2B` ("nueve"), lavender `#9FAFE9` ("2"), mustard `#EFBB29` ("siete"). Behind the wordmark
  runs a faint ribbon: one thick round-capped stroke, a shade darker than the ground, that enters left,
  loops once above the letters and curls out right. Page 5 extends the palette with green `#336F52`, pink
  `#E890B3`, light orange `#E87440` and lime `#CCD65F`. These are the token values in `src/index.css`.
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
- Code, database tables, columns and the enum values stored in them are in English (map stored values to
  Spanish labels in code). Customer-facing text is Spanish (Colombia), and so are the public URLs.
- No semicolons, single quotes, 2-space indent.
- Commit or push only when asked. The main branch is `master`.

## History

The repo was restarted from scratch at commit `ed20325`. Earlier commits hold a larger pnpm monorepo
(Next.js site, Payload CMS admin, a Python logo-vectorizing engine, a keychain text-to-shape library). Look
there with `git show <commit>:<path>` before rebuilding something it already solved.
