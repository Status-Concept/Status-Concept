# Plan 016: Split the 2,375-line index.css into layered stylesheets

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/index.css src/main.jsx`
> Expect index.css to have changed if plan 004 landed (dead-rule pruning) — that is fine; the structural facts below must still hold.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: MED (cascade order)
- **Depends on**: 004 (prune dead rules first)
- **Category**: tech-debt
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

`src/index.css` is a single ~2,375-line stylesheet holding design tokens, resets, shared components, and every page's styles. It is the highest-fan-in file in the repo: any change risks unrelated regressions, and dead rules hide easily. Splitting by concern (WITHOUT changing a single declaration) makes future style work reviewable.

## Current state

- `src/index.css` — imported once from `src/main.jsx`. Internal structure (approximate line ranges at commit f56df33; re-locate by the section comments/selectors, not line numbers):
  - `:root` tokens + font-face/imports + resets (top of file)
  - shared primitives: `.cb` buttons (~1587), `.nl` nav links (~1553), `.sl`, `.fs`/`.ff`, `.mb` badges, focus-visible block (~335)
  - carousel (`.cat-carousel*`), product cards (`.rd-product-*` ~225-330), page-specific blocks (`.rd-showroom-*`, `.account-*` ~2172+, cookie banner, form styles)
- CSS is plain (no preprocessor); Vite bundles and minifies. Order matters ONLY through the cascade — selectors here are mostly single-class with equal specificity, so preserving original ORDER is the safety requirement.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Build | `npm run build` | exit 0 |
| Tests | `npm test` | pass |
| Diff check | see Step 3 | byte-identical CSS bundle |

## Scope

**In scope**:
- Create `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/components.css`, `src/styles/pages.css`
- `src/index.css` becomes 4 `@import` lines (or main.jsx imports the four directly — pick the @import approach to keep main.jsx untouched)

**Out of scope**:
- ANY change to a selector, property, or value. This is a move-only refactor.
- Introducing CSS modules/tailwind/preprocessors.

## Git workflow

- Branch `loop`; one commit: `Split index.css into tokens/base/components/pages (move-only)`.

## Steps

### Step 1: Capture the before-bundle

`npm run build` and copy `dist/assets/index-*.css` to a temp location (e.g. `/tmp/before.css` or the OS temp dir).

**Verify**: file saved.

### Step 2: Cut in original order

Create the four files and MOVE contiguous blocks in their ORIGINAL top-to-bottom order: everything up to the end of resets → `tokens.css` + `base.css` (tokens = `:root`/fonts; base = resets/typography helpers); shared primitives → `components.css`; the rest (page-specific, in original order) → `pages.css`. Replace `src/index.css` content with:

```css
@import './styles/tokens.css';
@import './styles/base.css';
@import './styles/components.css';
@import './styles/pages.css';
```

Rule: if a block's classification is ambiguous, classification does NOT matter as much as ORDER — when in doubt, keep neighbors together so the concatenated order equals the original file order.

**Verify**: `npm run build` → exit 0.

### Step 3: Prove byte-equivalence

Compare the new `dist/assets/index-*.css` with the Step 1 copy. Minified output should be IDENTICAL except possibly the hash filename. On Windows PowerShell: `(Get-FileHash before.css).Hash -eq (Get-FileHash after.css).Hash`; in bash: `diff <(cat before.css) <(cat after.css)`.

If not byte-identical: diff the two and fix ordering until identical. Vite may inline @imports in a way that reorders nothing — if it emits identical content, done.

**Verify**: hashes equal (or diff empty).

### Step 4: Smoke

`npm test` green; dev-server visual spot check on homepage, products grid, product detail, contact, client area, mobile menu.

**Verify**: no visual differences.

## Test plan

Byte-equivalence in Step 3 IS the test. Smoke suite for runtime sanity.

## Done criteria

- [ ] Four styles files + 4-line index.css
- [ ] Production CSS bundle byte-identical to before
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- Byte-equivalence cannot be reached after two ordering fixes — report the diff hunks instead of shipping a visually-unverified split.

## Maintenance notes

- Future page styles go in `pages.css` (or per-page files later); tokens changes in `tokens.css` only.
- A follow-up could co-locate page CSS with pages — deferred (import graph noise vs. benefit unclear).
