import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  define: {
    global: 'window',
    'process.env': {},
  },
  optimizeDeps: {
    include: ['buffer', 'near-api-js'],
  },
  publicDir: 'public', // Ensure public directory is copied (includes _redirects file)
  server: {
    proxy: {
      // Proxy NEAR RPC requests to avoid CORS issues in development
      '/api/near-rpc': {
        target: 'https://test.rpc.fastnear.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/near-rpc/, ''),
        secure: true,
      },
      // Proxy backend API requests to avoid CORS issues in development
      '/api/backend-rust': {
        target: 'https://rustendpoint.fly.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/backend-rust/, ''),
        secure: true,
      },
      '/api/backend-js': {
        target: 'https://learn-near-backend.fly.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/backend-js/, ''),
        secure: true,
      },
    },
  },
})

