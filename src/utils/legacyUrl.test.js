import { describe, expect, it } from 'vitest'
import { legacyUrlTarget } from './legacyUrl'

describe('legacy hash links', () => {
  it('preserves filters, selected offers and enquiry details', () => {
    for (const route of ['/en/products?cat=lounge&collection=berlin', '/en/sales?offer=bella', '/pt/contact?product=Berlin%20Sofa']) {
      expect(legacyUrlTarget(`https://statusconcept.site/#${route}`)).toBe(route)
    }
  })
  it('preserves tracking and anchors, prioritizing route query values', () => {
    expect(legacyUrlTarget('https://statusconcept.site/?utm_source=email&offer=old#/en/sales?offer=new#catalogue'))
      .toBe('/en/sales?offer=new&utm_source=email#catalogue')
  })
  it('leaves clean URLs and normal anchors alone and rejects external targets', () => {
    for (const suffix of ['/en/sales', '/en/sales#catalogue', '/#//example.com/path', '/#/\\example.com/path', '/#https://example.com']) {
      expect(legacyUrlTarget(`https://statusconcept.site${suffix}`)).toBeNull()
    }
  })
})
