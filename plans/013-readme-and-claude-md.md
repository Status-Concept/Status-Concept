# Plan 013: Write README.md and CLAUDE.md; move stale research docs to docs/archive

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- package.json src/App.jsx src/components/TranslationLayer.jsx`
> (These are the files whose facts get documented — on drift, document the NEW truth, not the excerpts here.)

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (but content improves if written after 004/008 land — note which plans have landed and document the post-plan state)
- **Category**: docs + dx
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

The repo has no README and no CLAUDE.md. Its most load-bearing conventions are undiscoverable and easy to break: the triple lang-prefixed routing, the verbatim-string translation contract, generated product data files, and Supabase env setup. Agents (which actively execute work here) rediscover this every session. Six large research/plan markdown files also sit uncommitted in the repo root, blurring what is authoritative.

## Current state

- Repo root has no `README*`, no `CLAUDE.md`, no `AGENTS.md`.
- Uncommitted root docs: `STATVS-Marketing-Research.md`, `STATVS-Site-Improvement-Research.md`, `STATVS-Boss-Changes-Plan.md`, `STATVS-Routing-SEO-Migration-Plan.md`, `Status.md`, `HANDOFF-kitchen-hero.md` (verify with `git status --short -- '*.md'`).
- Facts to document (verify each at execution time):
  - Stack: Vite 8, React 19, react-router-dom 7 (HashRouter — URLs are `/#/en/...`), Supabase (auth, enquiries, favorites, profiles), no TypeScript.
  - Scripts: `npm run dev|build|lint|preview` (+ `test`/`check` if plan 001 landed).
  - Env: copy `.env.example` → `.env`; vars `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (publishable anon key — safe for client; do NOT paste values into docs).
  - Routing: `routesFor(prefix)` in `src/App.jsx` renders every route for `''`, `'/en'`, `'/pt'`; internal links MUST use `src/components/LocalizedLink.jsx`; imperative navigation uses `src/hooks/useLocalizedNavigate.js`.
  - i18n contract: `src/components/TranslationLayer.jsx` swaps text nodes whose EXACT trimmed value is a key in the lang dict. Consequences: (a) every new user-visible EN string needs a `pt` key; (b) changing copy in JSX requires updating the dict key or the string silently reverts to EN; (c) raw catalog data must be wrapped in `data-no-translate`.
  - Product data: `src/data/*.js` are GENERATED (from Produtos-Status-Concept sources via `scripts/`); don't hand-edit.
  - Schema: `supabase-schema.sql` is the source of truth for DB DDL/policies.
- Exemplar CLAUDE.md tone: short imperatives, no marketing.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Verify facts | `npm run build`, `ls scripts/` | exit 0 / listing |

## Scope

**In scope**:
- `README.md` (create)
- `CLAUDE.md` (create)
- `docs/archive/` (create; `git mv`-style move of the six root docs — they are untracked, so a plain move)

**Out of scope**:
- Rewriting/pruning the archived research docs' content.
- `.claude/skills/**` (leave as-is).

## Git workflow

- Branch `loop`; one commit: `Add README and CLAUDE.md; archive research docs`.

## Steps

### Step 1: README.md

Sections: What this is (2 lines: STATVS — luxury outdoor-furniture showroom site, Algarve; React SPA + Supabase); Quick start (clone, `npm install`, `.env` from `.env.example`, `npm run dev`); Scripts table; Architecture map (10 lines: pages/, components/, context/, data/ generated, lib/supabase, index.css single stylesheet); Routing & i18n (the contract from Current state — this is the section that prevents breakage); Database (`supabase-schema.sql`, apply via Supabase SQL editor); Deployment note (static `dist/` from `npm run build`, HashRouter so any static host works).

**Verify**: every command mentioned in README actually runs (`npm run dev` boots; others exit 0).

### Step 2: CLAUDE.md

Keep under ~40 lines, imperative:

```markdown
# CLAUDE.md

Commands: npm run dev | build | lint | preview [| test | check]
Always run lint (and test, if present) before declaring work done.

Architecture: Vite + React 19 SPA, HashRouter. Routes render 3× in src/App.jsx
via routesFor('') / ('/en') / ('/pt'). Pages lazy-load except the homepage.

Rules:
- Internal links: use src/components/LocalizedLink.jsx. Imperative nav: useLocalizedNavigate. Never raw <a href="/..."> for internal routes.
- i18n: src/components/TranslationLayer.jsx translates by EXACT trimmed string match. Every new visible EN string needs a pt key. If you change copy in JSX, update the dict. Wrap raw catalog data (product names, SKUs, dimensions) in data-no-translate.
- src/data/*.js are generated — never hand-edit; regenerate via scripts/.
- DB DDL/policies live in supabase-schema.sql — any new table/policy goes there first.
- Supabase client: use the accessor in src/lib/supabase.js (respect its current sync/async shape).
- Don't commit .env. Anon key is publishable but still never paste values into docs/code.
```

Adjust bracketed/conditional bits to match which plans have landed.

**Verify**: file exists; statements spot-checked against the code.

### Step 3: Archive the research docs

`mkdir docs/archive` and move the six root-level docs there. Add one line to each? No — instead add `docs/archive/README.md` with: "Historical research and planning artifacts. Not authoritative — see the repo README and plans/."

**Verify**: `ls *.md` at repo root shows only `README.md` and `CLAUDE.md`; `git status` shows the moves/creates only.

## Test plan

Not applicable (docs). The gate is fact-accuracy: every claim tested in Steps 1-2.

## Done criteria

- [ ] README.md and CLAUDE.md exist and every command/fact in them verified
- [ ] Root has no stray research .md files; docs/archive/README.md disclaimer present
- [ ] `plans/README.md` updated

## STOP conditions

- A documented fact cannot be verified against the code (e.g. scripts changed) — fix the doc to match reality, and if reality looks broken, report it.

## Maintenance notes

- CLAUDE.md must be updated by any plan that changes a rule it states (nav, i18n, supabase accessor). Reviewers should check this file in every structural PR.
