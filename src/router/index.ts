import type { RouteRecordRaw } from 'vue-router'
import { portalRoutes } from './portal'

const routes: RouteRecordRaw[] = [
  ...portalRoutes,
]

export default routes
