# Plan 007: Guard product data against dictionary collisions in the translation layer

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/components/TranslationLayer.jsx src/pages/status-concept-products.jsx src/pages/status-concept-product-detail.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 006 (same file; land 006 first)
- **Category**: bug
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

The translation layer matches EVERY text node's exact trimmed value against dictionaries containing very common single words (`New→Novo`, `All→Todos`, `View→Ver`, `Name→Nome`, `Featured→Destaques`, `Teak`-adjacent terms, etc.). Any catalog data that happens to equal a key — a product named "New", a collection called "All", a range chip "Teak" — gets silently force-translated on `/pt`. The fix is not rewriting i18n: it is marking the dynamic-data regions as untranslatable, which the layer already supports via `[data-no-translate]`.

## Current state

- `src/components/TranslationLayer.jsx` — `translateTextNode` skips nodes when `node.parentElement.closest('script, style, noscript, svg, textarea, [data-no-translate]')` matches. So a `data-no-translate` attribute on any ancestor protects a subtree.
- Product-name render sites (dynamic data that must NOT be dictionary-translated):
  - `src/pages/status-concept-products.jsx` — grid card: `<h3 className="ff"><LocalizedLink className="rd-card-link" …>{product.name}</LocalizedLink></h3>`; list row: same pattern; kitchen range chips render `collection.label` (values like `Black Stainless Steel`, `Carbon Line Teak`, `Teak`).
  - `src/pages/status-concept-product-detail.jsx` — `<h1>` product name, specs table values (`product.dims`, materials), related-product card names.
  - `src/pages/status-concept-favorites.jsx` — fav card `<h3>` names; `src/pages/client/ClientFavorites.jsx` — same.
  - `src/pages/status-concept-glatz.jsx` — model card `<h3>` names (`p.name`; values like `SUNWING(R) Casa`).
- Convention: category/UI labels (e.g. `categoryLabelOf(product)`, kickers) SHOULD still translate — only raw catalog identity fields (name, collection label from data, SKU, dimension strings) need protection.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Tests | `npm test` | pass |
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |

## Scope

**In scope**:
- `src/pages/status-concept-products.jsx`
- `src/pages/status-concept-product-detail.jsx`
- `src/pages/status-concept-favorites.jsx`
- `src/pages/client/ClientFavorites.jsx`
- `src/pages/status-concept-glatz.jsx`

**Out of scope**:
- The dictionaries themselves (do not remove the single-word keys — they translate real UI chrome like the sort dropdown).
- `TranslationLayer.jsx` mechanics.

## Git workflow

- Branch `loop`; one commit: `Mark catalog identity fields data-no-translate`.

## Steps

### Step 1: Annotate product-name elements

Add `data-no-translate` to the smallest element wrapping each raw catalog value listed in Current state. Examples:

```jsx
<h3 className="ff"><LocalizedLink className="rd-card-link" data-no-translate …>{product.name}</LocalizedLink></h3>
```

For the kitchen range chips in products.jsx: `<button … data-no-translate>{collection.label}</button>`.
For the detail page: the `<h1>` product name, SKU line, and the dimension/materials VALUE cells (keep the row LABELS — "Dimensions", "Materials" — translatable).

**Verify**: `grep -c "data-no-translate" src/pages/status-concept-products.jsx` → ≥ 3; build + lint exit 0.

### Step 2: Confirm chrome still translates

`npm run dev` → `/#/pt/products?cat=lounge`: sort dropdown still shows "Destaques"/"Nome"; kicker "Produtos /"; but product card names are byte-identical to `/#/en` versions.

**Verify**: manual check passes.

### Step 3: Regression fixture

If plan 001 landed, add one test to `src/components/TranslationLayer.test.jsx`: a node whose text equals a dict key (`New`) inside a `data-no-translate` parent stays `New` under `/pt`, while a sibling outside it becomes `Novo`.

**Verify**: `npm test` → green.

## Test plan

Covered in Step 3. Manual sweep in Step 2.

## Done criteria

- [ ] All five files annotate raw catalog values with `data-no-translate`
- [ ] PT UI chrome still translated (Step 2)
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- A render site from Current state no longer exists (drift).
- Annotating an element stops translation of UI chrome that shares the same wrapper — restructure ONLY the wrapper in question, and if that requires touching layout CSS, report instead.

## Maintenance notes

- New product-rendering surfaces must follow the same rule: raw catalog identity fields get `data-no-translate`. Record this in CLAUDE.md (plan 013).
