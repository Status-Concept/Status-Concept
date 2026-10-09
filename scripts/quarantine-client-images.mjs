import { readFile, writeFile, mkdir, rename, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifestPath = path.join(root, 'src/data/statusConceptImages.json')
const publicRoot = path.resolve(root, 'public/status-concept-images')
const archive = path.resolve('C:/Users/Santi/Documents/Codex/2026-08-15/so/work/status-client-image-quarantine')
const records = JSON.parse(await readFile(manifestPath, 'utf8'))
const privateImage = (image) => /04 - WHATSAPP/i.test(`${image.sourceReferencePath} ${image.originalFolder}`)
const excluded = records.filter(privateImage)
const retained = records.filter(image => !privateImage(image))
const retainedPaths = new Set(retained.map(image => image.src))
const moves = excluded.filter(image => !retainedPaths.has(image.src)).map(image => {
  const source = path.resolve(root, 'public', decodeURIComponent(image.src.replace(/^\//, '')))
  if (!source.startsWith(publicRoot + path.sep)) throw new Error('Image path escaped public image root')
  const target = path.resolve(archive, path.relative(publicRoot, source))
  if (!target.startsWith(archive + path.sep)) throw new Error('Archive path escaped quarantine root')
  return { source, target }
})
if (!process.argv.includes('--apply')) {
  console.log(JSON.stringify({ excludedRecords: excluded.length, moves: moves.length, archive }, null, 2))
} else if (excluded.length) {
  // Validate every source and destination before moving any file.
  for (const move of moves) {
    await access(move.source)
    try { await access(move.target); throw new Error(`Archive file already exists: ${move.target}`) }
    catch (error) { if (error.code !== 'ENOENT') throw error }
  }
  await mkdir(archive, { recursive: true })
  await writeFile(path.join(archive, 'excluded-records.json'), JSON.stringify(excluded, null, 2))
  for (const move of moves) {
    await mkdir(path.dirname(move.target), { recursive: true })
    await rename(move.source, move.target)
  }
  // Mechanical manifest rewrite; preserve all remaining records verbatim.
  await writeFile(manifestPath, `${JSON.stringify(retained, null, 2)}\n`)
  console.log(`Archived ${moves.length} files; retained ${retained.length} public image records.`)
}
