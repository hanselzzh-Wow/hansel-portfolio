import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // 彩蛋页 listing.html 是独立入口，不走 index.html 的 React 树，
      // 这样两边互不干扰，正经站不会因为彩蛋页的改动被牵连。
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        listing: resolve(import.meta.dirname, 'listing.html'),
      },
    },
  },
})
