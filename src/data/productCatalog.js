import { catalogProducts } from './catalogProducts'
import { glatzProducts } from './glatzProducts'
import { kitchenProducts } from './kitchenProducts'
import { demoProducts } from './demoProducts'
import { publishedCorrectionImages, publishedLocalProducts } from './publishedCorrections.generated'
import { isRattanProduct } from './productExclusions'
import { minimalProductHeroes } from './minimalProductHeroes.generated'
import { baliProducts, baliProductById, retiredBaliProductIds } from './baliCollection'
import { floridaProducts, floridaProductById, retiredFloridaProductIds } from './floridaCollection'
import { berlinProducts, berlinProductById, retiredBerlinProductIds } from './berlinCollection'
import sicilyModularSetFullImg from '../assets/images/sicily-modular-set-full.webp'
import sicilyCornerImg from '../assets/images/sicily-corner.jpg'
import sicilyCentreImg from '../assets/images/sicily-centre.jpg'
import sicilyOttomanImg from '../assets/images/sicily-ottoman.jpg'
import { localColourPages, getLocalColourProduct } from '../dev/colour-preview/targets'

const sicilyModularSet = {
  id: 'sicily-modular-set',
  name: 'Sicily Modular Set',
  collection: 'Sicily',
  collectionName: 'Sicily',
  category: 'lounge',
  categoryLabel: 'Lounge',
  // Keep the catalogue surface isolated and quiet. The lifestyle image is
  // reserved for the Talenti-style hover reveal on product cards.
  img: sicilyCornerImg,
  heroImage: sicilyModularSetFullImg,
  images: [sicilyCornerImg, sicilyCentreImg, sicilyOttomanImg],
  subcategories: ['upholstered', 'aluminium'],
  tag: 'Popular',
  desc: 'A contemporary modular lounge system for generous outdoor living areas.',
}

// This file is intentionally hand-authored. The source datasets are generated,
// while this module provides the single catalogue view used by product discovery.
const sourceProducts = [
  sicilyModularSet,
  ...glatzProducts,
  ...kitchenProducts,
  ...catalogProducts.filter((product) => product.category !== 'kitchen'),
]

const catalogueProducts = sourceProducts.filter((product) => !isRattanProduct(product))
const localProducts = publishedLocalProducts.filter((product) => !isRattanProduct(product) && !retiredBaliProductIds.has(product.id) && !retiredFloridaProductIds.has(product.id) && !retiredBerlinProductIds.has(product.id))

const withCorrectionImage = (product) => {
  const configuredProduct = getLocalColourProduct(product.id)
  if (configuredProduct) return { ...product, ...configuredProduct }
  if (baliProductById.has(product.id)) return baliProductById.get(product.id)
  if (floridaProductById.has(product.id)) return floridaProductById.get(product.id)
  if (berlinProductById.has(product.id)) return berlinProductById.get(product.id)
  const image = publishedCorrectionImages[product.id]
  const corrected = image ? { ...product, img: image, images: [image], fit: 'contain', publishedCorrection: true } : product
  const heroImage = minimalProductHeroes[corrected.id] || (corrected.fit === 'contain' && corrected.id
    ? `/product-images/hero/${corrected.id}.webp`
    : corrected.heroImage || null)
  return heroImage ? { ...corrected, heroImage } : corrected
}

export const publishedCorrectionProducts = [
  ...catalogueProducts.filter((product) => publishedCorrectionImages[product.id]).map(withCorrectionImage),
  ...localProducts.map(withCorrectionImage),
]

export const allProducts = [...catalogueProducts.map(withCorrectionImage), ...localProducts.map(withCorrectionImage)]

const correctedIds = new Set(publishedCorrectionProducts.map((product) => product.id))
export const publicSearchProducts = [
  ...demoProducts.filter((product) => !isRattanProduct(product) && !retiredBaliProductIds.has(product.id) && !baliProductById.has(product.id) && !retiredFloridaProductIds.has(product.id) && !floridaProductById.has(product.id) && !retiredBerlinProductIds.has(product.id) && !berlinProductById.has(product.id)).map(withCorrectionImage),
  ...publishedCorrectionProducts.filter((product) => !demoProducts.some((demo) => demo.id === product.id)),
  ...baliProducts,
  ...floridaProducts,
  ...berlinProducts,
  ...Object.keys(localColourPages).filter(id => !demoProducts.some(product => product.id === id) && !publishedCorrectionProducts.some(product => product.id === id)).map(getLocalColourProduct),
]

const expectedCorrectionCount = Object.keys(publishedCorrectionImages).filter((id) => !isRattanProduct({ id }) && !retiredBaliProductIds.has(id) && !retiredFloridaProductIds.has(id) && !retiredBerlinProductIds.has(id)).length
if (import.meta.env.DEV && correctedIds.size !== expectedCorrectionCount) {
  throw new Error(`Expected ${expectedCorrectionCount} corrected public products, found ${correctedIds.size}`)
}

export { isRattanProduct } from './productExclusions'

