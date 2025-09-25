import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 根据环境自动切换 base：Vercel 用 '/', GitHub Pages 用 '/fever-game-run/'
  base: process.env.VERCEL ? '/' : '/fever-game-run/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    hmr: {
      overlay: false
    },
    proxy: {
      '/api/piped': {
        target: 'https://piped.video',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/piped/, '')
      }
    }
  }
});
