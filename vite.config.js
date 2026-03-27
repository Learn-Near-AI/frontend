import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rpcTarget = env.VITE_RPC_PROXY_TARGET || 'https://test.rpc.fastnear.com';
  const backendTarget =
    env.VITE_BACKEND_PROXY_TARGET || env.VITE_BACKEND_URL || 'https://learnnearbyexample.fly.dev';

  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      include: ['src/**/*.{test,spec}.{js,jsx}'],
    },
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
          target: rpcTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/near-rpc/, ''),
          secure: true,
        },
        // Proxy backend API requests to avoid CORS issues in development
        '/api/backend': {
          target: backendTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/backend/, ''),
          secure: true,
        },
      },
    },
  };
});
