# Plan 011: WhatsApp deep-links that carry product/shortlist context

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/pages/status-concept-product-detail.jsx src/pages/status-concept-favorites.jsx src/pages/status-concept-contact.jsx src/components/TranslationLayer.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

WhatsApp is the dominant high-intent contact channel in the Portuguese market, and the site already knows exactly which product (or shortlist) the visitor is looking at — but its only WhatsApp link is a generic one on the contact page. Adding an "Enquire on WhatsApp" action on the product detail page and the favorites bar converts a browse into a threaded conversation with the showroom with zero form friction. Cheapest possible lift on the primary business goal.

## Current state

- WhatsApp number in use: `https://wa.me/351937573600` — appears in `src/pages/status-concept-contact.jsx` (success panel and error banner, `data-no-translate` links) and a generic prefilled variant `?text="Hello STATVS, I'd like to enquire about"` around `contact.jsx:114`.
- `src/pages/status-concept-product-detail.jsx` — already computes `const enquireState = { product: product.name, interest: … }` (~line 102) and renders CTA links `Request a proposal` / `Book a showroom visit` (`LocalizedLink className="cb cg|cb cd" to="/contact" state={enquireState}`) around lines 273-274 and 331.
- `src/pages/status-concept-favorites.jsx` — sticky bar (~line 96-101): count + `<LocalizedLink className="cb cg" to="/contact" state={{ shortlist: favorites.map(f => f.name || f.id) }}>Request a proposal for these</LocalizedLink>`.
- Button classes: `.cb` base + `.cg` (dark) / `.cd` (outline) — defined in `src/index.css:1587-1614`.
- Translation: new EN strings need PT keys in `TranslationLayer.jsx` (`pt` dict).

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm test` | pass |

## Scope

**In scope**:
- `src/utils/whatsapp.js` (create — one helper)
- `src/pages/status-concept-product-detail.jsx` (one new CTA)
- `src/pages/status-concept-favorites.jsx` (one new CTA)
- `src/components/TranslationLayer.jsx` (PT keys)

**Out of scope**:
- The contact page's existing WhatsApp links (fine as-is).
- WhatsApp Business API integration; this is plain `wa.me` deep links.
- Changing the existing proposal CTAs.

## Git workflow

- Branch `loop`; one commit: `Add WhatsApp enquiry links with product/shortlist context`.

## Steps

### Step 1: Helper

Create `src/utils/whatsapp.js`:

```js
const WHATSAPP_NUMBER = '351937573600'

export function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
```

**Verify**: `npm run lint` → 0.

### Step 2: Product detail CTA

Next to the existing CTA pair (~line 273-274), add a third action styled as the outline variant:

```jsx
<a className="cb cd" href={whatsappUrl(`Hello STATVS, I'm interested in the ${product.name}.`)} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
```

The product name inside the message is data — the whole message goes through `encodeURIComponent` in the helper. Mark the anchor `data-no-translate`? NO — the label "WhatsApp us" should translate; instead ensure the translation dict never contains a key equal to "WhatsApp us"'s PT value colliding elsewhere (it won't). Add the label `'WhatsApp us': 'Fale connosco no WhatsApp'` to the `pt` dict.

**Verify**: dev server, product page → the link's `href` contains the URL-encoded product name; opens WhatsApp web/app in a new tab.

### Step 3: Favorites shortlist CTA

In the sticky bar next to "Request a proposal for these", add:

```jsx
<a className="cb cd" href={whatsappUrl(`Hello STATVS, I'd like a proposal for: ${favorites.map((f) => f.name || f.id).join(', ')}.`)} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
```

Cap the message: if the joined list exceeds ~600 characters, truncate the list at the last full name that fits and append ` and ${n} more`.

**Verify**: with 2 favorites, the href contains both names encoded; with many favorites, the message stays ≤ ~700 chars.

### Step 4: PT sweep

`/#/pt` product page and favorites: the button reads "Fale connosco no WhatsApp"; message content (product names) stays as-is (data, not translated).

**Verify**: manual check.

## Test plan

If 001 landed, add `src/utils/whatsapp.test.js`: `whatsappUrl('a b?&')` → contains `text=a%20b%3F%26`; truncation behavior if implemented as a helper function (prefer putting the truncation logic in the helper as `whatsappShortlistMessage(names)` so it is unit-testable).

## Done criteria

- [ ] Helper exists and is unit-tested (if 001 landed)
- [ ] Product detail + favorites both expose contextual WhatsApp links opening in a new tab
- [ ] PT label present
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- The CTA blocks in Current state no longer exist (drift).
- Layout breaks with a third button on mobile widths (<420px) — if a one-line CSS fix (flex-wrap) doesn't solve it, report with a screenshot instead of redesigning the CTA row.

## Maintenance notes

- If the showroom's WhatsApp number changes, it now lives in exactly one place (`src/utils/whatsapp.js`) — plan 014 (showrooms data module) may later absorb it.
