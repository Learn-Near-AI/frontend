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
        target: 'https://rpc.testnet.near.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/near-rpc/, ''),
        secure: true,
      },
    },
  },
})

