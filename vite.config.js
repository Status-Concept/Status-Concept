import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import draftCatalogDevPlugin from './scripts/catalog-draft/vite-plugin-draft-catalog.mjs'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  plugins: [
    react(),
    ...(command === 'serve' ? [draftCatalogDevPlugin()] : []),
  ],
}))
