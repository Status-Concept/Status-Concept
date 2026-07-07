# Plan 015: Responsive image variants for product grids and thumbnails

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/pages/status-concept-products.jsx src/pages/status-concept-product-detail.jsx scripts/`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P3
- **Effort**: L
- **Risk**: LOW-MED
- **Depends on**: 001
- **Category**: perf
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

Product grid cards and detail-page thumbnails download full-resolution images: individual catalog webp files run 250–470 kB, and `public/product-images/` totals ~73 MB. Opening one category paints dozens of full-res files into ~300 px cards — multiple MB of over-fetch, worst on mobile. `sharp` is already a devDependency; a one-shot variant generator plus `srcset` wiring cuts grid payload by an order of magnitude.

## Current state

- Images live in TWO regimes:
  1. `public/product-images/**` (catalog + glatz) — referenced by STRING paths inside generated data files (`src/data/catalogProducts.js`, `glatzProducts.js`), e.g. `"img": "/product-images/glatz/alu-smart/01.webp"`. Served as-is, no Vite processing.
  2. `src/assets/images/**` — imported as modules in JSX (Vite hashes them). E.g. `src/assets/images/kitchen/carbon-line-1.webp` (679 kB).
- Render sites (grid/thumb — the over-fetchers):
  - `src/pages/status-concept-products.jsx` ~265 (grid card `<img src={product.img} … loading="lazy" decoding="async">`) and ~280 (list row).
  - `src/pages/status-concept-product-detail.jsx` ~213-219 (thumbnail rail uses full `src`), ~316 (related-products cards).
- Existing generator scripts live in `scripts/` (e.g. `generate-kitchen-heroes.mjs`, `classify-white-bg.mjs`) — Node ESM, run manually. Follow their style.
- Full-res must REMAIN for: detail-page main photo / zoom lightbox.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Generate variants | `node scripts/generate-image-variants.mjs` | summary printed, exit 0 |
| Build | `npm run build` | exit 0 |
| Tests | `npm test` | pass |

## Scope

**In scope**:
- `scripts/generate-image-variants.mjs` (create)
- Generated files under `public/product-images/**` (`*-w400.webp`, `*-w800.webp` siblings)
- `src/utils/imageVariants.js` (create — path helper)
- `src/pages/status-concept-products.jsx`, `src/pages/status-concept-product-detail.jsx` (srcset wiring at the 4 sites above)

**Out of scope**:
- `src/assets/images/**` module-imported imagery (Vite pipeline — different mechanism; defer).
- The data files (`src/data/*.js`) — do NOT regenerate or edit; variant paths are DERIVED from the original path at render time.
- Homepage/hero imagery.

## Git workflow

- Branch `loop`. TWO commits: (1) script + generated variants, (2) srcset wiring. Generated variants are many binary files — that is expected; note the count in the commit body.

## Steps

### Step 1: Variant generator

`scripts/generate-image-variants.mjs`: walk `public/product-images/**/*.webp` (skip files already ending `-w400`/`-w800`); for each, emit `<name>-w400.webp` (width 400) and `<name>-w800.webp` (width 800) via sharp, quality ~78, `withoutEnlargement: true`; skip when the variant exists and is newer than the source (idempotent, incremental). Print a summary: N sources, M generated, skipped K.

**Verify**: run it twice — second run generates 0 (all skipped). Spot-check one variant's dimensions: `node -e "import('sharp').then(async s=>console.log(await s.default('public/product-images/glatz/alu-smart/01-w400.webp').metadata()))"` → width 400.

### Step 2: Path helper

`src/utils/imageVariants.js`:

```js
// Only /product-images/ paths have generated variants; module-imported assets don't.
export function productSrcSet(src) {
  if (typeof src !== 'string' || !src.startsWith('/product-images/') || !src.endsWith('.webp')) return undefined
  const base = src.slice(0, -'.webp'.length)
  return `${base}-w400.webp 400w, ${base}-w800.webp 800w, ${src} 1600w`
}
```

**Verify**: unit test (see Test plan) passes.

### Step 3: Wire the grid/list/thumb/related sites

At the four render sites, add `srcSet={productSrcSet(product.img)}` plus an appropriate `sizes`:
- grid card: `sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 300px"`
- list row image: `sizes="220px"`
- detail thumbnail rail: `sizes="72px"`
- related cards: `sizes="(max-width: 640px) 60vw, 280px"`
`srcSet={undefined}` (non-catalog images, e.g. `sicilyCornerImg` fallbacks) must render exactly as before — the helper's undefined return guarantees that.

**Verify**: `npm run build` → 0; dev server, products grid, DevTools Network: card images now fetch `-w400`/`-w800` files (~10-40 kB each) instead of originals; a card with a module-imported image still loads.

### Step 4: Guard against missing variants

Because the generator may miss future images (new products added without running it), the full-res `src` remains the fallback in `srcSet`'s absence and the `src` attribute always stays the original — a missing variant file would 404 in srcset selection. Mitigate: the generator prints missing-variant counts, and add a line to CLAUDE.md/README (if plan 013 landed): "after adding product images, run `node scripts/generate-image-variants.mjs`".

**Verify**: delete one generated variant locally, reload grid — browser may 404 that one srcset candidate but the image still renders from another candidate/src (check the card still displays; restore the variant after).

## Test plan

`src/utils/imageVariants.test.js`: returns undefined for module URLs (`/assets/foo.webp`, imported hashed paths, undefined); correct 3-entry srcset for `/product-images/x/01.webp`.

## Done criteria

- [ ] Generator idempotent; variants exist for all current catalog webp files
- [ ] Grid/list/thumbs/related fetch -w400/-w800 files in DevTools
- [ ] Non-catalog images unaffected
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- `public/product-images` layout differs from the excerpt (paths not `/product-images/...`).
- Generated variant total adds > 200 MB to the repo — report before committing binaries (expected order: ~10-20 MB).
- sharp fails on some files (corrupt/CMYK) — skip-and-report list, don't abort the whole run.

## Maintenance notes

- New product images require a generator run — documented in README/CLAUDE.md.
- Deferred: `src/assets` imagery via `vite-imagetools`; AVIF variants; `<picture>` art direction.
