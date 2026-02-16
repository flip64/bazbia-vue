// src/core/api/client.ts
import axios from 'axios'  // ✅ فقط axios رو import کن

// تنظیمات پایه
const baseURL = import.meta.env.VITE_API_URL || 'httphttps://backend.bazbia.ir/api'

// ایجاد نمونه axios
const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// اینترسپتور درخواست
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// اینترسپتور پاسخ
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
