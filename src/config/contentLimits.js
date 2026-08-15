// Public staging keeps the earlier demonstration selection deliberately small.
// The generated catalogue remains available as a source for a later approval,
// but it should not leak into the public product surfaces before that decision.
export const MAX_DEMO_PRODUCTS = 5

export const isKitchenContent = (item) => item?.category === 'kitchen'

export const limitPageImages = (images, item) => {
  const safeImages = Array.isArray(images) ? images : []
  return isKitchenContent(item) ? safeImages : safeImages.slice(0, MAX_DEMO_PRODUCTS)
}

export const limitPageItems = (items, kitchen = false) => {
  const safeItems = Array.isArray(items) ? items : []
  return kitchen ? safeItems : safeItems.slice(0, MAX_DEMO_PRODUCTS)
}

export function limitDemoProducts(products) {
  const groups = new Map()
  for (const product of Array.isArray(products) ? products : []) {
    const key = product?.category || 'other'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(product)
  }

  return [...groups.entries()].flatMap(([category, items]) => limitPageItems(items, category === 'kitchen'))
}
