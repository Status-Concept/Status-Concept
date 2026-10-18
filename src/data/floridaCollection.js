// Reference selection confirmed by the catalogue owner; preserve canonical URLs.
export const retiredFloridaProductIds = new Set([
  'local-product-2cffe7e17f3e', 'local-product-031eca09e980',
  'local-product-401b4c386b61', 'local-product-3daed85506c4',
  'local-product-5986dd590de8', 'local-product-0d3725e86941',
  'local-product-5f459e1cdd5c', 'local-product-76d9292a9635',
  'local-product-7da0a684f1ff', 'local-product-92a913511fa4',
  'local-product-d87bf771b947', 'local-product-8a99b06548a2',
])

const root = '/product-images/florida-reference-v2'
export const floridaCollectionCover = `${root}/collection-cover.webp`
export const floridaCollectionHero = `${root}/set-minimal.webp`
export const floridaProducts = [
  { id: 'florida-dining', name: 'Florida Dining', key: 'table', productType: ['table'] },
  { id: 'florida-dining-armchair', name: 'Florida Dining Armchair', key: 'armchair', productType: ['armchair'] },
  { id: 'florida-dining-table-with-miami-dining-armchairs', name: 'Florida Dining Table with Miami Dining Armchairs', key: 'miami', studio: 'miami-charcoal', productType: ['dining-set'], finishes: ['miami-white'] },
  { id: 'florida-dining-table-with-orlando-dining-armchairs', name: 'Florida Dining Table with Orlando Dining Armchairs', key: 'orlando', productType: ['dining-set'] },
  { id: 'florida-dining-set', name: 'Florida Dining Set', key: 'set', productType: ['dining-set'] },
].map(({ key, studio = key, finishes = [], ...product }) => ({
  ...product,
  collection: 'florida', collectionName: 'Florida',
  category: 'dining', categoryLabel: 'Dining',
  img: `${root}/${studio}-studio.webp`,
  images: [studio, ...finishes].map((name) => `${root}/${name}-studio.webp`),
  heroImage: `${root}/${key}-minimal.webp`,
  curatedImages: true, hoverOnly: true, fit: 'contain',
}))

export const floridaProductById = new Map(floridaProducts.map((p) => [p.id, p]))
