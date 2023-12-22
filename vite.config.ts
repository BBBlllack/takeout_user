import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.151.100',
        changeOrigin: true,
        ws: true, // 允许websocket代理
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/image': {
        target: 'https://sm.ms/api/v2/upload',
        changeOrigin: true,
        ws: true, // 允许websocket代理
        rewrite: (path) => path.replace(/^\/image/, '')
      }
    }
  }
})
