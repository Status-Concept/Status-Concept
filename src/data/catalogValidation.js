import { PRODUCT_CATEGORIES, getProductFacets } from './productTaxonomy'

const categoryKeys = new Set(PRODUCT_CATEGORIES.map((category) => category.key))

export function validateCatalogProducts(products = []) {
  const issues = []
  const seen = new Set()

  products.forEach((product, index) => {
    const label = product.id || product.name || `row-${index + 1}`
    const facets = getProductFacets(product)
    if (!product.id) issues.push({ level: 'error', product: label, field: 'id', message: 'Product id is required.' })
    if (seen.has(product.id)) issues.push({ level: 'error', product: label, field: 'id', message: 'Product id is duplicated.' })
    seen.add(product.id)
    if (!product.name) issues.push({ level: 'error', product: label, field: 'name', message: 'Product name is required.' })
    if (!categoryKeys.has(facets.category)) issues.push({ level: 'error', product: label, field: 'category', message: `Unknown category: ${facets.category}` })
    if (!facets.images.length) issues.push({ level: 'error', product: label, field: 'images', message: 'At least one product image is required.' })
    if (!Array.isArray(facets.productType)) issues.push({ level: 'error', product: label, field: 'productType', message: 'productType must be an array.' })
    if (!Array.isArray(facets.materialFamilies)) issues.push({ level: 'error', product: label, field: 'materialFamilies', message: 'materialFamilies must be an array.' })
    if (facets.approvalStatus === 'approved' && (!facets.sourceUrl || !facets.reviewedAt)) {
      issues.push({ level: 'error', product: label, field: 'provenance', message: 'Approved products need sourceUrl and reviewedAt.' })
    }
  })

  return {
    valid: issues.every((issue) => issue.level !== 'error'),
    errors: issues.filter((issue) => issue.level === 'error'),
    warnings: issues.filter((issue) => issue.level === 'warning'),
    total: products.length,
  }
}

