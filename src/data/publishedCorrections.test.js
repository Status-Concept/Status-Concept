import { describe, expect, it } from 'vitest'
import { allProducts, publicSearchProducts, publishedCorrectionProducts } from './productCatalog'
import { demoProductIds } from './demoProducts'
import { publishedCorrectionImages, publishedLocalProducts } from './publishedCorrections.generated'

describe('public correction release', () => {
  it('maps every corrected image to one searchable, routable product', () => {
    const ids = Object.keys(publishedCorrectionImages)
    expect(ids).toHaveLength(139)
    expect(new Set(ids).size).toBe(139)
    expect(publishedCorrectionProducts).toHaveLength(139)
    for (const id of ids) {
      const product = publishedCorrectionProducts.find((item) => item.id === id)
      expect(product?.img).toBe(publishedCorrectionImages[id])
      expect(product?.images).toEqual([publishedCorrectionImages[id]])
      expect(allProducts.filter((item) => item.id === id)).toHaveLength(1)
      expect(publicSearchProducts.filter((item) => item.id === id)).toHaveLength(1)
      expect(product.img).toMatch(/^\/product-images\/corrections\/\d+-[a-z0-9-]+\.webp$/)
    }
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
