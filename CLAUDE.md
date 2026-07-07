# CLAUDE.md

Commands: `npm run dev` | `build` | `lint` | `test` | `check` (lint+test) | `preview`
Always run `npm run lint` and `npm test` before declaring work done.

## Architecture

Vite 8 + React 19 SPA, `HashRouter` (URLs are `/#/en/...`). Routes render three
times in `src/App.jsx` via `routesFor('')` / `('/en')` / `('/pt')`. Every page
is `React.lazy` except the homepage; the Supabase SDK is dynamic-imported too,
so the entry chunk stays small.

## Rules

- **Internal links:** use `src/components/LocalizedLink.jsx`. Imperative
  navigation: `useLocalizedNavigate`. Never a raw `<a href="/...">` for an
  internal route (it full-reloads under HashRouter). There is no text-matching
  nav interceptor anymore — links carry their own destination.
- **i18n:** `src/components/TranslationLayer.jsx` translates by **exact trimmed
  string match** against the `pt` dictionary. Consequences:
  - every new user-visible EN string needs a `pt` key, or it renders in EN;
  - if you change copy in JSX, update the matching dict key;
  - wrap **raw catalog data** (product names, SKUs, dimensions, collection
    labels) in `data-no-translate` so a product literally named "New"/"All"
    isn't force-translated.
- **Supabase:** use the async accessor `getSupabase()` from `src/lib/supabase.js`
  (never re-add a top-level `createClient`). `isSupabaseConfigured` is the sync
  flag for initial UI state.
- **Product data** (`src/data/catalogProducts.js`, `glatzProducts.js`,
  `kitchenProducts.js`) is **generated** by `scripts/` — never hand-edit;
  regenerate.
- **Images:** catalogue images under `public/product-images/**` have generated
  `-w400`/`-w800` variants; grid/thumbnail `<img>` use `productSrcSet()` from
  `src/utils/imageVariants.js`. After adding product images, run
  `node scripts/generate-image-variants.mjs`.
- **Contact data** (phones, email, addresses, hours) lives in
  `src/data/showrooms.js` — also mirrored in `index.html` JSON-LD; update both.
- **Database:** `supabase-schema.sql` is the source of truth for DDL/policies —
  any new table/policy goes there first.
- **Env:** never commit `.env`. The anon key is publishable-class but still
  never paste values into code/docs.
- `PageNav` is a dev-only QA overlay, gated by `import.meta.env.DEV` in App.jsx.
