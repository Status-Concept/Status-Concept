import { describe, expect, it } from 'vitest'
import { resolvePrivateAssetPath, isAllowedPrivateAssetPath } from './vite-plugin-draft-catalog.mjs'

describe('draft asset boundary', () => {
  it('allows only image assets in the two private image collections', () => {
    expect(isAllowedPrivateAssetPath('reference-images/chair.webp')).toBe(true)
    expect(isAllowedPrivateAssetPath('final-images/chair.jpg')).toBe(true)
    expect(isAllowedPrivateAssetPath('final-images/chair.avif')).toBe(true)
  })

  it('rejects source data, generated JSON and traversal attempts', () => {
    expect(isAllowedPrivateAssetPath('generated/draft-products.json')).toBe(false)
    expect(isAllowedPrivateAssetPath('sources/inventory/inventory.xlsx')).toBe(false)
    expect(isAllowedPrivateAssetPath('../outside.webp')).toBe(false)
    expect(isAllowedPrivateAssetPath('reference-images/../generated/draft.json')).toBe(false)
    expect(resolvePrivateAssetPath('C:/private-catalogue', 'generated/draft-products.json')).toBeNull()
  })
})
