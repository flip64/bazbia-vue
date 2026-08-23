// src/core/store/authStore.ts

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { authApi } from '@/modules/auth/api/authApi'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User
} from '@/modules/auth/types/user'

import { useCartStore } from '@/core/store/cartStore'

interface ApiErrorData {
  detail?: string
  message?: string
  non_field_errors?: string | string[]
  username?: string | string[]
  password?: string | string[]
}

interface HttpError {
  response?: {
    status?: number
    data?: ApiErrorData
  }
  message?: string
}

interface JwtPayload {
  exp?: number
}

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const SESSION_KEY = 'session_key'

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.warn(`ذخیره ${key} در مرورگر انجام نشد.`, error)
  }
}

function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`حذف ${key} از مرورگر انجام نشد.`, error)
  }
}

function getFirstErrorMessage(
  value: string | string[] | undefined
): string | null {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0]
  }

  return null
}

function getAuthErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  const httpError = error as HttpError
  const data = httpError.response?.data
  const status = httpError.response?.status

  const apiMessage =
    getFirstErrorMessage(data?.non_field_errors) ||
    getFirstErrorMessage(data?.username) ||
    getFirstErrorMessage(data?.password) ||
    data?.detail ||
    data?.message

  if (apiMessage) {
    return apiMessage
  }

  if (status === 400 || status === 401) {
    return 'اطلاعات واردشده صحیح نیست.'
  }

  if (status === 429) {
    return 'تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.'
  }

  if (status && status >= 500) {
    return 'خطایی در سرور رخ داده است. کمی بعد دوباره تلاش کنید.'
  }

  if (!httpError.response) {
    return 'ارتباط با سرور برقرار نشد.'
  }

  return fallbackMessage
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')

    if (parts.length !== 3) {
      return null
    }

    const normalizedPayload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      '='
    )

    return JSON.parse(atob(paddedPayload)) as JwtPayload
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  // ==========================
  // State
  // ==========================

  const user = ref<User | null>(null)

  const token = ref<string | null>(
    readStorage(ACCESS_TOKEN_KEY)
  )

  const refreshToken = ref<string | null>(
    readStorage(REFRESH_TOKEN_KEY)
  )

  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  let refreshPromise: Promise<boolean> | null = null

  // ==========================
  // Getters
  // ==========================

  const isAuthenticated = computed(() => {
    return Boolean(token.value && user.value)
  })

  const userName = computed(() => {
    return (
      user.value?.full_name ||
      user.value?.username ||
      'کاربر'
    )
  })

  const userInitials = computed(() => {
    const name =
      user.value?.full_name?.trim() ||
      user.value?.username?.trim()

    if (!name) {
      return 'ک'
    }

    const words = name.split(/\s+/)

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }

    return name.slice(0, 2).toUpperCase()
  })

  const isTokenExpired = computed(() => {
    if (!token.value) {
      return true
    }

    const payload = decodeJwtPayload(token.value)

    if (!payload?.exp) {
      return true
    }

    // سی ثانیه زودتر منقضی در نظر گرفته می‌شود.
    return payload.exp * 1000 <= Date.now() + 30_000
  })

  // ==========================
  // Token helpers
  // ==========================

  function setTokens(
    accessToken: string,
    newRefreshToken?: string
  ): void {
    token.value = accessToken
    writeStorage(ACCESS_TOKEN_KEY, accessToken)

    if (newRefreshToken) {
      refreshToken.value = newRefreshToken
      writeStorage(REFRESH_TOKEN_KEY, newRefreshToken)
    }
  }

  function clearAuthData(): void {
    user.value = null
    token.value = null
    refreshToken.value = null
    error.value = null

    removeStorage(ACCESS_TOKEN_KEY)
    removeStorage(REFRESH_TOKEN_KEY)
  }

  function clearError(): void {
    error.value = null
  }

  // ==========================
  // Authentication
  // ==========================

  async function login(
    credentials: LoginCredentials
  ): Promise<AuthResponse> {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.login(credentials)

      setTokens(response.access, response.refresh)

      if (response.user) {
        user.value = response.user
      } else {
        await fetchUserProfile()
      }

      await mergeGuestCart()

      return response
    } catch (caughtError: unknown) {
      clearAuthData()

      error.value = getAuthErrorMessage(
        caughtError,
        'ورود به حساب کاربری انجام نشد.'
      )

      throw caughtError
    } finally {
      loading.value = false
    }
  }

  async function register(
    data: RegisterData
  ): Promise<AuthResponse> {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.register(data)

      setTokens(response.access, response.refresh)

      if (response.user) {
        user.value = response.user
      } else {
        await fetchUserProfile()
      }

      await mergeGuestCart()

      return response
    } catch (caughtError: unknown) {
      clearAuthData()

      error.value = getAuthErrorMessage(
        caughtError,
        'ثبت‌نام انجام نشد.'
      )

      throw caughtError
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    error.value = null

    const currentRefreshToken = refreshToken.value

    try {
      if (currentRefreshToken) {
        await authApi.logout({
          refresh: currentRefreshToken
        })
      }
    } catch (caughtError: unknown) {
      console.warn(
        'خروج از حساب در سرور انجام نشد؛ داده‌های محلی پاک می‌شوند.',
        caughtError
      )
    } finally {
      clearAuthData()

      const cartStore = useCartStore()
      cartStore.$reset()

      loading.value = false
      initialized.value = true
    }
  }

  // ==========================
  // Profile
  // ==========================

  async function fetchUserProfile(
    retryAfterRefresh = true
  ): Promise<User | null> {
    if (!token.value) {
      user.value = null
      return null
    }

    try {
      const userData = await authApi.getProfile()

      user.value = userData
      return userData
    } catch (caughtError: unknown) {
      const httpError = caughtError as HttpError
      const status = httpError.response?.status

      const shouldRefresh =
        retryAfterRefresh &&
        refreshToken.value &&
        (status === 401 || isTokenExpired.value)

      if (shouldRefresh) {
        const refreshed = await refreshAccessToken()

        if (refreshed) {
          return fetchUserProfile(false)
        }
      }

      if (status === 401 || isTokenExpired.value) {
        clearAuthData()
      }

      return null
    }
  }

  // ==========================
  // Refresh token
  // ==========================

  async function executeTokenRefresh(): Promise<boolean> {
    if (!refreshToken.value) {
      clearAuthData()
      return false
    }

    try {
      const response = await authApi.refreshToken({
        refresh: refreshToken.value
      })

      setTokens(
        response.access,
        response.refresh
      )

      return true
    } catch {
      clearAuthData()
      return false
    }
  }

  async function refreshAccessToken(): Promise<boolean> {
    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = executeTokenRefresh()

    try {
      return await refreshPromise
    } finally {
      refreshPromise = null
    }
  }

  // ==========================
  // Application initialization
  // ==========================

  async function checkAuth(): Promise<boolean> {
    if (initialized.value) {
      return isAuthenticated.value
    }

    error.value = null

    try {
      if (!token.value && !refreshToken.value) {
        clearAuthData()
        return false
      }

      if (!token.value || isTokenExpired.value) {
        const refreshed = await refreshAccessToken()

        if (!refreshed) {
          return false
        }
      }

      const profile = await fetchUserProfile()

      return Boolean(profile)
    } finally {
      initialized.value = true
    }
  }

  // ==========================
  // Guest cart
  // ==========================

  async function mergeGuestCart(): Promise<void> {
    const sessionKey = readStorage(SESSION_KEY)

    if (!sessionKey) {
      return
    }

    try {
      const cartStore = useCartStore()

      await cartStore.mergeGuestCart(sessionKey)

      removeStorage(SESSION_KEY)
    } catch (caughtError: unknown) {
      console.warn(
        'ادغام سبد خرید مهمان انجام نشد.',
        caughtError
      )
    }
  }

  // ==========================
  // User helpers
  // ==========================

  function updateUser(updates: Partial<User>): void {
    if (!user.value) {
      return
    }

    user.value = {
      ...user.value,
      ...updates
    }
  }

  // ==========================
  // Return
  // ==========================

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
    mergeGuestCart,
    clearAuthData,
    clearError
  }
})
