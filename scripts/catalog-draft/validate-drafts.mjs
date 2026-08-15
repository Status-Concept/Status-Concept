import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const privateRoot = path.join(repoRoot, '.catalog-private')
const draftPath = path.join(privateRoot, 'generated', 'draft-products.json')
const reviewPath = path.join(privateRoot, 'review', 'selection-decisions.json')
const reportPath = path.join(privateRoot, 'reports', 'draft-validation.json')
if (!fs.existsSync(draftPath)) throw new Error('Missing generated draft-products.json.')

const products = JSON.parse(fs.readFileSync(draftPath, 'utf8'))
const review = fs.existsSync(reviewPath) ? JSON.parse(fs.readFileSync(reviewPath, 'utf8')) : { decisions: [] }
const decisions = new Map(review.decisions.map((decision) => [decision.sourceReference, decision]))
const errors = []
const ids = new Set()
const skus = new Set()
function validateRecord(record, productId, kind) {
  if (!record.sku) errors.push(kind + ' is missing a SKU in product: ' + productId)
  if (record.sku && skus.has(record.sku)) errors.push('Duplicate draft SKU across variants/components: ' + record.sku)
  if (record.sku) skus.add(record.sku)
  const decision = decisions.get(record.sourceReference)
  if (!decision || decision.finalStatus !== 'candidate') errors.push(kind + ' does not point to a reviewed candidate: ' + (record.sourceReference || record.sku || productId))
  for (const image of record.images || []) {
    if (/^(https?:)?\/\//i.test(String(image.url || image.src || ''))) errors.push('Remote image in draft ' + kind + ': ' + (record.sku || productId))
  }
}
for (const product of products) {
  if (ids.has(product.id)) errors.push('Duplicate draft product id: ' + product.id)
  ids.add(product.id)
  if (product.isPublished !== false) errors.push('Draft product is marked published: ' + product.id)
  if (product.publicationStatus === 'published') errors.push('Draft product has published status: ' + product.id)
  if (product.selectionStatus !== 'candidate') errors.push('Draft product is not a candidate: ' + product.id)
  for (const variant of product.variants || []) {
    validateRecord(variant, product.id, 'Variant')
  }
  for (const component of product.components || []) {
    validateRecord(component, product.id, 'Component')
    if (!component.componentRole) errors.push('Component is missing componentRole: ' + (component.sku || product.id))
    if (!Array.isArray(component.compatibleWithSkus)) errors.push('Component compatibility must be explicit: ' + (component.sku || product.id))
  }
  for (const image of [...(product.referenceImages || []), ...(product.finalImages || [])]) {
    if (/^(https?:)?\/\//i.test(String(image.url || image.src || ''))) errors.push('Remote image in draft product: ' + product.id)
  }
}
const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  products: products.length,
  variants: [...skus].length,
  errors,
  valid: errors.length === 0,
  note: products.length === 0
    ? 'No draft pages are generated until human selection and grouping approval are complete.'
    : 'Draft records remain hidden and are available only to the development preview.',
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8')
console.log(JSON.stringify(report, null, 2))
if (errors.length) process.exitCode = 1
