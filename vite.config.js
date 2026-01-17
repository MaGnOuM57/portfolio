import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://paper-api.alpaca.markets',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v2'),
      },
      '/data': {
        target: 'https://data.alpaca.markets',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data/, '/v2'),
      },
    },
  },
})

