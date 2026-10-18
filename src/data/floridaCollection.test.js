import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { floridaProducts, retiredFloridaProductIds, floridaCollectionCover, floridaCollectionHero } from './floridaCollection'
import { allProducts, publicSearchProducts } from './productCatalog'
import { findProductCollectionMatch } from '../utils/productSearch'

describe('reference-based Florida collection', () => {
  it('publishes exactly the five referenced models under Dining', () => {
    expect(floridaProducts.map((p) => p.name)).toEqual([
      'Florida Dining', 'Florida Dining Armchair',
      'Florida Dining Table with Miami Dining Armchairs',
      'Florida Dining Table with Orlando Dining Armchairs', 'Florida Dining Set',
    ])
    for (const products of [allProducts, publicSearchProducts]) {
      expect(products.filter((p) => p.collectionName === 'Florida').map((p) => p.id).sort())
        .toEqual(floridaProducts.map((p) => p.id).sort())
      expect(products.some((p) => retiredFloridaProductIds.has(p.id))).toBe(false)
    }
    expect(floridaProducts.every((p) => p.category === 'dining')).toBe(true)
    expect(findProductCollectionMatch(publicSearchProducts, 'Florida')).toMatchObject({ count: 5, category: 'dining' })
  })

  it('retains both Miami finishes as gallery photos, never the hover setting', () => {
    const miami = floridaProducts.find((p) => p.id === 'florida-dining-table-with-miami-dining-armchairs')
    expect(miami.images).toHaveLength(2)
    expect(miami.images[0]).toContain('miami-charcoal-studio')
    expect(miami.images[1]).toContain('miami-white-studio')
    for (const p of floridaProducts) {
      expect(p.images).not.toContain(p.heroImage)
      expect(p.hoverOnly).toBe(true)
    }
  })

  it('provides separate studio, hover and collection assets with responsive variants', () => {
    const paths = new Set([floridaCollectionCover, floridaCollectionHero, ...floridaProducts.flatMap((p) => [...p.images, p.heroImage])])
    for (const path of paths) {
      for (const suffix of ['', '-w400', '-w800']) {
        expect(existsSync(`public${path.replace(/\.webp$/, `${suffix}.webp`)}`), path + suffix).toBe(true)
      }
    }
  })
})
