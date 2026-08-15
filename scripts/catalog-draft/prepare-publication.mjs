import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const privateRoot = path.join(repoRoot, '.catalog-private')
const draftPath = path.join(privateRoot, 'generated', 'draft-products.json')
const selectionPath = path.join(privateRoot, 'reports', 'selection-summary.json')
const groupingPath = path.join(privateRoot, 'reports', 'grouping-summary.json')
const draftReportPath = path.join(privateRoot, 'reports', 'draft-validation.json')
const outputPath = path.join(privateRoot, 'reports', 'publication-readiness.json')
const draftProducts = fs.existsSync(draftPath) ? JSON.parse(fs.readFileSync(draftPath, 'utf8')) : []
const selection = fs.existsSync(selectionPath) ? JSON.parse(fs.readFileSync(selectionPath, 'utf8')) : null
const grouping = fs.existsSync(groupingPath) ? JSON.parse(fs.readFileSync(groupingPath, 'utf8')) : null
const validation = fs.existsSync(draftReportPath) ? JSON.parse(fs.readFileSync(draftReportPath, 'utf8')) : null
const readiness = {
  version: 1,
  generatedAt: new Date().toISOString(),
  dryRun: true,
  mutatesPublicCatalogue: false,
  mutatesSupabase: false,
  mutatesShopify: false,
  mutatesProduction: false,
  products: draftProducts.length,
  selectionReady: Boolean(selection?.readyForGrouping),
  groupingReady: Boolean(grouping?.readyForDraftGeneration),
  draftsValid: Boolean(validation?.valid),
  imagesApproved: draftProducts.every((product) => product.imageStatus === 'final-approved'),
  readyToPublish: false,
  blockers: [
    'Publication requires a separate explicit task and approval.',
    'The current selection matrix is conservative and needs human review.',
    'Final product images are not approved.',
  ],
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(readiness, null, 2) + '\n', 'utf8')
console.log(JSON.stringify(readiness, null, 2))
