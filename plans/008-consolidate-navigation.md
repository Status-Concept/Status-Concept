# Plan 008: Consolidate navigation on LocalizedLink; delete the text-matching click interceptor

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/useNavLinks.jsx src/components/Header.jsx src/components/LocalizedLink.jsx src/pages/`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: 001 (routing smoke tests required as safety net)
- **Category**: bug + tech-debt
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

Three navigation mechanisms coexist: (1) the canonical `LocalizedLink`/`useLocalizedNavigate`; (2) hand-rolled `withLang` + `navigate` calls; (3) `useNavLinks` — a document-level click listener imported by 9 pages that intercepts clicks on `a.nl` elements and routes by `link.textContent.trim()` matched against a label map. Mechanism 3 is actively buggy today: the Header renders `<LocalizedLink className="nl" to="/about">Showrooms</LocalizedLink>`, but `useNavLinks` maps the TEXT `Showrooms` to `/contact` — so on the 9 pages that mount it, clicking "Showrooms" fires BOTH React Router's navigation to `/about` AND a second `navigate()` to `/contact`; the interceptor wins. It also breaks whenever copy or translation changes the visible text. This plan deletes mechanism 3 and migrates stragglers to mechanism 1.

## Current state

- `src/useNavLinks.jsx` (whole file, 49 lines) — `navMap` of EN/PT labels → paths (note `Showrooms: '/contact'`); `handleClick` does `e.target.closest('a.nl')` → `navMap[link.textContent.trim()]` → `e.preventDefault(); navigate(...)`; plus a special case for a `SPAN` whose text is `STATVS` (the old logo — the logo is now a real `LocalizedLink`, so this branch is dead).
- Importers (9 pages): `grep -rln "useNavLinks" src/` → homepage, products, product-detail, glatz, about, contact, projects, favorites (+1 more; enumerate at execution time). Each calls `useNavLinks();` at the top of the component — that line is the only usage.
- `src/components/Header.jsx` — desktop nav renders real links now: `Products` dropdown → `/products…`, and `[["Projects","/projects"],["Showrooms","/about"],["Contact","/contact"]]` as `LocalizedLink className="nl"`.
- `src/components/LocalizedLink.jsx` — canonical link (8 lines, wraps react-router `Link` with `withLang`).
- DECISION REQUIRED BY PLAN (already made): "Showrooms" in the header points to `/about` (the About page hosts showroom info). `useNavLinks`'s `/contact` mapping is the stale one. Do not "fix" the header to match the dead map.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Tests | `npm test` | routing suite passes |
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |

## Scope

**In scope**:
- Delete `src/useNavLinks.jsx`
- Remove its import + call from every page that uses it
- Fix any navigation that silently DEPENDED on the interceptor (see Step 2)

**Out of scope**:
- `useLocalizedNavigate` (keep — it is the programmatic counterpart for imperative flows like the language switcher and post-submit redirects).
- Restyling links; `.nl` remains a pure CSS class.
- MobileMenu / Footer (already on LocalizedLink).

## Git workflow

- Branch `loop`; one commit: `Delete text-matching nav interceptor; navigation is LocalizedLink-only`.

## Steps

### Step 1: Inventory real dependents of the interceptor

Before deleting, find any `a.nl` anchors that do NOT have a working href (i.e. relied on the interceptor to navigate): `grep -rn 'className="nl"\|className={`nl' src/ --include="*.jsx"`. For each hit, confirm it is a `LocalizedLink`/`Link` with a real `to`, or an `<a>` with a valid href. Fix any bare `<a className="nl" href="#">` by converting to `LocalizedLink` with the correct route (route choice: match the Header's current mapping — Projects `/projects`, Showrooms `/about`, Contact `/contact`).

**Verify**: every `.nl` element in src/ has a real destination; list them in the commit message body.

### Step 2: Remove the hook from all pages

For each of the 9 importers: delete the `import useNavLinks from '../useNavLinks'` line and the `useNavLinks();` call.

**Verify**: `grep -rn "useNavLinks" src/` → only `src/useNavLinks.jsx` itself remains.

### Step 3: Delete the file

Delete `src/useNavLinks.jsx`.

**Verify**: `npm run build` → exit 0; `npm test` → routing suite green.

### Step 4: Manual click-through

`npm run dev`; on `/#/en` AND `/#/pt` click every header/nav surface: logo, Products (top level + each dropdown item), Projects, Showrooms, Contact, mobile menu entries, footer links. Each navigates exactly once to the URL its href declares (watch the address bar; "Showrooms" must land on `/#/en/about`, not `/contact`).

**Verify**: all destinations match hrefs; no double-navigation flicker.

## Test plan

Extend `src/App.test.jsx` (from plan 001): assert the Header's Showrooms link has `href` ending `/about` under both prefixes. The existing route smoke tests cover mount behavior.

## Done criteria

- [ ] `src/useNavLinks.jsx` deleted; zero references
- [ ] All `.nl` elements are real links with correct hrefs
- [ ] Manual click-through passes on EN and PT
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- Step 1 uncovers a page whose navigation exists ONLY as text-matched anchors with no route information — report the page; do not guess destinations beyond the Header mapping given above.
- After removal, any nav element navigates nowhere (dead click) — fix via LocalizedLink if the destination is in the Header mapping; otherwise STOP.

## Maintenance notes

- From now on: new internal links use `LocalizedLink`; imperative redirects use `useLocalizedNavigate`. No other mechanism. Record in CLAUDE.md (plan 013).
- Reviewer: scrutinize the diff for pages whose only change should be two deleted lines each.
