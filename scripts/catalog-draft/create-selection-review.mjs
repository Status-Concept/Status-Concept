import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const privateRoot = path.join(repoRoot, '.catalog-private')
const rawPath = path.join(privateRoot, 'raw', 'inventory-rows.jsonl')
const photoManifestPath = path.join(privateRoot, 'sources', 'selection-photos', 'manifest.json')
const reviewDir = path.join(privateRoot, 'review')
const reviewPath = path.join(reviewDir, 'selection-decisions.json')
const csvPath = path.join(reviewDir, 'selection-decisions.csv')

if (!fs.existsSync(rawPath)) throw new Error('Missing inventory-rows.jsonl. Run extract-inventory.ps1 first.')
if (!fs.existsSync(photoManifestPath)) throw new Error('Missing photo manifest. Run build-photo-manifest.mjs first.')
if (fs.existsSync(reviewPath)) throw new Error('Selection review already exists; refusing to overwrite human decisions.')

const rows = fs.readFileSync(rawPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
const photoManifest = JSON.parse(fs.readFileSync(photoManifestPath, 'utf8'))
const decisions = rows.map((row) => ({
  sourceFileId: row.sourceFileId,
  sourceSheet: row.sourceSheet,
  sourceRow: row.sourceRow,
  sourceReference: row.sourceReference,
  rowHash: row.rowHash,
  proposedStatus: 'unreviewed',
  finalStatus: 'unreviewed',
  selectionStatus: 'unreviewed',
  reviewedBy: null,
  reviewedAt: null,
  evidence: [],
  reviewNotes: [],
}))

const review = {
  version: 1,
  createdAt: new Date().toISOString(),
  policy: {
    clearX: 'excluded',
    visibleWithoutMark: 'candidate',
    ambiguousMark: 'needs_review',
    notVisible: 'unreviewed',
    stockAffectsSelection: false,
    humanReviewRequired: true,
  },
  inventoryTotal: rows.length,
  decisions,
  photoReviewQueue: photoManifest.photos.map((photo) => ({
    photoId: photo.photoId,
    photoPath: photo.photoPath,
    fileName: photo.fileName,
    reviewStatus: 'pending',
    visibleRows: [],
    reviewedBy: null,
    reviewedAt: null,
    notes: '',
  })),
}

fs.mkdirSync(reviewDir, { recursive: true })
fs.writeFileSync(reviewPath, JSON.stringify(review, null, 2) + '\n', 'utf8')

function csv(value) {
  const text = value == null ? '' : String(value)
  return '"' + text.replaceAll('"', '""') + '"'
}
const columns = ['sourceFileId', 'sourceSheet', 'sourceRow', 'sourceReference', 'rowHash', 'proposedStatus', 'finalStatus', 'selectionStatus', 'reviewedBy', 'reviewedAt', 'evidenceCount', 'reviewNotes']
const csvLines = [columns.join(',')]
for (const decision of decisions) {
  csvLines.push([
    decision.sourceFileId,
    decision.sourceSheet,
    decision.sourceRow,
    decision.sourceReference,
    decision.rowHash,
    decision.proposedStatus,
    decision.finalStatus,
    decision.selectionStatus,
    decision.reviewedBy,
    decision.reviewedAt,
    decision.evidence.length,
    decision.reviewNotes.join(' | '),
  ].map(csv).join(','))
}
fs.writeFileSync(csvPath, csvLines.join('\n') + '\n', 'utf8')
console.log(JSON.stringify({ inventoryTotal: rows.length, photos: review.photoReviewQueue.length, reviewPath }, null, 2))
