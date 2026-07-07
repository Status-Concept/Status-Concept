# STATVS — Site Improvement Research (Marketing + UI/Design)

**Subject:** the Status-Concept redesign (Vite + React, clean-white quiet-luxury build) — how to make it better.
**Date:** 6 July 2026
**Method:** Nine parallel research streams (Fable 5), each applying a dedicated skill against the *current* source code: CRO, SEO/AEO (delta vs. the 2 July research), copywriting, marketing psychology, analytics & experimentation, UX/UI (impeccable), high-end visual design, micro-interaction polish (design engineering), and anti-generic distinctiveness. Findings are tagged **[Observed]** (verified in code, with file:line evidence) vs **[Inferred]** (expert judgement). This report *builds on* `STATVS-Marketing-Research.md` (2 Jul) and `STATVS-Routing-SEO-Migration-Plan.md` — it does not repeat them.

---

## Executive summary

The redesign has crossed the line from broken to working: the enquiry funnel is real (form → Supabase, tappable tel/WhatsApp/mail, directions), the copy spine holds a consistent quiet-luxury voice, the design system has genuine assets (warm-neutral palette, bronze accent, expo easing, hairline dividers, above-average a11y scaffolding). Nine independent audits agree on what stands between this and a great site:

1. **🚨 The "No image" rule is the single biggest self-inflicted wound — every audit found it independently.** 134–184 of 218 products (61%+ of the catalogue, including **100% of the flagship Glatz shade category**) render a blank white square *while their photos sit on disk*, and the detail pages happily show full galleries the grid claims don't exist. CRO calls it a category→detail CTR collapse; psychology calls it evaluability poison ("phantom inventory"); SEO calls it catalogue blindness for image search and AI shopping agents; design calls it an apology repeated 184 times. **Consensus fix:** use the white-background classifier to pick *which* photo leads — never *whether* one shows (a near-one-line change); redesign the placeholder as a brand moment (tone-on-tone serif monogram + "See it in the showroom") for the genuinely imageless few; batch background-removal later to earn the uniform studio look properly.

2. **🚨 The auto-advancing category carousel on /products should become a static grid.** It's the landing's only navigation and it moves under the user's cursor every 5s, offers no pause/arrows/swipe (WCAG 2.2.2 failure), shows mobile users one tile per 5 seconds, and double-lists categories for keyboard users. Five categories fit one static row. (Multiple audits; the carousel *mechanism* — container-query responsive tiles — is well built; the auto-advance is the problem.)

3. **Three conversion bridges are each one parameter from done:** product detail → contact form (context still dropped), favourites → "Request quote for all" (navigates with no payload), compare → public route (currently ambushes anonymous users with a login wall). Plus: the contact form **reports success even when submission fails** (the mailto fallback sets "sent" unconditionally) — a P0 correctness bug.

4. **Accessibility has two cheap, wide P0s:** bronze `#8a7658` text on white computes to 4.36:1 and `--text-grey #8b867b` to 3.62:1 — both fail WCAG AA for the body-size text they carry (fix: use `--accent-hover #6f5e44` for text). And the closed mobile menu stays in the tab order (needs `inert`/`visibility`), with an unnamed hamburger button.

5. **The design is "premium template", one move from "commissioned build".** The consensus highest-leverage upgrade: **promote Cormorant Garamond from logo-only to display headings** — it's already loaded, it rhymes every headline with the logotype, and it's the register the category leaders use. Supporting moves: kill two leftover crimson values (`rgba(196,30,58,…)` at index.css:776, 1947), unify shadows/easings onto the existing tokens, image fade-on-load, button press states, and ration the kicker+divider formula (53 instances) so the owned assets — the Roman serif, the bronze A, the coordinates, After Care — do the talking.

6. **Measurement is at zero.** No analytics of any kind. The GA4 plan (consent-gated via the existing banner, HashRouter-aware manual page_views, `has_image` as a custom dimension) turns the No-image debate into data within weeks, and the Supabase `enquiries` table is already the lead source of truth.

7. **PT is half a site.** The dictionary's public strings are correct and courteous, but coverage collapses off the homepage (Contact/About/Projects/Glatz bodies are EN), and the client area speaks unaccented informal "tu" to a customer the marketing site treats as "o senhor". One brand, two registers.

**If only five things get done:** (1) kill the No-image gate and ship best-available photos; (2) static category grid; (3) finish the three conversion bridges + fix the false-success bug; (4) fix the two contrast tokens + crimson remnants; (5) promote the serif to display headings. All are hours-to-days, none waits on the routing migration.

---

## Contents

1. **CRO — Conversion Audit** (current funnel, No-image impact, remaining bridges)
2. **SEO & AI Search — Delta Audit** (new IA vs. keywords, link graph, pre-migration quick wins)
3. **Copy & Messaging — Second-Pass Review** (grades, register breaks, 15 rewrites EN+PT)
4. **Marketing Psychology — Persuasion Audit** (12 interventions, luxury-specific do/don't)
5. **Analytics & Experimentation — Measurement Plan** (GA4 taxonomy, KPI tree, honest test roadmap)
6. **UX/UI Audit — Structure, States & Accessibility** (IA parity, states, WCAG, carousel verdict)
7. **Visual Design — High-End Grade & Upgrades** (typography, color, imagery art direction, 10 upgrades)
8. **Polish & Micro-interactions — The Details Pass** (15 ranked feel improvements)
9. **Distinctiveness — Beyond Tasteful-Generic** (templated patterns, brand DNA, signature moments)
10. **Master Action List** (cross-referenced, sequenced)

---

---

## CRO — Conversion Audit (current build)

**Scope.** Fresh audit of the rebuilt funnel — *landing → category → product card → product detail → enquiry* — against the 2 July research. Claims tagged [Observed] (verified in `Status-Concept/src/`) or [Inferred]. Priorities: P0 = fix before/at launch, P1 = 0–4 weeks, P2 = after.

### What shipped since the last audit (credit where due)

The launch-blocking funnel defects are genuinely fixed. The enquiry form now submits — Supabase `enquiries` insert with a `mailto:` fallback so no lead is ever silently lost, a proper success state ("replies within one business day", tel + WhatsApp escape hatches), disabled-until-valid submit, and privacy/response-time microcopy under the button [Observed, `status-concept-contact.jsx`]. Every contact surface is now tappable: `tel:` in the header, `tel:`/`mailto:` in the footer, and the contact page's quick cards are real `tel:` / `wa.me/351937573600` (pre-filled text) / `mailto:` / Google Maps directions links; the map placeholder is gone, replaced by "Get directions →" cards per showroom [Observed]. The homepage hero now carries a real value proposition ("The Algarve's outdoor rooms, furnished and cared for") with a primary commitment CTA ("Book a showroom visit") and the After Care positioning in the subhead [Observed, `status-concept-homepage.jsx`]. The site has moved from ~0% mechanical conversion to a working funnel. What follows is about how much of that funnel now leaks.

### (a) P0 — The "No image" placeholder is the new biggest conversion problem

**What the code does.** `productImageStatus.js` lists 184 product ids whose main photo was auto-classified (by `scripts/classify-white-bg.mjs`) as not a clean white-background shot. On the products page these render a flat white square reading "NO IMAGE" and are force-sorted to the bottom of every category — the sort override beats both "Featured" and "Name" [Observed, `status-concept-products.jsx:26,132–139`, `index.css .rd-no-image`]. Kitchen is exempted (`product.category === "kitchen"` always shows its image).

**The verified arithmetic** (218 products = 1 Sicily + 21 Glatz + 50 kitchen + 146 catalog [Observed]):

| Category | Products | Rendering "No image" |
|---|---|---|
| Shade (incl. all 21 Glatz) | 44 | **44 — 100%** |
| Lounge | 51 | 42 |
| Dining | 52 | 33 |
| Sun loungers | 21 | 14 |
| Kitchen (exempt) | 50 | 0 |

So **134 of 218 grid cards (61%) are blank white squares**, and the **Shade category — the Glatz flagship the brand is exclusive on — shows zero product photography** [Observed]. Three aggravating facts: (1) the images *exist* — every catalog product has a populated `images` array and the Glatz folders hold 8+ shots each (`public/product-images/glatz/sombrano-s-plus/01–08.webp`) [Observed]; this is a presentation-layer aesthetic rule, not missing assets. (2) The product detail page ignores `noImageProducts` entirely and shows the full gallery [Observed] — so a card that says "No image" opens to a page full of images, which reads as a site error, not curation. (3) The category *banners* use these same "rejected" lifestyle photos (`shadeHeroImg = /product-images/glatz/ambiente-nova/01.webp`) [Observed] — the rule contradicts itself on the same page.

**Conversion impact [Inferred].** For a visual, considered purchase, the product image is the click decision. A grid that is 61% blank doesn't read as "photography pending" — it reads as *out of stock / abandoned site*, the single worst signal a luxury storefront can send. Expect: category→detail CTR collapse for affected items (they're both imageless *and* buried last), Shade — a primary commercial category and top SEO target — converting near zero, and brand-trust damage that bleeds into the products that *do* have photos. This likely gives back much of the conversion the form fixes earned.

**Options, honestly weighed:**

1. **Show the real image, drop the white-background rule (recommended, P0, ~1 line).** Lifestyle shots on cards are not a defect — Dedon, Tribù, Gloster all mix cutout and in-situ photography. Uniformity can be recovered with CSS (`object-fit: cover`, fixed 1:1, subtle neutral backdrop for `contain` items). Tradeoff: the grid loses the strict "studio catalog" look. That is a small aesthetic tax against a 61%-blank grid.
2. **Auto-process the photos** (background removal via `rembg`/Photoroom-class API at build time; the classifier script already exists as a pipeline hook). Gets the intended aesthetic and keeps all 218 visible. Tradeoff: batch cost/effort, some cutouts will be imperfect on complex furniture silhouettes; needs QA on ~134 items.
3. **Curate the catalog down** to the ~84 image-ready products and genuinely remove the rest. Coherent for a "quiet luxury" edit. Tradeoff: deletes most of the long-tail SEO/browse surface, and Shade would shrink to zero until Glatz photos are processed — not viable for the flagship brand.
4. **Status quo minimum-fix**: if the rule must stay short-term, at least (a) never show "NO IMAGE" text — use the product's real photo blurred/desaturated or a category line-drawing; (b) exempt Glatz like kitchen is exempted; (c) stop force-sorting them last so "Featured" means featured. This is triage, not a solution.

**Recommendation:** Option 1 now (ship this week), Option 2 as the follow-up to earn the uniform look properly. Expected impact: recovers the majority of category→detail clickthrough on 4 of 5 categories; highest-leverage single change in this audit.

### (b) P0/P1 — Known gaps still open (verified unfixed)

1. **"Request quote" still drops all product context (P0).** Detail-page "Request quote"/"Book showroom" call `goTo("/contact")` with no state; the contact page reads neither query params nor `location.state`, and the size selector is still render-only (first option hardcoded as selected, clicks not stored) [Observed, `status-concept-product-detail.jsx:250–272`, `status-concept-contact.jsx:13`]. The Supabase payload has no product field [Observed]. The visitor must re-type "Sombrano S+ 350×350" into an empty textarea — the highest-anxiety field on the form. Fix: pass `?product=`+SKU, pre-fill Interest + message, retitle the form ("Enquire about Sombrano S+"), store size selection. Expected impact: 20–40% lift on product-referred enquiry completion [Inferred]; also makes leads actionable for the showroom.
2. **Favourites bridge is half-built (P0).** A sticky "Request quote for all" bar now exists on `/favorites` [Observed — progress], but it navigates to `/contact` with **no payload**: the shortlist never reaches the form or the database [Observed, `status-concept-favorites.jsx:101`]. One parameter away from being the site's best conversion mechanic; today it asks the highest-intent visitor to remember their list.
3. **Compare hits a login wall (new, P0).** The public ComparePill routes to `/cliente/comparador`, which sits behind `ProtectedRoute` → redirect to `/login` [Observed, `ComparePill.jsx:17`, `App.jsx:44–56`]. An anonymous visitor who builds a comparison is ambushed by authentication — and the pill's label is hardcoded Portuguese ("Comparar") on the English site [Observed]. The compare page itself offers only Excel export, no enquiry CTA [Observed]. Fix: public compare route + "Send this comparison to the showroom" CTA.
4. **Zero proof anywhere (P1).** No testimonials, reviews, partner-logo row, or homepage projects strip exist in the codebase [Observed — grep confirms no testimonial/review markup]. Glatz/Draco appear only as marquee text. For €10k+ purchases, three attributed quotes near the form plus a Glatz/Draco/Sunbrella logo row is the cheapest trust win available [Inferred].
5. **Newsletter is still a dead form (P1).** `onSubmit={(e)=>e.preventDefault()}`, no state, no handler [Observed, homepage:158]. Either wire it to a `subscribers` table (the enquiries pattern is right there) or remove the section — a silent form teaches visitors the site's forms don't work, right before you ask them to trust the enquiry form [Inferred].
6. **After Care banner still lands on a "coming soon" placeholder (P1)** [Observed, `App.jsx:39`] — the homepage's differentiator CTA dead-ends. Gallery and Catalogue links likewise.
7. **Still no analytics (P1).** No gtag/Plausible/PostHog anywhere [Observed]. Every claim above is unmeasurable until form starts/completions, quote-CTA clicks, tel/WhatsApp taps, and no-image-card impressions are instrumented.

### (c) P1/P2 — Issues introduced by the redesign

- **The category landing adds a click without adding a decision aid (P1).** `/products` is now a banner + auto-advancing carousel of 5 tiles; there is no "all products" view [Observed]. The nav dropdown mercifully deep-links to `?cat=` [Observed, `Header.jsx:7–14`], but organic/direct arrivals to `/products` face: 5 choices, sliding sideways every 5s. **Auto-advance on clickable tiles is the real problem** — the target moves under the cursor mid-decision; carousels auto-rotate *content*, not *navigation* [Inferred]. All five categories fit one static row on desktop. Fix: static grid (keep the carousel only under ~560px if at all), pause on hover at minimum. `prefers-reduced-motion` is respected — good [Observed].
- **Forced sort undermines the toolbar (P2).** "Featured"/"Name" sorting silently applies only within the has-image group [Observed] — a Glatz shopper sorting by name gets an order that ignores it. Resolved automatically by fixing (a).
- **Empty-state copy isn't actionable (P2).** "No pieces in this category yet. Contact the showroom." is plain text, not a link [Observed].
- **Category landing has no enquiry path (P2).** The landing and category views never mention the showroom, WhatsApp, or a consultation — the only CTAs are product cards. A quiet "Not sure where to start? Talk to the showroom" line under the grid gives non-browsers an exit that converts [Inferred].

### Priority summary

| # | Action | Priority | Expected impact |
|---|---|---|---|
| 1 | Kill "No image": show real photos (Opt 1), then background-process (Opt 2) | **P0** | Restores category→detail CTR on 61% of catalog; Shade from 0 images to full |
| 2 | Carry product/size context into contact form + payload | **P0** | +20–40% product-referred completion [Inferred] |
| 3 | Attach favourites payload to "Request quote for all" | **P0** | Activates highest-intent funnel |
| 4 | Public compare route + enquiry CTA; fix PT pill label | **P0** | Removes login ambush |
| 5 | Proof layer: partner logos + 3 testimonials near form | P1 | Trust for high-ticket [Inferred] |
| 6 | Wire or remove newsletter; ship real After Care page | P1 | Stops credibility leaks |
| 7 | Static category grid; stop auto-advancing nav tiles | P1 | Faster, calmer category entry |
| 8 | Instrument the funnel (form starts/sends, CTA and tel/wa taps) | P1 | Makes everything above testable |
| 9 | Honest sort, linked empty states, category-page enquiry line | P2 | Marginal, cumulative |

**Bottom line.** The engine now runs — form, tappable contact, directions are all real [Observed]. But the redesign traded its shop window for a wall of white squares: 134 of 218 products, including 100% of the flagship Glatz category, display "No image" while their photos sit on disk. Fix that, then finish the three one-parameter bridges (product→form, favourites→form, compare→public), and the site finally converts at the rate its traffic deserves.

---

## SEO & AI Search — Delta Audit

**Scope:** what changed since the 2 July research (§1–§2 of `STATVS-Marketing-Research.md`) — the new Products IA, the reworked page heroes, `public/robots.txt`, and the "No image" placeholder system. The rendering architecture itself is unchanged and already has its own plan (`STATVS-Routing-SEO-Migration-Plan.md`): still `HashRouter` in `src/main.jsx`, still one static `<title>` in `index.html`, no meta description, no sitemap, no JSON-LD [Observed]. Everything below is about making the *content* SEO-correct so the migration pays off on day one — none of it replaces that plan.

### (a) The new IA vs. the money keywords — right shelves, wrong addresses

The nav dropdown (`Header.jsx` `PRODUCT_LINKS`) now exposes six category destinations [Observed]:

| Nav label | URL | Target money keyword | Verdict |
|---|---|---|---|
| Lounge | `/products?cat=lounge` | outdoor sofa/lounge sets Algarve | Right split, wrong URL type |
| Dining | `/products?cat=dining` | outdoor dining sets Algarve | Same |
| Sun Loungers & Day Beds | `/products?cat=sunlounger` | sunloungers Algarve | Same |
| Shade Solutions | `/products?cat=shade` | shade/pergolas — **split intent, see below** | Weak |
| Glatz Parasols | `/glatz-parasols` | glatz parasols portugal | **Best mapping on the site** — dedicated path URL, dedicated page |
| Outdoor Kitchens | `/products?cat=kitchen` | outdoor kitchen algarve | High-value keyword parked on a filter state |

Two structural problems [Observed → Inferred impact]:

1. **Five of six categories are query-string states of one route.** `?cat=` URLs are prerenderable in principle, but they canonicalize poorly, look like filters (not pages) to Google, and the migration plan's route manifest becomes awkward. Worse, `status-concept-products.jsx` accepts alias params (`?cat=daybed|coffee|side|bar|puffs` remap client-side), and `MobileMenu.jsx`/`Footer.jsx` actively link to them — so the same Dining grid will exist at `?cat=dining`, `?cat=coffee`, and `?cat=side`: pre-built duplicate content. **P0 (do during migration, decide now):** promote categories to path URLs (`/products/dining`), 301/canonicalize the aliases, and put the six paths in the sitemap manifest.
2. **Nav labels promise pages that don't exist.** The footer and mobile menu link "Bioclimatic Pergolas" and "Retractable Pergolas" to `?cat=shade` — where **zero pergola products exist** (the shade grid is 100% Glatz parasols, all currently rendered as "No image", see §c) [Observed]. Same pattern: "Pizza Ovens" / "BBQ Systems" → `?cat=kitchen`. Missing landing pages, in keyword-value order: **outdoor kitchens/Draco page** (the research's §2.3 P0 — "outdoor kitchen algarve" deserves a `/outdoor-kitchens` page mirroring the Glatz template, not a grid filter), **bioclimatic pergolas** (either build the page with real product/partner content or drop the label — a nav promise with no inventory hurts trust and AI citability), **After Care** (still a "coming soon" placeholder route [Observed], despite being the positioning moat), per-project URLs, and the trade page. **P1.**

The category `copy` strings (one sentence each, e.g. "Glatz parasols, bioclimatic pergolas and retractable systems…") are a good seed but thin [Observed]. Each category needs ~100–200 words of intro copy with geo modifiers — write it now, it prerenders later. **P1.**

### (b) On-page readiness — good bones, invisible link graph

**Improved since the research:** homepage H1 is now "The Algarve's outdoor rooms, furnished and cared for." — geo + category signal *and* the After Care positioning, a genuine upgrade over "Where Design Meets the Sun" [Observed]. Header phone/email are now real `tel:`/`mailto:` links [Observed]. One H1 per page everywhere; hierarchy is clean (H1 → H2 → product-card H3s). PT dictionary diacritics are correct (`mobiliário`, `exterior`) [Observed].

**Still to fix before prerender ships:**

- **H1s are label-grade, not keyword-grade** [Observed]: category H1s are bare ("Lounge", "Dining", "Modular Kitchen"); Glatz is "Glatz Parasols" (no Portugal/Algarve); Contact is "Visit, call or start a proposal" (no showroom/geo); About is "Outdoor excellence since 2013". Follow §1.3 of the research's templates — e.g. "Glatz Parasols — Algarve Showroom & Stockist", "Outdoor Lounge Furniture for the Algarve". **P1, cheap.**
- **The internal link graph is almost entirely non-crawlable** [Observed]. The dropdown items are `<button onClick>`; the top-nav "Projects / Showrooms / Contact" are `<a href="#">` intercepted by `useNavLinks.jsx` (which matches on *link text* — a fragility that PT translation will break); every homepage CTA is `<a href="#" onClick>`; and **product cards are `<article role="link">` with no anchor at all** (`status-concept-products.jsx:229`). The day prerendering ships, crawlers would discover pages only through the footer, and all ~218 product-detail URLs would be near-orphans reachable only via sitemap. **P0 prep:** convert nav, dropdown, CTAs and product cards to real `<a href={withLang(path)}>` (keep `onClick`+`preventDefault` for SPA behaviour — the footer already implements exactly this pattern at `Footer.jsx:53-58`). This is shippable today with zero visual change.
- **Hero/alt texts:** the new image-only heroes ship `alt=""` on About/Contact/Projects and the products banner [Observed]. With the H1 now below the image that's semantically survivable, but these heroes are showroom/project photography — meaning-bearing. Give them descriptive alts ("STATVS showroom, Quinta do Lago"); keep `alt=""` only for the category-chip thumbnails (correctly decorative). Grid images use `alt={product.name}` — acceptable baseline; detail-page thumbnails are templated ("view 2") — enrich from product data per research T8. **P1.** Add `width`/`height` to prevent CLS. **P2.**

### (c) The "No image" placeholder — self-inflicted catalogue blindness

`productImageStatus.js` flags **184 product ids** whose main shot isn't a clean white-background image; `status-concept-products.jsx:26` exempts kitchens, so **133 of the 218 listed products render a white "No image" square** in the category grids and sort last: lounge 43/51, dining 32/52, sunloungers 14/21, and **shade 44/44 — including all 21 Glatz parasols** [Observed, computed from the data files]. The perverse part: **the photos exist.** Every flagged product has `img`/`images` arrays that render fine on `/glatz-parasols` and on detail pages — a white-background *classifier* is being used as a display *gate*, hiding real lifestyle photography.

Impact once the site is crawlable [Inferred]: (1) **image SEO** — category pages contribute nothing to image search, and the flagship Glatz range ships an entirely imageless shade category; (2) **Product schema** — JSON-LD `image` can still be populated from data, but a Rich-Results product whose landing grid shows "No image" is an eligibility and CTR liability; (3) **AI-answer citability** — answer engines and shopping agents that render or screenshot the page see a store that's 60% empty squares; for "best outdoor furniture Algarve" comparisons an agent will describe (and prefer) competitors whose catalogues visibly exist. It also contradicts the E-E-A-T signal of a curated luxury retailer. **P0 quick win:** change `productHasImage` to fall back to the best *available* image (use the classifier to pick which shot leads, never whether one shows). One-line-ish frontend fix, shippable today.

### (d) Quick wins shippable before the routing migration

| # | Action | Why it works pre-migration | Priority |
|---|---|---|---|
| 1 | Replace the "No image" gate with best-available-photo fallback | Pure frontend; fixes UX today, image SEO later | **P0** |
| 2 | Real `<a href>` for nav/dropdown/CTAs/product cards (footer pattern) | Invisible now, but the link graph is ready the day HTML exists | **P0** |
| 3 | Static `LocalBusiness`/`Organization` JSON-LD + meta description in `index.html` | `index.html` is served for every URL even under HashRouter — crawlers of the bare domain get entity data immediately | **P0** |
| 4 | Ship `public/llms.txt` (brand summary, showrooms, brands, key URLs) | Static files bypass the SPA problem entirely; robots.txt (correctly allowing GPTBot/ClaudeBot/PerplexityBot/Google-Extended [Observed]) proves the pattern works | **P1** |
| 5 | Write category intro copy + keyword-grade H1s (a) & (b) | Content authored now prerenders at migration | **P1** |
| 6 | Decide category URL scheme (`/products/:cat`) and alias 301 map | Zero code today; prevents URL churn mid-migration | **P1** |
| 7 | Build or cut: outdoor-kitchens page, pergolas label, After Care placeholder | Removes broken nav promises; After Care is the moat page | **P1** |
| 8 | Uncomment the robots.txt `Sitemap:` line only when the sitemap ships | Currently commented out — correct as-is [Observed] | **P2** |

**Bottom line:** the new IA is directionally right — Glatz got the dedicated-page treatment every money category deserves — but five of six categories are still filter states, two nav labels point at empty shelves, the crawlable link graph doesn't exist yet, and the placeholder gate blanks out 61% of the catalogue including the entire Glatz range on `/products`. Items 1–3 above cost hours, not days, and none of them wait on the routing migration.

---

## Copy & Messaging — Second-Pass Review

### 1. Grading the first-round rewrites (all shipped, all verified in source) [Observed]

| Shipped copy | Grade | Note |
|---|---|---|
| Hero: "The Algarve's outdoor rooms, furnished and cared for." + subline | **A** | Category + place + differentiator in nine words. The subline's "keeps every piece as it arrived" quietly restates After Care. Keep untouched. |
| Intro: "fabrics that shrug off ten summers of sun, frames that ignore salt air…" | **A** | Best line on the site. PT "resistem a" flattens "shrug off" slightly but "maresia" earns it back. |
| After Care: "Delivered. Then looked after." | **A–** | "…ready the day you arrive, not a project when you do" is exactly the absentee-owner nerve. |
| Footer tagline; "Notes from the showroom"; "Ten years of Algarve terraces." | **B+/A** | All consistent with the knowledgeable-host voice. |

The public-facing spine (homepage, hero, footer) now holds the voice. The rot has retreated to the **edges**: fallbacks, empty states, deep pages, and the PT layer's coverage.

### 2. Voice audit — where the register still breaks [Observed]

**Product data is the biggest unfixed liability.** `src/data/catalogProducts.js` carries raw supplier boilerplate as taglines on ~20+ products: *"Our every day lifestyle is changing and our garden becomes a beautiful extension of our home. The consumer has realized that they can custom build their backyard dreams andare enjoying creating their visions."* — including the typo "andare", repeated verbatim across many pieces, plus internal-catalogue fragments like *"Dining piece, based on the Able ULTRA model."* This is pasted distributor copy ("the consumer", "backyard" — US register) rendering on detail pages of a quiet-luxury site. [Inferred: single highest-leverage copy fix remaining.]

**Fallback microcopy contradicts itself.** On unknown products the specs tab shows the row `Status — Details available on request` ("Status" is a database label, not host language), and the materials tab renders the fallback line *"Full specifications available through the showroom team"* followed by the hard-coded tag **"Included"** (`status-concept-product-detail.jsx:159–167`) — so it literally reads "Full specifications available through the showroom team — Included." Nonsense produced by template logic, visible to buyers.

**"No image" placeholder** (`products.jsx:243,258`; PT "Sem imagem"). It's an apology in inventory-speak. A luxury catalogue never says a thing is missing; it redirects attention to what the brand *does* have — a showroom ten minutes away.

**Smaller breaks:** Products page head repeats kicker "Products" over H1 "Products"; toolbar says "76 products shown" (stocktake voice — this house sells *pieces*); empty state "No pieces in this category yet. Contact the showroom." is two curt fragments; detail CTAs "Request quote / Book showroom" are clipped where the homepage says "Book a showroom visit" and the PT already says the classier "Pedir proposta"; related-products header "You may also like" is Amazon register; About's story paragraph still opens company-first ("Proud of what we represent…") — the same "highest quality" boilerplate the first pass killed on the homepage survives here; About stats "76+ Furniture pieces" and "5 Core service areas" are internal-speak; the About partner marquee mixes real brands (Sunbrella, Glatz) with category nouns ("Outdoor Kitchens", "Custom Upholstery") presented as partners; Projects kept "Installed settings" and "Request similar project" (prior proposals unshipped); Header's language toggle renders a literal lowercase "v" as the caret. **The Glatz page is the strongest deep page** — "Cantilever shade that floats above the furniture", "Colour-fast for 350–700 sunny days", "See them in the Algarve sun" all hold voice; only the one-word link "Discover" drifts into fashion-cliché.

### 3. PT register check (`TranslationLayer.jsx`)

**The good** [Observed]: the public PT dictionary is courteous third-person throughout ("Contacte o showroom", "Marque", "Mantenha"), diacritics are correct (the first-pass bug is fixed), and it uses real Algarve vocabulary — *maresia, terraços algarvios, tardes algarvias, espreguiçadeiras*. "Pedir proposta" is better than its EN source.

**Three problems:**

1. **Register clash with the client area** [Observed]. The client area, comparator, auth pages and toasts are PT-authored in informal "tu" — *"Aqui podes acompanhar…"*, *"Mantem os teus dados"*, *"Acede aos teus favoritos"*, *"So podes comparar 3 produtos"* (`ClientDashboard.jsx`, `ClientProfile.jsx`, `Login.jsx`, `Register.jsx`, `CompareContext.jsx`) — **and with no diacritics at all** (*orcamento, Area de cliente, ate, coracao, Sessao*). A buyer moves from formal, accented marketing PT into unaccented "tu" the moment they log in. In a luxury context this reads as two different companies.
2. **Coverage collapses off the homepage** [Observed]. Page titles are translated ("Visite, ligue ou inicie uma proposta", "Excelência exterior desde 2013") but the bodies beneath them are not: Contact form labels (Phone/Interest/Message), "Tell us what you need", the success message, "Send enquiry", the quick-cards; the entire About story/timeline/values; all six Projects descriptions and filters; virtually the whole Glatz page. Portuguese visitors get headline-PT, body-EN — worse than either language alone. [Inferred: this, not phrasing, is the main PT workstream.]
3. **Denglish and calques** [Observed]: *"Outdoor living de luxo · Algarve"* and *"Sistemas de outdoor living selecionados"* let whole phrases go English ("showroom"/"After Care" are earned loanwords; "outdoor living de luxo" is not). *"Detalhes disponíveis sob pedido"* is a calque — EU Portuguese says *a pedido* or *sob consulta*. *"Porque nós"* for "Why Us" is ungrammatical standalone — should be *"Porquê nós"*.

### 4. Next round — prioritized rewrites (EN → PT)

**P0 — visible defects**

| # | Where | Before → After | Rationale |
|---|---|---|---|
| 1 | Product card/list placeholder | "No image" / "Sem imagem" → **"See it in the showroom"** / **"Ver no showroom"**. Alt A: "Photography to follow" / "Fotografia em preparação". Alt B: no words — collection wordmark on the neutral panel. | Turns absence into an invitation and reinforces the showroom-led positioning. "No image" is the register of a parts catalogue. |
| 2 | `catalogProducts.js` taglines | "Our every day lifestyle is changing… andare enjoying creating their visions." → per-category house lines, e.g. dining: **"From the [Collection] dining range — built for terrace meals in Algarve sun and salt air."** / **"Da linha de refeições [Coleção] — feita para refeições no terraço, ao sol e à maresia do Algarve."** | Removes typo'd US-supplier boilerplate from dozens of detail pages. One templated sentence per category beats twenty pasted paragraphs. |
| 3 | Detail fallback specs/materials | "Status: Details available on request" + "…showroom team — Included" → spec row **"Specifications — On request"** / **"Especificações — A pedido"**; materials fallback **"Materials confirmed by the showroom team on request."** / **"Materiais confirmados pela equipa do showroom, a pedido."** (and suppress the "Included" tag on fallback rows). | Kills the "— Included" absurdity and the database label "Status"; fixes the *sob pedido* calque. |
| 4 | Client area PT (whole set) | "Aqui podes acompanhar favoritos, dados pessoais e futuros pedidos de orcamento." → **"Aqui pode acompanhar os seus favoritos, dados pessoais e pedidos de orçamento."**; "Mantem os teus dados atualizados…" → **"Mantenha os seus dados atualizados…"**; "So podes comparar 3 produtos…" → **"Só é possível comparar 3 produtos…"** | One brand, one register: courteous third person with diacritics, matching the public site. (EN dictionary keys must be updated in lockstep.) |

**P1 — voice consistency**

| # | Where | Before → After | Rationale |
|---|---|---|---|
| 5 | Detail CTAs | "Request quote / Book showroom" → **"Request a proposal / Book a showroom visit"** / **"Pedir proposta / Marcar visita ao showroom"** | Aligns EN with the PT that's already right; "quote" is contractor register, "Book showroom" is clipped. |
| 6 | Related products | kicker "From the catalogue" + "You may also like" → kicker **"Also from the catalogue"** + **"Pieces in the same spirit"** / **"Peças no mesmo espírito"** | "You may also like" is the one pure e-commerce cliché left on the page. |
| 7 | Category empty state | "No pieces in this category yet. Contact the showroom." → **"New pieces for this category are on their way. Meanwhile, the showroom team can show you what's arriving."** / **"Estão a chegar novas peças a esta categoria. Entretanto, a equipa do showroom pode mostrar-lhe o que vem a caminho."** | Host, not clerk: explains, then offers. |
| 8 | Products page head + toolbar | kicker "Products" / H1 "Products" → kicker **"Catalogue"**, H1 "Products"; "76 products shown" → **"76 pieces"** / **"76 peças"** | Removes the duplicate; "pieces" is the house noun (already used everywhere else). |
| 9 | About story | "Proud of what we represent and attentive to our customers' needs, Statvs is committed to outdoor furniture of the highest quality…" → **"Since 2013 we've chosen outdoor furniture the way our clients choose homes here: for how it lives, not how it looks on day one. European makers, materials that survive this coast, and service that continues after delivery."** / **"Desde 2013 escolhemos mobiliário de exterior como os nossos clientes escolhem casa aqui: pelo que dura, não pelo primeiro dia. Fabricantes europeus, materiais que resistem a esta costa e um serviço que continua depois da entrega."** | Last surviving block of company-first boilerplate. |
| 10 | About H1 + stats | "Outdoor excellence since 2013" → **"The Algarve outdoors, since 2013."** / **"O exterior algarvio, desde 2013."**; "5 Core service areas" → **"5 services, one team"** / **"5 serviços, uma equipa"**; "76+ Furniture pieces" → **"76+ pieces on display"** / **"76+ peças em exposição"** | Prior H1 proposal never shipped; "core service areas" is org-chart language. |

**P2 — polish**

| # | Where | Before → After | Rationale |
|---|---|---|---|
| 11 | Projects | "Installed settings" → **"Completed terraces"** / **"Terraços concluídos"**; "Request similar project" → **"Start a project like this"** / **"Começar um projeto assim"**; kicker "Your project next" → **"Yours next"** / **"O próximo é o seu"** | Carries the unshipped first-pass fix; "Request similar project" reads machine-generated. |
| 12 | Contact microcopy | "Choose an option" → **"Select an area of interest"** / **"Escolha uma área de interesse"**; unify "Replies within 24h" with the form's promise → **"Replies within one business day"** / **"Resposta no prazo de um dia útil"** (both places) | Two different reply promises on one page erode the precision the brand trades on. |
| 13 | PT Denglish | "Outdoor living de luxo · Algarve, Portugal" → **"Espaços exteriores de luxo · Algarve, Portugal"**; "Sistemas de outdoor living selecionados…" → **"Sistemas de exterior selecionados…"**; "Porque nós" → **"Porquê nós"** | Loanwords for proper nouns only; fixes the grammar slip. |
| 14 | Category copy (unshipped refinements) | Dining: "…from breakfast to late dinner." → **"…from breakfast in the shade to dinner past midnight."** / **"…do pequeno-almoço à sombra ao jantar pela noite dentro."**; Shade: lead with the benefit — **"Cool, usable outdoor rooms at 2 pm in August — Glatz parasols, bioclimatic pergolas, retractable systems."** / **"Salas exteriores frescas às 14h de agosto — chapéus de sol Glatz, pérgolas bioclimáticas, sistemas retráteis."** | First-pass suggestions that didn't ship; both add the sensory specificity the intro line set as the standard. |
| 15 | Glatz card link | "Discover" → **"View the model"** / **"Ver o modelo"** | The page's one drift into perfume-counter vocabulary. |

**Structural note (not a rewrite):** extend PT dictionary coverage to Contact, About, Projects and Glatz bodies before adding any new EN copy — every new English sentence currently widens the PT gap. [Inferred priority; gap itself Observed.]

---

## Marketing Psychology — Persuasion Audit

**Method note:** Behavioral audit of the redesign source (`Status-Concept/src/pages/` homepage, products, product-detail, contact, about, projects; `src/index.css`) against established persuasion science, calibrated to a €5k–€100k+ considered purchase and the quiet-luxury register. [Observed] = read in code; [Inferred] = strategist judgement.

### (a) What the site leverages vs. neglects

**Leveraged (partially):**

- **Authority via materials, not people** [Observed]: Sunbrella®/Interpon/Premium Aluminium badges on the homepage, spec tabs on every product, "since 2013" and "10+ years / 2 showrooms" stat blocks. This is *ingredient branding* — borrowed authority from component brands. It works, but it's the weakest authority tier available; the strongest (hospitality clients like Conrad/Hilton, named designer relationships) is entirely absent from the redesign [Observed: no Conrad/Hilton reference anywhere in `src/pages/` — the only "Conrad" is a coincidentally named side table in `catalogProducts.js`].
- **Place-name social proof** [Observed]: the marquee cycles "Quinta do Lago · Vale do Lobo · Vilamoura", and the projects page names six villas with locations and years. This is *similarity bias* done in the right register — "people like me, in places like mine, buy here." But it stops one step short: zero client voice. Not a single quote, initial, or outcome statement exists in the codebase [Observed].
- **Commitment devices half-built** [Observed]: Favorites and Compare buttons on every card create endowment ("my shortlist"), but the shortlist never converts — there is no "send this selection to the showroom" ask.

**Neglected or actively harmful:**

- **Ambiguity aversion around price-on-request** [Inferred, high confidence]: no prices, and no *explanation of the absence*. Buyers tolerate hidden prices in luxury when the concealment is framed (bespoke configuration, fabric grades, installation). Unframed, the silence reads as either "you can't afford it" (deterring the €8k buyer who could) or "prices are negotiable/foreigner-priced" — which is precisely the "estrangeiro prices" anxiety documented for Personas 1 and 4 in the prior research.
- **The blank-canvas effect** [Observed]: 184 of 218 products render a white "No image" square (`.rd-no-image`), sorted to sink below imaged products. Sorting them last is smart triage, but at grid scale the shopper still scrolls into a wall of empty white tiles. Psychologically this is *evaluability* poison: people judge inventory quality by the sample they can see, and a majority-blank catalogue reads as "half-finished website" or "phantom inventory" — directly contradicting the craftsmanship story. A luxury buyer's inference is not "photos pending"; it's "operation not as polished as it looks."
- **Choice overload** [Observed]: category grids of 50+ items with only "Featured/Name" sorting, no curation layer, no "start here" default. Hick's Law predicts slower decisions and higher abandonment; for a considered purchase the effect is deferral ("I'll look again later"), which for absentee owners means never.
- **Attention scarcity mismanaged** [Observed]: an auto-rotating 5-second hero carousel — the classic pattern users learn to ignore (banner blindness), and it steals attention from the single strongest line on the site ("furnished and cared for").
- **Peak-end rule, unexploited** [Observed]: the enquiry success state is competent (reply-time promise, WhatsApp fallback) but generic. And the newsletter form's `onSubmit` is `e.preventDefault()` — it silently does nothing [Observed, homepage line 158], a dead-end interaction that ends a session on a broken note.
- **Effort justification, unframed** [Observed/Inferred]: "Book a showroom visit" is the primary CTA, but the visit is presented as a logistics event (address, hours, directions), not a ritual. Effort people expend must be *given meaning* or it becomes friction.

### (b) Luxury-specific psychology

Quiet-luxury buyers evaluate credibility through **costly signals that can't be faked**: physical showrooms in expensive postcodes (STATVS has two — its strongest signal, correctly foregrounded), longevity, named projects, restraint in design, and *who else* is a client. Absent prices, these substitute signals carry the entire persuasion load — which is why the missing hospitality references and client voices are expensive omissions, not nice-to-haves.

The core paradox is **accessibility vs. exclusivity**: the brand must feel selective enough to justify the price while remaining approachable enough that a first-time villa owner dares to enquire. Price-on-request manages exclusivity but mismanages accessibility; the fix is never publishing a price list, it's *lowering the perceived social risk of asking* ("proposals within 48 hours," a named human, a defined process). Discretion itself is a feature for this buyer — testimonials should be attributed the way private banks do it ("Private client, Vale do Lobo"), which paradoxically signals *more* exclusivity than full names. And urgency mechanics (countdowns, stock counters, exit popups) are category poison: they signal inventory pressure, and inventory pressure signals mass retail. [Inferred]

### (c) Prioritized interventions

| # | Principle | Where (UI) | Exact change | Mechanism | Backfire risk / what NOT to do |
|---|-----------|-----------|--------------|-----------|-------------------------------|
| 1 | Evaluability / blank-canvas | Product grids (`status-concept-products.jsx`) | Remove the 184 "No image" tiles from the default grid. Show the ~34 imaged products as the curated grid; collapse the rest into a text-index band: "Full catalogue — {n} further pieces, photographed in our showrooms. Request the catalogue." | Judged inventory = visible sample; a fully-imaged grid reads flagship, not fragment | None if copy frames it as curation. Do NOT keep grey placeholder squares or stock photos — both read as decay |
| 2 | Ambiguity aversion | Product detail panel, above CTAs | Add a one-line "Pricing & proposals" note: "Each setting is priced on configuration and fabric. Detailed proposal within 48 hours of enquiry or a showroom visit." Optionally per-category floor: "Lounge settings from €X,XXX" [Inferred] | Names the process, kills the "am I allowed to ask?" hesitation and foreigner-pricing suspicion | Do NOT publish per-SKU prices or use charm pricing (€4,995) — round numbers only if any figure appears; tickets would collapse the consultative model |
| 3 | Commitment & consistency / Zeigarnik | "Request quote" on product detail | Carry product context into `/contact`: prefill interest + "Regarding: {product name}" in the message; success state echoes the product back | The open loop ("my Fortano enquiry") sustains motivation; context removal currently resets the buyer to zero | None — pure friction removal |
| 4 | Social proof (similarity) | Homepage between "Why Statvs" and After Care; projects page | One rotating attributed line: ""Five summers on, it still looks like delivery day." — Private client, Quinta do Lago"; add one such line per project | Vivid, location-matched proof for the exact persona; discreet attribution amplifies exclusivity | Do NOT add star ratings, Trustpilot widgets, review counts, or logos-wall carousels — mass-market grammar |
| 5 | Authority | About page + a quiet homepage line | Surface hospitality credentials: "Suppliers to the Algarve's leading hotels and beach clubs" (name Conrad/Hilton if contractually permitted); "Official Glatz partner" | Institutional buyers as proof-of-durability proxy — hotels can't afford furniture that fails | Verify claims first; unverifiable name-dropping in luxury is fatal if challenged |
| 6 | Paradox of choice / default effect | Category grids | Add a curation layer: 3–6 "Signature settings" (complete looks) pinned above the full grid; tag one "Most specified" per category | Defaults resolve paralysis; complete settings shift the frame from item-shopping to room-buying (higher AOV) | Keep it to one editorial tier — multiple badges ("Hot!", "Bestseller") cheapen |
| 7 | Peak-end rule | Contact success state | Upgrade the end: named recipient ("Your enquiry goes to {name}, showroom director"), a 3-step "what happens next," and a small gift — a downloadable Algarve terrace-care note (reciprocity) | Last moment defines memory of the whole session; a gift creates obligation before the callback | Do NOT add cross-sell or newsletter upsell here — the end must feel like white-glove receipt, not funnel stage |
| 8 | Effort justification | Homepage CTA + contact | Reframe "Book a showroom visit" as "Book a private consultation" — a scheduled 60-minute appointment, terrace plans welcome, coffee served | Ritualized effort raises perceived value of the outcome; appointments convert better than drop-ins for €20k decisions | Keep walk-in welcome visible; over-gatekeeping deters Persona 4 |
| 9 | Endowment / foot-in-door | Favorites page (`status-concept-favorites.jsx`) | Add "Send this shortlist to the showroom" — one click converts the saved selection into a prefilled enquiry | The shortlist is already "theirs"; the ask converts psychological ownership into commitment | None |
| 10 | Consistency / trust micro-fracture | Homepage newsletter | Wire the form to Supabase or delete the section — it currently swallows input silently [Observed] | A dead interaction is a broken promise; incongruent with "we look after things" | None — fixing is strictly better |
| 11 | Attention scarcity | Homepage hero | Replace the auto-carousel with one static hero (best image) + the H1; keep manual gallery if needed | Carousels train ignoring; one frame concentrates attention on the one differentiating message | None; motion ≠ luxury |
| 12 | Regret aversion (not scarcity) | Product detail + After Care | Add a stewardship promise line: "Delivered when you're in residence. Maintained when you're not." | Directly answers the absentee owner's dominant anxiety (who cares for it while I'm away) | This is the correct *substitute* for urgency. Do NOT use "only 2 left," countdowns, seasonal-deadline banners, or exit popups — each would re-price the brand downward |

**Priority order:** 1–3 first (they repair active damage), 4–7 next (they add missing proof and a designed ending), 8–12 as the polish layer. The unifying test for every future tactic: *would a private bank do this?* If not, neither should STATVS. [Inferred]

---

## Analytics & Experimentation — Measurement Plan

**[Observed]** The site currently ships with **zero analytics**: a full-text search across `src/` and `index.html` finds no gtag, GTM, dataLayer, Plausible, PostHog, or any tracking snippet. Every question about the funnel ("do people click the No-image cards?", "does the carousel help or hurt?") is currently unanswerable. The one measurable artefact is the Supabase `enquiries` table (`src/pages/status-concept-contact.jsx:61`) — the site's only conversion counter today.

### (a) GA4 tracking plan

**Stack recommendation:** gtag.js loaded directly (skip GTM — one developer, one SPA, GTM adds a consent/complexity layer with no payoff at this scale). Wrap it in a tiny `src/lib/analytics.js` with a `track(name, params)` helper that no-ops when consent is absent — every component calls the helper, never `gtag` directly.

**Consent gating [Observed]:** `ConsentNotice.jsx` already writes `localStorage.cookie_consent = 'accepted' | 'rejected'`. Use GA4 **Consent Mode v2**: initialise with `analytics_storage: 'denied'`, then call `gtag('consent', 'update', {analytics_storage: 'granted'})` when the value is `accepted` (on banner click and on load for returning accepters). The banner currently has no "update consent" hook — the `choose()` function is the single integration point. Note the banner is Portuguese-only and links to `/privacidade` which won't resolve under HashRouter [Observed] — fix alongside.

**HashRouter page_view pitfall [Observed — `main.jsx:9`]:** GA4's Enhanced Measurement "page changes" toggle listens to History API pushState, **not** `hashchange`, so with HashRouter every route change after landing is invisible and everything reports as `/`. Handle it now: disable auto page_view (`send_page_view: false`), and fire manual `page_view` events from a `useEffect` on `useLocation()` in `App.jsx`, sending `page_location: location.href` and a **normalised `page_path`** with the language prefix stripped into a `language` param (`/#/en/products` → `page_path: /products`, `language: en`) so EN/PT don't fragment every report. **After the BrowserRouter migration** (already planned in `STATVS-Routing-SEO-Migration-Plan.md`): keep the same manual page_view hook (it's router-agnostic), turn Enhanced Measurement history tracking off permanently to avoid double-counting, and expect referrer data to become meaningful (hash fragments are stripped from cross-site referrals, so today's acquisition data will be partly `direct`-polluted).

**Event taxonomy** (object_action, lowercase; `language` and `page_path` sent on everything via `gtag('set')`):

| Event | Params | Trigger |
|---|---|---|
| `page_view` | page_path, page_title, language | route change (manual) |
| `hero_carousel_interact` | action: arrow_prev/arrow_next/dot, slide_index | homepage hero controls |
| `category_tile_click` | category, position, source: carousel/grid | products-landing tiles (carousel auto-advances every 5s [Observed] — only track *clicks*, never auto-slides) |
| `nav_click` | nav_item, nav_type: dropdown/header/footer/mobile | Header/MobileMenu links |
| `product_card_click` | product_id, product_name, category, position, **has_image: true/false** | category grid cards |
| `product_view` | product_id, product_name, category, has_image | detail page mount |
| `detail_cta_click` | cta: enquire/whatsapp/favourite/compare, product_id | detail-page CTAs |
| `form_start` | form: contact | first field focus (once/session) |
| `generate_lead` ✅ | interest, method: supabase | successful insert into `enquiries` |
| `form_fallback_mailto` | interest | the catch branch at `contact.jsx:69` — this is a **backend-failure alarm**, not just a metric |
| `contact_click` ✅ | method: tel/whatsapp/mailto, location: contact_page/footer/detail | any tel:/wa.me/mailto tap |
| `directions_click` ✅ | showroom: quinta_do_lago/almancil | Maps links |
| `favourite_add` / `compare_add` | product_id, category | FavoriteButton/CompareButton |
| `compare_export` | product_count | Excel export |

Mark ✅ rows as GA4 key events. Register `has_image`, `category`, `language`, `method` as custom dimensions.

**The No-image penalty [Observed]:** "No image" placeholders exist in the products grid. `has_image` on both `product_card_click` and `product_view` gives you, within ~2–4 weeks, the exact CTR gap between image and placeholder cards (Exploration report: card impressions aren't tracked, so use *clicks per category-page view* per has_image bucket, weighted by placeholder share per category). **[Inferred]** expect placeholder cards to underperform by 50–80% based on e-commerce imagery studies — this number becomes the business case for the photography budget.

### (b) Supabase-side measurement freebies

- **`enquiries` is the source of truth for leads** — GA4 will undercount (consent rejections, ad-blockers: expect GA4 to see only ~60–80% of real submissions [Inferred]). Add three cheap columns to the insert payload: `language`, `source_path` (page the user came from), and `client_id` (read the GA `_ga` cookie when consent is granted, else null). That makes Supabase-to-GA4 reconciliation a weekly one-liner: `select count(*) from enquiries where created_at > now() - interval '7 days'` vs GA4's `generate_lead` count — the ratio is your tracking-loss factor; apply it when reading GA4 funnel rates.
- **`favorites` table**: `select product_id, count(*) group by 1` is a free "most-desired products" report for logged-in users, with zero consent constraints (first-party, legitimate-interest operational data). Cross-reference against enquiry `interest` values to see which admired products never convert to enquiries — merchandising signal.
- **Enquiry velocity & interest mix** over time is queryable today, before any GA4 work ships. Start there.

### (c) KPI tree (lead-gen luxury retail)

```
Sessions
 └─ % viewing a category page        target 45–65%
     └─ % viewing a product detail   target 25–40% of sessions
         └─ Enquiry rate (form + tel + WhatsApp + directions, per session)
                                     benchmark 1.5–4% [Inferred]
             └─ Showroom visits / qualified conversations
                 └─ Closed sales (offline — track manually per enquiry)
```

**[Inferred] benchmarks:** high-ticket furniture sites convert to *lead* at 1.5–4% of sessions (vs ~2% e-commerce purchase rates; leads are a lower bar, luxury audiences are smaller but higher-intent). WhatsApp/tel taps typically equal or exceed form submissions in Portugal/Algarve mobile traffic — count them as leads or you'll halve your measured conversion. Directions clicks are the most underrated KPI here: for a showroom business each one is a near-booking. Secondary health metrics: favourites per 100 sessions, compare-tool usage, EN vs PT conversion gap (likely large — tourist vs resident intent), and `form_fallback_mailto` rate (should be ~0%).

### (d) A/B test roadmap — with an honesty clause

**The honesty clause first [Inferred]:** a local luxury lead-gen site plausibly sees 2,000–10,000 sessions/month. At a 2.5% lead rate, detecting even a 30% relative lift needs roughly 6,500 sessions *per variant* — 2–6 months per test, and most of these tests will **never reach 95% significance**. So: (1) reserve true A/B mechanics for the top 1–2 tests only; (2) for the rest, use **sequential rollout + Bayesian read** (ship to 100%, compare 4 weeks pre/post in GA4, treat >80% probability-of-improvement as a keep decision) or plain **ship-and-watch with guardrails** (revert if leads drop). That's not statistical cowardice — it's the correct posture below ~20k sessions/month. Micro-conversions (card CTR, form starts) reach significance 5–10× faster than leads, so test against those where defensible.

| # | Test | Hypothesis | Primary metric | Method |
|---|---|---|---|---|
| 1 | **Real photos vs "No image" placeholders** (fix worst category) | Placeholder cards suppress clicks; photos recover ≥50% of the gap | `product_card_click` CTR by has_image | Not a real A/B — natural experiment via `has_image` dimension, then pre/post per category. Highest confidence, cheapest data |
| 2 | **Detail-page primary CTA: "Enquire" vs "WhatsApp us about this piece"** | Lower-friction channel lifts total contact actions ≥20% | detail_cta_click + contact_click per product_view | 50/50 client-side split (localStorage bucket); micro-conversion, may reach significance in 4–8 weeks |
| 3 | **Auto-advancing carousel vs static category grid** | Auto-advance causes mis-clicks/banner blindness; static grid lifts category_tile_click | tile CTR per landing view | Ship-and-watch (pre/post), guardrail: bounce on products landing |
| 4 | **Form length: current fields vs name+contact+message only** | Fewer fields lift start→submit completion ≥25% | form_start → generate_lead rate | 50/50 split; completion rate is a mid-funnel metric, feasible in ~2–3 months |
| 5 | **Sticky mobile contact bar (tel/WA) sitewide** | Persistent contact affordance lifts session→lead on mobile ≥15% | contact_click per mobile session | Rollout + Bayesian pre/post; too few leads for classical testing |
| 6 | **Language auto-detect vs EN default** | PT-browser users landing on EN bounce more; auto-detect lifts PT engagement | pages/session + lead rate by language | Ship-and-watch; segment comparison, no split needed |

Cadence: one change in flight at a time, a written hypothesis + decision log per the experiment-playbook format, monthly review. Priority order is deliberate — #1 requires no experiment infrastructure at all and almost certainly carries the largest effect size on the site.

---

## UX/UI Audit — Structure, States & Accessibility

Method: full read of `src/index.css` (2,320 lines), all pages in `src/pages/`, `Header`/`MobileMenu`/`Footer`/`Layout`, and the favorite/compare/PageNav components. Contrast ratios computed per WCAG relative-luminance formula. All findings are [Observed] in source unless tagged [Inferred].

### (a) Information architecture & navigation

**Desktop nav and mobile menu describe two different sites (P1).** [Observed] Desktop shows Products (6-item dropdown), Projects, Showrooms, Contact (`src/components/Header.jsx:7-14, 138-140`). The mobile menu shows an 8-group taxonomy including "Coffee Tables", "Bar & Patio", "Leisure › Sound Systems", "Why Us", "After Care" (`src/components/MobileMenu.jsx:50-58`). "Sound Systems" and "Leisure" have no entry in `NAV_ROUTES` (`MobileMenu.jsx:4-26`), so tapping them does nothing — a silent dead button. "Why Us"/About is unreachable from desktop nav entirely; it exists only in footer and mobile menu. Mobile sub-items route through category aliases (`daybed→sunlounger`, `coffee→dining`, `bar→lounge`, `src/pages/status-concept-products.jsx:90`), so "Coffee Tables" lands on a page titled "Dining" with no explanation.

**Nav links are `href="#"` resolved by text-matching (P1).** [Observed] Projects/Showrooms/Contact render as `<a href="#">` (`Header.jsx:138-140`) and depend on a document-level click listener that matches `link.textContent` against a map (`src/useNavLinks.jsx:23-32`) — which every page must remember to call. This breaks middle-click/open-in-new-tab, produces meaningless URLs for crawlers, and is one TranslationLayer text mutation away from dead navigation (the map carries PT variants as insurance, `useNavLinks.jsx:5-16`). Logo navigation via `textContent === 'STATVS'` sniffing (`useNavLinks.jsx:35-41`) is the same fragility.

**No breadcrumbs; back-links lose context (P2).** [Observed] Category pages fake a crumb with a non-interactive kicker "Products / Lounge" plus a "← Products" button (`status-concept-products.jsx:185-188`). The product-detail "Back to products" goes to the bare landing (`status-concept-product-detail.jsx:230`), discarding the category the user came from.

**Footer routes to placeholders and dead legal links (P1).** [Observed] "After Care", "Gallery", "Catalogue" all resolve to `Placeholder` "coming soon" pages (`src/components/Footer.jsx:16-19` → `src/App.jsx:39-41`). Privacy Policy, Cookie Policy and Terms are `href="#"` (`Footer.jsx:70-72`) — a compliance problem given the site sets a cookie-consent banner.

**PageNav dev widget ships in production (P1).** [Observed] A fixed bottom-right "Pages" switcher with `zIndex: 9999` is mounted unconditionally (`src/App.jsx:68`, `src/PageNav.jsx:34`), duplicating favorites entry points (floating heart + `/favorites` + `/cliente/favoritos`) and colliding visually with the cookie banner (z 9998) and ComparePill. Its menu items are `div onClick` — keyboard-invisible (`PageNav.jsx:72-95`).

### (b) Visual hierarchy & layout

**Three competing H1 treatments (P2).** [Observed] Homepage H1: clamp 36–60px, weight 500 (`status-concept-homepage.jsx:54`); `.rd-title`: clamp 38–62px, weight 300 (`src/index.css:83-89`); detail H1: clamp 32–48px, weight 400 (`status-concept-product-detail.jsx:232`). Same rank, three voices. On the kitchen detail page an `<h2>` precedes the page `<h1>` in DOM order (`product-detail.jsx:191` vs `232`) — a heading-outline violation.

**Inline-style sprawl undermines the design system (P1).** [Observed] The homepage, header and footer are built almost entirely from inline style objects, and the responsive layer patches them with attribute-selector hacks like `#grid > div > div[style*="grid"] { grid-template-columns: repeat(2,1fr) !important }` (`index.css:2233-2313`). Any refactor that changes a `style` string silently breaks tablet layout. Hover styling is done with `onMouseEnter` mutating `.style` (`Header.jsx:71-78,130-131`, `Footer.jsx:59-60`), which never fires for keyboard focus.

**Banner-height vs content (P2).** [Observed] Category pages open with a purely decorative 42vh/max-460px image (`index.css:962-975`) before any title or product; combined with the 104px fixed header, first products sit roughly a full viewport down. [Inferred] For a catalogue surface this taxes scroll effort with no information gain.

**Dead CSS and off-brand remnants (P2).** [Observed] `.rd-back-to-cats:hover` sets `border-color` on a borderless element — a no-op (`index.css:1065-1081`). Two leftovers of the old crimson brand remain: input focus glow `rgba(196,30,58,.12)` (`index.css:1947`) and active showroom tab `rgba(196,30,58,.18)` (`index.css:776`) — visibly red against the bronze system.

### (c) Interaction & state coverage

Systematic sweep — present: hover (pervasive), focus-visible (global ring, `index.css:344-347`), disabled (`auth-submit:disabled` 1967, contact submit `status-concept-contact.jsx:170`), loading (spinner `index.css:1998-2007`; "Sending…" label), empty (favorites `index.css:937-945`, compare empty column 1440-1452, products "No pieces in this category yet" `status-concept-products.jsx:222-225`), error (form-alert 1954-1961, toast-error 2156).

Missing or wrong:
- **Contact form reports success on failure (P0).** [Observed] The `catch` branch fires a `mailto:` redirect and then sets `status("sent")` and clears the form (`status-concept-contact.jsx:68-74`). If the user has no mail client (most desktop browsers), the enquiry is lost while the UI says "Thank you — your enquiry is on its way." The `error` status defined at line 14 is never used.
- **Newsletter form is a dead end (P1).** [Observed] `onSubmit={(e)=>e.preventDefault()}` with no feedback of any kind (`status-concept-homepage.jsx:158`).
- **No image-load failure state (P2).** [Inferred] With 184/218 products already lacking imagery, a broken `src` renders the browser's broken-image glyph inside the 1:1 card; there is no `onError` fallback to `.rd-no-image`.
- **`.rd-select` and range chips have no active/focus differentiation beyond the global ring; fine. The floating-label fields never float** — labels are statically pinned at 10px above the input (`index.css:797-806`); placeholder-less inputs look empty-labeled but work. Acceptable, but the class name promises more than it does.

### (d) Accessibility

**Contrast — computed (P0).** `--accent` #8a7658 on #ffffff = **4.36:1** — fails WCAG AA (4.5:1) for normal-size text. It is used for text at 11px on the category kicker (`index.css:82`), back-links (`index.css:320-331`), and "Get directions →" (`status-concept-homepage.jsx:120`). Worse: `--text-grey` #8b867b on white = **3.62:1**, failing AA while carrying real content — product card descriptions at 12px (`index.css:276-281`), counts at 13px (`index.css:142`), category labels (`index.css:1120-1128`), the "No image" placeholder itself (`index.css:1017-1029`). In the header top bar, #8b867b sits on `--light-grey` #f1efea = **3.15:1** at 11px (`Header.jsx:47-56`). `--accent-hover` #6f5e44 passes at 6.25:1 — the fix is one token swap for text usage. Footer links `rgba(255,255,255,.55)` on #1a1815 ≈ 6.1:1 — passes.

**Keyboard paths.** Genuinely good: skip link (`Layout.jsx:11`), global `:focus-visible` ring, product cards with `role="link" tabIndex={0}` and Enter/Space handling (`status-concept-products.jsx:229`), `aria-pressed` on view toggles and kitchen range chips (216-217, 198). Broken:
- **Closed mobile menu stays in the tab order (P0).** [Observed] The drawer is always mounted and hidden only by `translateX(100%)` (`MobileMenu.jsx:46-47`, `index.css:1760-1768`) — no `visibility:hidden`, no `inert`. Keyboard users tab through ~20 invisible off-screen buttons on every page.
- **MobileMenu has initial focus + Escape (`MobileMenu.jsx:33-42`) but no focus trap, no focus restore to the hamburger, and no body scroll lock (P1).**
- **The hamburger button has no accessible name** — two decorative `<div>` bars, no `aria-label`, no `aria-expanded` (`Header.jsx:162-170`) (P0, folded into the menu fix).
- **Language switcher options are `div onClick`** — unreachable by keyboard, no `aria-expanded`, no outside-click/Escape close (`Header.jsx:150-160`) (P1).
- **Products dropdown**: `aria-haspopup`/`aria-expanded` present, Escape closes, blur-out closes (`Header.jsx:101-136`) — but it claims `role="menu"`/`menuitem` (121, 127) without arrow-key navigation, which that role contracts. Use a plain list of links, or add roving focus. Escape also doesn't return focus to the trigger. (P2)
- **Lightbox: no Escape handler and no focus management (P1)** — close is click-only on backdrop/button (`product-detail.jsx:332-337`); focus stays behind the overlay.

**Aria grading:** B for intent — labeled icon buttons everywhere (`FavoriteButton.jsx:20`, `CompareButton.jsx:20`), `role="dialog" aria-modal` on the drawer, `aria-roledescription="carousel"` with labeled arrows and dots (`homepage:36-48`), toast `role="status"`. C for execution: thumbnails use `aria-pressed` where `aria-current` is meant (`product-detail.jsx:205`); hero slides give no state announcement (no `aria-live`, no "slide 2 of 3"); homepage hero images are CSS `background-image` divs — invisible to AT (`homepage:38`), acceptable only if truly decorative. Alt discipline elsewhere is actually good: banners `alt=""`, product images `alt={product.name}`.

**Reduced motion:** the global kill-switch plus targeted overrides (`index.css:1500-1509`) is solid, and both carousels check `matchMedia` before starting timers (`homepage:21`, `products.jsx:39`). Gap: checked once on mount, never re-evaluated; and marquee pause is hover-only (`index.css:1745-1747`).

### (e) The auto-advancing category carousel — verdict: replace (P0)

`CategoryCarousel` (`status-concept-products.jsx:32-75`, `index.css:988-1014`) is the sole navigation surface of the /products landing, and it auto-slides every 5s with **no pause, no arrows, no swipe, and no stop-after-interaction** — the only manual control is clicking a tile, which navigates away. WCAG 2.2.2 requires a pause/stop/hide mechanism for auto-advancing content; `prefers-reduced-motion` gating (line 39) does not satisfy it for everyone else. Concrete failures: (1) a tile can slide away mid-aim every 5s — an action surface that moves under the cursor; (2) on mobile one tile is visible (`index.css:1012`) and touch users cannot advance at all — they must wait 5 seconds per category to see the catalogue's top level; (3) categories are duplicated for the seamless loop (`products.jsx:35`), so keyboard users tab through 10 buttons for 5 categories, and focusing an off-screen duplicate inside the `overflow:hidden` container scroll-jumps the track out of sync with the transform. The homepage hero carousel is defensible (arrows + dots exist, `homepage:40-48`), but its interval never stops after manual interaction and there is no pause control — same 2.2.2 exposure (P1). Recommendation: on /products, a static 5-tile grid (the `.cat-strip.landing` styles already exist, `index.css:984-986`) beats any carousel; there are only five categories.

### (f) Responsive coverage

[Observed] The `rd-*` layer degrades deliberately (1100px/760px blocks, `index.css:1215-1281`) with 44px touch targets added for toolbar controls (1249-1250). The carousel's container-query steps (4/3/2/1 tiles, `index.css:1010-1012`) are well built — the mechanism is fine; the auto-advance is the problem. Weak points: the legacy `[style*="grid"] !important` overrides (2233-2313) are the mobile load-bearing wall (see §b); `.rd-quick-grid` 4→2→1 works but quick-card email `info@statusconcept.com` risks overflow in a 2-col card at ~380px [Inferred — verify]; favorite (top 12) and compare (top 52) buttons at `right:12` on 1-col mobile cards sit where thumbs scroll — acceptable, but the two stacked 32px targets are near the 24px spacing minimum (`products.jsx:231-240`); the detail page's `.rd-mobile-cta` fixed bar (644-655) can cover the last related-products row with no scroll-padding compensation (P2).

### Priority summary

| P | Finding | Evidence |
|---|---|---|
| P0 | Auto-advancing category carousel: no pause/arrows/swipe; mobile sees 1 tile per 5s; duplicated focusable tiles; WCAG 2.2.2 | `status-concept-products.jsx:32-75`; `index.css:988-1014` |
| P0 | Contact form reports success when submission fails | `status-concept-contact.jsx:68-74` |
| P0 | Bronze #8a7658 = 4.36:1 and #8b867b = 3.62:1 on white, both used for normal-size text | `index.css:15,82,142,276,320,1017` |
| P0 | Closed mobile menu remains tabbable; hamburger has no accessible name | `MobileMenu.jsx:46-47`; `index.css:1760-1768`; `Header.jsx:162-170` |
| P1 | Nav via `href="#"` + textContent matching; footer legal links dead; 3 footer routes are placeholders | `Header.jsx:138-140`; `useNavLinks.jsx:23-41`; `Footer.jsx:70-72`; `App.jsx:39-41` |
| P1 | Desktop/mobile menu parity: dead "Leisure/Sound Systems", About missing from desktop, alias mislabels | `MobileMenu.jsx:4-26,50-58` |
| P1 | Lightbox lacks Escape/focus trap; MobileMenu lacks trap/restore/scroll-lock; lang switcher keyboard-invisible | `product-detail.jsx:332-337`; `MobileMenu.jsx:33-42`; `Header.jsx:150-160` |
| P1 | PageNav dev widget in production; arbitrary z-indexes 9998-10000 | `App.jsx:68`; `PageNav.jsx:34`; `index.css:2143,2171` |
| P1 | Homepage hero: no pause control, timer ignores manual interaction; newsletter form dead | `homepage:20-26,158` |
| P2 | Three H1 treatments; h2-before-h1 on kitchen detail; back-link loses category; fake breadcrumb; 42vh decorative banners; red-brand remnants; `[style*="grid"]` responsive hacks; `aria-pressed` vs `aria-current` on thumbs | `homepage:54`; `product-detail.jsx:191,205,230,232`; `index.css:776,962,1065,1947,2233-2313` |

The encouraging counterweight: the `rd-*` system itself — global focus ring, skip link, reduced-motion layer, empty states, keyboard-operable cards — is above-average scaffolding. The P0s are concentrated in exactly two places: the carousel pattern and the color tokens, both cheap to fix relative to their impact.

---

## Visual Design — High-End Grade & Upgrades

**Overall grade: B / "premium template" tier — not yet "high-end agency" tier.** The foundation is genuinely good: a disciplined warm-neutral palette, a single bronze accent, hairline dividers, light font weights, a real easing token (`--ease-out-expo`, `src/index.css:27`) and layered warm-ink shadows (`src/index.css:28–30`) [Observed]. What separates it from Kettal/Tribù/Aman is (1) a single sans doing every job, (2) leftover colour from an older crimson palette leaking into interactive states, (3) inconsistent shadow/radius/duration values scattered outside the token system, and (4) imagery treatment that changes per card class instead of per surface rule — capped by 184 products showing a bare "No image" white square [Observed].

### (a) Typography — B-

**Observed scale (all Outfit):** hero H1 `clamp(36px,5vw,60px)`, weight **500**, `-0.01em` (`src/pages/status-concept-homepage.jsx:54`); page titles `clamp(38px,5.2vw,62px)` weight 300 (`src/index.css:84–85`); section H2 `clamp(30px,4vw,46px)` weight 300 (`:108–109`); card H3 18px/400 (`:264–266`); body 13–15px at line-height 1.7–1.85; kickers 10–11px with 2–4px tracking (`:74–81`, `:1535–1541`); logo only in Cormorant Garamond 28px, letter-spacing 8 (`src/components/Header.jsx:89`, `--font-serif` commented "logo STATVS apenas", `src/index.css:21`).

**Verdict:** Outfit-for-everything at 60px is *competent*, not luxury-grade. Outfit is a geometric sans with slightly rounded, friendly forms — at display sizes it reads "modern SaaS," not "quiet wealth." Every reference brand in this category pairs a neutral sans with a display serif or a sharper grotesk: the serif is already loaded (weights 300–600 + italics, `Status-Concept/index.html:12`), so **promoting Cormorant Garamond from logo-only to display headings (H1/H2 only) costs zero bytes and is the single highest-leverage change** [Inferred]. Cormorant at 300–400 weight, large sizes, tight leading is exactly the Aman/Soho-House register.

Specific flaws [Observed]:
- **Hero weight inconsistency:** homepage H1 is weight 500 while every other display heading is 300 — the heaviest type on the site is on the most important surface, inverting the luxury norm (`homepage.jsx:54` vs `index.css:84`).
- **Uppercase tracking is inconsistent:** kickers range 1.4px–4px across `.rd-kicker` (3px), `.sl` (4px), `.rd-select` (1.4px), `.rd-tab-btn` (1.8px), meta rows (1.6px). Luxury systems pick two values (e.g., 0.14em and 0.22em) and never deviate.
- **Line length:** `.rd-lede` allows `max-width:680px` at 15px (`index.css:90–96`) ≈ 90+ characters — over the 65–75ch editorial ceiling. `62ch` cap appears once (`index.css:1207`) proving the team knows the rule but doesn't systematize it.
- **No optical letter-spacing at display sizes:** large Cormorant needs `letter-spacing: 0`–`0.01em`; large Outfit needs `-0.02em`, but most headings sit at `-0.01em` or 0.

### (b) Color — B (discipline breaks found)

The warm-neutral ladder (`#fff → #f8f7f4 → #f1efea → #e3e0d9 → #8b867b → #1c1b18`) with bronze `#8a7658` is a correct, restrained luxury palette [Observed]. The bronze is used well as a *signal* colour (active tabs, kickers, focus rings, timeline years). But discipline breaks in three places:

1. **Stale crimson leakage** [Observed]: input focus glow is `rgba(196,30,58,.12)` (`src/index.css:1947`) and the active showroom tab is `rgba(196,30,58,.18)` (`:776`) — that's the old red `#c41e3a`, visibly clashing with bronze on every form focus. This is the kind of detail a high-end audit fails a site for.
2. **Cold-ink shadows** [Observed]: token shadows use warm `rgba(28,27,24,…)` but at least seven rules hardcode neutral-black `rgba(0,0,0,.08–.14)` (`:486, :502, :819, :842, :1621, :1637, :1804, :2150`) and the compare pill uses navy `rgba(26,26,46,.16)` (`:1342`) — cold grey shadows on a warm cream page read cheap.
3. **The legacy alias block** (`--stone`, `--ocean`, `--gold`, `--sage`, `:32–47`) invites drift; `--sand: #cfc8b9` still appears in dashed borders (`:1442`) [Observed].

### (c) Spacing & Rhythm — B+

`--section-padding: clamp(60px,10vw,120px)` (`:24`) is the right macro scale, and the hairline system (`1px solid var(--light-grey)` on `.rd-section.alt`, heroes, marquees) is genuinely elegant [Observed]. Weak points:

- **Cramped head-to-content gap:** `.rd-section-head { margin-bottom: 34px }` (`:105`) under 46px headings feels tight; luxury rhythm wants 56–72px there [Inferred].
- **`rd-page-head` bottom padding of 4px** (`:71`) makes title blocks kiss the section below.
- **Grid gaps are dense for the category:** product grid 30px/28px (`:223`, `:1136`), bento 20px, materials 18px. Kettal/Tribù grids breathe at 40–60px with fewer columns [Inferred].
- **Two divider greys** (`--light-grey` vs `--mid-grey`) are used interchangeably for the same job (`:668` vs `:707`) — pick one per context.
- The mobile layer works but is held together by `[style*="grid"] !important` attribute hacks (`:2233–2313`) [Observed] — a symptom of the inline-style JSX; fragile, and it blocks systematic rhythm tuning.

### (d) Imagery Art Direction — C+

Three treatments coexist without a governing rule [Observed]: default cards are `object-fit: cover` with 1.03 hover zoom (`:242–248`); `.kitchen-product` and `.studio-product` cards switch to `contain` with 20–24px padding on white and *disable* the hover zoom (`:249–255`, `:1140–1147`); collection cards use dark gradient scrims (`:198–203`). The grid therefore mixes cropped lifestyle shots against padded white cut-outs row by row — the single biggest "not-an-agency-build" tell.

**What a luxury brand does** [Inferred, standard practice — Kettal/B&B Italia PLPs]: one treatment per *surface*, not per product. Catalogue grid = 100% studio cut-outs on one shared tone (`--off-white #f8f7f4`, not pure white, so cards read as objects on the page); lifestyle/atmosphere imagery is reserved for heroes, collection banners and editorial breaks. Zoom-on-hover only on lifestyle; cut-outs get a subtle lift/shadow instead.

**The 184-product "No image" square** (`.rd-no-image`, `:1017–1029`; 184 ids in `src/data/productImageStatus.js` [Observed]) currently prints the words "No image" in tracked uppercase on white — an apology, repeated 184 times. Make the placeholder a brand asset:

```css
.rd-no-image {
  background: var(--off-white);
  color: transparent;              /* hide the literal text */
}
.rd-no-image::before {
  content: "S";                    /* STATVS monogram */
  font-family: var(--font-serif);
  font-size: clamp(56px, 8vw, 96px);
  font-weight: 300;
  color: var(--mid-grey);          /* tone-on-tone #e3e0d9 */
}
.rd-no-image::after {
  content: "Imagery on request";
  position: absolute; bottom: 18px;
  font-size: 9px; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--text-grey);
}
```
Tone-on-tone serif monogram + a *service* line ("Imagery on request" / "Sob consulta") converts the gap into concierge positioning. A per-category hairline line-icon (1px stroke, 48px, `--mid-grey`) is the richer v2 [Inferred].

### (e) Motion & Depth — B

Strengths [Observed]: `--ease-out-expo` on product cards (`:229–248`), the choreographed kitchen-hero entrance with staggered `kitchenHeroRise` delays (`:411, :430–435`), a full `prefers-reduced-motion` block (`:1500–1509`), and a consistent accent focus-ring system (`:334–347`) — genuinely above average. Weaknesses: the expo curve is applied to maybe 20% of transitions; the rest are default `.3s ease`/`.4s ease` (`:186, :195, :483, :500, :509, :817, :871`), so the site has two motion personalities. Hover lifts vary arbitrarily (-2px/-3px/-5px). Image zooms vary (1.02/1.03/1.05/1.06). The spotlight tour animates `top/left/width/height` (`:1365`) — layout-triggering properties. No scroll-entry reveals on section content (only heroes animate), so long pages appear statically [Observed]. Restrained-luxury norm: one curve, 500–700ms for transforms, 250–300ms for colour, one lift value, one zoom value.

### (f) The 10 Highest-Impact Upgrades

1. **Promote the serif to display.** `--font-display: 'Cormorant Garamond', Georgia, serif;` applied to `.rd-title`, `.rd-section-head h2`, hero H1: `font-weight: 400; letter-spacing: 0; line-height: 1.05;` bump sizes ~15% (serif needs it): hero `clamp(44px, 5.8vw, 76px)`. Keep Outfit for H3-and-below, UI, kickers.
2. **Kill the crimson.** `index.css:1947` → `box-shadow: 0 0 0 3px rgba(138,118,88,.15)`; `:776` → `background: rgba(138,118,88,.22); border-color: var(--accent);`
3. **Unify shadows onto tokens.** Replace every hardcoded `rgba(0,0,0,…)` and `rgba(26,26,46,…)` shadow with `var(--shadow-md)` / `var(--shadow-lg)` (`:486, :502, :819, :842, :1342, :1621, :1637, :1804`).
4. **One motion grammar.** Global: transforms `0.6s var(--ease-out-expo)`, colour/border `0.25s var(--ease-out-expo)`; hover lift `-4px` everywhere; image zoom `1.04` everywhere. Delete `.3s ease` etc.
5. **Redesign the placeholder** as §d above — 184 cards go from apology to brand moment for ~15 lines of CSS.
6. **Standardise the catalogue grid surface:** `.editorial .rd-product-media { background: var(--off-white); }`, all grid images `object-fit: contain; padding: 28px;`, reserve `cover` for lifestyle surfaces; then widen gaps: `gap: 40px 32px`.
7. **Tracking scale — two stops only:** kicker/label `letter-spacing: 0.22em; font-size: 11px;` meta/buttons `letter-spacing: 0.14em;` Apply to `.rd-kicker, .sl, .rd-select, .rd-tab-btn, .cb, .rd-product-meta`.
8. **Rhythm fixes:** `.rd-section-head { margin-bottom: 56px }`; `.rd-page-head { padding: 56px 48px 12px }`; `.rd-lede { max-width: 62ch }`; standardise dividers on `var(--light-grey)`.
9. **Hero typography correction:** homepage H1 to the display serif per (1); if kept in Outfit, drop `fontWeight` 500→300 and tighten to `-0.02em` (`homepage.jsx:54`).
10. **Scroll-entry reveals** on `.rd-section > *` children using the existing `useScrollAnimation` hook (`src/hooks/useScrollAnimation.js` [Observed, hook exists — usage not audited]): `opacity: 0; transform: translateY(24px);` resolving over `0.8s var(--ease-out-expo)` with 60–80ms stagger, gated behind `prefers-reduced-motion` (already tokenised at `:1500`).

Items 1–5 alone move the perceived tier from "nice template" to "commissioned build"; 6–10 finish the job. Everything above is additive CSS plus one JSX weight change — no layout rework required [Inferred].

---

## Polish & Micro-interactions — The Details Pass

STATVS already has a motion identity worth protecting: one strong easing token (`--ease-out-expo: cubic-bezier(0.16,1,0.3,1)`), soft warm-ink shadows, transform-based card hovers, and `prefers-reduced-motion` handled globally *and* in both carousels' autoplay logic [Observed]. The problem is consistency — the expo curve is the house voice, but roughly half the site still speaks in default `ease`. The gap between good and great here is not new animation; it's finishing the sentences already started.

### (a) Interaction audit — how things feel today

**Easing discipline is split.** Product cards use the expo token (`.rd-product-card` lift `.5s`, image zoom `.7s`) [Observed, index.css:229–248], but `.cc`, `.pc`, `.product-card`, `.cat-chip-img img`, bento and project cards all use generic `ease` at `.3–.4s` [Observed, index.css:1619–1639, 1780–1797]. Same site, two motion accents. The hero crossfade uses `1s ease-in-out` — a full second is editorial-slow, defensible for a luxury hero, but it's the only `ease-in-out` on the site.

**`transition: all` — 13 occurrences** [Observed]: `.rd-arrow` (871), `.rd-back-to-cats` (1079), `.si` (1605), `.cc .disc` (1632), `.cat-arrow` (1727), `.card-cta` (1795), `.account-nav` (2039), both overlay buttons (FavoriteButton.jsx:32,49; CompareButton.jsx:33,50), the hero dots (homepage:47), and product-detail:254. Beyond the perf hygiene issue, `all` on the scroll-reveal inline styles (see below) means *any* future inline style change animates at 0.8s — a latent bug.

**The carousel loop seam** (status-concept-products.jsx:38–53): slide `.7s` expo → `setTimeout` 700ms → snap with `transition: none` → `setTimeout` 20ms → re-enable. The values are conceptually right (expo's tail is visually settled by 700ms), but the mechanism is fragile [Inferred]: the 700ms timer starts at React commit, not transition start, so any main-thread jank (image decode on this image-heavy page) makes the snap land *mid-slide* — a visible jump. And the 20ms re-enable races the paint of the snapped frame; if the browser hasn't painted `translateX(0)` yet, the jump itself animates. The robust primitives are `transitionend` for the snap and a double-`requestAnimationFrame` for the re-enable. Timers also drift in background tabs; `transitionend` is immune.

**Press states are almost absent.** Only `.cat-filter:active { scale(0.96) }` exists [Observed, index.css:1829]. `.cb` (every CTA on the site), hero arrows, dropdown items, thumbnails — none acknowledge the press. This is the single cheapest feel upgrade available.

**Hover parity and gating.** Focus-visible treatment is genuinely good — a consistent 2px accent outline via `:where(a,button,…):focus-visible` plus component-specific rules [Observed, index.css:334–347]. Two gaps: dropdown menu items get hover tint via inline `onMouseEnter` JS (Header.jsx:130–131), so keyboard focus gets the outline but not the background — hover and focus should look like siblings. And no hover anywhere is gated behind `@media (hover: hover)`, so card lifts and JS hover handlers stick on touch [Observed].

**Hover that moves content vs. overlay:** the `-5px` card lift moves the whole card including text — acceptable and on-register — but the favorite/compare buttons sit as overlays that scale via inline JS handlers rather than CSS, mixing paradigms and defeating the reduced-motion kill switch.

**will-change** is used exactly once, correctly, on the carousel track [Observed, index.css:1001]. The three hero layers each carry inline `willChange: opacity` permanently — three persistent composited layers is fine at this scale [Observed].

### (b) What's missing — the good-to-great gaps

- **No image loading treatment anywhere** [Observed]. Lazy-loaded product images pop in at full opacity mid-scroll. No blur-up, no fade-on-load, no skeleton. On a site that *is* its photography, this is the most visible missing layer. A 300ms opacity fade gated on `onLoad` (or `img { opacity: 0 } img.loaded { opacity: 1 }`) is 90% of the win.
- **Dropdown mounts/unmounts instantly** [Observed, Header.jsx:120]. `{productsOpen && …}` with zero enter/exit. The hover-bridge `paddingTop: 8` is a nice invisible detail already there — but the panel itself blinks into existence. It deserves 160ms of `opacity + translateY(4px) + scale(0.98)` from `transform-origin: top left`. Exit can stay instant (exits faster than enters; instant is the limit case).
- **Scroll reveals barely exist.** `useScrollAnimation.js` hardcodes `opacity: 1` in both states [Observed, line 19] — so the "reveal" is a fully-visible section sliding 16px with `transition: all 0.8s`. It reads as a faint shove, not a reveal. Either commit (animate opacity 0→1 over ~0.6s with translateY(12px), transition scoped to `opacity, transform`) or delete the hook; the current half-state is invisible cost.
- **Toast has no exit** [Observed, ToastContext.jsx:12, index.css:2153]. Enters via the `fu` keyframe (`.35s`, translateY(32px) — a big entrance for a 14px-tall bar), then vanishes instantly at 4200ms. Keyframes also restart from zero when a second toast replaces the first mid-flight. Transitions (or `@starting-style`) + a 200ms fade-up exit + hover-to-pause would bring it to register. The close glyph is a literal "x" character — use a proper × or SVG.
- **The favorite-heart micro-moment** is an inflate-to-1.3 held for 400ms via `setTimeout` [Observed, FavoriteButton.jsx:12–14, 33]. Scale 1.3 on a 36px circle is loud for this brand, and the fill color change rides `transition: all .3s`. The luxury version: press-down `scale(0.92)` → settle to 1 (~300ms expo), heart fill fading in — felt, not shouted.
- **ComparePill pops in** with no entrance [Observed, ComparePill.jsx:10 — conditional render]. First-time event (rare) → deserves a 250ms rise. `@starting-style` makes this CSS-only.
- **Form details:** the contact submit swaps "Send enquiry" → "Sending…" with no width reservation (button reflows) and no spinner [Observed, contact:170–172]. The auth inputs' focus ring is `rgba(196,30,58,.12)` — **crimson**, a remnant of an old palette on a bronze site [Observed, index.css:1947]; same red hides in `.rd-showroom-tab.active` (`rgba(196,30,58,.18)`, line 776). The success state swap (`status === "sent"`) mounts with no transition.
- **MobileMenu** slides in with generic `ease .4s` [Observed, index.css:1765] — the one place the iOS drawer curve `cubic-bezier(0.32,0.72,0,1)` belongs. No body-scroll lock when open [Inferred — not in MobileMenu.jsx].

### (c) Performance of feel

Layout shift is largely handled: `aspect-ratio` reserves space in product grids, cat-chips, and rows [Observed]. Fonts load via Google Fonts `display=swap` with preconnect [Observed, index.html:8–12] — Outfit at weight 300 body text will visibly reflow on swap; a `size-adjust`-tuned fallback (or self-hosting + preload of the two critical weights) closes it. The hero dots animate `width` 8→24px — layout, not transform; tiny, but it's the only layout animation in the motion system [Observed]. Card hovers transition `box-shadow` (paint-bound) alongside transform — acceptable at this element count. Carousel and hero are both transform/opacity — 60fps-safe [Observed]; the real jank vector is the seam-timer race under image-decode load described above. Interaction latency is good — dropdown opens with zero delay on hover (arguably *too* eager crossing the nav; an 80ms intent delay is a taste call, not a defect).

### (d) Ranked improvements — highest feel-per-effort first

| # | Before | After | Where | Why |
|---|--------|-------|-------|-----|
| 1 | `.cb` has no press state | `.cb:active { transform: scale(0.98) }`, add `transform .15s var(--ease-out-expo)` to its transition list | index.css ~1548 | Every CTA site-wide starts listening to the user |
| 2 | Dropdown instant mount | 160ms `opacity 0→1, translateY(4px)→0, scale(.98)→1`, `transform-origin: top left`, expo | Header.jsx:120 | The most-touched interaction on desktop; instant exit stays |
| 3 | Toast: keyframe enter, no exit | Transition-based enter (translateY(-12px), 250ms expo) + 200ms exit fade; pause timer on hover | ToastContext.jsx + index.css:2139 | Interruptible, symmetric, calmer entrance |
| 4 | Product images pop in on lazy-load | `opacity: 0` → `opacity: 1` 300ms `ease` on `onLoad` | index.css `.rd-product-media img` + grid `<img>`s | The single most visible polish gap on an image-led site |
| 5 | `opacity: 1` in both reveal states, `transition: all .8s` | `opacity: 0 → 1`, `translateY(12px) → 0`, `transition: opacity .6s, transform .6s var(--ease-out-expo)` | useScrollAnimation.js:18–22 | Makes the reveal system actually reveal; kills the `all` landmine |
| 6 | Seam: `setTimeout(700)` + `setTimeout(20)` | `transitionend` listener for the snap; double-`rAF` before re-enabling | status-concept-products.jsx:41–49 | Jank-proof loop; no mid-slide jump under load |
| 7 | 13 × `transition: all` | Scope each: e.g. `.rd-arrow { transition: opacity .3s, transform .3s var(--ease-out-expo) }` | index.css lines listed above + both overlay buttons | Predictable motion, no accidental animation |
| 8 | Heart: `scale(1.3)` for 400ms via JS | `scale(0.92)` press → 1 settle, ~300ms expo; fill via `transition: fill .2s`; hover states in CSS behind `@media (hover:hover)` | FavoriteButton.jsx / CompareButton.jsx | Restrained delight; fixes sticky touch-hover |
| 9 | Crimson remnants `rgba(196,30,58,…)` | `rgba(138,118,88,.15)` (bronze) | index.css:1947, 776 | Off-palette focus ring is a visible seam in the system |
| 10 | Generic `ease` on `.cc`, `.pc`, `.product-card`, `.cat-chip-img img`, bento/project cards | `var(--ease-out-expo)`, keep durations | index.css:1619–1639, 1780+ | One motion voice everywhere |
| 11 | ComparePill appears instantly | `@starting-style { opacity: 0; transform: translateY(8px) }`, 250ms expo | index.css `.compare-pill` | Rare event → earns a considered entrance |
| 12 | MobileMenu `transform .4s ease` | `transform .45s cubic-bezier(0.32,0.72,0,1)`; exit `.3s` | index.css:1765 | The drawer curve drawers deserve; asymmetric exit |
| 13 | Submit button reflows on "Sending…" | `min-width` on the button (or fixed-width label span) | contact:170 | No layout twitch at the moment of highest user attention |
| 14 | Dropdown items: hover tint via JS only | Move to CSS class with matching `:focus-visible` background | Header.jsx:129–132 | Keyboard users get the full state, not just the outline |
| 15 | Hero dots `transition: all`, width animates | `transition: width .3s var(--ease-out-expo), background .3s ease` | homepage:47 | Scoped, on-voice; width here is small enough to keep |

None of these add bounce, spring, or spectacle — they finish the quiet system the site already declared. Items 1–5 are an afternoon and will be felt on every visit.

---

## Distinctiveness — Beyond Tasteful-Generic

**Design read:** redesign-preserve of a premium-consumer showroom site for affluent Algarve homeowners, currently executing "clean white quiet luxury" competently but anonymously. The build is disciplined; the problem is that its discipline is the *same* discipline as every AI-built luxury site. The fix is not more decoration; it is swapping generic signals for brand-owned ones.

### (a) The templated-pattern audit

**Patterns that actively read as AI-generic (retire or ration):**

1. **The kicker + H2 + bronze divider formula, everywhere.** [Observed] `.sl`/`.rd-kicker` (11px, uppercase, 3–4px tracking) plus the 60px `.la` gold line appears above nearly every section: 53 kicker instances across 17 page files. Homepage alone runs "Outdoor furniture specialists · Algarve" → "Why Statvs" → "Exclusive service" → "Visit us" → "Stay inspired". About runs five more. This is the #1 templated rhythm on AI-built sites.
2. **One typographic register for the entire UI.** [Observed] Nav, CTAs (`.cb`), pills, tabs, badges (`.mb`), footer headings, product meta, kickers, marquee: all 10–12px uppercase letter-spaced Outfit. When everything whispers in small caps, nothing is a headline moment and nothing is a label; the page has texture but no voice.
3. **One uniform hover recipe.** [Observed] `translateY(-3px) + soft shadow + img scale(1.02)` is applied identically to product cards, collection cards, quick cards, material cards, bento cards, project cards. A signature is *one* interaction done distinctively, not one transition pasted onto everything.
4. **Hero carousel with dots and chevrons.** [Observed] Three auto-rotating background images, 5s interval, pill-dots, glass arrow buttons, then the actual H1 in a separate white band below. This is the default "luxury template" hero of 2019. It also buries the headline below the fold-line of the image and forces the brand's first impression to be a stock-pattern control set.
5. **Marquee strips built from text tag-soup.** [Observed] Homepage marquee mixes fabric brands, towns and slogans ("Glatz Parasols · Quinta do Lago · 10+ Years Experience · Outdoor Living") — SEO keywords scrolling sideways. About has a second marquee of plain-text partner wordmarks. Two marquees sitewide is at the cap; text-only wordmark walls are a known tell.
6. **Numbered micro-labels.** [Observed] "Showroom 01 / Showroom 02" on homepage cards; values numbered "01–04" in bronze. Arabic-numeral enumeration eyebrows are a flagged AI tell — ironic for a brand whose entire name is a roman numeral joke waiting to be used.
7. **Symmetric equal-column grids as the only layout family.** [Observed] `repeat(3, 1fr)` product/collection/favorites grids, `repeat(4, 1fr)` stats/materials/quick grids, 50/50 story splits. The one asymmetric device that exists (the `featured` 2×2 editorial product card) proves the team can do better.
8. **Em-dashes shipped in visible copy.** [Observed] "makers — with seasonal After Care", "Thank you — your enquiry is on its way", "Vilamoura — since 2013".

**Patterns that are fine conventions (keep, refine):**

- **The newsletter block** [Observed] — the copy is genuinely good ("Notes from the showroom… a few times a year") and honest about frequency. Convention, not tell. Keep; consider moving it into the footer band.
- **Centered manifesto intro** ("Every piece in our showrooms earns its place…") [Observed] — centered is acceptable for a manifesto moment; this is the one section that *earns* centering.
- **Sticky product panel, floating-label enquiry form, compare pill, showroom split** [Observed] — solid commerce UX, brand-neutral, leave alone.
- **The border-radius:2px near-sharp system and warm-ink shadows** [Observed] — consistent and appropriate to the brand; this restraint is an asset.

### (b) The latent brand DNA worth amplifying

- **The STATVS logotype itself.** [Observed] Cormorant Garamond, 8px tracking, and the classical V-for-U. The CSS comment literally says `logo STATVS apenas` — the single most distinctive asset on the site is quarantined to 28px in the header. No competitor in the Algarve owns "Roman lapidary luxury."
- **The bronze A.** [Observed] `ST<span accent>A</span>TVS` in header, footer and auth logo. A one-letter mark already exists; it is just never used as a *mark*.
- **One quiet bronze** (#8a7658) on warm neutrals. [Observed] Correctly avoids the banned beige+brass cliché by staying near-white; the bronze is rationed well.
- **Real place anchoring.** [Observed] Quinta do Lago, Vale do Lobo, Almancil addresses, phone numbers, and actual GPS coordinates (`37.062229, -8.038336`) already live in the contact data. This is a *physical-venue* brand, which is the explicit exception to the locale-strip ban.
- **A voice with a thesis.** [Observed] "A quieter kind of luxury", "Material honesty", "Design without excess", and After Care ("ready the day you arrive, not a project when you do"). The values are strong enough to become UI, not just copy.

### (c) Ten distinctiveness moves

1. **Promote Cormorant to display duty — one serif moment per page.** Hero H1, the About pull-quote "A quieter kind of luxury", the enquiry thank-you. *Ownable:* every headline visually rhymes with the logotype. *Effort:* low. *Caution:* display only, never body or UI; weight 500+, sizes 40px+, or Cormorant goes spindly.
2. **Cut kickers to skill-legal levels and kill the 60px gold line as default.** Keep one kicker per ~3 sections (hero counts); elsewhere the headline stands alone. *Ownable:* restraint itself becomes the signature — most competitors label everything. *Effort:* low. *Caution:* re-check heading hierarchy after removal; some H2s will need +4–6px size.
3. **Make the bronze A a mark.** Extract the serif A as an SVG monogram: favicon, enquiry-confirmation seal, empty-state glyph (favorites), and the loading spinner replacement. *Ownable:* one letter, one color, unmistakably theirs. *Effort:* low. *Caution:* maximum 3–4 placements sitewide; never as a watermark behind text, never animated for its own sake.
4. **Roman numerals only where numbers already carry meaning.** Values "01–04" → set I–IV in Cormorant bronze; "Showroom 01/02" → "Showroom I / II". *Ownable:* STATVS is literally Roman; nobody else can justify this. *Effort:* trivial. *Caution:* do not spread numerals to section headers or pagination; confine to these two existing lists.
5. **Replace the hero carousel with one committed image + serif overlay headline.** One golden-hour terrace photo, H1 in Cormorant over a directional scrim (the kitchen-hero scrim treatment already in CSS is the template). *Ownable:* commitment reads as confidence; carousels read as indecision. *Effort:* medium. *Caution:* keep the two-CTA stack; do not add a scroll cue or dots-replacement gimmick.
6. **Turn "Material honesty" into UI: a photographed materials band.** Replace the three text badges ("Sunbrella® Fabrics" pills) with a strip of real macro textures — teak grain, Sunbrella weave, powder-coated aluminium — each with a one-line performance fact ("survives ten summers of UV"). *Ownable:* it enacts the brand value instead of claiming it. *Effort:* medium (needs 4–5 macro photos). *Caution:* no overlay pills on the swatch images; caption below, outside the image.
7. **Coordinates as a footer signature.** One line under each showroom address: "37.0622 N · 8.0383 W" (data already exists). *Ownable:* place-anchored brands earn coordinates; it quietly says "we are physically here," which is the whole showroom pitch. *Effort:* trivial. *Caution:* footer and contact panels only — never as an atmospheric nav/hero strip, and no live clocks or weather.
8. **Break the grid symmetry once per page.** Products keep the existing `featured` 2×2 card (extend it to every category view); About stats become an asymmetric 2fr/1fr band with one oversized number; showrooms go 7/5 split instead of 50/50. *Effort:* medium. *Caution:* asymmetry collapses to single column below 768px; don't stack multiple asymmetric families adjacently.
9. **Rebuild the marquee as a real-logo partner band, once, on the homepage.** Real Glatz/Sunbrella SVG marks (they are the actual credibility), delete the keyword marquee, delete the About text marquee. *Effort:* low-medium (logo sourcing/permission). *Caution:* logos only, no category captions; static row beats marquee if fewer than 8 marks.
10. **Copy pass: remove every em-dash and tighten registers.** Also replace weak stats ("76+ furniture pieces", "5 core service areas") with ones a client cares about ("120+ terraces maintained each season" if true). *Effort:* low. *Caution:* never invent numbers; if a real stat doesn't exist, cut the stat card.

### (d) Signature moments — the three things a first-time visitor should remember

1. **The opening breath (hero).** One still, sun-warm terrace image; "The Algarve's outdoor rooms, furnished and cared for." set in Cormorant with the bronze A echoing the wordmark above it. No dots, no rotation. The memory: *this brand holds still.*
2. **Touching the materials (homepage materials band → product entrance).** The macro-texture strip flowing into the editorial product grid with its one oversized featured card. The memory: *they care about what things are made of* — Material honesty, demonstrated.
3. **The thank-you (enquiry confirmation).** Keep the excellent existing promise copy ("replies within one business day"), set the headline in Cormorant, stamp the bronze A monogram, and show the chosen showroom's photo + coordinates. It is the last screen a qualified lead sees; today it is the plainest [Observed]. The memory: *a real place, real people, will answer.*

The through-line: STATVS already owns a Roman serif, a bronze letter, two sets of coordinates and a genuinely differentiated After Care story. Distinctiveness here is not adding — it is deleting the template scaffolding (kickers, dots, marquee soup, uniform hovers) so those four owned assets are the only voices left speaking.

---

## 10. Master Action List

Cross-cutting synthesis of the nine sections, sequenced by impact ÷ effort. Section references in brackets. Items marked ⚡ are hours, not days.

### 🚨 P0 — This week (repair before optimize)

| # | Action | Sections agreeing | Effort |
|---|--------|-------------------|--------|
| 1 | **Kill the "No image" display gate** — classifier picks *which* photo leads, never *whether* one shows; restore honest Featured/Name sorting | CRO §1a · SEO §2c · Psych §4c-1 · Visual §7d · Copy §3-P0-1 | ⚡ |
| 2 | **Redesign the placeholder** for genuinely imageless items: off-white panel, tone-on-tone serif "S" monogram, "See it in the showroom" / "Ver no showroom" | Visual §7d · Copy §3-P0-1 · Distinct. §9c-3 | ⚡ |
| 3 | **Static category grid on /products** — retire the auto-advance (WCAG 2.2.2; moving nav targets; mobile 1-tile/5s) | UX §6e · CRO §1c · Psych §4c-11 | ⚡ |
| 4 | **Fix the contact-form false success** — mailto fallback must not report "sent"; use the unused `error` state | UX §6c | ⚡ |
| 5 | **Product → form context**: pass product/SKU/size into /contact, prefill Interest+message, add product column to the enquiries insert | CRO §1b-1 · Psych §4c-3 | ⚡ |
| 6 | **Favourites → form payload** — attach the shortlist to "Request quote for all" | CRO §1b-2 · Psych §4c-9 | ⚡ |
| 7 | **Public compare route + enquiry CTA** — remove the login ambush; fix the hardcoded PT pill label | CRO §1b-3 | Half-day |
| 8 | **Contrast tokens**: use `#6f5e44` for accent-as-text; darken `--text-grey` usage on body text (both fail WCAG AA today) | UX §6d | ⚡ |
| 9 | **Kill the crimson remnants** (`index.css:776, 1947`) → bronze | Visual §7f-2 · Polish §8d-9 · UX §6b | ⚡ |
| 10 | **Mobile menu a11y**: `inert`/`visibility:hidden` when closed; name the hamburger (`aria-label`, `aria-expanded`) | UX §6d | ⚡ |
| 11 | **Real `<a href>` everywhere** — nav, dropdown, CTAs, product cards (footer already shows the pattern); kills the textContent-matching fragility and pre-builds the crawlable link graph | SEO §2b · UX §6a | Half-day |
| 12 | **Static JSON-LD (LocalBusiness/Organization) + meta description in index.html** — works even under HashRouter | SEO §2d-3 | ⚡ |

### P1 — Next 30 days (finish, prove, measure)

- **Serif promotion**: `--font-display: Cormorant Garamond` on H1/H2 (weight 400+, sizes +15%); drop homepage H1 weight 500→display serif. The consensus #1 visual upgrade. [Visual §7f-1 · Distinct. §9c-1]
- **GA4 via the analytics plan**: consent-mode v2 on the existing banner, manual page_views (HashRouter-aware), full event taxonomy with `has_image` dimension; add `language`/`source_path`/`client_id` columns to enquiries. [Analytics §5]
- **Proof layer**: 2–3 discreetly attributed client lines ("Private client, Quinta do Lago"), real partner logo row (Glatz/Sunbrella/Draco), hospitality line if contractually safe. No star ratings, no widgets. [Psych §4c-4/5 · CRO §1b-4]
- **Pricing-ambiguity line** on product detail: "Each setting is priced on configuration and fabric. Detailed proposal within 48 hours." [Psych §4c-2]
- **Copy P0/P1 batch**: supplier-boilerplate purge in catalogProducts (the "andare" text), fallback-specs absurdity ("— Included"), detail CTAs → "Request a proposal", About story rewrite, products-page "pieces" not "products shown". All EN+PT pairs provided in §3. [Copy §3]
- **PT parity workstream**: extend dictionary coverage to Contact/About/Projects/Glatz bodies; convert client-area "tu" → courteous third person with diacritics. [Copy §3.3]
- **Newsletter**: wire to a `subscribers` table (enquiries pattern) or delete the section. [CRO §1b-5 · Psych §4c-10]
- **After Care page**: replace the placeholder — it's the positioning moat and a homepage CTA dead-ends into "coming soon". [CRO §1b-6 · SEO §2d-7]
- **Nav parity & dead links**: reconcile desktop/mobile menus (About missing on desktop; dead "Leisure/Sound Systems" buttons), real Privacy/Cookie/Terms pages (compliance — the site sets a consent cookie). [UX §6a]
- **Polish top-5**: button press states, dropdown enter animation, toast exit + hover-pause, image fade-on-load, fix useScrollAnimation (opacity 0→1). [Polish §8d-1..5]
- **Motion/shadow token unification**: one easing, one lift, one zoom; replace 13 `transition: all`; retokenize hardcoded cold shadows. [Visual §7f-3/4 · Polish §8d-7/10]
- **Category URL decision** (`/products/:cat`) + alias canonical map — decide now, ship at migration. [SEO §2a]
- **Keyword-grade H1s + 100–200-word category intros** (prerender-ready). [SEO §2b/2a]
- **Remove the PageNav dev widget from production.** [UX §6a]

### P2 — The quarter (compound)

- Batch background-removal pipeline for the ~134 non-white photos → earn the uniform studio grid; then `--off-white` card surface + wider grid gaps. [CRO §1a-opt2 · Visual §7f-6]
- Curation layer: 3–6 "Signature settings" pinned per category; one "Most specified" tag. [Psych §4c-6]
- Enquiry confirmation as a signature moment: serif headline, bronze-A seal, showroom photo + coordinates, "what happens next" steps. [Distinct. §9d-3 · Psych §4c-7]
- Distinctiveness batch: kicker rationing, Roman numerals (I–IV, Showroom I/II), coordinates in footer, materials macro-texture band, one asymmetric layout per page, real-logo partner band replacing marquee text-soup. [Distinct. §9c]
- Hero decision: test one committed static hero vs. carousel (data from GA4 first). [Distinct. §9c-5 · Psych §4c-11 vs Analytics §5d-3]
- A/B roadmap in the §5 order — only after GA4 has 4+ weeks of baseline. [Analytics §5d]
- `llms.txt`; image `width`/`height` for CLS; font self-hosting with size-adjusted fallback. [SEO §2d-4 · Polish §8c]
- Lightbox focus management; dropdown roving focus or plain-list roles; `@media (hover:hover)` gating. [UX §6d · Polish §8a]

### The dependency spine

**No-image fix (1–2) → static grid (3) → bridges + false-success (4–7) → measurement (GA4)** is the conversion path: nothing else is provable until the catalogue is visible, the funnel is airtight, and events are flowing. The **visual tier jump (serif + tokens + polish top-5)** is independent and can run in parallel. The routing/SSG migration remains its own planned project — items 11–12 here are its cheap prerequisites, not its replacement.

---

*Prepared as an internal working document. The two verification flags from the 2 July research still stand before public claims: official Glatz/Draco dealer status wording, and exact showroom NAP data.*
