// Generate downscaled -w400 and -w800 webp variants for every catalogue image
// under public/product-images, so grids and thumbnails fetch small files while
// the lightbox keeps the full-res original. Idempotent + incremental: skips a
// variant that already exists and is newer than its source.
//
// Run after adding product images:  node scripts/generate-image-variants.mjs

import { readdir, stat } from 'node:fs/promises'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'product-images')
const WIDTHS = [400, 800]
const QUALITY = 78

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

const isVariant = (name) => /-w\d+\.webp$/.test(name)

async function newerThan(target, source) {
  try {
    const [t, s] = await Promise.all([stat(target), stat(source)])
    return t.mtimeMs >= s.mtimeMs
  } catch {
    return false // target missing
  }
}

let sources = 0
let generated = 0
let skipped = 0
const failed = []

for await (const file of walk(ROOT)) {
  if (!file.endsWith('.webp') || isVariant(basename(file))) continue
  sources += 1
  const base = file.slice(0, -'.webp'.length)
  for (const w of WIDTHS) {
    const out = `${base}-w${w}.webp`
    if (await newerThan(out, file)) { skipped += 1; continue }
    try {
      await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out)
      generated += 1
    } catch (err) {
      failed.push(`${file}: ${err.message}`)
    }
  }
}

console.log(`sources: ${sources}, generated: ${generated}, skipped: ${skipped}, failed: ${failed.length}`)
if (failed.length) {
  console.log('FAILED (skipped, not fatal):')
  failed.forEach((f) => console.log('  ' + f))
}
