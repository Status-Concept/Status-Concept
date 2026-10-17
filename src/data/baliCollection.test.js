import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { baliProducts, retiredBaliProductIds } from './baliCollection'
import { allProducts, publicSearchProducts } from './productCatalog'
import { refineProductResults, productHasImage } from '../pages/status-concept-products'
import { findProductCollectionMatch } from '../utils/productSearch'

describe('reference-based Bali collection', () => {
  it('publishes only the three referenced models with distinct identities', () => {
    expect(baliProducts.map((product) => product.name)).toEqual([
      'Bali Lounge Armchair & Footstool', 'Bali Sun Lounger', 'Bali Double Sun Lounger',
    ])
    for (const products of [allProducts, publicSearchProducts]) {
      expect(products.filter((product) => product.collectionName === 'Bali').map((product) => product.id).sort())
        .toEqual(baliProducts.map((product) => product.id).sort())
      expect(products.some((product) => retiredBaliProductIds.has(product.id))).toBe(false)
    }
  })

  it('shows all three models from the existing Bali collection link without misclassifying loungers', () => {
    const results = refineProductResults(publicSearchProducts, { category: 'lounge', collection: 'bali' })
    expect(results.map((product) => product.id)).toEqual(baliProducts.map((product) => product.id))
    expect(baliProducts.filter((product) => product.category === 'sunlounger')).toHaveLength(2)
    expect(refineProductResults(baliProducts, { category: 'lounge' })).toHaveLength(1)
    expect(findProductCollectionMatch(publicSearchProducts, 'Bali')).toMatchObject({ count: 3 })
  })

  it('uses a separate studio and minimal-background image for each model, with responsive files', () => {
    expect(new Set(baliProducts.map((product) => product.img)).size).toBe(3)
    expect(new Set(baliProducts.map((product) => product.heroImage)).size).toBe(3)
    for (const product of baliProducts) {
      expect(productHasImage(product)).toBe(true)
      expect(product.images).toEqual([product.img, product.heroImage])
      for (const image of product.images) {
        expect(image).toContain('/product-images/bali-reference-v2/')
        for (const suffix of ['', '-w400', '-w800']) {
          expect(existsSync(`public${image.replace(/\.webp$/, `${suffix}.webp`)}`), image + suffix).toBe(true)
        }
      }
    }
  })
})
