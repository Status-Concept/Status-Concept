import { describe, it, expect } from 'vitest'
import { productSrcSet } from './imageVariants'

describe('productSrcSet', () => {
  it('builds a 3-entry srcset for a catalogue image', () => {
    expect(productSrcSet('/product-images/glatz/x/01.webp')).toBe(
      '/product-images/glatz/x/01-w400.webp 400w, /product-images/glatz/x/01-w800.webp 800w, /product-images/glatz/x/01.webp 1600w',
    )
  })
  it('returns undefined for module-imported / hashed assets', () => {
    expect(productSrcSet('/assets/foo-a1b2c3.webp')).toBeUndefined()
    expect(productSrcSet('/src/assets/hero.webp')).toBeUndefined()
  })
  it('returns undefined for non-webp and nullish input', () => {
    expect(productSrcSet('/product-images/x/01.jpg')).toBeUndefined()
    expect(productSrcSet(undefined)).toBeUndefined()
    expect(productSrcSet(null)).toBeUndefined()
  })
})
