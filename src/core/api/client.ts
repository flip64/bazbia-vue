import axios, {
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosResponse
} from "axios"
import { useAuthStore } from "@/core/store/authStore"
import { API_ENDPOINTS } from "./endpoints"

// ================= Base Config =================

const baseURL =
  import.meta.env.VITE_API_URL || "https://backend.bazbia.ir/api"

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true, // ⭐ حل مشکل سشن
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})

// ================= Request Interceptor =================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token")
    const sessionKey = localStorage.getItem("session_key")

    // اگر لاگین شده → JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // اگر مهمان → session_key
    else if (
      sessionKey &&
      !config.params?.session_key &&
      !config.data?.session_key
    ) {
      config.params = {
        ...config.params,
        session_key: sessionKey
      }
    }

    // جلوگیری از cache در GET
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    return config
  },
  (error: AxiosError) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  }
)

// ================= Response Interceptor =================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // ---------- 401 Unauthorized ----------
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (refreshToken) {
          const response = await axios.post(
            `${baseURL}${API_ENDPOINTS.AUTH.REFRESH}`,
            { refresh: refreshToken },
            { withCredentials: true }
          )

          const { access } = response.data as { access: string }

          localStorage.setItem("access_token", access)

          originalRequest.headers.Authorization = `Bearer ${access}`

          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError)
        handleLogout()
      }
    }

    // ---------- 403 ----------
    if (error.response?.status === 403) {
      console.error("Forbidden:", error.response.data)
    }

    // ---------- 404 ----------
    if (error.response?.status === 404) {
      console.error("Not Found:", error.config?.url)
    }

    // ---------- Validation ----------
    if (error.response?.status === 422) {
      console.error("Validation:", error.response.data)
    }

    // ---------- Server Error ----------
    if (error.response?.status && error.response.status >= 500) {
      console.error("Server error:", error.response.data)
    }

    // ---------- Network ----------
    if (!error.response) {
      console.error("Network error")
    }

    return Promise.reject(error)
  }
)

// ================= Helper Functions =================

function handleLogout() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")

  const authStore = useAuthStore()
  authStore.logout()

  if (window.location.pathname !== "/login") {
    window.location.href = "/login?session=expired"
  }
}

// ================= Utilities =================

export function isOnline(): boolean {
  return navigator.onLine
}

export function getToken(): string | null {
  return localStorage.getItem("access_token")
}

export function getSessionKey(): string | null {
  return localStorage.getItem("session_key")
}

export function setSessionKey(key: string): void {
  localStorage.setItem("session_key", key)
}

// ================= Custom Client =================

export function createCustomClient(base?: string) {
  return axios.create({
    baseURL: base || baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
}

export default apiClient
