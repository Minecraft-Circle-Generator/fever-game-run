import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // 启用快速刷新优化
    fastRefresh: true,
    // 减少 JSX 运行时开销
    jsxRuntime: 'automatic'
  })],
  optimizeDeps: {
    exclude: ['lucide-react'],
    // 预构建常用依赖
    include: ['react', 'react-dom', 'react-router-dom']
  },
  build: {
    // 启用 gzip 压缩
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // 核心库单独打包
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react']
        },
        // 优化文件名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // 移除未使用的代码
        pure_funcs: ['console.log', 'console.info'],
        // 压缩选项
        passes: 2
      },
      mangle: {
        // 混淆变量名以减小文件大小
        safari10: true
      }
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true
  },
  server: {
    hmr: {
      overlay: false
    },
    // 预热常用文件
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx']
    }
  },
  // 启用实验性功能以提升性能
  esbuild: {
    // 移除生产环境的 console
    drop: ['console', 'debugger']
  }
});
