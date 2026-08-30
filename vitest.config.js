import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const virtualDraftCatalogId = 'virtual:status-concept-draft-catalog'
const resolvedVirtualDraftCatalogId = `\0${virtualDraftCatalogId}`

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'empty-private-catalog-for-tests',
      resolveId(id) {
        return id === virtualDraftCatalogId ? resolvedVirtualDraftCatalogId : null
      },
      load(id) {
        return id === resolvedVirtualDraftCatalogId ? 'export const categoryHeroOverrides = {}; export const legacyImageOverrides = {}; export default []' : null
      },
    },
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
