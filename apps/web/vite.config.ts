import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100
    },
    hmr: {
      overlay: true,
      // Only enable HMR in development
      enabled: process.env.NODE_ENV === 'development'
    }
  },
})
