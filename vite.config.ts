import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    logLevel: 'silent', // Ignore all TypeScript errors
    //loader: 'tsx' //Ari commneted
  },
  build: {
    outDir: './dist', // Ensure output directory is 'dist'
    emptyOutDir: true, // Clear old build before creating new
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', //Ari added
        '.ts': 'tsx',
        '.tsx': 'tsx'
      },
      ignoreAnnotations: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
