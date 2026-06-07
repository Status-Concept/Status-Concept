# Modular Kitchen Collections

**Brand:** Draco Grills (dracogrills.co.uk)
**Detailed per-collection specs:** See `products/kitchen/` subfolder
Source code: `src/data/kitchenProducts.js` (77.7 KB, 53 products)
Source data: `Produtos-Status-Concept.zip` extracted 2026-06-03

## Collections (`kitchenCollectionMeta`)

### 1. Black Stainless Steel ("Nero")
- **Handle:** `black-stainless-steel`
- **Material:** 304-grade black stainless steel
- **Tops:** Granite
- **Features:** BBQs, fridges, sinks, modular cabinets

### 2. Carbon Line Teak
- **Handle:** `carbon-line-teak`
- **Material:** Black reclaimed teak
- **Tops:** Ceramic
- **Style:** Dark, modern, modular

### 3. Teak
- **Handle:** `teak`
- **Material:** Natural reclaimed teak
- **Tops:** Ceramic
- **Style:** Warm, natural

---

## Product Counts by Collection

| Collection | Products | Price Range (GBP) |
|-----------|----------|-------------------|
| Black Stainless Steel | 13 | £666.75 – £2,333.35 |
| Carbon Line Teak | 28 | £238.89 – £3,276.70 |
| Teak | 12 | £794.45 – £2,586.90 |
| **Total** | **53** | |

## Product Types (53 total)

| Type | Notes |
|------|-------|
| 6-Burner Gas BBQ | 90,000 BTU, 95.5×45.5cm cooking area, SKU: DRAK806 (Black SS) |
| 4-Burner Gas BBQ | 65,000 BTU |
| Fridge Cabinet (single door) | Multiple door/material variants in Carbon Line |
| Fridge Cabinet (double door) | Multiple door/material variants in Carbon Line |
| Sink Cabinet | With work surface |
| Drawer Unit (3-drawer) | Storage modules |
| Waste Bin Cabinet | Black SS collection |
| Sear Station | With side burner |
| Corner Module | 90° configuration |
| Modular Island Unit | 180cm wide prep center (Carbon Line) |
| Kamado Egg Cabinet Table | 60cm & 70cm, with 22" or 27" kamado options |
| Coffee Bar | Teak collection |
| Wine Cabinet | Teak collection |
| Add-on Shelving | Slatted shelf + double shelf accessories |

---

## Product Data Shape

```js
{
  id: 'slug-based-id',
  name: 'Product Name',
  collection: 'black-stainless-steel' | 'carbon-line-teak' | 'teak',
  collectionName: 'Display Name',
  category: 'kitchen',
  img: 'path/to/image',       // some use img, some use image
  tag: 'Popular' | 'New' | '',
  desc: 'Marketing copy',     // some use desc, some use description
  specs: {
    sku: 'DRAK806',
    type: 'Barbecue > Gas > 6 Burner',
    dimensions: '119cm (H) x 110cm (W) x 73.5cm (D)',
    material: '304-grade black stainless steel',
    heatOutput: '90,000 BTU (26.37KW)',
    cookingArea: '95.5 x 45.5cm (4345cm2)'
  },
  sizeOptions: [...]   // optional, for configurable products
}
```

> **Note:** Field naming is inconsistent — some products use `img` vs `image`, `desc` vs `description`. Watch for this when rendering.
