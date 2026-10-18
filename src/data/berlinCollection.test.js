import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { berlinProducts, retiredBerlinProductIds, berlinCollectionCover, berlinCollectionHero } from './berlinCollection'
import { allProducts, publicSearchProducts } from './productCatalog'
import { findProductCollectionMatch } from '../utils/productSearch'

describe('reference-based Berlin collection', () => {
  it('shows only the two referenced products, retaining canonical IDs', () => {
    expect(berlinProducts.map((p) => p.id)).toEqual(['berlin-modular-sofa', 'berlin'])
    for (const products of [allProducts, publicSearchProducts]) {
      expect(products.filter((p) => p.collectionName === 'Berlin').map((p) => p.id).sort())
        .toEqual(['berlin', 'berlin-modular-sofa'])
      expect(products.some((p) => retiredBerlinProductIds.has(p.id))).toBe(false)
    }
    expect(findProductCollectionMatch(publicSearchProducts, 'Berlin')).toMatchObject({ count: 2, category: 'lounge' })
  })

  it('keeps configurations in studio galleries and environments only on hover', () => {
    expect(berlinProducts[0].images).toHaveLength(4)
    expect(berlinProducts[1].images).toHaveLength(3)
    for (const p of berlinProducts) {
      expect(p.images.every((image) => image.endsWith('-studio.webp'))).toBe(true)
      expect(p.images).not.toContain(p.heroImage)
      expect(p.hoverOnly).toBe(true)
    }
  })

  it('has complete assets and responsive variants', () => {
    const paths = new Set([berlinCollectionCover, berlinCollectionHero, ...berlinProducts.flatMap((p) => [...p.images, p.heroImage])])
    for (const path of paths) {
      for (const suffix of ['', '-w400', '-w800']) {
        expect(existsSync(`public${path.replace(/\.webp$/, `${suffix}.webp`)}`), path + suffix).toBe(true)
      }
    }
  })
})
