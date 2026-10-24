import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = path.join(root, 'dist')
const html = await readFile(path.join(dist, 'index.html'), 'utf8')
const server = await createServer({
  root, configFile: false, appType: 'custom', logLevel: 'error',
  optimizeDeps: { noDiscovery: true, entries: [] },
  server: { middlewareMode: true, hmr: false, watch: null },
})
const productIds = new Set()
try {
  const { publicSearchProducts } = await server.ssrLoadModule('/src/data/productCatalog.js')
  for (const product of publicSearchProducts) productIds.add(product.id)
  for (const name of ['bali', 'florida', 'berlin']) {
    const collection = await server.ssrLoadModule(`/src/data/${name}Collection.js`)
    const retiredIds = collection[`retired${name[0].toUpperCase()}${name.slice(1)}ProductIds`]
    for (const id of retiredIds) productIds.add(id)
  }
} finally {
  await server.close()
}

// Keep these entry pages aligned with routesFor in App.jsx. Query strings share
// the same shell. Real files let GitHub Pages serve deep links with HTTP 200.
const pages = ['', 'products', 'images', 'sales', 'glatz-parasols', 'projects',
  'after-care', 'about', 'contact', 'login', 'register', 'registar', 'privacy',
  'privacidade', 'cookies', 'terms', 'fabric-library',
  ...Array.from(productIds, (id) => `product/${encodeURIComponent(id)}`)]
let count = 0
for (const locale of ['', 'en', 'pt']) {
  for (const page of pages) {
    const directory = path.resolve(dist, locale, page)
    const relative = path.relative(dist, directory)
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Invalid route: ${page}`)
    if (directory === dist) continue
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, 'index.html'), html)
    count++
  }
}
await writeFile(path.join(dist, '404.html'), html)
await writeFile(path.join(dist, '.nojekyll'), '')
console.log(`Generated ${count} static route entry pages and the not-found shell.`)
