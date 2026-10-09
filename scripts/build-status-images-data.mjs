import { readFile, writeFile } from 'node:fs/promises'

const csvPath = 'C:/Users/Santi/Documents/Codex/2026-09-03/x20-x20/outputs/status-concept-images-organized/image-name-index.csv'
const outputPath = new URL('../src/data/statusConceptImages.json', import.meta.url)

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]
    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"'
        i += 1
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
    } else if (char === '"') {
      quoted = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''))
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ''))
    rows.push(row)
  }

  const headers = rows.shift()
  return rows.filter((values) => values.length > 1).map((values) => Object.fromEntries(
    headers.map((header, index) => [header, values[index] || '']),
  ))
}

function sourceLabel(originalFolder) {
  if (originalFolder.startsWith('02 - FURNITURE')) return 'Furniture catalogue'
  if (originalFolder.startsWith('03 - DRACO')) return 'Draco kitchens'
  if (originalFolder.startsWith('04 - WHATSAPP')) return 'WhatsApp client images'
  if (originalFolder.startsWith('_CURATED')) return 'Curated'
  return 'Other'
}

const rows = parseCsv(await readFile(csvPath, 'utf8'))
  // WhatsApp client images remain in the private organized deliverable and
  // are intentionally excluded from the public site asset manifest.
  .filter((row) => !/^04 - WHATSAPP/i.test(row.OriginalFolder) && !/^04 - WHATSAPP/i.test(row.SourceReferencePath))
const data = rows.map((row) => {
  const relative = row.OrganizedRelativePath.replaceAll('\\', '/').replace(/^by-name\//, '')
  const segments = relative.split('/').map((segment) => encodeURIComponent(segment))
  return {
    id: `${row.ProductKey}-${row.ImageFile}`,
    name: row.ImageName,
    productName: row.ProductName,
    imageFile: row.ImageFile,
    letter: row.AlphabeticalGroup,
    source: sourceLabel(row.OriginalFolder),
    src: `/status-concept-images/${segments.join('/')}`,
    sourceReferencePath: row.SourceReferencePath,
    originalFolder: row.OriginalFolder,
    sha256: row.SHA256,
    bytes: Number(row.Bytes) || 0,
  }
})

await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
console.log(`Built ${data.length} status concept image records.`)
await import('./build-public-image-library.mjs')
