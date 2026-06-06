import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'

import '@/vendor/echarts-config'

import App from './App.vue'
import routes from './router'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import './styles/index.scss'

// SAFETY: ElMessageBox/ElMessage/ElOverlay 是 JS API 调用（非模板组件），
// unplugin-vue-components 不会自动注入它们的样式。
// 在 SSR 阶段跳过 CSS 导入，避免 Node.js ESM 不支持 .css 扩展名。
async function importClientStyles(): Promise<void> {
  if (typeof window !== 'undefined') {
    await import('element-plus/theme-chalk/el-message-box.css')
    await import('element-plus/theme-chalk/el-message.css')
    await import('element-plus/theme-chalk/el-overlay.css')
  }
}

// vite-ssg 导出模式：SSG 构建时调用，生成静态 HTML
export const createApp = ViteSSG(
  App,
  { routes, base: '/personal-portal/' },
  async ({ app, router, isClient }) => {
    await importClientStyles()
    app.use(ElementPlus, { locale: zhCn, zIndex: 10000 })
    app.use(createPinia())
  },
)
