import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const privateRoot = path.join(repoRoot, '.catalog-private')
const draftPath = path.join(privateRoot, 'generated', 'draft-products.json')
const outputPath = path.join(privateRoot, 'research', 'product-research.json')
const fetchEnabled = process.argv.includes('--fetch')
const retrievedAt = new Date().toISOString()
const baseUrl = 'https://statusconcept.com/wp-json'

if (!fs.existsSync(draftPath)) throw new Error('Missing generated draft-products.json.')
const products = JSON.parse(fs.readFileSync(draftPath, 'utf8'))
const research = []
const errors = []

function source(url, matchedBy, confidence, fieldsSupported, method, notes = '') {
  return {
    url,
    sourceType: 'status-concept',
    retrievedAt,
    matchedBy,
    confidence,
    fieldsSupported,
    method,
    notes,
  }
}

async function request(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'StatusConcept-private-catalogue-research/1.0' } })
  if (!response.ok) throw new Error('HTTP ' + response.status + ' for ' + url)
  return response.json()
}

for (const product of products) {
  const refs = (product.variants || []).map((variant) => variant.sourceReference).filter(Boolean)
  const record = {
    productId: product.id,
    canonicalName: product.canonicalName,
    pendingResearch: true,
    sourcePolicy: [
      'Exact SKU in WooCommerce Store API',
      'Reference in WordPress content',
      'Model name',
      'Collection and type',
      'Manufacturer or supplier official source',
    ],
    sources: [],
    matchedFields: {},
    missingFields: ['description', 'specs', 'dimensions', 'materials', 'images'],
    errors: [],
  }

  if (fetchEnabled) {
    const query = refs[0] || product.canonicalName
    const encoded = encodeURIComponent(query)
    const endpoints = [
      { url: baseUrl + '/wc/store/v1/products?search=' + encoded + '&per_page=10', method: 'woocommerce-store-search' },
      { url: baseUrl + '/product?search=' + encoded + '&per_page=10', method: 'wordpress-product-search' },
    ]
    for (const endpoint of endpoints) {
      try {
        const data = await request(endpoint.url)
        const matches = Array.isArray(data) ? data : []
        if (matches.length) {
          record.sources.push(source(endpoint.url, refs.length ? 'reference' : 'model', refs.length ? 'exact' : 'high', [], endpoint.method, 'Match stored for human confirmation; external data never replaces Excel values.'))
          record.matches = matches.map((match) => ({
            id: match.id || match.slug || null,
            name: match.name || match.title?.rendered || null,
            url: match.permalink || match.link || null,
          }))
          break
        }
      } catch (error) {
        record.errors.push(error.message)
      }
    }
  }
  if (!record.sources.length) {
    record.sources.push(source(baseUrl, 'manual', 'uncertain', [], fetchEnabled ? 'official-source-search' : 'pending-research', fetchEnabled
      ? 'No exact official match was found automatically; manual research remains required.'
      : 'Research is pending. Run with --fetch only after candidates are approved; never hotlink returned images.'))
  }
  record.pendingResearch = true
  research.push(record)
}

const output = {
  version: 1,
  generatedAt: retrievedAt,
  fetchEnabled,
  canonicalResearchDomain: 'statusconcept.com',
  imagePolicy: 'Reference images must be downloaded to private storage with hash and provenance; no hotlinks.',
  products: research,
  errors,
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf8')
console.log(JSON.stringify({ products: products.length, fetchEnabled, outputPath, errors: errors.length }, null, 2))
