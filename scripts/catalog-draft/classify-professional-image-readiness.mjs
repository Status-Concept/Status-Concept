import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '../..')
const privateRoot = path.join(projectRoot, '.catalog-private', 'reference-images')
const sourceRoot = path.join(privateRoot, 'unmatched')
const manifestPath = path.join(
  privateRoot,
  'professional-white',
  '_selection',
  'source-selection.json',
)
const outputPath = path.join(
  privateRoot,
  'professional-white',
  '_selection',
  'readiness-classification.json',
)

const concurrency = 8
const thumbnailSize = 96
const borderSize = 8

function classifyPixel(red, green, blue) {
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722
  const chroma = Math.max(red, green, blue) - Math.min(red, green, blue)
  return {
    brightNeutral: luminance >= 222 && chroma <= 22,
    pureWhite: red >= 245 && green >= 245 && blue >= 245,
    luminance,
    chroma,
  }
}

async function inspectBackground(relativePath) {
  const absolutePath = path.join(sourceRoot, ...relativePath.split('/'))
  const input = await readFile(absolutePath)
  const { data, info } = await sharp(input, { failOn: 'none' })
    .rotate()
    .resize(thumbnailSize, thumbnailSize, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  let borderPixels = 0
  let brightNeutralPixels = 0
  let pureWhitePixels = 0
  let luminanceTotal = 0
  let chromaTotal = 0

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const isBorder =
        x < borderSize ||
        y < borderSize ||
        x >= info.width - borderSize ||
        y >= info.height - borderSize
      if (!isBorder) continue

      const offset = (y * info.width + x) * info.channels
      const pixel = classifyPixel(data[offset], data[offset + 1], data[offset + 2])
      borderPixels += 1
      if (pixel.brightNeutral) brightNeutralPixels += 1
      if (pixel.pureWhite) pureWhitePixels += 1
      luminanceTotal += pixel.luminance
      chromaTotal += pixel.chroma
    }
  }

  const brightNeutralRatio = brightNeutralPixels / borderPixels
  const pureWhiteRatio = pureWhitePixels / borderPixels
  const meanBorderLuminance = luminanceTotal / borderPixels
  const meanBorderChroma = chromaTotal / borderPixels

  let readiness = 'needs-ai-edit'
  if (
    brightNeutralRatio >= 0.76 &&
    meanBorderLuminance >= 224 &&
    meanBorderChroma <= 20
  ) {
    readiness = 'likely-studio-compliant'
  } else if (
    brightNeutralRatio >= 0.5 &&
    meanBorderLuminance >= 205 &&
    meanBorderChroma <= 30
  ) {
    readiness = 'needs-human-check'
  }

  return {
    relativePath,
    readiness,
    brightNeutralRatio: Number(brightNeutralRatio.toFixed(5)),
    pureWhiteRatio: Number(pureWhiteRatio.toFixed(5)),
    meanBorderLuminance: Number(meanBorderLuminance.toFixed(3)),
    meanBorderChroma: Number(meanBorderChroma.toFixed(3)),
  }
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

async function main() {
  const selection = JSON.parse(await readFile(manifestPath, 'utf8'))
  const selectedImages = selection.products.flatMap((product) =>
    product.selected.map((image) => ({
      productId: product.productId,
      productName: product.normalizedName,
      folder: product.folder,
      relativePath: image.relativePath,
    })),
  )

  const classified = await mapWithConcurrency(selectedImages, async (image, index) => {
    if ((index + 1) % 100 === 0) {
      process.stdout.write(`Classified ${index + 1}/${selectedImages.length}\n`)
    }
    try {
      return { ...image, ...(await inspectBackground(image.relativePath)) }
    } catch (error) {
      return {
        ...image,
        readiness: 'needs-human-check',
        error: error instanceof Error ? error.message : String(error),
      }
    }
  })

  const totals = classified.reduce(
    (summary, image) => {
      summary[image.readiness] += 1
      return summary
    },
    {
      'likely-studio-compliant': 0,
      'needs-human-check': 0,
      'needs-ai-edit': 0,
    },
  )

  const output = {
    version: 1,
    generatedAt: new Date().toISOString(),
    sourceManifest: path.relative(projectRoot, manifestPath).split(path.sep).join('/'),
    methodology:
      'Conservative border-colour screening only. It separates likely neutral studio backgrounds from images requiring AI or human inspection; it never approves product fidelity.',
    totals,
    images: classified,
  }

  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  process.stdout.write(`${JSON.stringify({ outputPath, totals }, null, 2)}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
