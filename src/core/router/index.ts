import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { setupAuthGuard } from "./guard"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/Login.vue"),
    meta: { guestOnly: true }
  },

  // 404 page
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/NotFound.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior() {
    return { top: 0 }
  }
})

setupAuthGuard(router)

export default router
