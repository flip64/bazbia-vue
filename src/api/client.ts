import axios from "axios"
import { APP_CONFIG } from "../config/app"

export const api = axios.create({
  baseURL: APP_CONFIG.apiURL,
  timeout: 15000
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)
