// The source catalogue identifies seven products as rattan. Bonaire's
// imported copy omits the material, but its approved photograph shows wicker.
export const excludedRattanIds = new Set([
  'bonaire-able',
  'monaco-side-table',
  'pietra-dining-armchair',
  'pietra-dining-chair',
  'st-tropez-high-side-table',
  'st-tropez-low-side-table',
  'st-malo-swivel-daybed',
  'st-malo-yacht-daybed',
])

export const isRattanProduct = (product) => {
  const materialEvidence = [product.name, product.desc, product.sourcePath, product.specs?.material, ...(product.materialFamilies || [])].filter(Boolean).join(' ')
  return excludedRattanIds.has(product.id) || /\b(?:rattan|wicker)\b/i.test(materialEvidence)
}
