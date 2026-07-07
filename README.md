# STATVS — Status Concept

Marketing and catalogue site for STATVS (Status Concept), a luxury
outdoor-furniture retailer with two showrooms in the Algarve. Single-page React
app backed by Supabase (auth, enquiries, favourites, profiles). No online
checkout by design — the goal is showroom visits and proposal requests.

## Quick start

```bash
npm install
cp .env.example .env          # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## Scripts

| Command | Does |
|---------|------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest suite |
| `npm run check` | lint + test |

## Architecture

- **Stack:** Vite 8, React 19, react-router-dom 7 (`HashRouter` — URLs are
  `/#/en/...`), Supabase. No TypeScript.
- **Routing & i18n:** `src/App.jsx` renders every route three times via
  `routesFor('')` / `('/en')` / `('/pt')`. Language comes from the URL prefix.
  Translation is a DOM layer (`src/components/TranslationLayer.jsx`) that swaps
  text nodes by **exact string match** against a `pt` dictionary — so every
  visible EN string needs a `pt` key, and raw catalogue data is marked
  `data-no-translate`. Internal links use `src/components/LocalizedLink.jsx`.
- **Layout of `src/`:** `pages/` (route components), `components/`, `context/`
  (auth, toast), `data/` (**generated** product data + `showrooms.js`),
  `lib/supabase.js` (lazy `getSupabase()` accessor), `utils/`, `index.css`
  (split into `src/styles/tokens|layout|base|components.css`).
- **Images:** catalogue images live in `public/product-images/**` with generated
  `-w400`/`-w800` variants (`node scripts/generate-image-variants.mjs`); grids
  use `productSrcSet()`. Full-res is kept for the lightbox.

## Database

`supabase-schema.sql` is the source of truth for tables, RLS and policies —
apply it in the Supabase SQL editor (or via the Supabase CLI/MCP). Tables:
`products`, `profiles`, `favorites`, `enquiries` (insert-only from the public
site), `subscribers` (newsletter, insert-only). Contact-info is also mirrored in
`index.html`'s JSON-LD.

## Deployment

`npm run build` emits a static `dist/`. Because the app uses `HashRouter`, it
works on any static host with no server-side routing config.

## Working in this repo

See `CLAUDE.md` for the conventions agents/contributors must follow (links,
i18n contract, Supabase accessor, generated data, image variants). Planning and
research artefacts live in `docs/archive/` and are historical, not
authoritative; active improvement plans are in `plans/`.
