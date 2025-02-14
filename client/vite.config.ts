import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures correct asset paths
  build: {
    outDir: 'dist', // Default Vite output folder
  },
  server: {
    proxy: {
      '/api': {
        target: "https://taskbuddy-65qv.onrender.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
});
