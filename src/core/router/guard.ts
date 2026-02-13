import { useAuthStore } from "@/modules/auth/store/authStore"

export function setupAuthGuard(router:any) {
  router.beforeEach((to:any, _from:any, next:any) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuth)
      return next("/login")

    next()
  })
}
