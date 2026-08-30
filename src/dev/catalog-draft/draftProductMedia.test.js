import { describe, expect, it } from 'vitest'
import { draftProductImages } from './draftProductMedia'

describe('draft product media', () => {
  it('prioritises selected variant images, removes duplicates and keeps three views', () => {
    const shared = { path: '.catalog-private/reference-images/shared.png' }
    const product = {
      referenceImages: [shared, { path: '.catalog-private/reference-images/second.png' }, { path: '.catalog-private/reference-images/fourth.png' }],
      finalImages: [],
    }
    const variant = {
      images: [{ path: '.catalog-private/reference-images/variant.png' }, shared],
    }

    expect(draftProductImages(product, variant).map((image) => image.path)).toEqual([
      '.catalog-private/reference-images/variant.png',
      '.catalog-private/reference-images/shared.png',
      '.catalog-private/reference-images/second.png',
    ])
  })

  it('returns an empty gallery when there are no local images', () => {
    expect(draftProductImages({}, null)).toEqual([])
  })
})
