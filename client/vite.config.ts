import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(), tsconfigPaths()],
  server:{
    port: 3000,
    proxy:{
      '/api': {
        target:'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
