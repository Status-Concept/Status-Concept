import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const privateRoot = path.join(repoRoot, '.catalog-private')
const inventoryPath = path.join(privateRoot, 'raw', 'inventory-rows.jsonl')
const reviewPath = path.join(privateRoot, 'review', 'selection-decisions.json')
const groupingPath = path.join(privateRoot, 'review', 'grouping-decisions.json')
const outputPath = path.join(privateRoot, 'generated', 'draft-products.json')
if (!fs.existsSync(inventoryPath) || !fs.existsSync(reviewPath)) throw new Error('Inventory or selection review is missing.')

const inventory = fs.readFileSync(inventoryPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
const grouping = fs.existsSync(groupingPath) ? JSON.parse(fs.readFileSync(groupingPath, 'utf8')) : { groups: [] }
const inventoryByReference = new Map(inventory.map((row) => [row.sourceReference, row]))
const decisions = new Map(review.decisions.map((decision) => [decision.sourceReference, decision]))

function text(row) {
  return String(row?.values?.column3 || row?.displayValues?.column3 || '').trim()
}
function sourceFamily(row) {
  return String(row?.values?.column6 || row?.displayValues?.column6 || '').trim()
}
function supplier(row) {
  return String(row?.values?.column5 || row?.displayValues?.column5 || '').trim()
}
function extractCollection(description) {
  const match = description.match(/\b(?:RENO|HAWAII|TOKYO|MACAU|MIAMI|NEWPORT|ORLANDO|FLORIDA|LAGUNA|LISBON|BALI|SICILY|CONRAD|CORSICA|BELLA|MUNICH|BORA BORA|PANAMA|OPORTO|BAHAMAS|STA MONICA|SEVILLE|CRIB|COCO DIAMOND)\b/i)
  return match ? match[0].toUpperCase() : 'Pending collection'
}
function classify(description, family) {
  const value = (description + ' ' + family).toLowerCase()
  if (value.includes('kitchen') || value.includes('bbq') || value.includes('barbecue')) return { category: 'Outdoor Kitchens', subcategory: 'Pending taxonomy' }
  if (value.includes('parasol') || value.includes('awning') || value.includes('pergola') || value.includes('shade')) return { category: 'Shade Solutions', subcategory: 'Pending taxonomy' }
  if (value.includes('sunlounger') || value.includes('sun lounger') || value.includes('daybed') || value.includes('day bed')) return { category: 'Sun Loungers & Day Beds', subcategory: 'Pending taxonomy' }
  if (value.includes('dining') || value.includes('bar table') || value.includes('bar chair')) return { category: 'Dining', subcategory: 'Pending taxonomy' }
  if (value.includes('sofa') || value.includes('armchair') || value.includes('lounge') || value.includes('pouf') || value.includes('footstool')) return { category: 'Lounge', subcategory: 'Pending taxonomy' }
  if (value.includes('cushion') || value.includes('flower pot') || value.includes('stool') || value.includes('side table') || value.includes('coffee table') || value.includes('cover')) return { category: 'Draft accessory', subcategory: 'Pending taxonomy' }
  return { category: 'Needs taxonomy review', subcategory: 'Pending taxonomy' }
}
function parseMaterials(description) {
  const found = []
  const patterns = [
    ['aluminium', /\balum(?:inium)?\b/i],
    ['rope', /\brope\b/i],
    ['textylene', /\btextylene\b/i],
    ['ceramic', /\bceramic\b/i],
    ['teak', /\bteak\b/i],
    ['fabric', /\bfabric|textile|cushion/i],
    ['wood', /\bwood|wooden\b/i],
  ]
  for (const [label, pattern] of patterns) if (pattern.test(description)) found.push(label)
  return found
}
function parseDimensions(description) {
  const matches = description.match(/\b\d{2,4}\s*[x×*]\s*\d{2,4}(?:\s*[x×*]\s*\d{2,4})?\s*(?:cm)?\b/gi) || []
  return matches.map((value) => ({ label: 'Source dimension', value: value.trim(), source: 'Excel' }))
}
function numberValue(row) {
  const value = String(row?.values?.column4 || '').replace(',', '.')
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}
function componentInfo(description) {
  const value = description.toLowerCase()
  if (value.includes('cover')) return { sellableUnitType: 'accessory', componentRole: 'cover' }
  if (value.includes('cushion') || value.includes('mattress')) return { sellableUnitType: 'component', componentRole: 'cushion' }
  if (value.includes('frame')) return { sellableUnitType: 'component', componentRole: 'frame' }
  if (value.includes('base')) return { sellableUnitType: 'component', componentRole: 'base' }
  if (value.includes('top')) return { sellableUnitType: 'component', componentRole: 'top' }
  if (value.includes('unit') || value.includes('module') || value.includes('corner') || value.includes('left') || value.includes('right') || value.includes('center')) return { sellableUnitType: 'component', componentRole: 'module' }
  return { sellableUnitType: 'complete', componentRole: null }
}
function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'draft-product'
}

const groups = Array.isArray(grouping.groups) ? grouping.groups.filter((group) => group.approvalStatus === 'approved') : []
const products = []
const usedSkus = new Set()
for (const group of groups) {
  const references = [...new Set([
    ...(group.sourceReferences || []),
    ...(group.sourceRows || []).map((sourceRow) => review.decisions.find((decision) => Number(decision.sourceRow) === Number(sourceRow))?.sourceReference),
  ].filter(Boolean))]
  const validRows = references
    .map((reference) => inventoryByReference.get(reference))
    .filter((row) => {
      const decision = decisions.get(row.sourceReference)
      return row && decision?.finalStatus === 'candidate' && decision.selectionStatus === 'candidate' && decision.reviewedBy && decision.reviewedAt && decision.evidence?.length
    })
  if (!validRows.length) continue
  const first = validRows[0]
  const description = text(first)
  const taxonomy = classify(description, sourceFamily(first))
  const collection = group.collection || extractCollection(description)
  const canonicalName = group.canonicalName || description.replace(/\s*-\s*(?:charcoal|white|graphite|blue|coffee|black)\b.*$/i, '').trim()
  const id = 'draft-' + slug((group.groupId || canonicalName) + '-' + supplier(first))
  const records = validRows.map((row) => {
    const decision = decisions.get(row.sourceReference)
    const component = componentInfo(text(row))
    return {
      sku: row.sourceReference,
      sourceReference: row.sourceReference,
      sourceDescription: text(row),
      stockQuantity: numberValue(row),
      materials: parseMaterials(text(row)),
      selectionEvidence: decision.evidence || [],
      researchSources: [],
      reviewStatus: 'verified',
      ...component,
    }
  })
  const variants = records
    .filter((record) => record.sellableUnitType === 'complete')
    .map((record) => {
      usedSkus.add(record.sku)
      return record
    })
  const components = records
    .filter((record) => record.sellableUnitType !== 'complete')
    .map((record) => {
      usedSkus.add(record.sku)
      return {
        ...record,
        compatibleWithSkus: [],
        images: [],
      }
    })
  const allMaterials = [...new Set(records.flatMap((record) => record.materials))]
  products.push({
    id,
    canonicalName,
    collection,
    supplier: supplier(first),
    category: group.category || taxonomy.category,
    subcategory: group.subcategory || taxonomy.subcategory,
    productType: group.productType || 'Pending product type',
    sourceFamily: sourceFamily(first),
    description: group.description || 'Pending approved product description.',
    specs: [],
    dimensions: parseDimensions(description),
    materials: allMaterials,
    variants,
    components,
    referenceImages: [],
    finalImages: [],
    researchSources: [],
    selectionStatus: 'candidate',
    approvalStatus: 'draft',
    publicationStatus: 'hidden',
    imageStatus: 'awaiting-final-images',
    isPublished: false,
    reviewNotes: ['Generated only from an explicitly reviewed candidate and approved grouping.', 'Final images are still required before publication.'],
  })
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2) + '\n', 'utf8')
console.log(JSON.stringify({ products: products.length, variants: [...usedSkus].length, outputPath }, null, 2))
