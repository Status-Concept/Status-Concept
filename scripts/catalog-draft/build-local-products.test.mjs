import { describe, expect, it } from 'vitest'
import { buildLocalProduct } from './build-local-products.mjs'

const metadata = {
  productName: 'Celia Dining Armchair Artie Ivory White Dune',
  productIds: ['abc123'],
  originalFolder: '02 - FURNITURE/01 - FURNITURE BY COLLECTION AND ITEM/CELIA',
  images: [
    { file: '01.png', sha256: 'one', reviewStatus: 'needs-human-review' },
    { file: '02.png', sha256: 'two', reviewStatus: 'needs-human-review' },
  ],
  inventoryMatches: [
    {
      sku: 'ABA36.0001.AW.NT.560D',
      description: 'Dining Armchair CELIA - Artie Ivory White / Dune cushions',
      stockQuantity: 2,
      supplier: 'ABLE TRADING',
      family: 'Dining',
      fullFamily: 'Outdoor furniture / Dining',
      extraFields: ['Natural Twist Wicker'],
      sourceRow: 120,
      confidence: 'high',
      score: 0.94,
    },
  ],
}

describe('local product builder', () => {
  it('preserves local images and inventory variants without publishing them', () => {
    const product = buildLocalProduct(metadata, 'CELIA/Celia Dining Armchair [abc123]')

    expect(product.id).toBe('local-product-abc123')
    expect(product.category).toBe('Dining')
    expect(product.referenceImages).toHaveLength(2)
    expect(product.referenceImages[0].path).toContain('.catalog-private/reference-images/professional-white/organized-by-product/CELIA/')
    expect(product.variants[0]).toMatchObject({
      sku: 'ABA36.0001.AW.NT.560D',
      stockQuantity: 2,
      reviewStatus: 'needs_review',
    })
    expect(product.imageStatus).toBe('reference-only')
    expect(product.publicationStatus).toBe('hidden')
    expect(product.isPublished).toBe(false)
    expect(JSON.stringify(product)).not.toMatch(/https?:\/\//)
  })

  it('keeps products without a safe SKU match visible without inventing a variant', () => {
    const product = buildLocalProduct({ ...metadata, productIds: ['unmatched'], inventoryMatches: [] }, 'CELIA/Unmatched')

    expect(product.id).toBe('local-product-unmatched')
    expect(product.variants).toEqual([])
    expect(product.supplier).toBe('Pending supplier review')
    expect(product.reviewNotes).toContain('No safe local inventory match was found; no SKU was invented.')
  })
})
