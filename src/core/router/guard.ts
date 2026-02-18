// src/core/router/guard.ts
import { useAuthStore } from "@/core/store/authStore"  // ✅ مسیر رو اصلاح کن
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export function setupAuthGuard(router: any) {
  router.beforeEach((
    to: RouteLocationNormalized, 
    _from: RouteLocationNormalized, 
    next: NavigationGuardNext
  ) => {
    const auth = useAuthStore()

    // ✅ چک کردن احراز هویت
    if (to.meta?.requiresAuth && !auth.isAuthenticated) {  // isAuthenticated رو چک کن
      return next({ 
        path: '/login', 
        query: { redirect: to.fullPath }  // آدرس قبلی رو ذخیره کن
      })
    }

    // ✅ صفحه لاگین/ثبت‌نام برای کاربران لاگین کرده ممنوع
    if (to.meta?.guest && auth.isAuthenticated) {
      return next('/')
    }

    next()
  })
}
