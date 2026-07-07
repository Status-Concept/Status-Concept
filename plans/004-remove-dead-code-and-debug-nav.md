# Plan 004: Remove comparator leftovers, dead pages, unused deps, and gate the debug PageNav

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/PageNav.jsx src/components/SpotlightTour.jsx src/pages/status-concept-collection.jsx src/components/TranslationLayer.jsx src/index.css package.json src/App.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 001 (recommended — gives `npm test` as a safety net; may proceed without it)
- **Category**: tech-debt
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

The product-comparison feature was deliberately removed, but ~230 lines of orphaned code remain (an unused tour component, an unrouted page, ~40 comparator dict keys, 22 dead CSS rules), plus two unused/misplaced dependencies (`xlsx` — carries a high `npm audit` advisory; `@google/genai` — dev-script-only but in `dependencies`). Separately, a floating debug page-navigator (`PageNav`) renders for real visitors on every page (fixed, bottom-right, z-index 9999) and contains a link to the non-existent `/collection` route.

## Current state

- `src/PageNav.jsx` — floating "Pages" menu; page list at lines 7-16 includes `{ path: '/collection', label: 'Collection' }` (no such route) and `/product/sicily-modular-set`. Rendered unconditionally in `src/App.jsx` (`<PageNav />`, around line 63, between `TranslationLayer` and `Suspense`).
- `src/components/SpotlightTour.jsx` — 81-line component; `grep -rn "SpotlightTour" src/` shows no importer (only its own file).
- `src/pages/status-concept-collection.jsx` — 152-line page; not imported, not routed in `src/App.jsx`.
- `src/components/TranslationLayer.jsx` — the `en:` dict (lines ~45-85) holds comparator-only keys, e.g. `'Comparar produtos'`, `'Abrir comparador'`, `'Transferir Excel'`, `'O comparador esta vazio'`, the whole "Comparator tutorial" block, and comparator toasts (`'Removido do comparador.'`, `'Adicionado ao comparador.'`, `'So podes comparar…'` ×2). Also `Comparador: 'Comparator'` and `'Abrir comparador': 'Open comparator'`. The `pt:` dict has `'Send this comparison to the showroom': 'Enviar esta comparação ao showroom'` (dead — the comparator UI is gone).
- `src/index.css` — 22 occurrences of `.compare-` / comparator-related selectors (`grep -c "compare-" src/index.css`), plus tour styles if any are `.spotlight-*`/`.tour-*` (verify before deleting).
- `package.json` — `"xlsx": "^0.18.5"` in dependencies (imported nowhere under `src/` — `grep -rn "xlsx" src/` → 0 matches); `"@google/genai": "^2.9.0"` in dependencies but only used by `scripts/generate-kitchen-heroes.mjs`.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm test` | pass (if 001 landed) |
| Audit | `npm audit --omit=dev` | 0 high/critical after xlsx removal |

## Scope

**In scope**:
- Delete: `src/components/SpotlightTour.jsx`, `src/pages/status-concept-collection.jsx`
- Edit: `src/PageNav.jsx` (gate to dev + drop `/collection` entry), `src/App.jsx` (conditional render if needed), `src/components/TranslationLayer.jsx` (remove comparator-only keys), `src/index.css` (remove confirmed-dead rules), `package.json` (+ lockfile via npm)

**Out of scope**:
- `scripts/generate-kitchen-heroes.mjs` itself (keep working: move its dep, don't delete the script).
- Any live CSS: delete a selector ONLY after `grep -rn "<class>" src/` shows no JSX usage.
- The root-level `STATVS-*.md` research docs (plan 013 handles doc placement).

## Git workflow

- Branch `loop`; one commit: `Remove comparator leftovers and debug nav; drop unused xlsx dep`.

## Steps

### Step 1: Delete dead files

Delete `src/components/SpotlightTour.jsx` and `src/pages/status-concept-collection.jsx`.

**Verify**: `grep -rn "SpotlightTour\|status-concept-collection" src/` → 0 matches; `npm run build` → exit 0.

### Step 2: Gate PageNav to dev and drop the dead entry

In `src/PageNav.jsx`: remove the `{ path: '/collection', … }` entry; at the top of the component add `if (!import.meta.env.DEV) return null`.

**Verify**: `npm run build` → exit 0; `grep -n "collection" src/PageNav.jsx` → 0 matches. Then `npm run preview` and confirm the floating "Pages" button does NOT appear on the built site, but DOES appear under `npm run dev`.

### Step 3: Prune comparator dict keys

In `src/components/TranslationLayer.jsx`, delete from the `en:` dict every key that exists only for the comparator (the "Comparator", "Comparator tutorial" and comparator-toast blocks — see Current state). Also delete `Comparador: 'Comparator'`, `'Abrir comparador'`, and from `pt:` the `'Send this comparison to the showroom'` entry. KEEP everything used by live pages (e.g. `'Limpar tudo'` is still used by favorites' "Clear all" — check each key with `grep -rn "<string>" src/pages src/components --include="*.jsx" -l` before removing; if a key's EN or PT string appears in any live JSX, keep it).

**Verify**: `npm test` (if present) green; dev-server spot check `/#/pt/favorites` still shows "Limpar tudo" behavior intact.

### Step 4: Prune dead CSS

For each `.compare-*` (and tour-specific) selector in `src/index.css`: `grep -rn "compare-" src/ --include="*.jsx"` → confirm 0 JSX usages, then delete the rule block. Re-run the grep after; the only remaining `compare-` occurrences should be none.

**Verify**: `grep -c "compare-" src/index.css` → 0; `npm run build` → exit 0.

### Step 5: Dependencies

`npm uninstall xlsx` and `npm uninstall @google/genai && npm install -D @google/genai` (moves it to devDependencies — the generator script still resolves it).

**Verify**: `npm audit --omit=dev` → no high/critical advisories; `node scripts/generate-kitchen-heroes.mjs --help` (or a dry require) still resolves the module — if the script has no help flag, `node -e "import('@google/genai').then(()=>console.log('ok'))"` → `ok`.

## Test plan

Covered by 001's smoke suite plus the greps above. No new tests.

## Done criteria

- [ ] Both dead files gone; no references remain
- [ ] PageNav absent from production build, present in dev
- [ ] `npm audit --omit=dev` → 0 high/critical
- [ ] `grep -c "compare-" src/index.css` → 0
- [ ] Build, lint (and tests if present) exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- Any "dead" file/key/selector turns out to have a live reference (grep hit in src/) — report instead of deleting.
- Removing `xlsx` breaks the build (something imports it transitively from src/) — report.

## Maintenance notes

- Plan 016 (CSS split) assumes this pruning already happened.
- If a spotlight/tour is wanted later, restore `SpotlightTour.jsx` from git history rather than keeping it live.
