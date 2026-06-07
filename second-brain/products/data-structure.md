# Product Data Structure

## Data Files
- `src/data/kitchenProducts.js` — The only dedicated data file so far
  - Exports: `kitchenCollectionMeta`, `kitchenProducts`
- Other product data appears to be inline in page components or loaded via Supabase

## Kitchen Product Fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | URL slug, kebab-case |
| `name` | string | Display name |
| `collection` | string | `black-stainless-steel`, `carbon-line-teak`, `teak` |
| `collectionName` | string | Human-readable collection label |
| `category` | string | Always `'kitchen'` in this file |
| `img` / `image` | string | Asset path — **inconsistent field name** |
| `tag` | string | `'Popular'`, `'New'`, or `''` |
| `desc` / `description` | string | Marketing copy — **inconsistent field name** |
| `specs` | object | SKU, type, dimensions, material, heat output, cooking area |
| `sizeOptions` | array | Optional — for Kamado tables and configurable items |

## Supabase
- Auth and user data managed via Supabase
- Favorites likely stored in Supabase (linked to user auth)
- See `src/context/AuthContext` and `src/pages/client/`

## Known Data Inconsistencies to Fix
- `img` vs `image` — standardize to one field name
- `desc` vs `description` — standardize to one field name
