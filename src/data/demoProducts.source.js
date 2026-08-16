import { allProducts } from './productCatalog'
import { noImageProducts } from './productImageStatus'
import { limitDemoProducts } from '../config/contentLimits'

// This source selection is used only by the generation script. The browser
// imports demoProducts.generated.js so the public bundle never imports the
// historical catalogue, Glatz catalogue, or kitchen source arrays wholesale.
const demoOrder = (products) => {
  const groups = new Map()
  for (const product of products) {
    const key = product?.category || 'other'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(product)
  }

  return [...groups.entries()].flatMap(([category, items]) => {
    if (category === 'kitchen') return items
    const ordered = [...items].sort((a, b) => {
      const aImage = noImageProducts.has(a.id) ? 1 : 0
      const bImage = noImageProducts.has(b.id) ? 1 : 0
      if (aImage !== bImage) return aImage - bImage
      return (b.tag ? 1 : 0) - (a.tag ? 1 : 0)
    })
    if (category !== 'lounge') return ordered
    const sicilyProduct = ordered.find((product) => product.id === 'sicily-modular-set')
    return sicilyProduct ? [sicilyProduct, ...ordered.filter((product) => product.id !== sicilyProduct.id)] : ordered
  })
}

export const demoProducts = limitDemoProducts(demoOrder(allProducts))

export const demoProductIds = new Set(demoProducts.map((product) => product.id).filter(Boolean))
