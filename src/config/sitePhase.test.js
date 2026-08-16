import { describe, expect, it } from 'vitest'
import { ACTIVE_PHASE, SITE_FEATURES } from './sitePhase'

describe('site phase guard', () => {
  it('keeps the public site on the approved phase-one scope', () => {
    expect(ACTIVE_PHASE).toBe(1)
    expect(SITE_FEATURES.products).toBe(true)
    expect(SITE_FEATURES.search).toBe(true)
    expect(SITE_FEATURES.showrooms).toBe(true)
    expect(SITE_FEATURES.enquiries).toBe(true)
  })

  it('keeps later-phase surfaces disabled', () => {
    expect({
      newsletter: SITE_FEATURES.newsletter,
      afterCare: SITE_FEATURES.afterCare,
      projects: SITE_FEATURES.projects,
      gallery: SITE_FEATURES.gallery,
      glatz: SITE_FEATURES.glatz,
      catalogue: SITE_FEATURES.catalogue,
      accounts: SITE_FEATURES.accounts,
      favourites: SITE_FEATURES.favourites,
      staffDeliveries: SITE_FEATURES.staffDeliveries,
    }).toEqual({
      newsletter: false,
      afterCare: false,
      projects: false,
      gallery: false,
      glatz: false,
      catalogue: false,
      accounts: false,
      favourites: false,
      staffDeliveries: false,
    })
  })
})
