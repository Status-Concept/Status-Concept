# Plan 003: Ship real privacy/cookie/terms pages and fix the dead legal links

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/components/ConsentNotice.jsx src/components/Footer.jsx src/App.jsx src/components/TranslationLayer.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug (compliance-visible)
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

The GDPR cookie banner links to `/privacidade` — a route that does not exist, via a raw `href` that under HashRouter causes a full page load to a 404/fallback. The footer's "Privacy Policy", "Cookie Policy" and "Terms" links are `href="#"` (dead). A cookie-consent banner pointing at a non-functional privacy policy is a user-visible compliance defect on every page of the site.

## Current state

- `src/components/ConsentNotice.jsx:21` — `<a href="/privacidade"> Politica de privacidade</a>` (raw href; app routes live under `/#/…`).
- `src/components/Footer.jsx:70-73` (bottom bar):

```jsx
<a href="#" style={{color:"inherit",textDecoration:"none"}}>Privacy Policy</a>
<a href="#" style={{color:"inherit",textDecoration:"none"}}>Cookie Policy</a>
<a href="#" style={{color:"inherit",textDecoration:"none"}}>Terms</a>
```

- `src/App.jsx` — `routesFor(prefix)` renders each route for `''`, `'/en'`, `'/pt'`; pages are `React.lazy`. Placeholder pattern to copy (line 39):

```jsx
<Route path={`${prefix}/after-care`} element={<Placeholder title="After Care & Valet Service" subtitle="…" />} />
```

- `src/components/LocalizedLink.jsx` — `<LocalizedLink to="/path">` renders a lang-prefixed react-router `Link`. This is the repo's canonical internal link. Exemplar usage: `src/components/Footer.jsx:53-60`.
- `src/components/TranslationLayer.jsx` — every user-visible EN string needs a PT key in the `pt` dict (exact trimmed match). Existing keys: `'Privacy Policy': 'Política de privacidade'`, `'Cookie Policy': 'Política de cookies'`, `Terms: 'Termos'`.
- Page conventions: pages live in `src/pages/status-concept-*.jsx`, wrap content in `Layout` (`src/components/Layout.jsx`), use classes `rd-page-head`, `rd-title ff`, `rd-lede fs` (see `src/pages/status-concept-placeholder.jsx` for the minimal page shape).

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm test` | pass (if 001 landed) |

## Scope

**In scope**:
- `src/pages/status-concept-legal.jsx` (create — one component serving 3 legal docs)
- `src/App.jsx` (3 new routes)
- `src/components/ConsentNotice.jsx` (fix link)
- `src/components/Footer.jsx` (fix 3 links)
- `src/components/TranslationLayer.jsx` (PT keys for new page copy)

**Out of scope**:
- Legal text authorship: use clearly-labelled placeholder legal copy structured for a Portuguese retailer (sections listed below) and mark `TODO: legal review` in a code comment. Do NOT invent specific legal claims (no fake DPO names, no fake registration numbers).
- Cookie-consent mechanics (`ConsentNotice` behavior stays as is).

## Git workflow

- Branch `loop`; one commit: `Add privacy/cookie/terms pages and fix dead legal links`.

## Steps

### Step 1: Create the legal page component

`src/pages/status-concept-legal.jsx`: a component `Legal({ doc })` where `doc ∈ 'privacy' | 'cookies' | 'terms'`. Render inside `Layout`, with `rd-page-head` heading and simple prose sections. Content requirements (placeholder but honest):

- **privacy** ("Privacy Policy"): who we are (STATVS · Status Concept, Almancil, Algarve — contact `info@statusconcept.com`); what data the site collects (contact-form fields: name, email, phone, interest, message; account data: name, phone; favorites); purpose (responding to enquiries, account features); storage (Supabase, EU hosting note as TODO); retention TODO; user rights under GDPR (access, rectification, erasure — exercised via email); no sale of data.
- **cookies** ("Cookie Policy"): essential cookies/localStorage used (`cookie_consent`, session auth token, favorites keys); no third-party ad cookies; how to change choice (clear site data).
- **terms** ("Terms"): informational catalogue site; product info non-contractual; enquiry ≠ order; Portuguese law.

Top of file: `// TODO: legal review — placeholder copy pending counsel sign-off`.

**Verify**: `npm run lint` → exit 0.

### Step 2: Route it

In `src/App.jsx`, lazy-import the page and add, inside `routesFor(prefix)`:

```jsx
<Route path={`${prefix}/privacy`} element={<Legal doc="privacy" />} />
<Route path={`${prefix}/cookies`} element={<Legal doc="cookies" />} />
<Route path={`${prefix}/terms`} element={<Legal doc="terms" />} />
```

Also add a PT-friendly alias for the banner: `<Route path={`${prefix}/privacidade`} element={<Legal doc="privacy" />} />`.

**Verify**: `npm run build` → exit 0.

### Step 3: Fix the consent banner link

`src/components/ConsentNotice.jsx`: replace the raw anchor with the canonical link component:

```jsx
import LocalizedLink from './LocalizedLink'
// …
<LocalizedLink to="/privacidade"> Politica de privacidade</LocalizedLink>
```

Keep the surrounding copy identical (translation keys match on exact strings).

**Verify**: `grep -n 'href="/privacidade"' src/components/ConsentNotice.jsx` → no matches.

### Step 4: Fix the footer links

Replace the three `href="#"` anchors in `src/components/Footer.jsx` bottom bar with `LocalizedLink to="/privacy" | "/cookies" | "/terms"`, preserving the inline style object.

**Verify**: `grep -c 'href="#"' src/components/Footer.jsx` → 0.

### Step 5: PT translations

Add PT dict keys in `TranslationLayer.jsx` for every new user-visible EN string on the legal pages (headings + section titles at minimum; body paragraphs too — the dict matches whole text nodes, so keep paragraphs as single strings and translate each). Alternatively author the legal pages bilingually in-component keyed off `getLangFromPath(location.pathname)` — choose ONE approach; the dict approach is the repo convention.

**Verify**: run dev, open `/#/pt/privacidade` — headings render in PT; `npm test` (if 001 landed) → green.

## Test plan

If 001 landed: extend `src/App.test.jsx` with a route assertion for `/en/privacy` (page heading appears). Otherwise manual: all three pages reachable from footer, banner link navigates in-SPA (no full reload — URL stays `/#/…`).

## Done criteria

- [ ] `/#/en/privacy`, `/#/en/cookies`, `/#/en/terms`, `/#/pt/privacidade` all render real pages
- [ ] No `href="#"` left in Footer; ConsentNotice uses LocalizedLink
- [ ] `TODO: legal review` marker present in the legal page file
- [ ] Build + lint (+ tests if present) exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- `routesFor` in App.jsx no longer matches the excerpt (routing refactor landed).
- The operator has real legal copy — STOP and ask for it rather than shipping placeholders silently.

## Maintenance notes

- Replace placeholder copy after legal review; the `TODO` marker is the tracker.
- If cookie usage changes (analytics added — see plan 012/roadmap), the cookies page must be updated in the same PR.
