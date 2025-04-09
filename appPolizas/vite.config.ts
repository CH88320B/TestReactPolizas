import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 Importante para rutas relativas correctas en Azure
  build: {
    outDir: 'dist' // 👈 Carpeta de salida esperada por Azure Static Web App
  }
})
