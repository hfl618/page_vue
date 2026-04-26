import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@/api/modules/auth': ['login', 'signup', 'logout', 'checkUsername'],
          '@/api/modules/knowledge': ['fetchUserArticles', 'fetchPublicArticles', 'fetchArticleDetail'],
          '@/api/modules/user': ['fetchMe', 'updateProfile'],
        }
      ],
      // 关键修复：自动扫描这些目录下的所有导出
      dirs: [
        './src/composables/**',
        './src/views/**/hooks/**',
        './src/components/**/hooks/**',
      ],
      dts: false,
    }),
    Components({
      dirs: ['src/components', 'src/layouts'], // 自动导入组件和布局
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
      // 这里的配置是生命线：将所有 /api 请求转发到 Flask
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      // 允许上传图片
      '/upload': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      }
    }
  }
})
