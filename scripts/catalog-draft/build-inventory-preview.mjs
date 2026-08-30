import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const privateRoot = path.join(repoRoot, '.catalog-private')
const inventoryPath = path.join(privateRoot, 'raw', 'inventory-rows.jsonl')
const outputPath = path.join(privateRoot, 'generated', 'inventory-preview.json')

if (!fs.existsSync(inventoryPath)) {
  throw new Error('Missing private inventory: ' + inventoryPath)
}

const rows = fs.readFileSync(inventoryPath, 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line))

function value(row, column) {
  return String(row?.values?.['column' + column] || row?.displayValues?.['column' + column] || '').trim()
}

function slug(valueToSlug) {
  return String(valueToSlug)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'item'
}

function classify(description, family) {
  const valueToClassify = (description + ' ' + family).toLowerCase()
  if (valueToClassify.includes('kitchen') || valueToClassify.includes('bbq') || valueToClassify.includes('barbecue')) return 'Outdoor Kitchens'
  if (valueToClassify.includes('parasol') || valueToClassify.includes('awning') || valueToClassify.includes('pergola') || valueToClassify.includes('shade')) return 'Shade Solutions'
  if (valueToClassify.includes('sunlounger') || valueToClassify.includes('sun lounger') || valueToClassify.includes('daybed') || valueToClassify.includes('day bed')) return 'Sun Loungers & Day Beds'
  if (valueToClassify.includes('dining') || valueToClassify.includes('bar table') || valueToClassify.includes('bar chair')) return 'Dining'
  if (valueToClassify.includes('sofa') || valueToClassify.includes('armchair') || valueToClassify.includes('lounge') || valueToClassify.includes('pouf') || valueToClassify.includes('footstool')) return 'Lounge'
  return 'Pending taxonomy'
}

function numberValue(row) {
  const parsed = Number(value(row, 4).replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

const products = rows.map((row) => {
  const sourceReference = value(row, 2) || `row-${row.sourceRow}`
  const sourceDescription = value(row, 3) || 'Unnamed inventory item'
  const family = value(row, 6)
  const supplier = value(row, 5)
  const id = `inventory-preview-${slug(sourceReference)}-${row.sourceRow}`
  const variant = {
    sku: sourceReference,
    sourceReference,
    sourceDescription,
    stockQuantity: numberValue(row),
    materials: [],
    images: [],
    selectionEvidence: [],
    researchSources: [],
    reviewStatus: 'draft',
    sellableUnitType: 'complete',
    componentRole: null,
  }

  return {
    id,
    canonicalName: sourceDescription,
    collection: 'Inventory preview',
    supplier: supplier || 'Pending supplier review',
    category: classify(sourceDescription, family),
    subcategory: 'Pending review',
    productType: family || 'Pending product type',
    sourceFamily: family,
    description: 'Imported inventory record. Product content and final images are pending review.',
    specs: [
      { label: 'Source reference', value: sourceReference },
      { label: 'Source row', value: String(row.sourceRow) },
    ],
    dimensions: [],
    materials: [],
    variants: [variant],
    components: [],
    referenceImages: [],
    finalImages: [],
    researchSources: [],
    selectionStatus: 'unreviewed',
    approvalStatus: 'draft',
    publicationStatus: 'hidden',
    imageStatus: 'awaiting-final-images',
    isPublished: false,
    reviewNotes: [
      'Inventory preview only; not a reviewed product selection.',
      'Grouping, taxonomy, research and final images are still pending.',
    ],
  }
})

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2) + '\n', 'utf8')
console.log(JSON.stringify({ products: products.length, variants: products.length, outputPath }, null, 2))
