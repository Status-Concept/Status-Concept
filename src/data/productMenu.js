// The header and mobile navigation use this same taxonomy so a category leaf
// never points at a stale name-search filter.
export const PRODUCT_MENU = [
  {
    key: 'lounge',
    label: 'Lounge',
    to: '/products?cat=lounge',
    items: [
      { name: 'Upholstered', to: '/products?cat=lounge&material=upholstered' },
      { name: 'Rope', to: '/products?cat=lounge&material=rope' },
      { name: 'Aluminium', to: '/products?cat=lounge&material=aluminium' },
      { name: 'Sofas', to: '/products?cat=lounge&type=sofa' },
      { name: 'Modular', to: '/products?cat=lounge&type=modular' },
      { name: 'Armchairs', to: '/products?cat=lounge&type=armchair' },
      { name: 'Poufs', to: '/products?cat=lounge&type=pouf' },
    ],
  },
  {
    key: 'dining',
    label: 'Dining',
    to: '/products?cat=dining',
    items: [
      { name: 'Tables', to: '/products?cat=dining&type=table' },
      { name: 'Chairs', to: '/products?cat=dining&type=chair' },
      { name: 'Armchairs', to: '/products?cat=dining&type=armchair' },
      { name: 'Bar Stools', to: '/products?cat=dining&type=bar-stool' },
    ],
  },
  {
    key: 'sunlounger',
    label: 'Sun Loungers & Day Beds',
    to: '/products?cat=sunlounger',
    items: [
      { name: 'Sun Loungers', to: '/products?cat=sunlounger&type=sun-lounger' },
      { name: 'Day Beds', to: '/products?cat=sunlounger&type=day-bed' },
    ],
  },
  {
    key: 'shade',
    label: 'Shade Solutions',
    to: '/products?cat=shade',
    items: [
      { name: 'Pergolas', to: '/products?cat=shade&type=pergola' },
      { name: 'Parasols', to: '/products?cat=shade&type=parasol' },
      { name: 'Awnings', to: '/products?cat=shade&type=awning' },
    ],
  },
  {
    key: 'kitchen',
    label: 'Outdoor Kitchens',
    to: '/products?cat=kitchen',
    items: [
      { name: 'Modular Kitchens', to: '/products?cat=kitchen&type=modular' },
      { name: 'Built-in Kitchens', to: '/products?cat=kitchen&type=built-in' },
      { name: 'Attachments & Accessories', to: '/products?cat=kitchen&type=accessories' },
      { name: 'BBQs', to: '/products?cat=kitchen&type=bbq' },
    ],
  },
]
