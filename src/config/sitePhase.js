// The proposal deck is staged. Keep this switch central so future phases can
// be enabled deliberately instead of leaking into the public navigation.
export const ACTIVE_PHASE = 1

export const SITE_FEATURES = Object.freeze({
  // Phase 1 · Foundations & System
  multilingual: true,
  gdpr: true,
  seo: true,
  enquiries: true,

  // Phase 2 · Content & CMS
  newsletter: false,
  afterCare: false,

  // Phase 3 · Site Integration & QA / extended public surfaces
  projects: false,
  showrooms: false,
  glatz: false,

  // Phase 4 · Catalogue & Product
  products: false,
  catalogue: false,
  search: false,

  // Phase 5 · Client Area
  accounts: false,
  favourites: false,
})

