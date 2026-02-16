// src/core/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios'

// تنظیمات پایه
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ایجاد نمونه axios
const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// اینترسپتور درخواست - اضافه کردن توکن
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // اضافه کردن زبان به هدر
    config.headers['Accept-Language'] = 'fa'
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// اینترسپتور پاسخ - مدیریت خطاها
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    // مدیریت خطای 401 (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// ✅ این خط مهمه - export default
export default apiClient
