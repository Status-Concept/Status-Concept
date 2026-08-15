import fs from 'node:fs'
import path from 'node:path'
import { createReadStream } from 'node:fs'
import { extname } from 'node:path'

const virtualModuleId = 'virtual:status-concept-draft-catalog'
const resolvedVirtualModuleId = '\0' + virtualModuleId

export default function draftCatalogDevPlugin() {
  const draftPath = path.resolve(process.cwd(), '.catalog-private', 'generated', 'draft-products.json')
  const privateRoot = path.resolve(process.cwd(), '.catalog-private')
  const source = () => {
    if (!fs.existsSync(draftPath)) return 'export default [];'
    const value = JSON.parse(fs.readFileSync(draftPath, 'utf8'))
    return 'export default ' + JSON.stringify(value) + ';'
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
      server.middlewares.use('/__status-private', (request, response, next) => {
        const requestPath = decodeURIComponent(String(request.url || '').split('?')[0]).replace(/^\/+/, '')
        const filePath = path.resolve(privateRoot, requestPath)
        if (!filePath.startsWith(privateRoot + path.sep) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          next()
          return
        }
        const contentTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.webp': 'image/webp',
        }
        response.statusCode = 200
        response.setHeader('Content-Type', contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream')
        createReadStream(filePath).pipe(response)
      })
      server.watcher.on('change', (changedPath) => {
        if (path.resolve(changedPath) !== draftPath) return
        const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload', path: '*' })
      })
    },
  }
}
