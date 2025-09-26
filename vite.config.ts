import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const isDev = process.env.NODE_ENV === 'development' || process.env.npm_lifecycle_event === 'dev';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  root: isDev ? fileURLToPath(new URL('./examples', import.meta.url)) : fileURLToPath(new URL('./', import.meta.url)),
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'VueRightclickMenu',
      fileName: (format) => `vue-rightclick-menu.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
