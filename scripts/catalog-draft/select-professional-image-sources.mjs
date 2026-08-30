import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '../..')
const sourceRoot = path.join(
  projectRoot,
  '.catalog-private',
  'reference-images',
  'unmatched',
)
const outputRoot = path.join(
  projectRoot,
  '.catalog-private',
  'reference-images',
  'professional-white',
  '_selection',
)

const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp'])
const colourTerms = [
  'anthracite',
  'baby blue',
  'beige',
  'black',
  'blue',
  'brown',
  'carbon',
  'charcoal',
  'coffee',
  'cream',
  'dark grey',
  'graphite',
  'green',
  'grey',
  'ivory',
  'khaki',
  'light grey',
  'old grey',
  'orange',
  'permateak',
  'red',
  'sand',
  'slate',
  'storm',
  'taupe',
  'turquoise',
  'white',
  'wood',
]

const concurrency = 10

function toPortablePath(value) {
  return value.split(path.sep).join('/')
}

function normalizeProductName(fileName) {
  return path
    .parse(fileName)
    .name.replace(/\s*\[[0-9a-f]{8}\]\s*$/iu, '')
    .replace(/\s*\(\d+\)\s*$/u, '')
    .replace(/[ _-]+HR$/iu, '')
    .replace(/[ _-]+\d+\s*$/u, '')
    .replace(/\s+/gu, ' ')
    .trim()
    .toLocaleLowerCase('en')
}

function extractColours(normalizedName) {
  return colourTerms.filter((colour) =>
    new RegExp(`(^|[^a-z])${colour.replaceAll(' ', '\\s+')}([^a-z]|$)`, 'iu').test(
      normalizedName,
    ),
  )
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(absolutePath)))
    } else if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(absolutePath)
    }
  }

  return files
}

function differenceHash(data, width, height) {
  let bits = ''
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * width
    for (let x = 0; x < width - 1; x += 1) {
      bits += data[rowOffset + x] > data[rowOffset + x + 1] ? '1' : '0'
    }
  }
  return bits
}

function hammingDistance(left, right) {
  let distance = 0
  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    if (left[index] !== right[index]) distance += 1
  }
  return distance + Math.abs(left.length - right.length)
}

function calculateVisualMetrics(data, width, height) {
  let edgeTotal = 0
  let edgeSamples = 0
  let clippedDark = 0
  let clippedLight = 0

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * width
    for (let x = 0; x < width; x += 1) {
      const value = data[rowOffset + x]
      if (value <= 8) clippedDark += 1
      if (value >= 247) clippedLight += 1

      if (x + 1 < width) {
        edgeTotal += Math.abs(value - data[rowOffset + x + 1])
        edgeSamples += 1
      }
      if (y + 1 < height) {
        edgeTotal += Math.abs(value - data[rowOffset + width + x])
        edgeSamples += 1
      }
    }
  }

  const pixels = width * height
  return {
    edgeScore: edgeSamples ? edgeTotal / edgeSamples : 0,
    clippedDarkRatio: pixels ? clippedDark / pixels : 1,
    clippedLightRatio: pixels ? clippedLight / pixels : 1,
  }
}

function scoreImage(image) {
  const megapixels = image.width && image.height ? (image.width * image.height) / 1_000_000 : 0
  const resolutionScore = Math.min(Math.log2(megapixels + 1) / 3, 1)
  const edgeScore = Math.min(image.edgeScore / 28, 1)
  const exposureScore = Math.max(
    0,
    1 - Math.min((image.clippedDarkRatio + image.clippedLightRatio) * 2.5, 1),
  )
  const aspectRatio = image.width && image.height ? image.width / image.height : 0
  const aspectScore = aspectRatio >= 0.55 && aspectRatio <= 2.2 ? 1 : 0.45
  const sizeScore = Math.min(Math.log2(image.bytes / 80_000 + 1) / 6, 1)

  return Number(
    (
      resolutionScore * 0.4 +
      edgeScore * 0.25 +
      exposureScore * 0.15 +
      aspectScore * 0.1 +
      sizeScore * 0.1
    ).toFixed(5),
  )
}

async function inspectImage(absolutePath) {
  const relativePath = toPortablePath(path.relative(sourceRoot, absolutePath))
  const parent = path.posix.dirname(relativePath)
  const normalizedName = normalizeProductName(path.basename(absolutePath))
  const input = await readFile(absolutePath)
  const metadata = await sharp(input, { failOn: 'none' }).metadata()
  const thumbnail = await sharp(input, { failOn: 'none' })
    .rotate()
    .resize({ width: 65, height: 64, fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const metrics = calculateVisualMetrics(
    thumbnail.data,
    thumbnail.info.width,
    thumbnail.info.height,
  )
  const stats = await sharp(input, { failOn: 'none' }).stats()
  const image = {
    absolutePath,
    relativePath,
    fileName: path.basename(absolutePath),
    parent,
    normalizedName,
    groupKey: `${parent}|${normalizedName}`,
    colours: extractColours(normalizedName),
    bytes: input.length,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    format: metadata.format ?? null,
    orientation: metadata.orientation ?? null,
    entropy: Number((stats.entropy ?? 0).toFixed(5)),
    ...metrics,
    sha256: createHash('sha256').update(input).digest('hex'),
    differenceHash: differenceHash(
      thumbnail.data,
      thumbnail.info.width,
      thumbnail.info.height,
    ),
  }
  image.score = scoreImage(image)
  return image
}

async function mapWithConcurrency(values, worker) {
  const results = new Array(values.length)
  let nextIndex = 0

  async function run() {
    while (nextIndex < values.length) {
      const index = nextIndex
      nextIndex += 1
      results[index] = await worker(values[index], index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, run))
  return results
}

function selectDiverseImages(images) {
  const uniqueByContent = [...new Map(images.map((image) => [image.sha256, image])).values()]
  const ranked = uniqueByContent.sort((left, right) => right.score - left.score)
  const selected = []

  for (const candidate of ranked) {
    const nearDuplicate = selected.some(
      (existing) => hammingDistance(existing.differenceHash, candidate.differenceHash) <= 5,
    )
    if (!nearDuplicate) selected.push(candidate)
    if (selected.length === 3) break
  }

  if (selected.length < Math.min(3, ranked.length)) {
    for (const candidate of ranked) {
      if (!selected.includes(candidate)) selected.push(candidate)
      if (selected.length === 3) break
    }
  }

  return selected
}

async function main() {
  const paths = await walk(sourceRoot)
  const inspectionResults = await mapWithConcurrency(paths, async (filePath, index) => {
    if ((index + 1) % 100 === 0) {
      process.stdout.write(`Inspected ${index + 1}/${paths.length}\n`)
    }
    try {
      return { image: await inspectImage(filePath), error: null }
    } catch (error) {
      return {
        image: null,
        error: {
          relativePath: toPortablePath(path.relative(sourceRoot, filePath)),
          message: error instanceof Error ? error.message : String(error),
        },
      }
    }
  })
  const inspected = inspectionResults.flatMap((result) => (result.image ? [result.image] : []))
  const rejected = inspectionResults.flatMap((result) => (result.error ? [result.error] : []))

  const groups = new Map()
  for (const image of inspected) {
    const images = groups.get(image.groupKey) ?? []
    images.push(image)
    groups.set(image.groupKey, images)
  }

  const products = [...groups.entries()]
    .map(([groupKey, images]) => {
      const selected = selectDiverseImages(images)
      const productId = createHash('sha1').update(groupKey).digest('hex').slice(0, 12)
      return {
        productId,
        groupKey,
        folder: images[0].parent,
        normalizedName: images[0].normalizedName,
        colours: [...new Set(images.flatMap((image) => image.colours))],
        sourceImageCount: images.length,
        uniqueImageCount: new Set(images.map((image) => image.sha256)).size,
        selectedCount: selected.length,
        selected: selected.map(({ absolutePath, differenceHash: _differenceHash, ...image }) => image),
        generationStatus: 'pending-review',
      }
    })
    .sort((left, right) =>
      `${left.folder}/${left.normalizedName}`.localeCompare(
        `${right.folder}/${right.normalizedName}`,
      ),
    )

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    sourceRoot: toPortablePath(path.relative(projectRoot, sourceRoot)),
    imageCount: inspected.length,
    rejectedImageCount: rejected.length,
    productGroupCount: products.length,
    selectedImageCount: products.reduce((total, product) => total + product.selectedCount, 0),
    groupingNote:
      'Groups are filename-derived and preserve colour/finish words. Human confirmation is required before publication.',
    rejected,
    products,
  }

  await mkdir(outputRoot, { recursive: true })
  const manifestPath = path.join(outputRoot, 'source-selection.json')
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  process.stdout.write(
    `${JSON.stringify(
      {
        manifestPath,
        imageCount: manifest.imageCount,
        rejectedImageCount: manifest.rejectedImageCount,
        productGroupCount: manifest.productGroupCount,
        selectedImageCount: manifest.selectedImageCount,
      },
      null,
      2,
    )}\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
