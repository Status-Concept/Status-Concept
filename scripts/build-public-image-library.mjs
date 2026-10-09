import { readFile, writeFile } from 'node:fs/promises'
import { publicAssetUrl } from '../src/utils/publicAssetUrl.js'

// Keep provenance in the source manifest, never ship local paths and hashes
// to visitors. This is a mechanical projection of the approved records.
export async function buildPublicImageLibrary() {
  const records = JSON.parse(await readFile(new URL('../src/data/statusConceptImages.json', import.meta.url), 'utf8'))
  const publicRecords = records
    .filter((record) => !/^04 - WHATSAPP/i.test(record.originalFolder || '') && !/^04 - WHATSAPP/i.test(record.sourceReferencePath || ''))
    .map(({ id, name, productName, imageFile, letter, source, src }) => ({ id, name, productName, imageFile, letter, source, src: publicAssetUrl(src) }))
  await writeFile(new URL('../src/data/statusConceptPublicImages.json', import.meta.url), `${JSON.stringify(publicRecords)}\n`)
  console.log(`Prepared ${publicRecords.length} public image records without provenance metadata.`)
}

await buildPublicImageLibrary()
