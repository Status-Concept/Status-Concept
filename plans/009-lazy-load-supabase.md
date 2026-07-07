# Plan 009: Move the Supabase SDK out of the entry chunk

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/lib/supabase.js src/context/AuthContext.jsx src/FavoritesContext.jsx src/pages/status-concept-contact.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: 001
- **Category**: perf
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

`@supabase/supabase-js` is statically imported by `AuthContext` (mounted at the app root), so the whole SDK ships in the entry chunk to every anonymous visitor — the majority of traffic for a showroom catalogue site — even though only login/account/favorites/contact-submit paths use it. Entry is currently ~508 kB (149 kB gzip); the SDK is a meaningful slice of that.

## Current state

- `src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// … exports `supabase` (client or null) and `isSupabaseConfigured`
```

- `src/context/AuthContext.jsx:2` — `import { supabase, isSupabaseConfigured } from '../lib/supabase'`; calls `supabase.auth.getSession()` in a mount effect and subscribes to `onAuthStateChange`.
- Other consumers: `src/FavoritesContext.jsx`, `src/pages/status-concept-contact.jsx`, `src/pages/Login.jsx`, `src/pages/Register.jsx`, client pages (`grep -rln "lib/supabase" src/` at execution time for the full list; pages are already lazy chunks — only the two contexts matter for the entry graph).
- Build baseline (commit f56df33): entry `dist/assets/index-*.js` ≈ 508 kB. Record the exact current number in Step 1.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Build + size | `npm run build` | exit 0; note entry chunk size |
| Tests | `npm test` | pass |
| Lint | `npm run lint` | exit 0 |

## Scope

**In scope**:
- `src/lib/supabase.js` (convert to async accessor)
- `src/context/AuthContext.jsx`, `src/FavoritesContext.jsx` (await the accessor)
- Direct page consumers only if the accessor change forces a signature change there

**Out of scope**:
- Auth UX/flows, RLS, any table.
- Changing when auth state resolves for the header (a brief anonymous flash before session load already exists today — do not regress it further than one extra microtask/network tick).

## Git workflow

- Branch `loop`; one commit: `Lazy-load the Supabase SDK behind an async accessor`.

## Steps

### Step 1: Record the baseline

`npm run build`; note the entry chunk size from the output table (e.g. `dist/assets/index-XXXX.js  508.28 kB`).

**Verify**: number recorded (goes in the commit message).

### Step 2: Async accessor in `src/lib/supabase.js`

Refactor to a memoized async getter while keeping the config flag synchronous:

```js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let clientPromise = null
export function getSupabase() {
  if (!isSupabaseConfigured) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(supabaseUrl, supabaseAnonKey)
    )
  }
  return clientPromise
}
```

Keep a temporary `export const supabase = null`-free transition: instead, update ALL importers in the same commit (Step 3) — do not leave a dual API.

**Verify**: `grep -rn "from '../lib/supabase'\|from \"../lib/supabase\"\|lib/supabase" src/` lists every importer to update in Step 3.

### Step 3: Update the two contexts (and any page importer)

`AuthContext.jsx`: in the mount effect, `const supabase = await getSupabase(); if (!supabase) { setLoading(false); return }` then proceed with `getSession()`/`onAuthStateChange` exactly as today (store the client in a ref or state for `login/logout/register` functions to use — they are already async). `FavoritesContext.jsx`: same pattern inside `loadSupabaseFavorites` and any other direct use. Page-level consumers (contact submit, Login/Register): replace `if (!supabase)` guards with `const supabase = await getSupabase()` at the top of their async handlers — the call sites are already inside async functions.

**Verify**: `npm run lint` → 0; `npm test` → green; `npm run build` → exit 0.

### Step 4: Confirm the SDK left the entry chunk

After build: `grep -l "supabase" dist/assets/index-*.js` should NOT match the SDK internals — better check: the build output now lists a separate chunk containing supabase (name varies), and the entry chunk shrank vs Step 1 by ≥ 60 kB raw.

**Verify**: entry size delta recorded; visiting `/#/en` in `npm run preview` with DevTools Network shows the supabase chunk loads only after an auth-needing action (or on login page), not on first paint. ALSO verify session persistence: log in, reload the page → still logged in (the deferred `getSession()` must still restore the session).

## Test plan

Plan 001's suites must stay green (they cover anonymous rendering). Add no new tests unless a regression is found; the login/reload manual check in Step 4 is the gate for auth restoration.

## Done criteria

- [ ] `@supabase/supabase-js` is dynamically imported; no static import remains (`grep -rn "from '@supabase/supabase-js'" src/` → only inside the dynamic import in lib/supabase.js)
- [ ] Entry chunk ≥ 60 kB smaller than the Step 1 baseline
- [ ] Login, logout, favorites sync, contact submit, and session-restore-on-reload all work in `npm run preview`
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- The auth-restore-on-reload check fails after one honest fix attempt — revert and report (session restoration timing is the real risk here).
- The entry chunk shrinks by < 30 kB (SDK was not actually in the entry graph — measurement contradicts the premise; report).

## Maintenance notes

- New Supabase consumers must use `getSupabase()`; never re-add a top-level `createClient`. Record in CLAUDE.md (plan 013).
- If a future SSR/prerender pass lands, revisit — dynamic import boundaries change.
