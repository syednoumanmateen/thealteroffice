import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'process';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');
console.log(env.VITE_APP_BE_HOST)
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1000, // Increased chunk size warning limit
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_MODE==="development"?env.VITE_APP_BE_HOST_LOCAL:env.VITE_APP_BE_HOST, // Local API host for development
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        },
      }
    },
    base: "/", // Set base URL based on mode
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode), // For React compatibility
    },
  };
});