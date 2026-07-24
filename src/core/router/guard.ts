// src/core/router/guard.ts

import type { Router } from 'vue-router'
import { useAuthStore } from '@/core/store/authStore'

export function setupAuthGuard(router: Router): void {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()

    // بعد از رفرش، ابتدا وضعیت ورود را از توکن بررسی کن
    if (!auth.initialized) {
      await auth.checkAuth()
    }

    // صفحات نیازمند ورود
    if (
      to.meta.requiresAuth &&
      !auth.isAuthenticated
    ) {
      return {
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      }
    }

    // جلوگیری از ورود کاربر لاگین‌شده به صفحه ورود و ثبت‌نام
    if (
      to.meta.guestOnly &&
      auth.isAuthenticated
    ) {
      return {
        name: 'home'
      }
    }

    return true
  })
}
