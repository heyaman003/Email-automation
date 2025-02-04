import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import the path module

export default defineConfig({
  plugins: [react()],
  base: '/email-automation/', // Ensure this matches your BrowserRouter basename
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Use path to define aliases
    },
  },
})
