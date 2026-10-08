import { catalogProducts } from './catalogProducts'
import { glatzProducts } from './glatzProducts'
import { kitchenProducts } from './kitchenProducts'
import { demoProducts } from './demoProducts'
import { publishedCorrectionImages, publishedLocalProducts } from './publishedCorrections.generated'
import sicilyModularSetFullImg from '../assets/images/sicily-modular-set-full.webp'
import sicilyCornerImg from '../assets/images/sicily-corner.jpg'
import sicilyCentreImg from '../assets/images/sicily-centre.jpg'
import sicilyOttomanImg from '../assets/images/sicily-ottoman.jpg'

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
const catalogueProducts = [
  sicilyModularSet,
  ...glatzProducts,
  ...kitchenProducts,
  ...catalogProducts.filter((product) => product.category !== 'kitchen'),
]

const withCorrectionImage = (product) => {
  const image = publishedCorrectionImages[product.id]
  return image ? { ...product, img: image, images: [image], fit: 'contain', publishedCorrection: true } : product
}

export const publishedCorrectionProducts = [
  ...catalogueProducts.filter((product) => publishedCorrectionImages[product.id]).map(withCorrectionImage),
  ...publishedLocalProducts,
]

export const allProducts = [...catalogueProducts.map(withCorrectionImage), ...publishedLocalProducts]

const correctedIds = new Set(publishedCorrectionProducts.map((product) => product.id))
export const publicSearchProducts = [
  ...demoProducts.map(withCorrectionImage),
  ...publishedCorrectionProducts.filter((product) => !demoProducts.some((demo) => demo.id === product.id)),
]

if (import.meta.env.DEV && correctedIds.size !== 139) {
  throw new Error(`Expected 139 corrected public products, found ${correctedIds.size}`)
}

