import { searchProducts } from '../utils/productSearch'

// The catalogue data is assembled from several historical sources. This file
// is the migration layer that gives every source the same explicit facets
// without editing the generated files by hand.
export const PRODUCT_CATEGORIES = [
  {
    key: 'lounge',
    label: 'Lounge',
    title: 'Lounge',
    copy: 'Sofas, modular seating and armchairs for relaxed outdoor rooms.',
    types: [
      { value: 'sofa', label: 'Sofas' },
      { value: 'modular', label: 'Modular' },
      { value: 'armchair', label: 'Armchairs' },
      { value: 'pouf', label: 'Poufs' },
    ],
    materials: [
      { value: 'upholstered', label: 'Upholstered' },
      { value: 'rope', label: 'Rope' },
      { value: 'aluminium', label: 'Aluminium' },
    ],
  },
  {
    key: 'dining',
    label: 'Dining',
    title: 'Dining',
    copy: 'Tables and seating for long lunches, dinners and everything between.',
    types: [
      { value: 'table', label: 'Tables' },
      { value: 'chair', label: 'Chairs' },
      { value: 'armchair', label: 'Armchairs' },
      { value: 'bar-stool', label: 'Bar Stools' },
    ],
    materials: [],
  },
  {
    key: 'sunlounger',
    label: 'Sun Loungers & Day Beds',
    title: 'Sun Loungers & Day Beds',
    copy: 'Poolside loungers and day beds made for Algarve summers.',
    types: [
      { value: 'sun-lounger', label: 'Sun Loungers' },
      { value: 'day-bed', label: 'Day Beds' },
    ],
    materials: [],
  },
  {
    key: 'shade',
    label: 'Shade Solutions',
    title: 'Shade Solutions',
    copy: 'Parasols, pergolas and awnings for comfortable outdoor rooms.',
    types: [
      { value: 'parasol', label: 'Parasols' },
      { value: 'pergola', label: 'Pergolas' },
      { value: 'awning', label: 'Awnings' },
    ],
    materials: [],
  },
  {
    key: 'kitchen',
    label: 'Outdoor Kitchens',
    title: 'Outdoor Kitchens',
    copy: 'Modular kitchens, built-in modules, attachments and BBQs.',
    types: [
      { value: 'modular', label: 'Modular' },
      { value: 'built-in', label: 'Built-in' },
      { value: 'accessories', label: 'Attachments & Accessories' },
      { value: 'bbq', label: 'BBQs' },
    ],
    materials: [
      { value: 'stainless-steel', label: 'Black Stainless Steel' },
      { value: 'teak', label: 'Teak' },
      { value: 'ceramic', label: 'Ceramic' },
    ],
  },
  {
    key: 'carpets',
    label: 'Carpets',
    title: 'Carpets',
    copy: 'Outdoor rugs that bring warmth, texture and definition to an open-air room.',
    types: [],
    materials: [],
  },
  {
    key: 'decor',
    label: 'Decor',
    title: 'Decor',
    copy: 'Finishing pieces selected to give an outdoor space its character.',
    types: [],
    materials: [],
  },
  {
    key: 'statues',
    label: 'Statues',
    title: 'Statues',
    copy: 'Sculptural accents for gardens, terraces and considered outdoor settings.',
    types: [],
    materials: [],
  },
]

export const CATEGORY_ALIASES = {
  daybed: 'sunlounger',
  'day-beds': 'sunlounger',
  coffee: 'dining',
  side: 'dining',
  bar: 'dining',
  puffs: 'lounge',
  sofa: 'lounge',
  glatz: 'shade',
  rug: 'carpets',
  rugs: 'carpets',
  sculpture: 'statues',
  sculptures: 'statues',
  vases: 'decor',
}

const CATEGORY_KEYS = new Set(PRODUCT_CATEGORIES.map((category) => category.key))
const CATEGORY_LABELS = Object.fromEntries(PRODUCT_CATEGORIES.map((category) => [category.key, category.label]))

const slugify = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

const normalized = (value) => slugify(value).replace(/-/g, ' ')

const unique = (values) => [...new Set(values.filter(Boolean))]

const fieldValues = (value) => {
  if (Array.isArray(value)) return value.flatMap(fieldValues)
  if (value && typeof value === 'object') return Object.values(value).flatMap(fieldValues)
  return value == null || value === '' ? [] : [String(value)]
}

const textOf = (product) => normalized([
  product.name,
  product.id,
  product.collectionName,
  product.collection,
  product.categoryLabel,
  product.category,
  product.sourceCategory,
  product.sourcePath,
  product.supplier,
  product.description,
  product.desc,
  product.tagline,
  product.specs,
  product.dimensions,
  product.materials,
  product.image,
].flatMap(fieldValues).join(' '))

const hasAny = (text, terms) => terms.some((term) => text.includes(term))

const asValue = (value) => slugify(value)

function canonicalCategory(product) {
  const candidate = asValue(product.category)
  if (CATEGORY_KEYS.has(candidate)) return candidate
  return CATEGORY_ALIASES[candidate] || 'lounge'
}

function typeFor(product, category, text) {
  const explicit = unique(fieldValues(product.productType || product.type).map(asValue))
  if (explicit.length) return explicit

  if (category === 'lounge') {
    if (hasAny(text, ['pouf', 'pouffe', 'ottoman'])) return ['pouf']
    if (hasAny(text, ['armchair', 'arm-chair', 'lounge chair', 'fauteuil'])) return ['armchair']
    if (hasAny(text, ['modular', 'corner sofa', 'corner'])) return ['modular']
    if (hasAny(text, ['sofa', 'sofas', 'couch', 'divano', 'settee'])) return ['sofa']
  }

  if (category === 'dining') {
    if (hasAny(text, ['bar stool', 'bar-stool', 'bar chair'])) return ['bar-stool']
    if (hasAny(text, ['dining armchair', 'armchair'])) return ['armchair']
    if (hasAny(text, ['dining chair', 'chair'])) return ['chair']
    if (hasAny(text, ['dining table', 'table'])) return ['table']
  }

  if (category === 'sunlounger') {
    if (hasAny(text, ['day bed', 'day-bed', 'daybed', 'sun bed'])) return ['day-bed']
    if (hasAny(text, ['sun lounger', 'sun-lounger', 'lounger', 'chaise'])) return ['sun-lounger']
  }

  if (category === 'shade') {
    if (hasAny(text, ['awning', 'retractable roof'])) return ['awning']
    if (hasAny(text, ['pergola', 'bioclimatic'])) return ['pergola']
    if (hasAny(text, ['parasol', 'umbrella', 'glatz', 'sunwing', 'sombrano', 'fortello', 'pendalex'])) return ['parasol']
  }

  if (category === 'kitchen') {
    if (hasAny(text, ['bbq', 'barbecue', 'grill', 'burner', 'kamado', 'gas barbecue'])) return ['bbq']
    if (hasAny(text, ['add-on', 'attachment', 'accessory', 'shelf', 'hook-on', 'waste bin'])) return ['accessories']
    if (hasAny(text, ['built-in', 'built in', 'integrated'])) return ['built-in']
    return ['modular']
  }

  return []
}

function materialsFor(product, text) {
  const explicit = fieldValues(product.materialFamilies || product.materialFamily).map(asValue)
  const values = [...explicit]
  const materialText = normalized([
    product.materials,
    product.specs,
    product.description,
    product.desc,
    product.name,
    product.collectionName,
  ].flatMap(fieldValues).join(' '))

  if (hasAny(materialText, ['rope', 'cord'])) values.push('rope')
  if (hasAny(materialText, ['upholstered', 'upholstery', 'fabric', 'textile', 'cushion'])) values.push('upholstered')
  if (hasAny(materialText, ['aluminium', 'aluminum'])) values.push('aluminium')
  if (hasAny(materialText, ['stainless steel', 'inox'])) values.push('stainless-steel')
  if (hasAny(materialText, ['teak', 'teca'])) values.push('teak')
  if (hasAny(materialText, ['ceramic', 'ceramics'])) values.push('ceramic')
  if (hasAny(materialText, ['granite'])) values.push('granite')
  if (hasAny(materialText, ['wicker', 'rattan'])) values.push('wicker')

  // Keep `text` in the signature so callers can use the same normalized
  // source document while the explicit material rules above remain readable.
  if (text && hasAny(text, ['aluminium', 'aluminum'])) values.push('aluminium')
  return unique(values.map(asValue))
}

function normalizedSpecs(product) {
  const source = product.specifications || product.specs
  if (Array.isArray(source)) return source.filter(Boolean)
  if (source && typeof source === 'object') {
    return Object.entries(source).map(([label, value]) => ({ label, value })).filter(({ value }) => value != null && value !== '')
  }
  return []
}

function normalizedDimensions(product) {
  const source = product.dimensions || product.dims
  if (Array.isArray(source)) return source.filter(Boolean)
  if (source && typeof source === 'object') return [source]
  if (product.specs?.dimensions) return [{ piece: product.name, w: product.specs.dimensions }]
  return []
}

function normalizedMaterials(product) {
  const values = fieldValues(product.materials || product.material)
  if (product.specs?.material) values.push(product.specs.material)
  return unique(values.map((value) => String(value).trim()).filter(Boolean))
}

export function getProductFacets(product = {}) {
  const category = canonicalCategory(product)
  const text = textOf(product)
  const collectionName = product.collectionName || product.collection || product.sourceCollection || ''
  const collection = slugify(collectionName)
  const images = fieldValues(product.images || product.image || product.img)
  const imageMode = product.imageMode || (product.fit === 'wide' ? 'lifestyle' : 'studio')
  const productType = typeFor(product, category, text)
  const materialFamilies = materialsFor(product, text)

  return {
    category,
    categoryLabel: CATEGORY_LABELS[category] || product.categoryLabel || 'Outdoor living',
    subcategory: product.subcategory ? asValue(product.subcategory) : productType[0] || '',
    productType,
    materialFamilies,
    collection,
    collectionName,
    supplier: product.supplier || product.supplierName || '',
    images,
    imageMode,
    specs: normalizedSpecs(product),
    dimensions: normalizedDimensions(product),
    materials: normalizedMaterials(product),
    sourceUrl: product.sourceUrl || '',
    reviewedAt: product.reviewedAt || '',
    approvalStatus: product.approvalStatus || 'review',
  }
}

export function normalizeProduct(product = {}) {
  return { ...product, ...getProductFacets(product) }
}

export function productMatchesFilters(product, filters = {}) {
  const facets = getProductFacets(product)
  const category = CATEGORY_ALIASES[filters.category] || filters.category
  const type = asValue(filters.type || filters.productType)
  const material = asValue(filters.material || filters.materialFamily)
  const collection = asValue(filters.collection)
  const subcategory = asValue(filters.subcategory)
  const supplier = asValue(filters.supplier)

  if (category && facets.category !== category) return false
  if (type && !facets.productType.includes(type)) return false
  if (material && !facets.materialFamilies.includes(material)) return false
  if (collection && facets.collection !== collection) return false
  if (subcategory && facets.subcategory !== subcategory) return false
  if (supplier && asValue(facets.supplier) !== supplier) return false
  return true
}

export function filterProducts(products, filters = {}) {
  const scoped = products.filter((product) => productMatchesFilters(product, filters))
  if (!filters.query?.trim()) return scoped
  const searched = new Set(searchProducts(scoped, filters.query).map((product) => product.id || product.name))
  const queryTokens = normalized(filters.query).split(' ').filter(Boolean)
  return scoped.filter((product) => {
    const key = product.id || product.name
    if (searched.has(key)) return true
    const facets = getProductFacets(product)
    const facetText = normalized([
      facets.productType,
      facets.materialFamilies,
      facets.collectionName,
      facets.categoryLabel,
    ].flatMap(fieldValues).join(' '))
    return queryTokens.every((token) => facetText.includes(token))
  })
}

export function getFacetOptions(products, category, field) {
  const values = new Map()
  products
    .filter((product) => !category || getProductFacets(product).category === category)
    .forEach((product) => {
      const facets = getProductFacets(product)
      const entries = field === 'material' ? facets.materialFamilies : facets.productType
      entries.forEach((value) => {
        if (!values.has(value)) values.set(value, formatFacetLabel(value))
      })
    })
  return [...values.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function formatFacetLabel(value) {
  const labels = {
    'bar-stool': 'Bar Stools',
    'day-bed': 'Day Beds',
    'sun-lounger': 'Sun Loungers',
    'stainless-steel': 'Black Stainless Steel',
    'built-in': 'Built-in',
  }
  return labels[value] || String(value || '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function getCategory(key) {
  return PRODUCT_CATEGORIES.find((category) => category.key === (CATEGORY_ALIASES[key] || key))
}
