// src/core/api/endpoints.ts

/**
 * آدرس‌های API - مطابق با بک‌اند Django
 * baseURL: https://backend.bazbia.ir/api
 */
export const API_ENDPOINTS = {
  // ========== احراز هویت ==========
  AUTH: {
    /** ورود کاربر - POST */
    LOGIN: '/customers/login/',
    
    /** ثبت نام کاربر - POST */
    REGISTER: '/customers/register/',
    
    /** خروج از سیستم - POST */
    LOGOUT: '/customers/logout/',
    
    /** رفرش توکن - POST */
    REFRESH: '/customers/token/refresh/',
    
    /** دریافت پروفایل - GET */
    PROFILE: '/customers/profile/',
    
    /** ویرایش پروفایل - PUT/PATCH */
    UPDATE_PROFILE: '/customers/profile/update/',
    
    /** تغییر رمز عبور - POST */
    CHANGE_PASSWORD: '/customers/change-password/',
    
    /** تایید ایمیل/موبایل - POST */
    VERIFY: '/customers/verify/',
    
    /** ارسال مجدد کد تایید - POST */
    RESEND_CODE: '/customers/resend-code/'
  },

  // ========== سبد خرید ==========
  CART: {
    /** دریافت سبد خرید - GET */
    GET: '/orders/cart/',
    
    /** افزودن به سبد خرید - POST */
    ADD: '/orders/cart/add/',
    
    /** بروزرسانی آیتم - PUT */
    UPDATE: (id: number) => `/orders/cart/items/${id}/`,
    
    /** حذف آیتم - DELETE */
    DELETE: (id: number) => `/orders/cart/items/${id}/`,
    
    /** خالی کردن سبد خرید - DELETE */
    CLEAR: '/orders/cart/clear/',
    
    /** ادغام سبد خرید مهمان - POST */
    MERGE: '/orders/cart/merge/',
    
    /** اعمال کد تخفیف - POST */
    APPLY_COUPON: '/orders/cart/apply-coupon/',
    
    /** حذف کد تخفیف - DELETE */
    REMOVE_COUPON: '/orders/cart/remove-coupon/',
    
    /** محاسبه هزینه ارسال - POST */
    CALCULATE_SHIPPING: '/orders/cart/calculate-shipping/'
  },

  // ========== محصولات ==========
  PRODUCT: {
    /** لیست محصولات - GET */
    LIST: '/products/full-products/',
    
    /** جزئیات محصول - GET */
    DETAIL: (id: number) => `/products/${id}/`,
    
    /** لیست واریانت‌ها - GET */
    VARIANTS: (productId: number) => `/products/${productId}/variants/`,
    
    /** جزئیات واریانت - GET */
    VARIANT_DETAIL: (variantId: number) => `/products/variants/${variantId}/`,
    
    /** بررسی موجودی - GET */
    STOCK_CHECK: (variantId: number) => `/products/variants/${variantId}/stock/`,
    
    /** جستجوی محصولات - GET */
    SEARCH: '/products/search/',
    
    /** لیست دسته‌بندی‌ها - GET */
    CATEGORIES: '/products/categories/',
    
    /** لیست برندها - GET */
    BRANDS: '/products/brands/',
    
    /** محصولات پیشنهادی - GET */
    SUGGESTIONS: (id: number) => `/products/${id}/suggestions/`,
    
    /** محصولات پر بازدید - GET */
    POPULAR: '/products/popular/',
    
    /** محصولات تخفیف دار - GET */
    DISCOUNTED: '/products/discounted/'
  },

  // ========== سفارشات ==========
  ORDER: {
    /** ایجاد سفارش - POST */
    CREATE: '/orders/create/',
    
    /** لیست سفارشات - GET */
    LIST: '/orders/',
    
    /** جزئیات سفارش - GET */
    DETAIL: (id: number) => `/orders/${id}/`,
    
    /** لغو سفارش - POST */
    CANCEL: (id: number) => `/orders/${id}/cancel/`,
    
    /** پیگیری سفارش - GET */
    TRACK: (id: number) => `/orders/${id}/track/`,
    
    /** بازگشت سفارش - POST */
    RETURN: (id: number) => `/orders/${id}/return/`,
    
    /** دریافت فاکتور - GET */
    INVOICE: (id: number) => `/orders/${id}/invoice/`
  },

  // ========== پرداخت ==========
  PAYMENT: {
    /** ایجاد پرداخت - POST */
    CREATE: '/payments/create/',
    
    /** تایید پرداخت - GET */
    VERIFY: '/payments/verify/',
    
    /** دریافت روش‌های پرداخت - GET */
    METHODS: '/payments/methods/',
    
    /** وضعیت پرداخت - GET */
    STATUS: (id: number) => `/payments/${id}/status/`
  },

  // ========== کاربران ==========
  USER: {
    /** آدرس‌ها - GET/POST */
    ADDRESSES: '/customers/addresses/',
    
    /** آدرس خاص - GET/PUT/DELETE */
    ADDRESS: (id: number) => `/customers/addresses/${id}/`,
    
    /** آدرس پیش‌فرض - PUT */
    DEFAULT_ADDRESS: (id: number) => `/customers/addresses/${id}/default/`,
    
    /** لیست علاقه‌مندی‌ها - GET */
    WISHLIST: '/customers/wishlist/',
    
    /** افزودن به علاقه‌مندی‌ها - POST */
    ADD_TO_WISHLIST: '/customers/wishlist/add/',
    
    /** حذف از علاقه‌مندی‌ها - DELETE */
    REMOVE_FROM_WISHLIST: (productId: number) => `/customers/wishlist/${productId}/`,
    
    /** دیدگاه‌های کاربر - GET */
    REVIEWS: '/customers/reviews/',
    
    /** دیدگاه خاص - GET/PUT/DELETE */
    REVIEW: (id: number) => `/customers/reviews/${id}/`
  }
} as const

// ========== Type Exports ==========
export type ApiEndpoints = typeof API_ENDPOINTS

// ========== Utility Functions ==========

/**
 * دریافت آدرس کامل یک endpoint
 * @param path - مسیر نسبی
 * @returns آدرس کامل
 */
export function getFullUrl(path: string): string {
  const baseURL = import.meta.env.VITE_API_URL || 'https://backend.bazbia.ir/api'
  return `${baseURL}${path}`
}

/**
 * ساخت query string
 * @param params - پارامترها
 * @returns query string
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * ترکیب مسیر با query string
 * @param path - مسیر
 * @param params - پارامترها
 * @returns مسیر کامل با query string
 */
export function buildUrl(path: string, params?: Record<string, any>): string {
  if (!params) return path
  const queryString = buildQueryString(params)
  return `${path}${queryString}`
}
