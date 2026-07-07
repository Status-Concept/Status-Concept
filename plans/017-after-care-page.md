# Plan 017: Build the real After Care page (replace the "coming soon" placeholder)

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/App.jsx src/pages/status-concept-homepage.jsx src/components/TranslationLayer.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P2 (direction — highest-confidence product gap)
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none (003's Placeholder-replacement pattern is a useful reference)
- **Category**: direction
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

After Care (seasonal cleaning, maintenance, winter storage) is the brand's stated differentiator — it is woven through the homepage copy, is a selectable enquiry interest, and has THREE live CTAs pointing at `/after-care`… which renders a "coming soon" placeholder. The most motivated clicks on the site currently dead-end. A real page converts that intent into enquiries tagged `after_care`, and it is a retention/CLV product, not a one-off sale.

## Current state

- `src/App.jsx:39` — `<Route path={`${prefix}/after-care`} element={<Placeholder title="After Care & Valet Service" subtitle="Seasonal care, cleaning and maintenance for your outdoor furniture. Full details coming soon." />} />`.
- Live CTAs → `/after-care`: homepage banner `See the After Care plans` (`status-concept-homepage.jsx:97`), footer `After Care` link (`Footer.jsx` ROUTES), mobile menu entry (`MobileMenu.jsx:24`).
- Enquiry form already has interest option `After Care Service` (`status-concept-contact.jsx:65` options list) and accepts router-state prefill: navigating with `state={{ interest: 'After Care Service' }}` pre-selects it (see `enquireState` pattern in `status-concept-product-detail.jsx:102` and the `useEffect` prefill in contact page).
- Page conventions: `Layout` wrapper, hero section (`rd-page-hero` with `rd-hero-img`, `rd-hero-inner`, `rd-kicker fs`, `rd-title ff`, `rd-lede fs` — see `status-concept-favorites.jsx:36-46` for the minimal hero), sections `rd-section`, CTA buttons `.cb .cg`/`.cb .cd`, links via `LocalizedLink`.
- Brand voice (from existing copy): quiet luxury, concrete and unhyped — e.g. "Delivered. Then looked after.", "so the terrace is ready the day you arrive, not a project when you do."
- KNOWN FACTS about the service usable in copy (from existing site copy ONLY — do not invent): seasonal cleaning; maintenance; winter care; performed by the company's own team; serves Algarve homes (Vale do Lobo, Quinta do Lago, Vilamoura, Tavira); "keeps every piece as it arrived". NO pricing, NO named tiers exist anywhere — pricing/tier specifics MUST NOT be invented.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm test` | pass |

## Scope

**In scope**:
- `src/pages/status-concept-aftercare.jsx` (create)
- `src/App.jsx` (swap the placeholder route for the real page)
- `src/components/TranslationLayer.jsx` (PT keys for every new string)

**Out of scope**:
- Pricing, plan tiers, or service commitments not present in existing copy — the page describes the service and drives to an enquiry, nothing more.
- New imagery generation (reuse existing assets: pick a fitting image already in `src/assets/images/` — e.g. a showroom/lifestyle shot already imported elsewhere).

## Git workflow

- Branch `loop`; one commit: `Build the After Care page; retire the placeholder route`.

## Steps

### Step 1: The page

`src/pages/status-concept-aftercare.jsx`, default export, structure:
1. Hero (`rd-page-hero`): kicker `After Care & Valet Service`; title `Delivered. Then looked after.` (reuses the exact homepage banner line — its PT key already exists); lede: the existing homepage sentence "Seasonal cleaning, maintenance and winter care by our own team — so the terrace is ready the day you arrive, not a project when you do." (PT key exists).
2. "What it covers" section — three cards (reuse `rd-section` + a simple grid): Seasonal cleaning / Maintenance & repairs / Winter care & storage. 1-2 sentences each, grounded in the known facts (no specifics beyond them).
3. "How it works" — three numbered steps: We visit and assess → You get a care proposal → Your pieces are looked after each season. Keep generic-but-honest; no response-time or pricing promises.
4. CTA section: primary `LocalizedLink className="cb cg"` → `/contact` with `state={{ interest: 'After Care Service' }}`, label `Request After Care`; secondary `.cb .cd` → `/contact`, label `Book a showroom visit` (PT key exists).

**Verify**: `npm run lint` → 0.

### Step 2: Route it

In `src/App.jsx`: add `const AfterCare = lazy(() => import('./pages/status-concept-aftercare'))` and replace the `/after-care` Placeholder route element with `<AfterCare />`. Leave the Placeholder component in place (gallery/catalogue still use it).

**Verify**: `npm run build` → 0; `/#/en/after-care` renders the new page; homepage banner CTA lands on it.

### Step 3: PT keys

Add a `pt` dict entry for EVERY new visible EN string introduced in Step 1 (section headings, card titles, card bodies, step labels, `Request After Care`). Reuse existing keys where the string is identical — do not duplicate keys.

**Verify**: `/#/pt/after-care` fully in PT except brand terms; `npm test` green.

### Step 4: Enquiry prefill check

Click `Request After Care` → contact page shows interest pre-selected as `After Care Service` (PT: `Serviço After Care`).

**Verify**: manual check on EN and PT.

## Test plan

If 001 landed, add to `App.test.jsx`: `/en/after-care` renders heading `Delivered. Then looked after.`.

## Done criteria

- [ ] `/after-care` renders a real page in EN and PT; placeholder gone from that route
- [ ] CTA prefills the enquiry interest
- [ ] No invented pricing/tiers/claims (reviewer check)
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- The operator supplies real After Care service details/tiers — STOP and incorporate them instead of the grounded-generic copy.
- The contact form's interest prefill mechanism changed (drift in contact.jsx).

## Maintenance notes

- When real plan tiers/pricing exist, this page gets a pricing section — deliberately deferred.
- Enquiries from this page arrive with `source: "contact_page"` unless a `source` is threaded through state — acceptable now; plan 018's status model may formalize it.
