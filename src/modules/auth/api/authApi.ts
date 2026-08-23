// src/modules/auth/api/authApi.ts

import api from '@/core/api/client'

import type {
  LoginCredentials,
  LoginResponse,
  LogoutPayload,
  OtpRequestPayload,
  OtpRequestResponse,
  OtpVerifyPayload,
  OtpVerifyResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  User
} from '@/modules/auth/types/user'


export const authApi = {
  /**
   * ورود با شماره موبایل و رمز عبور
   */
  async login(
    data: LoginCredentials
  ): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      '/customers/auth/login/password/',
      data
    )

    return response.data
  },

  /**
   * درخواست ارسال کد تأیید
   */
  async requestOtp(
    data: OtpRequestPayload
  ): Promise<OtpRequestResponse> {
    const response = await api.post<OtpRequestResponse>(
      '/customers/auth/otp/request/',
      data
    )

    return response.data
  },

  /**
   * تأیید کد OTP و ورود یا ایجاد خودکار کاربر
   */
  async verifyOtp(
    data: OtpVerifyPayload
  ): Promise<OtpVerifyResponse> {
    const response = await api.post<OtpVerifyResponse>(
      '/customers/auth/otp/verify/',
      data
    )

    return response.data
  },

  /**
   * دریافت اطلاعات کاربر فعلی
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>(
      '/customers/auth/me/'
    )

    return response.data
  },

  /**
   * تمدید Access Token
   */
  async refreshToken(
    data: RefreshTokenPayload
  ): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(
      '/customers/auth/token/refresh/',
      data
    )

    return response.data
  },

  /**
   * خروج و blacklist کردن Refresh Token
   */
  async logout(
    data: LogoutPayload
  ): Promise<void> {
    await api.post(
      '/customers/auth/logout/',
      data
    )
  }
}