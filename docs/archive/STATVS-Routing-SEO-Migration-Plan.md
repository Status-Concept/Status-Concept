# STATVS — Routing & SEO Rendering Migration Plan

**Status:** Proposal — no code changed yet (per your "plan it first" decision).
**Date:** 2 July 2026
**Owner:** decision needed from Diogo before any work starts.
**Why this exists:** it's the #1 finding in the marketing research (§1, §2). Fixing it is a *bundle* — the pieces only pay off together — and it touches every internal link plus the live deployment, so it gets its own plan instead of being done inline.

---

## 1. The problem, precisely

The rebuilt site (`Status-Concept/`) is a client-rendered SPA on **`HashRouter`**:

- **Every page is the same URL** to a crawler: `statusconcept.com/#/en/products`, `/#/en/contact` etc. all resolve to `statusconcept.com/` — the `#fragment` is never sent to the server and is ignored by Google's indexer. So the site is effectively **one indexable page**.
- **The initial HTML is an empty `<div id="root">`** (`index.html`). Google *can* render JS, but slowly and unreliably; **AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Gemini) mostly do not execute JS at all** — they get a blank page.
- **No per-route metadata** — one static `<title>` for the whole site; no meta description, canonical, OG, or hreflang per page.
- **Translation is a client-side DOM swap** (`TranslationLayer.jsx`) — even if a crawler rendered the page, the PT version only exists *after* JS runs, so there is no PT HTML to index.
- **No sitemap.xml.** (robots.txt now added.)

**Net effect if launched as-is:** statusconcept.com goes from an indexed, ranking WordPress site to *invisible* — to Google and to every AI answer engine. This is a **launch blocker**, not an optimisation.

### Why BrowserRouter *alone* is not the fix (and is actually a regression)

Swapping `HashRouter → BrowserRouter` gives real paths (`/en/products`) **but the served HTML is still an empty `#root`** — crawlers get the same nothing. What it *adds* on its own is **deep-link 404s on refresh**: visiting `/en/products` directly, or refreshing it, hits the host looking for a file that doesn't exist. That only works if the host is configured to serve `index.html` for all paths (SPA fallback). So BrowserRouter is only safe *and* only worthwhile as part of the full bundle below.

---

## 2. The blocking unknown: **where is the site deployed?**

This single fact decides whether this is a **~1 day job or a multi-day migration.** Please confirm:

| If the production host is… | Then SPA-fallback + 301s + headers are… | Effort |
|---|---|---|
| **Netlify / Vercel / Cloudflare Pages** | Trivial — a `_redirects` / `vercel.json` / `netlify.toml` with rewrite + 301 rules | **Low** |
| **A generic static host / cPanel / S3 without rewrite control** | Requires `.htaccess`, or the host may not support fallback at all → prerendering becomes mandatory, not optional | **Medium–High** |
| **Still WordPress hosting, replacing it in place** | Need to confirm the swap plan and DNS/URL mapping | **Medium** |

**I currently see no host config in the repo** (no `netlify.toml`, `vercel.json`, `CNAME`, or CI workflow), and `vite.config.js` uses `base: './'` — which *hints* at a generic static host with no rewrite control. If that's right, this is the medium-high path and prerendering is required. **Please tell me the host before I estimate firmly.**

---

## 3. The bundle (what "fixing it" actually means)

These ship together or not at all:

1. **`HashRouter → BrowserRouter`** (`src/main.jsx`) + set `vite.config.js` `base: '/'`.
2. **Static prerendering / SSG** — generate real HTML per route at build time (see §4 for the tool choice). This is the piece that makes the site visible to search + AI.
3. **Per-route metadata** — `<title>`, meta description, canonical, OG, hreflang per page and per language. On **React 19** this needs *no library* — components can render `<title>`/`<meta>` and React hoists them to `<head>`.
4. **Host rewrites** — SPA fallback so deep links / refreshes work (host-specific, §2).
5. **301 redirects** from the old WordPress URLs (`/shop/`, `/product-category/…`, `/status-concept/`, `/contact-us/`, `/contactos/`) to the new routes — preserves existing Google ranking equity. Host-specific.
6. **sitemap.xml** listing both language trees (only meaningful once real URLs exist).
7. **Real i18n content** (the big one — see §5): the DOM-swap `TranslationLayer` produces zero PT HTML for crawlers. For PT SEO/AEO value, PT needs real per-route translated content that prerenders.

Items 1–6 are the "make it visible" core. Item 7 is a larger sub-project that can be phased.

---

## 4. Recommended approach for prerendering

Three realistic options, in order of preference for *this* codebase:

**Option A — `vite-react-ssg` (recommended).** Integrates with the existing `react-router-dom` v7 route tree; pre-renders each route to static HTML at build; supports React 19 document metadata. Lowest disruption — keeps the current component structure and router. Requires routes to be enumerable (they mostly are; dynamic product pages need a route manifest fed to the prerenderer).

**Option B — `vite-plugin-prerender` / Puppeteer crawl at build.** Bolt-on: build the SPA, then a headless browser visits each route and writes the rendered HTML. Zero refactor, but slower builds, fragile on dynamic routes, and no true SSR data flow. A pragmatic stopgap.

**Option C — migrate marketing pages to Astro (or Next).** Highest ceiling for SEO/AEO and content (journal/guides from §5), but a real rewrite of the public pages. Overkill now; worth revisiting when the content engine (§5 of the research) is funded.

**Recommendation:** Option A. Fall back to B only if enumerating dynamic routes proves painful under deadline.

---

## 5. The i18n complication (don't skip this)

`TranslationLayer.jsx` walks the DOM and swaps English text for Portuguese *at runtime, keyed on exact English strings*. Consequences for this migration:

- **Prerendered PT pages would contain English HTML** (the swap hasn't run yet at build time). So SSG alone gives PT no crawlable content — defeating half the AEO goal for the domestic audience.
- **It's fragile** — every copy edit must also update the dictionary key (we hit this today doing the copy rewrites).

**Options:**
- **Phase 1 (ship visibility fast):** prerender **EN only** with full metadata + hreflang pointing at PT; keep the DOM-swap for PT as a client enhancement. EN gets the SEO/AEO win immediately; PT stays at parity with today (client-swapped).
- **Phase 2 (PT parity):** move to a real i18n resource system (e.g. `react-i18next` or route-level content modules) so PT prerenders as real HTML. This is the larger lift and can follow once EN visibility is proven in Search Console.

This phasing lets us unblock launch without waiting on the full i18n rebuild.

---

## 6. Proposed sequence & rough effort (assuming Netlify/Vercel/Cloudflare)

| Phase | Work | Effort |
|---|---|---|
| **0. Confirm host** | You tell me the host; I confirm rewrite/redirect capability | — |
| **1. Router + base** | `BrowserRouter`, `base:'/'`, fix any hardcoded `#` links, host SPA-fallback rule | 0.5 day |
| **2. Prerender (EN) + metadata** | Wire `vite-react-ssg`, per-route `<title>`/meta/canonical/OG, hreflang, build manifest for dynamic routes | 1–2 days |
| **3. 301s + sitemap** | Map old WP URLs → new routes in host config; generate sitemap.xml | 0.5 day |
| **4. Verify** | Fetch-as-Google / view-source per route, Rich Results test, submit sitemap in GSC, crawl for 404s | 0.5 day |
| **5. PT parity (later)** | Real i18n resources so PT prerenders | 2–4 days |

**Phases 1–4 ≈ 3–4 days on a modern host.** On a no-rewrite static host, add time for `.htaccess`/prerender workarounds or a host move.

---

## 7. Risks & mitigations

- **Deep-link 404s** if the host fallback isn't set → *Mitigation:* configure and test fallback in Phase 1 before anything else; don't merge router swap until fallback is verified.
- **Lost ranking equity** if 301s are missed → *Mitigation:* pull the old WP URL list (from the live sitemap / GSC / Screaming Frog) and map every ranking URL before DNS cutover.
- **Dynamic product routes not prerendered** → *Mitigation:* generate a route manifest from the product data at build; verify each product URL returns real HTML.
- **PT shows English to crawlers** (see §5) → *Mitigation:* accept EN-first (Phase 1), schedule PT parity (Phase 5); set hreflang correctly so it's not treated as duplicate/broken.
- **Analytics blind spot** — we still can't measure any of this → *Mitigation:* add GA4 + Search Console as part of Phase 4 (also a standalone research item).
- **Client-area routes** (`/cliente`, login) should stay SPA / `noindex` — don't prerender or expose them.

---

## 8. What I need from you to start

1. **The production host** (Netlify / Vercel / Cloudflare / cPanel / other) — decides §2 and the whole estimate.
2. **Confirm EN-first is acceptable** for the visibility launch, with PT parity as a fast-follow (§5), or whether PT must ship in the same phase.
3. Access to the **old WordPress URL list** (or permission to crawl statusconcept.com) so I can build the 301 map.

Once I have #1, I'll turn §6 into a concrete, task-level plan and we can start with Phase 1.
