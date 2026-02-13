import { createRouter, createWebHistory } from "vue-router"
import { setupAuthGuard } from "./guard"

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/Login.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

setupAuthGuard(router)

export default router
