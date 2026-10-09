import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

// Gallery URLs discovered in statusconcept.com's homepage data-lazyload attributes.
// Preserve downloaded originals separately from responsive, uncropped web copies.
const selections = [
  ['sicily', '2025/07/SC_0033_5.Sicily-Modular-Set.jpg'],
  ['berlin', '2025/07/SC_0008_30.Berlin-Modular-sofa.jpg'],
  ['florida-orlando', '2025/07/SC_0013_25.Florida-dining-table-with-Orlando-Dining-Armchairs.jpg'],
  ['bella', '2025/09/SC_0002_Bellasofaset.jpg'],
  ['reno', '2025/07/SC_0014_24.Reno-Sofa-set.jpg'],
  ['showroom-quinta', '2025/09/SC_0003_SHOWRROMQDL1.jpg'],
  ['showroom-quinta-2', '2025/09/SC_0004_ShowroomQDL.jpg'],
]
const originals = new URL('../docs/photography/originals/', import.meta.url)
const web = new URL('../public/photography/', import.meta.url)
await mkdir(originals, { recursive: true })
await mkdir(web, { recursive: true })
const manifest = []
for (const [name, path] of selections) {
  const source = `https://statusconcept.com/wp-content/uploads/${path}`
  const response = await fetch(source, { signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`${source}: HTTP ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const metadata = await sharp(buffer).metadata()
  await writeFile(new URL(`${name}.jpg`, originals), buffer)
  const widths = [...new Set([480, 800, metadata.width].filter(w => w <= metadata.width))]
  const variants = []
  for (const width of widths) {
    const file = `${name}-${width}.webp`
    const output = await sharp(buffer).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 88 }).toBuffer()
    await writeFile(new URL(file, web), output)
    variants.push({ src: `/photography/${file}`, width, bytes: output.length })
  }
  manifest.push({ name, source, width: metadata.width, height: metadata.height, originalBytes: buffer.length, variants })
  console.log(`${name}: ${metadata.width} x ${metadata.height}, ${buffer.length} bytes`)
}
await writeFile(new URL('../src/data/homepagePhotography.json', import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`)
