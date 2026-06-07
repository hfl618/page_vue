import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        'vue-i18n',
        {
          '@/api/modules/categories': ['fetchCategories'],
          '@/api/modules/auth': ['login', 'signup', 'logout', 'checkUsername'],
          '@/api/modules/knowledge': ['fetchUserArticles', 'fetchPublicArticles', 'fetchArticleDetail'],
          '@/api/modules/user': ['fetchMe', 'updateProfile'],
          '@/api/request': [['default', 'request']],
        }
      ],
      // 关键修复：自动扫描这些目录下的所有导出
      dirs: [
        './src/composables/**',
        './src/views/**/hooks/**',
        './src/components/**/hooks/**',
        './src/store/**',
        './src/constants/**',
      ],
      dts: false,
    }),
    Components({
      dirs: ['src/components', 'src/layouts', 'src/views/**/components', 'src/views/**/parts'], // 增加 parts 扫描
      extensions: ['vue'],
      deep: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@comp': path.resolve(__dirname, './src/components'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@views': path.resolve(__dirname, './src/views'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 物理加固：使用 127.0.0.1 避免 IPv6 冲突，增加异常容错
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        // 如果后端接口本身不带 /api 前缀，请取消下方 rewrite 的注释
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/upload': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
      '/tools/icon': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
