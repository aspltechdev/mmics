import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,

    /*
     * Proxy the API and uploaded images to the backend during
     * development. This keeps requests same-origin, so CORS
     * and cross-origin image blocking cannot bite while
     * working locally.
     */
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    /*
     * Split node_modules into its own chunk so the vendor code
     * is cached separately from application code between
     * deploys. Rolldown (Vite 8) requires this as a function.
     */
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
