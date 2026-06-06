import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/vendor/echarts-config'

import App from './App.vue'
import router from './router'

// SAFETY: ElMessageBox/ElMessage 是 JS API 调用（非模板组件），
// unplugin-vue-components 不会自动注入它们的样式，需显式导入。
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-overlay.css'  // ElMessageBox 遮罩层依赖

// Element Plus 全局配置：中文语言包
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import './styles/index.scss'

const app = createApp(App)

app.use(ElementPlus, { locale: zhCn, zIndex: 10000 })
app.use(createPinia())
app.use(router)

app.mount('#app')
