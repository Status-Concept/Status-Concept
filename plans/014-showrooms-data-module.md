# Plan 014: Single source of truth for showroom contact data

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/components/Header.jsx src/components/Footer.jsx src/pages/status-concept-contact.jsx src/pages/status-concept-homepage.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: LOW
- **Depends on**: 001 (smoke tests), ideally after 011 (absorbs the WhatsApp constant)
- **Category**: tech-debt
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

Showroom addresses, phone numbers, hours, and map links are duplicated ~38 times across 6 files. A phone-number or opening-hours change today requires synchronized edits in Header, Footer, contact, homepage, projects and the translation dict — guaranteed drift. One data module ends that.

## Current state

Verified duplication sites (spot-check before editing):
- `src/components/Header.jsx:54-56` — `tel:+351289030179` and `mailto:info@statusconcept.com`.
- `src/components/Footer.jsx` — contact column: `Showroom Quinta do Lago`, `Showroom Almancil`, `+351 289 030 179`, `info@statusconcept.com` with `ROUTES` map entries (`tel:`/`mailto:`).
- `src/pages/status-concept-contact.jsx` — two showroom cards with addresses `Estr. Quinta do Lago-Vale do Lobo, 8135-106 Almancil` and `Avenida 5 de Outubro 298, 8135-103 Almancil`, GPS strings, phone `+351 289 030 179`, WhatsApp `https://wa.me/351937573600`, hours.
- `src/pages/status-concept-homepage.jsx` — showroom section: same two addresses + hours `Mon – Sat / 09:30 – 18:00 / Sunday / Closed` + Google Maps links (`s.maps`).
- `index.html` — JSON-LD block with both showrooms' PostalAddress/GeoCoordinates/openingHours (`Mo-Sa 09:30-18:00`). KEEP IN SYNC but do not templatize (it's static HTML).
- `src/utils/whatsapp.js` — WhatsApp number constant (exists only if plan 011 landed).

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Tests | `npm test` | pass |
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |

## Scope

**In scope**:
- `src/data/showrooms.js` (create)
- The four JSX consumers above (replace literals with imports)
- `src/utils/whatsapp.js` (import the number from the new module, if 011 landed)

**Out of scope**:
- `index.html` JSON-LD (static; add a comment in showrooms.js: "mirrored in index.html JSON-LD — update both").
- `TranslationLayer.jsx` dict entries for address strings (addresses are `data-no-translate` candidates but leave translation behavior unchanged in this plan).
- Visual changes of any kind.

## Git workflow

- Branch `loop`; one commit: `Extract showrooms data module; consume everywhere`.

## Steps

### Step 1: Create the module

`src/data/showrooms.js` — capture EXACTLY the strings currently rendered (copy from the files, don't retype):

```js
// Canonical showroom/contact data. NOTE: mirrored in index.html JSON-LD — update both.
export const CONTACT = {
  phone: '+351 289 030 179',
  phoneHref: 'tel:+351289030179',
  email: 'info@statusconcept.com',
  whatsapp: '351937573600',
}

export const SHOWROOMS = [
  {
    key: 'quinta-do-lago',
    name: 'Quinta do Lago',
    address: 'Estr. Quinta do Lago-Vale do Lobo, 8135-106 Almancil',
    maps: '<copy the exact maps URL from homepage>',
    hours: [['Mon – Sat', '09:30 – 18:00'], ['Sunday', 'Closed']],
  },
  {
    key: 'almancil',
    name: 'Almancil',
    address: 'Avenida 5 de Outubro 298, 8135-103 Almancil',
    maps: '<exact URL>',
    hours: [['Mon – Sat', '09:30 – 18:00'], ['Sunday', 'Closed']],
  },
]
```

Fill every `<…>` from the live code, byte-for-byte.

**Verify**: `npm run lint` → 0.

### Step 2: Migrate consumers one file at a time

Order: Header → Footer → contact → homepage. In each, import from `../data/showrooms` (adjust relative path) and replace the literal strings/hrefs. The RENDERED OUTPUT MUST BE BYTE-IDENTICAL — the translation layer matches exact strings, so any drift in whitespace or punctuation breaks PT rendering.

**Verify after EACH file**: `npm run build` → 0; dev-server spot check the page; `npm test` green. For PT: `/#/pt` still translates the surrounding labels (addresses themselves were never translated).

### Step 3: Duplication sweep

`grep -rn "289 030 179\|8135-106\|8135-103\|statusconcept.com" src/ --include="*.jsx"` → every remaining hit should be either a consumer importing the module (no literals) or a deliberate leftover documented in the commit message (e.g. TranslationLayer keys). Target: 0 literal duplicates in JSX.

**Verify**: grep output clean.

## Test plan

Existing smoke tests; plus one assertion if convenient: contact page renders `CONTACT.phone` (import the module in the test to avoid hardcoding).

## Done criteria

- [ ] `src/data/showrooms.js` exists; all four consumers import it
- [ ] Zero literal phone/address duplicates in JSX (grep)
- [ ] Rendered pages byte-identical (PT translation intact)
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- Any consumer renders a VARIANT of the address (different punctuation) — do not normalize silently; keep both variants rendering as-is and report the discrepancy (normalizing changes translation-layer behavior and JSON-LD consistency).

## Maintenance notes

- Future contact-info changes: edit `showrooms.js` + `index.html` JSON-LD. Consider a build-time JSON-LD generator later (deferred).
