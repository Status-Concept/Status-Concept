# Plan 012: Add a minimal CI gate (lint + test + build) on GitHub Actions

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- package.json`
> Also confirm `.github/` still does not exist; if it does, reconcile instead of overwriting.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 001 (so CI has a test step; may land before 001 with the test step commented)
- **Category**: dx
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

Nothing gates pushes: lint/build run only when someone remembers, and regressions reach the deployed site unchecked. The repo is on GitHub (`origin` → `github.com/sasalu08/Status-Concept.git`, branches `main` and `loop`), so a 30-line Actions workflow gives every push/PR an automatic lint+test+build verdict.

## Current state

- No `.github/` directory in the repo.
- `package.json` scripts: `dev`, `build`, `lint`, `preview` (+ `test` and `check` after plan 001).
- Node version: not pinned anywhere. Vite 8 requires Node ≥ 20.19 — use Node 22 LTS in CI and pin it via an `engines` field.
- Build requires no env vars (Supabase vars are optional at build time — `src/lib/supabase.js` tolerates absence; verify during Step 3).

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Local dry run | `npm ci && npm run lint && npm test && npm run build` | exit 0 |

## Scope

**In scope**:
- `.github/workflows/ci.yml` (create)
- `package.json` (add `"engines": { "node": ">=20.19" }`)

**Out of scope**:
- Deployment automation (no deploy target is configured in-repo; do not invent one).
- Branch protection rules (needs repo admin UI; note in maintenance).
- Caching beyond `actions/setup-node`'s built-in npm cache.

## Git workflow

- Branch `loop`; one commit: `Add CI: lint, test, build on push and PR`.
- Do NOT push unless the operator instructed it (CI proves itself on the next authorized push).

## Steps

### Step 1: Workflow file

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main, loop]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
        if: ${{ hashFiles('vitest.config.js') != '' }}
      - run: npm run build
```

(The `if:` guard lets this land before plan 001; remove the guard once 001 is DONE.)

**Verify**: `npx yaml-lint .github/workflows/ci.yml` if available, else `node -e "require('js-yaml')"`-style checks are NOT required — a careful read suffices; YAML is 20 lines.

### Step 2: Engines pin

Add to `package.json`: `"engines": { "node": ">=20.19" }`.

**Verify**: `npm run build` still exits 0 locally.

### Step 3: Local dry run of exactly what CI runs

`npm ci && npm run lint && npm test && npm run build` in a clean state (stash uncommitted work first if needed; restore after). If `npm test` fails because plan 001 hasn't landed, that's expected — the workflow's `if:` guard covers it.

**Verify**: the chain exits 0 (modulo the guarded test step).

## Test plan

CI is the test. First green run on GitHub after the next push is the real acceptance; locally the Step 3 chain stands in.

## Done criteria

- [ ] `.github/workflows/ci.yml` exists with lint/test/build steps
- [ ] `engines` field present
- [ ] Local `npm ci && npm run lint && npm run build` exits 0
- [ ] `plans/README.md` updated

## STOP conditions

- `npm ci` fails on a lockfile mismatch — report; do not regenerate the lockfile as a side effect of this plan.

## Maintenance notes

- After the first green run, enable branch protection on `main` requiring the `verify` job (repo admin action — flag to operator).
- When plan 001 lands, delete the `if:` guard on the test step.
