import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // Ensure correct relative paths for assets
  server: {
    port: 3000 // Specify the port you want to use
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/includes/variables.scss";`
      }
    }
  }
})
