import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { authApi } from "@/modules/auth/api/authApi"
import type { LoginCredentials, RegisterData, User, AuthResponse } from "@/modules/auth/types/user"
import { useCartStore } from "@/core/store/cartStore"

export const useAuthStore = defineStore("auth", () => {
  // ========== State ==========
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem("access_token"))
  const refreshToken = ref<string | null>(localStorage.getItem("refresh_token"))
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // ========== Getters ==========
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  const userName = computed(() => {
    return user.value?.full_name || user.value?.username || 'کاربر'
  })

  const userInitials = computed(() => {
    if (!user.value?.username) return '??'
    return user.value.username.slice(0, 2).toUpperCase()
  })

  const isTokenExpired = computed(() => {
    if (!token.value) return true
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  })

  // ========== Actions ==========

  /**
   * لاگین کاربر
   */
  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    
    try {
      const response: AuthResponse = await authApi.login(credentials)
      
      // ذخیره توکن‌ها
      setTokens(response.access, response.refresh)
      
      // دریافت اطلاعات کاربر
      await fetchUserProfile()
      
      // ادغام سبد خرید مهمان
      await mergeGuestCart()
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در ورود به سیستم'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * ثبت نام کاربر جدید
   */
  async function register(data: RegisterData) {
    loading.value = true
    error.value = null
    
    try {
      const response: AuthResponse = await authApi.register(data)
      
      // ذخیره توکن‌ها
      setTokens(response.access, response.refresh)
      
      // دریافت اطلاعات کاربر
      await fetchUserProfile()
      
      // ادغام سبد خرید مهمان
      await mergeGuestCart()
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در ثبت نام'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * خروج از سیستم
   */
  async function logout() {
    loading.value = true
    
    try {
      if (token.value && refreshToken.value) {
        await authApi.logout({ refresh: refreshToken.value })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // پاکسازی store
      clearAuthData()
      
      // ریست سبد خرید
      const cartStore = useCartStore()
      cartStore.$reset()
      
      loading.value = false
    }
  }

  /**
   * دریافت پروفایل کاربر
   */
  async function fetchUserProfile() {
    if (!token.value) return null
    
    try {
      const userData = await authApi.getProfile()
      user.value = userData
      return userData
    } catch (err) {
      console.error('Fetch profile error:', err)
      // اگر توکن منقضی شده، سعی کن رفرش کنی
      if (isTokenExpired.value) {
        await refreshAccessToken()
      }
      return null
    }
  }

  /**
   * رفرش توکن
   */
  async function refreshAccessToken() {
    if (!refreshToken.value) {
      clearAuthData()
      return false
    }
    
    try {
      const response = await authApi.refreshToken({
        refresh: refreshToken.value
      })
      
      token.value = response.access
      localStorage.setItem("access_token", response.access)
      
      return true
    } catch (err) {
      clearAuthData()
      return false
    }
  }

  /**
   * بررسی وضعیت احراز هویت در شروع برنامه
   */
  async function checkAuth() {
    if (initialized.value) return isAuthenticated.value
    
    if (!token.value) {
      initialized.value = true
      return false
    }
    
    // اگر توکن منقضی شده، سعی کن رفرش کنی
    if (isTokenExpired.value) {
      const refreshed = await refreshAccessToken()
      if (!refreshed) {
        initialized.value = true
        return false
      }
    }
    
    // دریافت اطلاعات کاربر
    await fetchUserProfile()
    
    initialized.value = true
    return isAuthenticated.value
  }

  /**
   * ادغام سبد خرید مهمان با کاربر
   */
  async function mergeGuestCart() {
    const sessionKey = localStorage.getItem('session_key')
    if (sessionKey) {
      try {
        const cartStore = useCartStore()
        await cartStore.mergeGuestCart(sessionKey)
        localStorage.removeItem('session_key')
      } catch (err) {
        console.error('Merge cart error:', err)
      }
    }
  }

  /**
   * ذخیره توکن‌ها
   */
  function setTokens(accessToken: string, refreshTokenValue?: string) {
    token.value = accessToken
    localStorage.setItem("access_token", accessToken)
    
    if (refreshTokenValue) {
      refreshToken.value = refreshTokenValue
      localStorage.setItem("refresh_token", refreshTokenValue)
    }
  }

  /**
   * پاکسازی داده‌های احراز هویت
   */
  function clearAuthData() {
    user.value = null
    token.value = null
    refreshToken.value = null
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }

  /**
   * آپدیت اطلاعات کاربر
   */
  function updateUser(updates: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  // ========== Return ==========
  return {
    // State
    user,
    token,
    refreshToken,
    loading,
    error,
    initialized,
    
    // Getters
    isAuthenticated,
    userName,
    userInitials,
    isTokenExpired,
    
    // Actions
    login,
    register,
    logout,
    checkAuth,
    fetchUserProfile,
    refreshAccessToken,
    updateUser,
    mergeGuestCart
  }
})

// نوع‌های مورد نیاز (باید در فایل types تعریف بشن)
export interface User {
  id: number
  username: string
  email: string
  full_name?: string
  phone?: string
  avatar?: string
  date_joined?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password2?: string
  full_name?: string
  phone?: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}
