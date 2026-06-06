import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { portalRoutes } from './portal'

const routes: RouteRecordRaw[] = [
  ...portalRoutes,
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  document.title = `${String(to.meta.title || '页面')} — 个人主页`
  return true
})

export { router }
export default router
