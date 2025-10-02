import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Use esbuild for minification instead of terser
    minify: 'esbuild',
    // Prevent build from failing on network errors
    rollupOptions: {
      external: [],
    },
  },
})
