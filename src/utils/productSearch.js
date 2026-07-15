const synonymGroups = [
  ['sofa', 'sofas', 'couch', 'settee'],
  ['chair', 'chairs', 'cadeira', 'cadeiras', 'armchair', 'poltrona', 'poltronas'],
  ['table', 'tables', 'mesa', 'mesas'],
  ['lounger', 'loungers', 'sunlounger', 'sunloungers', 'espreguicadeira', 'espreguicadeiras'],
  ['daybed', 'daybeds', 'cama', 'camas'],
  ['parasol', 'parasols', 'umbrella', 'umbrellas', 'guarda-sol', 'chapeu', 'chapeus'],
  ['shade', 'sombra', 'sombras'],
  ['pergola', 'pergolas', 'pergola', 'pergolas'],
  ['kitchen', 'kitchens', 'cozinha', 'cozinhas'],
  ['barbecue', 'barbecues', 'bbq', 'bbqs', 'grelhador', 'grelhadores'],
  ['teak', 'teca'],
  ['aluminium', 'aluminum', 'aluminio'],
  ['stainless', 'inox', 'aco'],
  ['modular', 'modulars', 'modularidade'],
]

export function normalizeSearchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const synonymIndex = new Map()

synonymGroups.forEach((group) => {
  const normalizedGroup = [...new Set(group.map(normalizeSearchText).filter(Boolean))]
  normalizedGroup.forEach((term) => synonymIndex.set(term, normalizedGroup))
})

function flattenValues(value, output = []) {
  if (value == null || value === '') return output
  if (Array.isArray(value)) {
    value.forEach((item) => flattenValues(item, output))
    return output
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((item) => flattenValues(item, output))
    return output
  }
  output.push(String(value))
  return output
}

function productDocument(product) {
  const primary = normalizeSearchText([product.name, product.id].filter(Boolean).join(' '))
  const secondary = normalizeSearchText([
    product.collectionName,
    product.collection,
    product.categoryLabel,
    product.category,
    product.supplier,
    product.sourceCategory,
    product.tag,
  ].filter(Boolean).join(' '))
  const details = normalizeSearchText(flattenValues([
    product.desc,
    product.description,
    product.tagline,
    product.materials,
    product.specs,
    product.dims,
    product.sizeOptions,
  ]).join(' '))

  return { primary, secondary, details, all: `${primary} ${secondary} ${details}`.trim() }
}

function tokenOptions(token) {
  return synonymIndex.get(token) || [token]
}

function scoreProduct(product, normalizedQuery, queryTokens) {
  const document = productDocument(product)
  const tokenMatches = queryTokens.map((token) => {
    const options = tokenOptions(token)
    return options.some((option) => document.all.includes(option))
  })

  if (!tokenMatches.every(Boolean)) return 0

  let score = 1
  if (document.primary === normalizedQuery) score += 600
  else if (document.primary.startsWith(normalizedQuery)) score += 320
  else if (document.primary.includes(normalizedQuery)) score += 220

  if (document.secondary.includes(normalizedQuery)) score += 120
  if (document.details.includes(normalizedQuery)) score += 40

  queryTokens.forEach((token) => {
    const options = tokenOptions(token)
    if (options.some((option) => document.primary.split(' ').some((word) => word.startsWith(option)))) score += 70
    else if (options.some((option) => document.primary.includes(option))) score += 50
    if (options.some((option) => document.secondary.includes(option))) score += 30
    if (options.some((option) => document.details.includes(option))) score += 10
  })

  if (product.tag) score += 3
  return score
}

export function searchProducts(products, query, { limit = Number.POSITIVE_INFINITY } = {}) {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return []

  const queryTokens = normalizedQuery.split(' ').filter(Boolean)
  const seen = new Set()

  return products
    .map((product, index) => ({
      product,
      index,
      score: scoreProduct(product, normalizedQuery, queryTokens),
    }))
    .filter(({ product, score }) => {
      const key = product.id || product.name
      if (!score || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => b.score - a.score || a.index - b.index || a.product.name.localeCompare(b.product.name))
    .slice(0, limit)
    .map(({ product }) => product)
}

