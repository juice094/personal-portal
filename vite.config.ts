import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

/**
 * 将 .md 文件作为原始字符串导出，供 import.meta.glob 使用。
 * 避免 Vite 将 frontmatter 语法当作 JS 解析。
 */
function markdownRawPlugin() {
  return {
    name: 'markdown-raw',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (id.endsWith('.md')) {
        return `export default ${JSON.stringify(code)}`
      }
    },
  }
}

/**
 * SSR 阶段将 .css 导入替换为空模块，避免 Node.js ESM
 * 不支持 .css 扩展名导致的构建失败。
 */
function ssrCssExternalPlugin() {
  return {
    name: 'ssr-css-external',
    enforce: 'post' as const,
    resolveId(id: string) {
      if (id.endsWith('.css')) {
        return { id, external: true }
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    markdownRawPlugin(),
    ssrCssExternalPlugin(),
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
  ssr: {
    noExternal: ['element-plus'],
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
