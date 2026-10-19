import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// The app is a static site: it can be dropped on any static host
// (Netlify, Vercel, S3, GitHub Pages, nginx) with no server-side runtime.
// Routing is hash-based, so no rewrite rules are needed.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
