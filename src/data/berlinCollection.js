export const retiredBerlinProductIds = new Set([
  'local-product-96d0949d7c3e',
  'local-product-96f4b2caff9b',
  'local-product-curated-berlin-modular-sofa-lead-chine-white-aluminium',
  'local-product-f92f7fef8d9a',
])

const root = '/product-images/berlin-reference-v2'
export const berlinCollectionCover = `${root}/collection-cover.webp`
export const berlinCollectionHero = `${root}/collection-hero.webp`
export const berlinProducts = [
  {
    id: 'berlin-modular-sofa', name: 'Berlin Modular Sofa', key: 'modular',
    productType: ['modular', 'corner'],
    gallery: ['modular', 'modular-charcoal-l', 'modular-charcoal-u', 'modular-grey-set'],
  },
  {
    id: 'berlin', name: 'Berlin', key: 'berlin',
    productType: ['sofa', 'armchair'],
    gallery: ['berlin', 'modular', 'berlin-black-armchair'],
  },
].map(({ key, gallery, ...product }) => ({
  ...product,
  collection: 'berlin', collectionName: 'Berlin',
  category: 'lounge', categoryLabel: 'Lounge',
  img: `${root}/${key}-studio.webp`,
  images: gallery.map((image) => `${root}/${image}-studio.webp`),
  heroImage: `${root}/${key}-minimal.webp`,
  curatedImages: true, hoverOnly: true, fit: 'contain',
  subcategories: ['upholstered'],
}))

export const berlinProductById = new Map(berlinProducts.map((p) => [p.id, p]))
