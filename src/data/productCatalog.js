import { catalogProducts } from './catalogProducts'
import { glatzProducts } from './glatzProducts'
import { kitchenProducts } from './kitchenProducts'
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
export const allProducts = [
  sicilyModularSet,
  ...glatzProducts,
  ...kitchenProducts,
  ...catalogProducts.filter((product) => product.category !== 'kitchen'),
]

