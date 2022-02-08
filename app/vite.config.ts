import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      through2: 'stub-through2',
      fs: 'stub-fs',
      path: 'stub-path',
      util: 'stub-util',
      execa: 'stub-execa',
    },
  },
  build: {
    emptyOutDir: true,
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       jsonWorker: [`monaco-editor/esm/vs/language/json/json.worker`],
    //       editorWorker: [`monaco-editor/esm/vs/editor/editor.worker`],
    //     },
    //   },
    // },
  },
  optimizeDeps: {
    include: ['@commitlint/parse', '@commitlint/lint'],
  },
})
