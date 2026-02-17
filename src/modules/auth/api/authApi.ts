// src/modules/auth/api/authApi.ts
import api from '@/core/api/client'

// توابع جداگانه (همان کد قبلی شما)
export const loginRequest = (data: {email: string, password: string}) =>
  api.post('/auth/login', data)

export const registerRequest = (data: {name: string, email: string, password: string}) =>
  api.post('/auth/register', data)

export const getMeRequest = () =>
  api.get('/auth/me')

// اضافه کردن شیء authApi برای import آسان‌تر
export const authApi = {
  loginRequest,
  registerRequest,
  getMeRequest
}
