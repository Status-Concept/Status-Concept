import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const privateRoot = path.join(repoRoot, '.catalog-private')
const reviewPath = path.join(privateRoot, 'review', 'selection-decisions.json')
const groupingPath = path.join(privateRoot, 'review', 'grouping-decisions.json')
const reportPath = path.join(privateRoot, 'reports', 'grouping-summary.json')

if (!fs.existsSync(reviewPath)) throw new Error('Missing selection-decisions.json.')
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
const candidateRows = review.decisions.filter((decision) =>
  decision.finalStatus === 'candidate' &&
  decision.selectionStatus === 'candidate' &&
  decision.reviewedBy &&
  decision.reviewedAt &&
  decision.evidence?.length
)

if (!fs.existsSync(groupingPath)) {
  fs.writeFileSync(groupingPath, JSON.stringify({
    version: 1,
    instructions: 'Only approved groups create draft products. Use sourceReferences or sourceRows and record the approval.',
    groups: [],
  }, null, 2) + '\n', 'utf8')
}
const grouping = JSON.parse(fs.readFileSync(groupingPath, 'utf8'))
const groups = Array.isArray(grouping.groups) ? grouping.groups : []
const candidateRefs = new Set(candidateRows.map((row) => row.sourceReference))
const assigned = new Map()
const approvedGroups = []
const errors = []

for (const group of groups) {
  if (group.approvalStatus !== 'approved') continue
  const refs = [...new Set([
    ...(group.sourceReferences || []),
    ...(group.sourceRows || []).map((row) => {
      const match = review.decisions.find((decision) => Number(decision.sourceRow) === Number(row))
      return match?.sourceReference
    }),
  ].filter(Boolean))]
  const validRefs = refs.filter((ref) => candidateRefs.has(ref))
  if (!validRefs.length) continue
  for (const ref of validRefs) {
    if (assigned.has(ref)) errors.push('Candidate assigned to more than one approved group: ' + ref)
    assigned.set(ref, group.groupId || 'group-' + (approvedGroups.length + 1))
  }
  approvedGroups.push({
    groupId: group.groupId || 'group-' + approvedGroups.length,
    canonicalName: group.canonicalName || '',
    sourceReferences: validRefs,
    approvalStatus: group.approvalStatus,
    approvedBy: group.approvedBy || null,
    approvedAt: group.approvedAt || null,
    notes: group.notes || '',
  })
}

const unassignedCandidates = candidateRows
  .map((row) => row.sourceReference)
  .filter((reference) => !assigned.has(reference))

const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  candidateRows: candidateRows.length,
  approvedGroups: approvedGroups.length,
  assignedCandidateRows: assigned.size,
  unassignedCandidates,
  approvedGroupsDetail: approvedGroups,
  errors,
  readyForDraftGeneration: candidateRows.length > 0 && errors.length === 0 && unassignedCandidates.length === 0,
  note: candidateRows.length === 0
    ? 'No reviewed candidates exist yet; human photo review is still pending.'
    : 'Every candidate must receive one approved grouping before draft generation.',
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8')
console.log(JSON.stringify(report, null, 2))
if (errors.length) process.exitCode = 1
