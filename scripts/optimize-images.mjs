// Optimize public/product-images/glatz: convert JPG/PNG to WebP (max 1600px, q80),
// rewrite the /product-images/glatz/... refs in src, verify, and delete originals.
//
// Usage:
//   node scripts/optimize-images.mjs --convert   # create .webp next to originals (non-destructive)
//   node scripts/optimize-images.mjs --rewrite   # rewrite refs, verify all resolve, delete converted originals
//
// catalog/ subtree is intentionally untouched (only referenced by the unused catalogProducts.js).

import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const GLATZ_DIR = path.join(ROOT, 'public', 'product-images', 'glatz')
const REF_FILES = [
  path.join(ROOT, 'src', 'data', 'glatzProducts.js'),
  path.join(ROOT, 'src', 'pages', 'status-concept-products.jsx'),
]

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

async function convert() {
  const files = (await walk(GLATZ_DIR)).filter(isConvertible)
  let converted = 0, skippedCollision = 0, before = 0, after = 0
  const collisions = []
  for (const file of files) {
    const twin = webpTwin(file)
    const twinExists = await fs.access(twin).then(() => true, () => false)
    if (twinExists) { skippedCollision++; collisions.push(path.relative(ROOT, twin)); continue }
    const src = await fs.stat(file)
    await sharp(file).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(twin)
    const dst = await fs.stat(twin)
    before += src.size; after += dst.size; converted++
  }
  console.log(JSON.stringify({
    phase: 'convert', converted, skippedCollision, collisions,
    beforeMB: +(before / 1048576).toFixed(1), afterMB: +(after / 1048576).toFixed(1),
  }, null, 2))
}

async function rewrite() {
  // 1. Rewrite refs whose .webp twin exists on disk.
  const refRe = /\/product-images\/glatz\/[^"'`)\s]+?\.(?:jpe?g|png)/gi
  let rewritten = 0, keptOriginalRef = 0
  for (const rf of REF_FILES) {
    let text = await fs.readFile(rf, 'utf8')
    const refs = [...new Set(text.match(refRe) || [])]
    for (const ref of refs) {
      const abs = path.join(ROOT, 'public', ref.replace(/^\//, ''))
      const twin = webpTwin(abs)
      const twinExists = await fs.access(twin).then(() => true, () => false)
      if (twinExists) {
        text = text.split(ref).join(ref.replace(/\.(jpe?g|png)$/i, '.webp'))
        rewritten++
      } else keptOriginalRef++
    }
    await fs.writeFile(rf, text)
  }

  // 2. Verify EVERY /product-images/ ref in src (all files) resolves to a real file.
  const srcFiles = (await walk(path.join(ROOT, 'src'))).filter(p => /\.(jsx?|css)$/.test(p))
  const missing = []
  const allRefRe = /\/product-images\/[^"'`)\s]+?\.(?:jpe?g|png|webp)/gi
  const referenced = new Set()
  for (const sf of srcFiles) {
    const text = await fs.readFile(sf, 'utf8')
    for (const ref of text.match(allRefRe) || []) {
      referenced.add(ref)
      const abs = path.join(ROOT, 'public', ref.replace(/^\//, ''))
      const ok = await fs.access(abs).then(() => true, () => false)
      if (!ok) missing.push({ file: path.relative(ROOT, sf), ref })
    }
  }
  if (missing.length) {
    console.error(JSON.stringify({ phase: 'rewrite', FAILED: 'missing refs', missing }, null, 2))
    process.exit(1)
  }

  // 3. Delete originals that were converted AND are no longer referenced anywhere in src.
  const files = (await walk(GLATZ_DIR)).filter(isConvertible)
  let deleted = 0, kept = 0
  for (const file of files) {
    const twin = webpTwin(file)
    const twinExists = await fs.access(twin).then(() => true, () => false)
    const rel = '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/')
    if (twinExists && !referenced.has(rel)) { await fs.unlink(file); deleted++ }
    else kept++
  }
  console.log(JSON.stringify({ phase: 'rewrite', rewritten, keptOriginalRef, verifiedRefs: referenced.size, missing: 0, deletedOriginals: deleted, keptFiles: kept }, null, 2))
}

const mode = process.argv[2]
if (mode === '--convert') await convert()
else if (mode === '--rewrite') await rewrite()
else { console.error('pass --convert or --rewrite'); process.exit(1) }
