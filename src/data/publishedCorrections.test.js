import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { allProducts, publicSearchProducts, publishedCorrectionProducts, isRattanProduct } from './productCatalog'
import { demoProductIds } from './demoProducts'
import { publishedCorrectionImages, publishedLocalProducts } from './publishedCorrections.generated'

describe('public correction release', () => {
  it('provides existing primary and individual hover images for every studio product, including local records', () => {
    for (const product of publicSearchProducts.filter((item) => item.fit === 'contain')) {
      expect(existsSync(`public${product.img}`), product.id).toBe(true)
      expect(product.heroImage, product.id).toBe(`/product-images/hero/${product.id}.webp`)
      expect(existsSync(`public${product.heroImage}`), product.id).toBe(true)
    }
  })
  it('maps every corrected image to one searchable, routable product', () => {
    const ids = Object.keys(publishedCorrectionImages)
    expect(ids).toHaveLength(139)
    expect(new Set(ids).size).toBe(139)
    expect(publishedCorrectionProducts).toHaveLength(138)
    for (const id of ids) {
      if (id === 'bonaire-able') {
        expect(publishedCorrectionProducts.some((item) => item.id === id)).toBe(false)
        expect(publicSearchProducts.some((item) => item.id === id)).toBe(false)
        continue
      }
      const product = publishedCorrectionProducts.find((item) => item.id === id)
      expect(product?.img).toBe(publishedCorrectionImages[id])
      expect(product?.images).toEqual([publishedCorrectionImages[id]])
      expect(allProducts.filter((item) => item.id === id)).toHaveLength(1)
      expect(publicSearchProducts.filter((item) => item.id === id)).toHaveLength(1)
      expect(product.img).toMatch(/^\/product-images\/corrections\/\d+-[a-z0-9-]+\.webp$/)
    }
  })

  it('excludes the rattan products from catalogue and public search', () => {
    const excluded = [
      'bonaire-able', 'monaco-side-table', 'pietra-dining-armchair',
      'pietra-dining-chair', 'st-tropez-high-side-table',
      'st-tropez-low-side-table', 'st-malo-swivel-daybed', 'st-malo-yacht-daybed',
    ]
    for (const id of excluded) {
      expect(allProducts.some((item) => item.id === id)).toBe(false)
      expect(publicSearchProducts.some((item) => item.id === id)).toBe(false)
      expect(demoProductIds.has(id)).toBe(false)
    }
    expect(allProducts.some(isRattanProduct)).toBe(false)
  })

  it('adds only minimal public fields for the 66 formerly local-only product records', () => {
    expect(publishedLocalProducts).toHaveLength(66)
    for (const product of publishedLocalProducts) {
      expect(Object.keys(product).sort()).toEqual([
        'category', 'categoryLabel', 'collection', 'collectionName', 'fit', 'id',
        'images', 'img', 'name', 'publishedCorrection',
      ])
      expect(product.name).toBeTruthy()
      expect(demoProductIds.has(product.id)).toBe(false)
      expect(JSON.stringify(product)).not.toMatch(/stockQuantity|\.catalog-private|selectionEvidence|sourceReference/)
    }
  })
})
