# Plan 019: SPIKE — Real /catalogue index from the structured product data

> **Executor instructions**: This is a scoped SPIKE with a shippable v1.
> Follow steps; on any STOP condition, stop and report. Update
> `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/App.jsx src/data/productImageStatus.js src/pages/status-concept-products.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P3 (direction)
- **Effort**: M (v1 index page; PDF pipeline explicitly deferred)
- **Risk**: LOW-MED
- **Depends on**: 007 (data-no-translate convention), 015 recommended (thumbnails)
- **Category**: direction
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

The footer links to `/catalogue`, which promises "Browse and download our full product catalogue. Coming soon." High-consideration buyers (and their architects) want a browsable/shareable overview; the product data is already structured (`id, name, collection, category, images, desc`, kitchen/glatz specs), which makes a flat, crawlable catalogue index disproportionately cheap. Unlike the query-param product grids, a single static-route index is also a clean SEO surface.

## Current state

- `src/App.jsx:41` — `/catalogue` renders the shared `Placeholder`.
- Data: `src/data/catalogProducts.js` (largest set), `glatzProducts.js`, `kitchenProducts.js`; item shape includes `id`, `name`, `collection`/`collectionName`, `category`, `categoryLabel`, `img`, `images[]`, `desc`. `src/data/productImageStatus.js` exports `noImageProducts` (a set/list of product ids with no real image — 184 items).
- Product route helper pattern: `product.route || `/product/${product.id}`` (see `productRoute` in `status-concept-products.jsx:170`).
- Card conventions: `rd-product-card`, `NoImagePlaceholder` (in products.jsx — NOT exported; the catalogue page needs its own copy or an extracted shared component), stretched-link pattern `rd-card-link` inside `h3`, `data-no-translate` on raw names (plan 007).
- PT: new UI strings need dict keys.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Build | `npm run build` | exit 0 |
| Tests | `npm test` | pass |
| Lint | `npm run lint` | exit 0 |

## Scope

**In scope**:
- `src/pages/status-concept-catalogue.jsx` (create — v1 index)
- `src/App.jsx` (swap placeholder route)
- Extract `NoImagePlaceholder` to `src/components/NoImagePlaceholder.jsx` and reuse from both products.jsx and the new page
- `src/components/TranslationLayer.jsx` (PT keys)
- A short decision note at the top of the new file re: PDF (see Step 4)

**Out of scope**:
- PDF generation (deferred — decision recorded, not built).
- Email-gating the catalogue (open question for operator; v1 is open).
- Search; filters beyond the category anchors described below.

## Git workflow

- Branch `loop`; one commit: `Ship a real /catalogue index over the structured product data`.

## Steps

### Step 1: Extract NoImagePlaceholder

Move the `NoImagePlaceholder` component from `src/pages/status-concept-products.jsx` into `src/components/NoImagePlaceholder.jsx` (same markup/classes: `rd-no-image`, `rd-no-image-mark`, `rd-no-image-label`, `list` variant prop). Import it back into products.jsx — zero visual change.

**Verify**: `npm run build` → 0; products grid unchanged (spot check a Glatz category which uses the placeholder).

### Step 2: The catalogue page

`src/pages/status-concept-catalogue.jsx`: merge the three data arrays into category-grouped sections (Lounge / Dining / Sun Loungers / Shade / Outdoor Kitchens — reuse the `categoryLabel` values present in data). Page structure: `rd-page-head` (title `Catalogue`, lede one sentence), a sticky-ish anchor row linking to each category section (`<a href="#cat-lounge">` in-page anchors are fine under HashRouter ONLY via `onClick` scroll — anchors with bare `#id` hrefs FIGHT HashRouter; use `onClick={() => document.getElementById(id)?.scrollIntoView()}` buttons instead), then per category a compact grid of ALL items: image (or `NoImagePlaceholder`) + name link (`LocalizedLink className="rd-card-link" data-no-translate`) via the `product.route || /product/${id}` convention + collection line. Use `loading="lazy"` and, if plan 015 landed, `productSrcSet`.

Performance guard: this page renders 200+ cards; keep each card minimal (no FavoriteButton, no desc) and lazy images.

**Verify**: `npm run build` → 0; page renders all sections; every card links to a working detail page (spot check 3 across the three datasets).

### Step 3: Route + PT

Swap the `/catalogue` Placeholder in App.jsx for the lazy page. Add PT keys for new strings (`Catalogue` exists; add the lede + section anchors if new).

**Verify**: `/#/pt/catalogue` renders in PT; footer "Catálogo" link lands on it.

### Step 4: Record the PDF decision

Top-of-file comment: `// v1: on-site index only. PDF export deferred — open questions: gate behind email capture (ties to newsletter/subscribers)? per-collection PDFs? print CSS may be the cheapest path (@media print on this page).` Also add a `@media print` block? NO — defer entirely; the comment is the deliverable.

**Verify**: comment present.

## Test plan

If 001 landed: App.test.jsx route assertion for `/en/catalogue` (heading appears). Manual: 3 random card links resolve; no-image products show the placeholder, not broken imgs.

## Done criteria

- [ ] `/catalogue` is a real, crawlable index of all products with working links
- [ ] NoImagePlaceholder shared component; products.jsx unchanged visually
- [ ] PT parity for new strings
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- Rendering all items makes the page unusably slow in dev (> ~2s to interactive on a normal machine) — STOP and report; the fallback design (per-category lazy sections) is a design change the operator should see.
- Data shapes differ across the three arrays in a way that breaks the merged card (missing `category`) — report the mismatched items instead of special-casing silently.

## Maintenance notes

- If the catalogue should be gated for lead capture later, the subscribers table (plan 010) is the natural hook.
- New products appear automatically (data-driven); no maintenance beyond the image-variant generator run (plan 015).
