# STATVS — Second Brain

Central knowledge base for the Status Concept website project.
Keep this updated as the project evolves — Claude reads and writes here to stay in sync.

## Workflow Notes
- **Image drop folder:** `C:\Users\Santi\status-concept\random-images\` — drop new images here, then tell Claude to use them
- **Dev server:** `npm run dev` from `C:\Users\Santi\status-concept\` — runs on port 5173 (may vary)
- **GitHub:** Claude pushes to GitHub when the user asks.
- **Last browsed:** 2026-06-06 at http://localhost:5173

## Structure

| Folder | Contents |
|--------|----------|
| `brand/` | Brand identity, tone of voice, copy guidelines |
| `products/` | Product catalog, categories, specs reference |
| `pages/` | Per-page content, copy, and feature notes |
| `tech/` | Tech stack, architecture, data models, Supabase |

## Index

### Brand
- [brand/identity.md](brand/identity.md) — Brand name, positioning, values, taglines
- [brand/showrooms.md](brand/showrooms.md) — Showroom locations, hours, contacts
- [brand/partners.md](brand/partners.md) — Partner brands and material suppliers

### Products
- [products/categories.md](products/categories.md) — All product categories and counts
- [products/kitchen-collections.md](products/kitchen-collections.md) — Kitchen collections overview + price ranges
- [products/kitchen/black-stainless-steel.md](products/kitchen/black-stainless-steel.md) — 13 products, full SKUs & prices (Draco Grills)
- [products/kitchen/carbon-line-teak.md](products/kitchen/carbon-line-teak.md) — 28 products, full SKUs & prices (Draco Grills)
- [products/kitchen/teak.md](products/kitchen/teak.md) — 12 products, full SKUs & prices (Draco Grills)
- [products/data-structure.md](products/data-structure.md) — How product data is structured in code
- [products/glatz-shade.md](products/glatz-shade.md) — Glatz parasols: full range, model specs (Sombrano S+, Sunwing Casa), fabric classes, selling angles
- [products/glatz-parasols/](products/glatz-parasols/README.md) — One file per Glatz model (21 files): specs, sizes, pricing, image refs, official URLs
- [products/glatz-images/](products/glatz-images/README.md) — Official product images for all 21 Glatz models (hero cut-outs + lifestyle shots)

### Pages
- [pages/navigation.md](pages/navigation.md) — Full nav menu, mega menus, footer, cookie banner
- [pages/homepage.md](pages/homepage.md) — All sections, hero copy, featured collections, stats, projects, showrooms
- [pages/products-page.md](pages/products-page.md) — Filters, layout, sort options
- [pages/about.md](pages/about.md) — Company story, timeline, values, stats
- [pages/contact.md](pages/contact.md) — Contact info, showroom details, form fields
- [pages/projects.md](pages/projects.md) — Portfolio page, all 6 current projects listed

### Off-limits (other business)
- [NOT-FOR-THIS-SITE/README.md](NOT-FOR-THIS-SITE/README.md) — Inovation2Lead products (pergolas, awnings, blinds) — **separate company, do not use here**

### Tech
- [tech/stack.md](tech/stack.md) — Tech stack, dependencies, build setup
- [tech/routing.md](tech/routing.md) — All routes and page components
- [tech/auth.md](tech/auth.md) — Auth system, Supabase, client portal
