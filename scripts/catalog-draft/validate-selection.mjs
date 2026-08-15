import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const privateRoot = path.join(repoRoot, '.catalog-private')
const rawPath = path.join(privateRoot, 'raw', 'inventory-rows.jsonl')
const reviewPath = path.join(privateRoot, 'review', 'selection-decisions.json')
const reportPath = path.join(privateRoot, 'reports', 'selection-summary.json')
if (!fs.existsSync(rawPath) || !fs.existsSync(reviewPath)) throw new Error('Inventory or selection review is missing.')

const rows = fs.readFileSync(rawPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
const validStatuses = new Set(['candidate', 'excluded', 'needs_review', 'unreviewed'])
const errors = []
if (rows.length !== 2651) errors.push('Inventory row count is not 2651.')
if (review.decisions.length !== rows.length) errors.push('Selection matrix does not cover every inventory row.')

const inventoryRefs = new Set(rows.map((row) => row.sourceReference))
const seen = new Set()
const counts = { candidate: 0, excluded: 0, needs_review: 0, unreviewed: 0 }
const contradictions = []
const withEvidence = new Set()
for (const decision of review.decisions) {
  if (!validStatuses.has(decision.finalStatus)) errors.push('Invalid final status for ' + decision.sourceReference)
  if (!validStatuses.has(decision.proposedStatus)) errors.push('Invalid proposed status for ' + decision.sourceReference)
  if (!validStatuses.has(decision.selectionStatus)) errors.push('Invalid selection status for ' + decision.sourceReference)
  counts[decision.finalStatus] += 1
  if (seen.has(decision.sourceReference)) errors.push('Duplicate reference in selection matrix: ' + decision.sourceReference)
  seen.add(decision.sourceReference)
  if (!inventoryRefs.has(decision.sourceReference)) errors.push('Review reference not found in inventory: ' + decision.sourceReference)
  if (decision.evidence?.length) withEvidence.add(decision.sourceReference)
  const evidenceStatuses = [...new Set((decision.evidence || []).map((evidence) => evidence.finalStatus).filter(Boolean))]
  if (evidenceStatuses.length > 1) contradictions.push(decision.sourceReference)
  if ((decision.finalStatus === 'candidate' || decision.finalStatus === 'excluded') && (!decision.reviewedBy || !decision.reviewedAt || !decision.evidence?.length)) {
    errors.push('A candidate/excluded decision needs reviewer, date and evidence: ' + decision.sourceReference)
  }
}
if (seen.size !== 2651) errors.push('Selection matrix does not contain 2651 unique references.')
if (review.policy?.stockAffectsSelection !== false) errors.push('Selection policy allows stock to affect selection.')

const photoQueue = review.photoReviewQueue || []
const reviewedPhotos = photoQueue.filter((photo) => photo.reviewStatus === 'reviewed').length
const summary = {
  version: 1,
  generatedAt: new Date().toISOString(),
  inventoryTotal: rows.length,
  referencesFoundInPhotoEvidence: withEvidence.size,
  candidate: counts.candidate,
  excluded: counts.excluded,
  needsReview: counts.needs_review,
  unreviewed: counts.unreviewed,
  contradictoryReferences: contradictions,
  photoCount: photoQueue.length,
  reviewedPhotos,
  pendingPhotoReviews: photoQueue.length - reviewedPhotos,
  photoCoveragePercent: rows.length ? Number(((withEvidence.size / rows.length) * 100).toFixed(2)) : 0,
  stockUsedForSelection: false,
  errors,
  readyForGrouping: errors.length === 0 && counts.needs_review === 0 && counts.unreviewed === 0,
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2) + '\n', 'utf8')
console.log(JSON.stringify(summary, null, 2))
if (errors.length) process.exitCode = 1
