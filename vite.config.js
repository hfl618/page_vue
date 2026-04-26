import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
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
