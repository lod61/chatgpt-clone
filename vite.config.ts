import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-markdown'],
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-highlight': ['react-syntax-highlighter'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}) 