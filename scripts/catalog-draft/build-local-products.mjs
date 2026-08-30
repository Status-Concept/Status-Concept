import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const privateRoot = path.join(repoRoot, '.catalog-private')
const organizedRoot = path.join(privateRoot, 'reference-images', 'professional-white', 'organized-by-product')
const outputPath = path.join(privateRoot, 'generated', 'local-products.json')

function normalizePath(value) {
  return String(value).replaceAll('\\', '/')
}

function safeId(value) {
  return String(value || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'product'
}

function classify(name, family = '') {
  const text = `${name} ${family}`.toLowerCase()
  if (/kitchen|bbq|barbecue|cabinet/.test(text)) return 'Outdoor Kitchens'
  if (/parasol|awning|pergola|shade/.test(text)) return 'Shade Solutions'
  if (/sunlounger|sun lounger|sunbed|daybed|day bed|lounger/.test(text)) return 'Sun Loungers & Day Beds'
  if (/dining|bar table|bar chair|dining table/.test(text)) return 'Dining'
  if (/sofa|armchair|lounge|pouf|footstool|ottoman/.test(text)) return 'Lounge'
  if (/coffee table|side table|table/.test(text)) return 'Tables'
  if (/cushion|pot|planter|decor/.test(text)) return 'Accessories & Décor'
  return 'Pending taxonomy'
}

function collectionName(metadata) {
  const segments = normalizePath(metadata.originalFolder || '').split('/').filter(Boolean)
  const collectionIndex = segments.findIndex((segment) => /collection and item/i.test(segment))
  if (collectionIndex >= 0 && segments[collectionIndex + 1]) return segments[collectionIndex + 1]
  const meaningful = segments.findLast((segment) => !/^\d+\s*-/.test(segment) && !/^(tables|chairs|sofas)$/i.test(segment))
  return meaningful || String(metadata.productName || 'Private catalogue').split(/\s+/)[0]
}

function productType(metadata) {
  const family = metadata.inventoryMatches?.find((match) => match.family)?.family
  if (family) return family
  const name = String(metadata.productName || '')
  const known = name.match(/(Dining Armchair|Bar Chair|Sunlounger|Sun Lounger|Daybed|Coffee Table|Side Table|Dining Table|Bar Table|Armchair|Sofa|Footstool|Ottoman|Pouf|Cabinet|Kitchen|Planter|Pot)/i)
  return known?.[1] || 'Pending product type'
}

export function buildLocalProduct(metadata, relativeProductFolder) {
  const productId = metadata.productIds?.[0] || safeId(metadata.productName)
  const imageBase = normalizePath(path.posix.join(
    '.catalog-private/reference-images/professional-white/organized-by-product',
    normalizePath(relativeProductFolder),
  ))
  const referenceImages = (metadata.images || []).slice(0, 3).map((image, index) => ({
    path: `${imageBase}/${image.file}`,
    sha256: image.sha256,
    alt: `${metadata.productName} — view ${index + 1}`,
    sourceType: 'status-concept-local-generated',
    reviewStatus: image.reviewStatus || 'needs-human-review',
  }))
  const inventoryMatches = metadata.inventoryMatches || []
  const suppliers = [...new Set(inventoryMatches.map((match) => match.supplier).filter(Boolean))]
  const families = [...new Set(inventoryMatches.map((match) => match.family).filter(Boolean))]
  const variants = inventoryMatches.map((match) => ({
    sku: match.sku,
    sourceReference: match.sku,
    sourceDescription: match.description,
    stockQuantity: match.stockQuantity,
    materials: match.extraFields || [],
    images: referenceImages,
    selectionEvidence: [],
    researchSources: [],
    reviewStatus: 'needs_review',
    matchConfidence: match.confidence,
    sourceRow: match.sourceRow,
    supplier: match.supplier,
  }))
  const bestMatch = inventoryMatches[0]
  const family = families[0] || ''

  return {
    id: `local-product-${safeId(productId)}`,
    canonicalName: metadata.productName,
    collection: collectionName(metadata),
    supplier: suppliers.join(' / ') || 'Pending supplier review',
    category: classify(metadata.productName, family),
    subcategory: family || 'Pending review',
    productType: productType(metadata),
    sourceFamily: family,
    description: bestMatch?.description || 'Locally prepared Status Concept product. Product details and SKU association require final review.',
    specs: [
      { label: 'Local images', value: String(referenceImages.length) },
      { label: 'Inventory matches', value: String(inventoryMatches.length) },
      { label: 'Original folder', value: metadata.originalFolder || 'Private organised catalogue' },
    ],
    dimensions: [],
    materials: [...new Set(inventoryMatches.flatMap((match) => match.extraFields || []))],
    variants,
    components: [],
    referenceImages,
    finalImages: [],
    researchSources: [],
    selectionStatus: 'candidate',
    approvalStatus: 'review',
    publicationStatus: 'hidden',
    imageStatus: 'reference-only',
    isPublished: false,
    reviewNotes: [
      'Localhost private preview only; not published.',
      'Professional white-background images still require human approval.',
      ...(inventoryMatches.length ? ['Inventory SKU matches require final confirmation.'] : ['No safe local inventory match was found; no SKU was invented.']),
    ],
  }
}

function findProductInfoFiles(root) {
  const files = []
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name)
      if (entry.isDirectory()) visit(fullPath)
      else if (entry.isFile() && entry.name === 'product-info.json') files.push(fullPath)
    }
  }
  visit(root)
  return files.sort((a, b) => a.localeCompare(b))
}

export function buildLocalProducts(root = organizedRoot) {
  if (!fs.existsSync(root)) throw new Error(`Missing organized product images: ${root}`)
  return findProductInfoFiles(root).map((infoPath) => {
    const metadata = JSON.parse(fs.readFileSync(infoPath, 'utf8'))
    const relativeProductFolder = normalizePath(path.relative(root, path.dirname(infoPath)))
    return buildLocalProduct(metadata, relativeProductFolder)
  })
}

function run() {
  const products = buildLocalProducts()
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8')
  const result = {
    products: products.length,
    images: products.reduce((total, product) => total + product.referenceImages.length, 0),
    variants: products.reduce((total, product) => total + product.variants.length, 0),
    productsWithImages: products.filter((product) => product.referenceImages.length > 0).length,
    outputPath,
  }
  console.log(JSON.stringify(result, null, 2))
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) run()
