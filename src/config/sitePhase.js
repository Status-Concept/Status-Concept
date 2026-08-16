// The proposal deck is staged. Keep this switch central so later phases can be
// enabled deliberately instead of leaking into the public navigation.
export const ACTIVE_PHASE = 1

export const SITE_FEATURES = Object.freeze({
  // Phase 1 · foundations and the approved public demonstration site
  multilingual: true,
  gdpr: true,
  seo: true,
  enquiries: true,
  products: true,
  search: true,
  showrooms: true,

  // Later phases stay off until they are separately approved.
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
