// src/core/api/client.ts
import axios, { type InternalAxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios'
import { useAuthStore } from '@/core/store/authStore'
import { API_ENDPOINTS } from './endpoints'

// تنظیمات پایه
const baseURL = import.meta.env.VITE_API_URL || 'https://backend.bazbia.ir/api'

// ایجاد نمونه axios
const apiClient = axios.create({
  baseURL,
  timeout: 15000, // افزایش تایم‌اوت به 15 ثانیه
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// ========== Request Interceptor ==========
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // اضافه کردن توکن احراز هویت
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // اضافه کردن session_key برای کاربران مهمان (اگر در params نباشه)
    const sessionKey = localStorage.getItem('session_key')
    if (sessionKey && !config.params?.session_key && !config.data?.session_key) {
      config.params = {
        ...config.params,
        session_key: sessionKey
      }
    }
    
    // اضافه کردن timestamp برای جلوگیری از کش شدن
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// ========== Response Interceptor ==========
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // می‌توانیم ساختار پاسخ رو استاندارد کنیم
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    // مدیریت خطای 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // تلاش برای refresh token
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${baseURL}${API_ENDPOINTS.AUTH.REFRESH}`, {
            refresh: refreshToken
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          
          // بروزرسانی هدر و ارسال مجدد درخواست
          originalRequest.headers.Authorization = `Bearer ${access}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError)
      }
      
      // اگر refresh token هم کار نکرد، logout
      handleLogout()
    }
    
    // مدیریت خطای 403 (Forbidden)
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data)
      // می‌توانیم به صفحه دسترسی غیرمجاز هدایت کنیم
    }
    
    // مدیریت خطای 404 (Not Found)
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.config?.url)
    }
    
    // مدیریت خطای 422 (Validation Error)
    if (error.response?.status === 422) {
      const validationErrors = error.response.data as Record<string, string[]>
      console.error('Validation errors:', validationErrors)
    }
    
    // مدیریت خطای 500 (Server Error)
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error:', error.response.data)
      // می‌توانیم یک toast نمایش بدیم
    }
    
    // مدیریت خطای شبکه
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
    }
    
    if (!error.response) {
      console.error('Network error - no response from server')
    }
    
    return Promise.reject(error)
  }
)

// ========== Helper Functions ==========

/**
 * خروج از سیستم و هدایت به صفحه لاگین
 */
function handleLogout() {
  // پاکسازی localStorage
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  
  // پاکسازی session_key (اختیاری - می‌خواهیم مهمان باشه)
  // localStorage.removeItem('session_key')
  
  // ریست store
  const authStore = useAuthStore()
  authStore.logout()
  
  // هدایت به صفحه لاگین (بدون رفرش کامل صفحه)
  if (window.location.pathname !== '/login') {
    window.location.href = '/login?session=expired'
  }
}

/**
 * بررسی وضعیت اینترنت
 */
export function isOnline(): boolean {
  return navigator.onLine
}

/**
 * دریافت توکن فعلی
 */
export function getToken(): string | null {
  return localStorage.getItem('access_token')
}

/**
 * دریافت session_key فعلی
 */
export function getSessionKey(): string | null {
  return localStorage.getItem('session_key')
}

/**
 * تنظیم session_key جدید
 */
export function setSessionKey(key: string): void {
  localStorage.setItem('session_key', key)
}

/**
 * ایجاد نمونه axios با تنظیمات خاص
 */
export function createCustomClient(baseURL?: string) {
  return axios.create({
    baseURL: baseURL || import.meta.env.VITE_API_URL || 'https://backend.bazbia.ir/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
}

export default apiClient
