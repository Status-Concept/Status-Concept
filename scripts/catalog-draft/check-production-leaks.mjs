import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const distRoot = path.join(repoRoot, 'dist')
if (!fs.existsSync(distRoot)) throw new Error('dist/ is missing. Run npm run build first.')

const forbidden = [
  { label: 'draft route', pattern: /__dev\/catalog-draft|__dev%2Fcatalog-draft/i },
  { label: 'draft virtual module', pattern: /status-concept-draft-catalog/i },
  { label: 'private directory', pattern: /\.catalog-private|catalog-private/i },
  { label: 'selection review file', pattern: /selection-decisions|draft-products\.json/i },
  { label: 'stock field', pattern: /stockQuantity|Qnt_ Existente|Qnt_Existente/i },
  { label: 'private image source', pattern: /selection-photos|reference-images|final-images/i },
]
const hits = []
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(fullPath)
    else {
      const buffer = fs.readFileSync(fullPath)
      if (buffer.includes(0)) continue
      const content = buffer.toString('utf8')
      for (const item of forbidden) {
        if (item.pattern.test(content)) hits.push({ file: path.relative(distRoot, fullPath), label: item.label })
      }
    }
  }
}
walk(distRoot)
const result = {
  checkedAt: new Date().toISOString(),
  distRoot,
  hits,
  valid: hits.length === 0,
}
console.log(JSON.stringify(result, null, 2))
if (hits.length) process.exitCode = 1
