import { describe, expect, it } from 'vitest'
import { publicAssetUrl } from './publicAssetUrl'

describe('public asset filenames', () => {
  it('serves reserved filename characters without creating query or fragment delimiters', () => {
    expect(publicAssetUrl('/images/A%20%2B%20B%26C%2C%20D.png')).toBe('/images/A%20+%20B&C,%20D.png')
    expect(publicAssetUrl('/images/file%23tag%3F.png')).toBe('/images/file%23tag%3F.png')
  })
})
