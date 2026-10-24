import { productThumbnails } from '../data/productThumbnails.generated'

export const productThumbnail = product => productThumbnails[product.id] || product.img || product.image
