import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const privateRoot = path.join(root, '.catalog-private')
const localProductsPath = path.join(privateRoot, 'generated', 'local-products.json')
const outputPath = path.join(privateRoot, 'generated', 'legacy-image-overrides.json')
const catalogPath = path.join(root, 'src', 'data', 'catalogProducts.js')
const imageStatusPath = path.join(root, 'src', 'data', 'productImageStatus.js')

const GENERATED_PRODUCT_IDS = new Set([
  'antalya-dining-armchair',
  'dining-pietra',
  'madrid-dining-armchair',
  'monaco-side-table',
  'munich-dining-table-with-reno-dining-armchairs',
  'naples',
  'orland-dining-set',
  'pietra-dining-armchair',
  'pietra-dining-chair',
  'st-tropez-high-side-table',
  'st-tropez-low-side-table',
  'armona-lounge',
  'bermuda-divano',
  'bora-bora-divano',
  'cairo-sofa-set',
  'dakkar',
  'dijon',
  'dunbar-lounge',
  'fiji-divano',
  'imperia-divano',
  'macau-lounge',
  'manila',
  'oxford-2',
  'oxford-modular-sofa',
  'palma-divano',
  'saint-tropez-balcony-set',
  'zagreb',
  'antalya-daybed',
  'oxford',
  'panamera-sun-lounger',
  'saint-tropez-sun-lounger',
  'laguna-dining-table-with-miami-dining-armchairs',
])

const REUSE_GENERATED_IMAGE = {
  'dining-chair-pietra': 'dining-pietra',
}

// These choices resolve names that are intentionally broader than the local
// catalogue item. Everything else is selected by exact model/type scoring and
// recorded in the generated manifest for review.
const EXPLICIT_LOCAL_PRODUCT = {
  bern: 'local-product-curated-bern-dining-armchair-white-lead-chine',
  'bern-dining-armchair': 'local-product-curated-bern-dining-armchair-white-lead-chine',
  'bella-reclining-dining-set': 'local-product-951bb7c63b93',
  'bella-reclining-sofa-set': 'local-product-3c9cc8408eb8',
  'bella-reclining-sofa-set-dining-set': 'local-product-19c46a09ee62',
  'laguna-dining-set': 'local-product-32be4ad2168b',
  'lisbon-dining-armchair': 'local-product-b0e836f82f18',
  'oporto-bar': 'local-product-694810e0af53',
  'oporto-dining-armchair': 'local-product-68a53f512473',
  'reno-balcony-set': 'local-product-3842a335e3d0',
  tahiti: 'local-product-4c1441ca1634',
  'zanzibar-dining-armchair': 'local-product-7b868075e3cb',
  'conrad': 'local-product-curated-conrad-single-sunlounger-white-charcoal',
  'corsica': 'local-product-curated-corsica-single-sunlounger-charcoal-storm',
  athens: 'local-product-curated-athens-sunlounger-white-lead-chine',
  'antigua-lounge': 'local-product-curated-antigua-sofa-set-nature-grey-white-aluminium',
  'antigua-xl-lounge': 'local-product-e3c3927f5e7d',
  'bali-lounge-2': 'local-product-45ea1bcfa830',
  bali: 'local-product-curated-bali-sunlounger-nature-grey-white-aluminium',
  'bali-double-sun-lounger': 'local-product-curated-bali-double-sunlounger-lead-chine-white-aluminium',
  'berlin-modular-sofa': 'local-product-5a80e66164ce',
  'crete-lounger': 'local-product-1a0cfcfd365a',
  'crete-sun-lounger': 'local-product-1a0cfcfd365a',
  gibraltar: 'local-product-4c1f846c4b96',
  maui: 'local-product-d0bc7ee8de28',
  'newport': 'local-product-5b15a01c86e1',
  'santorini-lounge': 'local-product-b8811bc0f455',
  seville: 'local-product-7c47e7e98e85',
  'tokyo-lounge': 'local-product-41585593bc57',
  'versailles-lounge': 'local-product-9b75b6dd0a7e',
}

const MODEL_ALIASES = {
  'cuba-deka': ['cuba'],
  'side-table-tray': ['side', 'table', 'tray'],
  'u-shaped-side-table': ['u', 'shaped', 'side', 'table'],
  'zanzibar-dinning': ['zanzibar', 'dining'],
  'bora-bora-divano': ['bora', 'bora'],
  'bora-bora-bar-set': ['bora', 'bora', 'bar'],
  'bora-bora-slim': ['bora', 'bora', 'slim'],
  'fiji-divano': ['fiji'],
  'ibiza-divano': ['ibiza'],
  'maya-divano': ['maya'],
  'palma-divano': ['palma'],
}

const FURNITURE_CATEGORIES = new Set(['dining', 'lounge', 'sunlounger'])
const STOP_WORDS = new Set([
  'with', 'and', 'the', 'set', 'collection', 'outdoor', 'reclining', 'adjustable',
])

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function words(value) {
  return normalize(value).split(/\s+/).filter(Boolean)
}

function readCatalogProducts() {
  const source = fs.readFileSync(catalogPath, 'utf8')
  const start = source.indexOf('[')
  const end = source.lastIndexOf(']')
  return JSON.parse(source.slice(start, end + 1))
}

function readNoImageIds() {
  const source = fs.readFileSync(imageStatusPath, 'utf8')
  return new Set([...source.matchAll(/"([^"]+)"/g)].map((match) => match[1]))
}

function categoryMatches(legacy, local) {
  const category = normalize(local.category)
  if (legacy.category === 'sunlounger') return category.includes('sun lounger')
  return category === legacy.category
}

function typeTerms(legacy) {
  const name = normalize(legacy.name)
  const terms = []
  if (name.includes('dining armchair')) terms.push('dining', 'armchair')
  else if (name.includes('dining chair')) terms.push('dining', 'chair')
  else if (name.includes('side table')) terms.push('side', 'table')
  else if (name.includes('dining table') || name.includes('dining set')) terms.push('dining', 'table')
  else if (name.includes('bar')) terms.push('bar')
  else if (name.includes('modular')) terms.push('modular')
  else if (name.includes('sofa') || name.includes('divano') || legacy.category === 'lounge') terms.push('sofa')
  if (name.includes('double sun')) terms.push('double', 'sunlounger')
  else if (name.includes('sun lounger')) terms.push('sunlounger')
  if (name.includes('day bed') || name.includes('daybed')) terms.push('daybed')
  return terms
}

function modelTerms(legacy) {
  if (MODEL_ALIASES[legacy.id]) return MODEL_ALIASES[legacy.id]
  const typeWordSet = new Set([
    'dining', 'armchair', 'chair', 'table', 'side', 'sofa', 'lounge', 'sun', 'lounger',
    'day', 'bed', 'double', 'modular', 'balcony', 'bar', 'slim', 'divano', 'corner', 'xl',
  ])
  const source = words(legacy.collectionName || legacy.name)
  const result = source.filter((word) => !STOP_WORDS.has(word) && !typeWordSet.has(word))
  return result.length ? result : words(legacy.name).slice(0, 1)
}

function candidateImages(product) {
  return [...(product.finalImages || []), ...(product.referenceImages || [])]
    .map((image) => typeof image === 'string' ? image : image?.path || image?.src || image?.url)
    .filter((image) => String(image || '').startsWith('.catalog-private/'))
    .slice(0, 3)
}

function scoreCandidate(legacy, local) {
  const haystack = normalize(`${local.canonicalName} ${local.collection} ${local.productType}`)
  const models = modelTerms(legacy)
  const types = typeTerms(legacy)
  let score = categoryMatches(legacy, local) ? 45 : -20
  score += models.reduce((total, word) => total + (haystack.split(' ').includes(word) ? 35 : -30), 0)
  score += types.reduce((total, word) => total + (haystack.includes(word) ? 12 : -5), 0)
  const legacyWords = new Set(words(legacy.name))
  const overlap = words(local.canonicalName).filter((word) => legacyWords.has(word)).length
  score += overlap * 6
  if (normalize(local.canonicalName) === normalize(legacy.name)) score += 120
  if (candidateImages(local).length === 0) score -= 200
  return score
}

function generatedImageOverride(productId, sourceProductId = productId) {
  return {
    productId,
    images: [`.catalog-private/final-images/legacy/${sourceProductId}/01.png`],
    sourceType: sourceProductId === productId ? 'generated-from-legacy-source' : 'approved-generated-reuse',
    sourceProductId,
  }
}

function main() {
  const localProducts = JSON.parse(fs.readFileSync(localProductsPath, 'utf8'))
  const localById = new Map(localProducts.map((product) => [product.id, product]))
  const noImageIds = readNoImageIds()
  const legacyProducts = readCatalogProducts()
    .filter((product) => noImageIds.has(product.id) && FURNITURE_CATEGORIES.has(product.category))

  const overrides = {}
  const unresolved = []

  for (const legacy of legacyProducts) {
    if (GENERATED_PRODUCT_IDS.has(legacy.id)) {
      overrides[legacy.id] = generatedImageOverride(legacy.id)
      continue
    }
    if (REUSE_GENERATED_IMAGE[legacy.id]) {
      overrides[legacy.id] = generatedImageOverride(legacy.id, REUSE_GENERATED_IMAGE[legacy.id])
      continue
    }

    const explicitId = EXPLICIT_LOCAL_PRODUCT[legacy.id]
    const ranked = localProducts
      .map((product) => ({ product, score: scoreCandidate(legacy, product) }))
      .sort((a, b) => b.score - a.score)
    const match = explicitId ? localById.get(explicitId) : ranked[0]?.product
    const score = explicitId ? scoreCandidate(legacy, match || {}) : ranked[0]?.score ?? -Infinity
    const images = match ? candidateImages(match) : []
    if (!match || images.length === 0 || (!explicitId && score < 45)) {
      unresolved.push({
        productId: legacy.id,
        name: legacy.name,
        bestMatch: ranked[0]?.product?.canonicalName || null,
        bestMatchId: ranked[0]?.product?.id || null,
        score: ranked[0]?.score ?? null,
      })
      continue
    }
    overrides[legacy.id] = {
      productId: legacy.id,
      images,
      sourceType: explicitId ? 'approved-local-match' : 'model-and-type-match',
      sourceProductId: match.id,
      sourceProductName: match.canonicalName,
      matchScore: score,
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(overrides, null, 2)}\n`)
  console.log(`Legacy furniture placeholders: ${legacyProducts.length}`)
  console.log(`Image overrides written: ${Object.keys(overrides).length}`)
  if (unresolved.length) {
    console.error('Unresolved image overrides:')
    console.error(JSON.stringify(unresolved, null, 2))
    process.exitCode = 1
  }
}

main()
