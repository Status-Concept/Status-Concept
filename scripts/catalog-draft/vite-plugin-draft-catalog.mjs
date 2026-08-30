import fs from 'node:fs'
import path from 'node:path'
import { createReadStream } from 'node:fs'
import { extname } from 'node:path'

const virtualModuleId = 'virtual:status-concept-draft-catalog'
const resolvedVirtualModuleId = '\0' + virtualModuleId
const PRIVATE_IMAGE_ROOTS = new Set(['reference-images', 'final-images'])
const IMAGE_CONTENT_TYPES = {
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

export function isAllowedPrivateAssetPath(requestPath) {
  const normalized = String(requestPath || '').replaceAll('\\', '/')
  const [root] = normalized.split('/')
  return PRIVATE_IMAGE_ROOTS.has(root)
    && !normalized.includes('..')
    && /\.(?:avif|jpe?g|png|webp)$/i.test(normalized)
}

export function resolvePrivateAssetPath(privateRoot, requestPath) {
  if (!isAllowedPrivateAssetPath(requestPath)) return null
  const normalized = String(requestPath).replaceAll('\\', '/')
  const filePath = path.resolve(privateRoot, ...normalized.split('/'))
  const relativePath = path.relative(privateRoot, filePath)
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) return null
  return filePath
}

export function composeDraftCatalog({ approvedDrafts = [], localProducts = [], inventoryPreview = [] }) {
  return [...approvedDrafts, ...(localProducts.length ? localProducts : inventoryPreview)]
}

export default function draftCatalogDevPlugin() {
  const draftPath = path.resolve(process.cwd(), '.catalog-private', 'generated', 'draft-products.json')
  const localProductsPath = path.resolve(process.cwd(), '.catalog-private', 'generated', 'local-products.json')
  const inventoryPreviewPath = path.resolve(process.cwd(), '.catalog-private', 'generated', 'inventory-preview.json')
  const privateRoot = path.resolve(process.cwd(), '.catalog-private')
  const source = () => {
    const approvedDrafts = fs.existsSync(draftPath) ? JSON.parse(fs.readFileSync(draftPath, 'utf8')) : []
    const localProducts = fs.existsSync(localProductsPath) ? JSON.parse(fs.readFileSync(localProductsPath, 'utf8')) : []
    const inventoryPreview = fs.existsSync(inventoryPreviewPath) ? JSON.parse(fs.readFileSync(inventoryPreviewPath, 'utf8')) : []
    return 'export default ' + JSON.stringify(composeDraftCatalog({ approvedDrafts, localProducts, inventoryPreview })) + ';'
  }
  return {
    name: 'status-concept-draft-catalog-dev',
    apply: 'serve',
    resolveId(id) {
      return id === virtualModuleId ? resolvedVirtualModuleId : null
    },
    load(id) {
      return id === resolvedVirtualModuleId ? source() : null
    },
    configureServer(server) {
      server.watcher.add(draftPath)
      server.watcher.add(localProductsPath)
      server.watcher.add(inventoryPreviewPath)
      server.middlewares.use('/__status-private', (request, response, next) => {
        const requestPath = decodeURIComponent(String(request.url || '').split('?')[0]).replace(/^\/+/, '')
        const filePath = resolvePrivateAssetPath(privateRoot, requestPath)
        if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          next()
          return
        }
        response.statusCode = 200
        response.setHeader('Content-Type', IMAGE_CONTENT_TYPES[extname(filePath).toLowerCase()])
        response.setHeader('Cache-Control', 'no-store')
        response.setHeader('X-Content-Type-Options', 'nosniff')
        createReadStream(filePath).pipe(response)
      })
      server.watcher.on('change', (changedPath) => {
        const resolvedChangedPath = path.resolve(changedPath)
        if (resolvedChangedPath !== draftPath && resolvedChangedPath !== localProductsPath && resolvedChangedPath !== inventoryPreviewPath) return
        const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload', path: '*' })
      })
    },
  }
}
