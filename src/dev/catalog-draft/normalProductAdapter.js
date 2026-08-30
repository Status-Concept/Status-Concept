const CATEGORY_MAP = {
  Lounge: 'lounge',
  Dining: 'dining',
  'Sun Loungers & Day Beds': 'sunlounger',
  'Shade Solutions': 'shade',
  'Outdoor Kitchens': 'kitchen',
  Tables: 'dining',
  'Accessories & Décor': 'decor',
}

export function privateImageUrl(image) {
  const value = typeof image === 'string' ? image : image?.path || image?.src || image?.url || ''
  if (!value) return ''
  if (value.startsWith('.catalog-private/')) return `/__status-private/${value.slice('.catalog-private/'.length)}`
  if (value.startsWith('/.catalog-private/')) return `/__status-private/${value.slice('/.catalog-private/'.length)}`
  return /^https?:\/\//i.test(value) ? '' : value
}

function cleanProductName(value) {
  const cleaned = String(value || '').replace(/^\d+(?:[-._\s]+)+/, '').trim()
  return cleaned.replace(/^[a-z]/, (letter) => letter.toUpperCase())
}

export function toNormalProduct(product) {
  const images = [
    ...(product.finalImages || []),
    ...(product.referenceImages || []),
  ].map(privateImageUrl).filter(Boolean).slice(0, 3)
  const variants = product.variants || []
  const skuSpecs = variants.map((variant, index) => ({
    label: variants.length === 1 ? 'SKU' : `SKU ${index + 1}`,
    value: variant.sku,
  }))
  const normalSpecs = [
    product.productType ? { label: 'Type', value: product.productType } : null,
    product.collection ? { label: 'Collection', value: product.collection } : null,
    product.supplier ? { label: 'Supplier', value: product.supplier } : null,
    ...skuSpecs,
  ].filter(Boolean)

  return {
    id: product.id,
    name: cleanProductName(product.canonicalName),
    collection: product.collection,
    collectionName: product.collection,
    category: CATEGORY_MAP[product.category],
    categoryLabel: product.category,
    productType: product.productType,
    supplier: product.supplier,
    desc: product.description,
    tagline: product.description,
    img: images[0],
    images,
    fit: 'contain',
    specs: normalSpecs,
    dimensions: product.dimensions || [],
    materials: product.materials || [],
    variantSkus: variants.map((variant) => variant.sku),
    localCatalog: true,
    route: `/product/${product.id}`,
  }
}

export function buildNormalLocalCatalog(products = []) {
  return products
    .filter((product) => product.selectionStatus === 'candidate')
    .filter((product) => (product.variants || []).length > 0)
    .filter((product) => Boolean(CATEGORY_MAP[product.category]))
    .map(toNormalProduct)
    .filter((product) => product.images.length > 0)
}

export function applyLegacyImageOverrides(products = [], overrides = {}) {
  return products.map((product) => {
    const override = overrides[product.id]
    if (!override) return product
    const images = (override.images || []).map(privateImageUrl).filter(Boolean)
    if (images.length === 0) return product
    return {
      ...product,
      img: images[0],
      images,
      fit: 'contain',
      hasApprovedImage: true,
      localCatalogImage: true,
    }
  })
}
