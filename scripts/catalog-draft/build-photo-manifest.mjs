import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..', '..')
const privateRoot = path.join(repoRoot, '.catalog-private')

function argument(name, fallback = '') {
  const index = process.argv.findIndex((value) => value === name || value === name.replace('--', '-'))
  return index >= 0 ? process.argv[index + 1] || fallback : fallback
}

const inputArgument = argument('--input-dir', argument('--inputDir'))
if (!inputArgument) throw new Error('Pass --input-dir with the directory containing the selection photographs.')
const inputDir = path.resolve(inputArgument)

const files = (await fs.readdir(inputDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && /^WhatsApp Image 2026-08-15/i.test(entry.name))
  .filter((entry) => /\.(jpe?g|png)$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, 'en'))

if (!files.length) throw new Error('No dated WhatsApp selection photographs were found.')

const outputDir = path.join(privateRoot, 'sources', 'selection-photos', 'originals')
await fs.mkdir(outputDir, { recursive: true })

const photos = []
for (const fileName of files) {
  const sourcePath = path.join(inputDir, fileName)
  const buffer = await fs.readFile(sourcePath)
  const hash = crypto.createHash('sha256').update(buffer).digest('hex')
  const metadata = await sharp(buffer).metadata()
  const storedPath = path.join(outputDir, fileName)
  await fs.copyFile(sourcePath, storedPath)
  photos.push({
    photoId: 'photo-' + hash.slice(0, 16),
    fileName,
    sha256: hash,
    byteSize: buffer.byteLength,
    width: metadata.width || null,
    height: metadata.height || null,
    format: metadata.format || path.extname(fileName).slice(1).toLowerCase(),
    sourcePath: sourcePath,
    photoPath: '.catalog-private/sources/selection-photos/originals/' + fileName,
    reviewed: false,
  })
}

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  sourceDirectory: inputDir,
  totalPhotos: photos.length,
  photos,
}
const manifestPath = path.join(privateRoot, 'sources', 'selection-photos', 'manifest.json')
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
console.log(JSON.stringify({ totalPhotos: photos.length, manifestPath }, null, 2))
