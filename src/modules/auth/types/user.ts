// src/modules/auth/types/user.ts

// ==========================
// User
// ==========================

export interface User {
  id: number
  username: string
  phone: string

  full_name?: string
  first_name?: string
  last_name?: string
  email?: string | null
  avatar?: string | null
}

// ==========================
// Tokens
// ==========================

export interface AuthTokens {
  access: string
  refresh: string
}

export interface RefreshTokenPayload {
  refresh: string
}

export interface RefreshTokenResponse {
  access: string

  /**
   * در صورت فعال بودن ROTATE_REFRESH_TOKENS
   * بک‌اند refresh جدید برمی‌گرداند.
   */
  refresh?: string
}

// ==========================
// Password login
// ==========================

export interface LoginCredentials {
  phone: string
  password: string
}

export interface LoginResponse {
  message?: string
  user: User
  tokens: AuthTokens
}

// برای سازگاری موقت با Store قدیمی
export type AuthResponse = LoginResponse

// ==========================
// OTP request
// ==========================

export interface OtpRequestPayload {
  phone: string
}

export interface OtpRequestResponse {
  message: string
  session_id: string
  expires_in?: number
  retry_after?: number

  /**
   * فقط در محیط توسعه ممکن است بک‌اند کد را برگرداند.
   * در محیط production نباید وجود داشته باشد.
   */
  debug_code?: string
}

// ==========================
// OTP verification
// ==========================

export interface OtpVerifyPayload {
  phone: string
  session_id: string
  code: string
}

export interface OtpVerifyResponse {
  message: string
  is_new_user: boolean
  user: User
  tokens: AuthTokens
}

// ==========================
// Logout
// ==========================

export interface LogoutPayload {
  refresh: string
}