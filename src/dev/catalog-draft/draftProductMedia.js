function imageKey(image) {
  if (typeof image === 'string') return image
  return image?.path || image?.url || image?.src || image?.photoPath || ''
}

export function draftProductImages(product = {}, variant = null) {
  const candidates = [
    ...(variant?.images || []),
    ...(product.finalImages || []),
    ...(product.referenceImages || []),
  ]
  const seen = new Set()
  const images = []
  for (const image of candidates) {
    const key = imageKey(image)
    if (!key || seen.has(key)) continue
    seen.add(key)
    images.push(image)
    if (images.length === 3) break
  }
  return images
}
