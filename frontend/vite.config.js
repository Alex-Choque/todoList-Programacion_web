import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    https: {
      key: './key.pem',
      cert: './cert.pem'
    },
    proxy: {
      '/tasks': {
        target: 'https://localhost:5000',
        secure: false
      },
      '/auth': {
        target: 'https://localhost:5000',
        secure: false
      },
      '/files': {
        target: 'https://localhost:5000',
        secure: false
      }
    }
  }
})