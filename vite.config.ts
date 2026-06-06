import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: true })],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: true })],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (['vue', 'vue-router', 'pinia'].some(pkg => id.includes(pkg))) return 'vue-vendor'
            if (id.includes('element-plus') && !id.includes('icons')) return 'ui-vendor'
            if (id.includes('@element-plus/icons-vue')) return 'icons-vendor'
            if (id.includes('echarts') || id.includes('vue-echarts')) return 'echarts-vendor'
          }
        }
      }
    }
  }
})
