// Curated two-level Products nav: each category shows a short list of furniture
// types (its "subtitles"), not the full collection dump. Type links filter the
// catalogue via ?type=<keyword> (matched against product names); the kitchen
// ranges use ?collection=<key>. Hand-authored — keep the type keywords in sync
// with the catalogue so every leaf returns products.
export const PRODUCT_MENU = [
  {
    key: 'lounge',
    label: 'Lounge',
    to: '/products?cat=lounge',
    items: [
      { name: 'Upholstered', to: '/products?cat=lounge&subcat=upholstered' },
      { name: 'Rope', to: '/products?cat=lounge&subcat=rope' },
      { name: 'Aluminium', to: '/products?cat=lounge&subcat=aluminium' },
      { name: 'Corner Sofas', to: '/products?cat=lounge&type=corner' },
      { name: 'Armchairs', to: '/products?cat=lounge&type=armchair' },
      { name: 'Modular', to: '/products?cat=lounge&type=modular' },
    ],
  },
  {
    key: 'dining',
    label: 'Dining',
    to: '/products?cat=dining',
    items: [
      { name: 'Dining Tables', to: '/products?cat=dining&type=table' },
      { name: 'Dining Chairs', to: '/products?cat=dining&type=chair' },
      { name: 'Armchairs', to: '/products?cat=dining&type=armchair' },
      { name: 'Side Tables', to: '/products?cat=dining&type=side-table' },
      { name: 'Bar Stools', to: '/products?cat=dining&type=bar' },
    ],
  },
  {
    key: 'sunlounger',
    label: 'Sun Loungers & Day Beds',
    to: '/products?cat=sunlounger',
    items: [
      { name: 'Sun Loungers', to: '/products?cat=sunlounger&type=lounger' },
      { name: 'Day Beds', to: '/products?cat=sunlounger&type=bed' },
    ],
  },
  {
    key: 'shade',
    label: 'Shade Solutions',
    to: '/products?cat=shade',
    items: [
      { name: 'Pergolas', to: '/products?cat=shade&subcat=pergolas' },
      { name: 'Glatz Parasols', to: '/glatz-parasols' },
      { name: 'Awnings', to: '/products?cat=shade&subcat=awnings' },
    ],
  },
  {
    key: 'kitchen',
    label: 'Outdoor Kitchens',
    to: '/products?cat=kitchen',
    items: [
      { name: 'Modular Kitchens', to: '/products?cat=kitchen' },
      { name: 'Built-in Kitchens', to: '/products?cat=kitchen&mode=built-in' },
    ],
  },
  {
    key: 'carpets',
    label: 'Carpets',
    to: '/products?cat=carpets',
    items: [],
  },
  {
    key: 'decor',
    label: 'Decor',
    to: '/products?cat=decor',
    items: [],
  },
  {
    key: 'statues',
    label: 'Statues',
    to: '/products?cat=statues',
    items: [],
  },
]
