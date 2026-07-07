# Plan 001: Establish a verification baseline (Vitest + smoke tests)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- package.json src/utils/language.js src/components/TranslationLayer.jsx src/utils/sanitize.js`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

The repo has no test runner, no tests, and no typecheck — the only scripts are `dev/build/lint/preview` (`package.json:6-11`). Every other plan in `plans/` makes blind changes without this one. This plan adds Vitest plus a first smoke layer over the three most fragile mechanisms: language-prefixed routing, the string-matching translation layer, and the sanitize utility. It deliberately does NOT aim for coverage — it aims for a one-command "did I break the app?" signal.

## Current state

- `package.json` — scripts: `"dev": "vite", "build": "vite build", "lint": "eslint .", "preview": "vite preview"`. No test deps. Vite 8, React 19, react-router-dom 7.
- `src/utils/language.js` — pure functions `getLangFromPath`, `stripLangFromPath`, `withLang` (SUPPORTED_LANGS = `['en','pt']`, DEFAULT_LANG `'en'`). Example: `withLang('/products?cat=shade', 'pt')` must return `'/pt/products?cat=shade'`.
- `src/components/TranslationLayer.jsx` — exports a default React component; the translation core is `translateTextNode(node, lang)` and `applyTranslations(lang)` (module-private, lines ~437-476). It swaps `node.nodeValue` when the trimmed value is an exact key in the `translations[lang]` dict, preserving leading/trailing whitespace. Nodes under `[data-no-translate]` are skipped.
- `src/utils/sanitize.js` — small pure sanitizers (`sanitizeText`, `sanitizePhone`) used by `src/context/AuthContext.jsx:32-34`.
- `src/App.jsx` — `routesFor(prefix)` renders the same route set for `''`, `'/en'`, `'/pt'`; pages are `React.lazy` except the homepage. App must be rendered inside a Router; the app entry (`src/main.jsx`) supplies `HashRouter`.
- No CI. ESLint flat config at `eslint.config.js`.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install | `npm install` | exit 0 |
| Build | `npm run build` | `✓ built in …`, exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests (after this plan) | `npm test` | all pass, exit 0 |

## Scope

**In scope** (the only files you should modify/create):
- `package.json` (add devDeps + `"test"` script)
- `vitest.config.js` (create)
- `src/utils/language.test.js` (create)
- `src/utils/sanitize.test.js` (create)
- `src/components/TranslationLayer.test.jsx` (create)
- `src/App.test.jsx` (create)

**Out of scope**:
- Any change to application source behavior. This plan only adds tests/config.
- E2E/browser testing (Playwright etc.) — explicitly deferred.
- `dist/`, `scripts/`, product data files.

## Git workflow

- Work on the current branch (`loop`) unless told otherwise.
- One commit: `Add Vitest verification baseline: routing, translation, sanitize smoke tests`.
- Do NOT push unless the operator instructed it.

## Steps

### Step 1: Install Vitest and testing-library

Run: `npm install -D vitest @testing-library/react @testing-library/jsdom jsdom @testing-library/jest-dom`
(If `@testing-library/jsdom` does not exist as a package, install only `vitest @testing-library/react jsdom @testing-library/jest-dom` — the required set is vitest + jsdom + testing-library/react.)

Add to `package.json` scripts: `"test": "vitest run"`.

Create `vitest.config.js`:

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

**Verify**: `npx vitest run` → "no test files found" (or 0 tests) with exit code 0 or a clear empty-suite message.

### Step 2: Unit tests for language utils

Create `src/utils/language.test.js` covering:
- `getLangFromPath('/pt/products')` → `'pt'`; `getLangFromPath('/products')` → `'en'`; `getLangFromPath('/')` → `'en'`.
- `stripLangFromPath('/pt/products')` → `'/products'`; `stripLangFromPath('/en')` → `'/'`; `stripLangFromPath('/products')` → `'/products'`.
- `withLang('/products?cat=shade', 'pt')` → `'/pt/products?cat=shade'`; `withLang('/', 'en')` → `'/en'`; `withLang('/en/products', 'pt')` → `'/pt/products'` (re-prefix); unknown lang falls back to `'/en/...'`.

**Verify**: `npm test` → all language tests pass.

### Step 3: Unit tests for sanitize utils

Read `src/utils/sanitize.js` first and write `src/utils/sanitize.test.js` asserting its actual documented behavior (at minimum: strips `<`/`>` or tags from text, phone keeps digits/+/spaces — derive exact expectations from the implementation, do not guess).

**Verify**: `npm test` → sanitize tests pass.

### Step 4: DOM test for the translation layer

Create `src/components/TranslationLayer.test.jsx`. Because `translateTextNode`/`applyTranslations` are module-private, test through the component: render a small tree inside a `MemoryRouter` at `/pt` with `TranslationLayer` mounted plus known dict strings, e.g.:

```jsx
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TranslationLayer from './TranslationLayer'
```

The component walks `document.getElementById('root')` — so the test must render into a container with id `root` (create `<div id="root">` and pass it as the render container). Cases:
1. A text node `Products` under `/pt` becomes `Produtos` (exact-key hit).
2. `  Products  ` keeps its leading/trailing whitespace, i.e. becomes `  Produtos  `.
3. A node inside `<span data-no-translate>Products</span>` stays `Products`.
4. Under `/en` route prefix, `Products` stays `Products`.
Use `waitFor` — translation runs in an effect + MutationObserver.

**Verify**: `npm test` → translation tests pass.

### Step 5: Routing smoke test

Create `src/App.test.jsx`: render `<App />` inside `MemoryRouter` at `initialEntries={['/']}`, `['/en/contact']`, `['/pt/contact']` and assert the expected page content appears (`await screen.findByText(...)` because routes are lazy). Suggested assertions: homepage contains `STATVS` (logo) and the contact route contains the text `Tell us what you need` (EN). Wrap render with the providers App already includes internally — App brings its own providers, so rendering `<App />` inside `MemoryRouter` is sufficient. NOTE: `src/main.jsx` uses `HashRouter`; tests must NOT import main.jsx.

If Supabase env vars are missing in the test environment, `src/lib/supabase.js` exports a null/flagged client (`isSupabaseConfigured`) — auth simply stays anonymous; that is fine for smoke tests.

**Verify**: `npm test` → all suites green.

### Step 6: Wire into lint habit

Add `"check": "npm run lint && npm test"` to package.json scripts.

**Verify**: `npm run check` → exit 0.

## Test plan

This plan IS the test plan. Final state: 4 test files, ≥12 assertions total, `npm test` exits 0 in under ~30s.

## Done criteria

- [ ] `npm test` exits 0 with 4 test files passing
- [ ] `npm run build` still exits 0
- [ ] `npm run lint` still exits 0
- [ ] `git status` shows only in-scope files changed
- [ ] `plans/README.md` status row updated

## STOP conditions

- `TranslationLayer.jsx` no longer walks `#root` / the dict shape changed (drift).
- Vitest cannot resolve JSX from `.jsx` files after config (build tooling drift) after one honest fix attempt.
- Any test requires modifying application source to pass — report the finding instead of changing source.

## Maintenance notes

- Future plans (004, 006, 007, 008, 009) rely on `npm test` as their safety net — keep it green.
- When copy changes in pages, translation tests may need new fixture strings; prefer testing mechanism (whitespace, no-translate, lang switch), not full copy coverage.
