// Curated from the product references supplied for the Bali image revision.
// Keep generated source catalogues intact and retain the canonical product IDs.
export const retiredBaliProductIds = new Set([
  'local-product-curated-bali-lounge-footstool-lead-chine',
  'local-product-curated-bali-modular-sofa-taupe',
  'local-product-19246e8d35ed',
  'local-product-curated-bali-sofa-set-lead-chine',
])

const imageRoot = '/product-images/bali-reference-v2'
export const baliCollectionHero = `${imageRoot}/collection-hero-coastal-v3.webp`
export const baliProducts = [
  { id: 'bali-lounge-2', name: 'Bali Lounge Armchair & Footstool', category: 'lounge', categoryLabel: 'Lounge', imageKey: 'armchair', productType: ['armchair', 'footstool'] },
  { id: 'bali', name: 'Bali Sun Lounger', category: 'sunlounger', categoryLabel: 'Sun Loungers', imageKey: 'single', productType: ['sunlounger'] },
  { id: 'bali-double-sun-lounger', name: 'Bali Double Sun Lounger', category: 'sunlounger', categoryLabel: 'Sun Loungers', imageKey: 'double', productType: ['daybed', 'double'] },
].map(({ imageKey, ...product }) => ({
  ...product,
  collection: 'bali',
  collectionName: 'Bali',
  img: `${imageRoot}/${imageKey}-studio.webp`,
  heroImage: `${imageRoot}/${imageKey}-minimal.webp`,
  images: [`${imageRoot}/${imageKey}-studio.webp`],
  hoverOnly: true,
  fit: 'contain',
  curatedImages: true,
}))

export const baliProductById = new Map(baliProducts.map((product) => [product.id, product]))
