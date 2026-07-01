// Optimize src/assets/images: convert JPG/PNG over 250KB to WebP (max 1920px, q80),
// rewrite the ES-import specifiers across src, then delete converted originals.
// Vite build verifies the result: any broken import fails the build.
//
// Usage: node scripts/optimize-asset-images.mjs

import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const ASSETS = path.join(ROOT, 'src', 'assets', 'images')
const SRC = path.join(ROOT, 'src')
const MIN_BYTES = 250 * 1024

async function walk(dir) {
  const out = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...await walk(p))
    else out.push(p)
  }
  return out
}

const isConvertible = (p) => /\.(jpe?g|png)$/i.test(p)
const webpTwin = (p) => p.replace(/\.(jpe?g|png)$/i, '.webp')

// 1. Convert
const candidates = []
for (const f of (await walk(ASSETS)).filter(isConvertible)) {
  const st = await fs.stat(f)
  if (st.size >= MIN_BYTES) candidates.push({ file: f, size: st.size })
}
let converted = 0, skippedCollision = 0, before = 0, after = 0
const convertedSet = new Set()
for (const { file, size } of candidates) {
  const twin = webpTwin(file)
  if (await fs.access(twin).then(() => true, () => false)) { skippedCollision++; continue }
  await sharp(file).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(twin)
  before += size; after += (await fs.stat(twin)).size
  converted++; convertedSet.add(path.resolve(file))
}

// 2. Rewrite import specifiers, resolving each against the importing file.
const codeFiles = (await walk(SRC)).filter(p => /\.(jsx?|mjs)$/.test(p))
const specRe = /(["'])((?:\.{1,2}\/)[^"']*assets\/images\/[^"']+?\.(?:jpe?g|png))\1/gi
let rewritten = 0
for (const cf of codeFiles) {
  let text = await fs.readFile(cf, 'utf8')
  let changed = false
  text = text.replace(specRe, (whole, quote, spec) => {
    const resolved = path.resolve(path.dirname(cf), spec)
    if (convertedSet.has(resolved)) {
      changed = true; rewritten++
      return quote + spec.replace(/\.(jpe?g|png)$/i, '.webp') + quote
    }
    return whole
  })
  if (changed) await fs.writeFile(cf, text)
}

// 3. Delete originals that were converted and are referenced nowhere anymore.
let deleted = 0, keptReferenced = 0
const allText = (await Promise.all(codeFiles.map(f => fs.readFile(f, 'utf8')))).join('\n')
for (const abs of convertedSet) {
  const name = path.basename(abs)
  if (allText.includes(name)) { keptReferenced++; continue }
  await fs.unlink(abs); deleted++
}

console.log(JSON.stringify({
  converted, skippedCollision, rewrittenSpecifiers: rewritten,
  deletedOriginals: deleted, keptStillReferenced: keptReferenced,
  beforeMB: +(before / 1048576).toFixed(1), afterMB: +(after / 1048576).toFixed(1),
}, null, 2))
