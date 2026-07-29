// src/core/api/endpoints.ts

/**
 * آدرس‌های API مطابق با بک‌اند Django.
 *
 * baseURL پیش‌فرض:
 * https://backend.bazbia.ir/api
 *
 * نکته:
 * تمام مسیرها با / شروع می‌شوند و در انتها نیز /
 * دارند تا با تنظیم APPEND_SLASH جنگو هماهنگ باشند.
 */

export const API_ENDPOINTS = {
  // =====================================================
  // احراز هویت
  // =====================================================
  AUTH: {
    /** ورود کاربر - POST */
    LOGIN: '/customers/login/',

    /** ثبت‌نام کاربر - POST */
    REGISTER: '/customers/register/',

    /** خروج از حساب کاربری - POST */
    LOGOUT: '/customers/logout/',

    /** تازه‌سازی access token - POST */
    REFRESH: '/customers/token/refresh/',

    /** دریافت پروفایل کاربر - GET */
    PROFILE: '/customers/profile/',

    /** ویرایش پروفایل کاربر - PUT/PATCH */
    UPDATE_PROFILE:
      '/customers/profile/update/',

    /** تغییر رمز عبور - POST */
    CHANGE_PASSWORD:
      '/customers/change-password/',

    /** تأیید ایمیل یا شماره موبایل - POST */
    VERIFY: '/customers/verify/',

    /** ارسال مجدد کد تأیید - POST */
    RESEND_CODE:
      '/customers/resend-code/',
  },

  // =====================================================
  // سبد خرید
  // =====================================================
  CART: {
    /** دریافت سبد خرید فعلی - GET */
    GET: '/orders/cart/',

    /** افزودن واریانت به سبد خرید - POST */
    ADD: '/orders/cart/add/',

    /** به‌روزرسانی تعداد آیتم - PUT/PATCH */
    UPDATE: (id: number): string =>
      `/orders/cart/items/${id}/`,

    /** حذف یک آیتم از سبد خرید - DELETE */
    DELETE: (id: number): string =>
      `/orders/cart/items/${id}/delete/`,

    /** خالی‌کردن کامل سبد خرید - DELETE */
    CLEAR: '/orders/cart/clear/',

    /** ذخیره سبد خرید کاربر - POST */
    SAVE: '/orders/cart/save/',

    /** بازیابی سبد خرید ذخیره‌شده - GET */
    LOAD: '/orders/cart/load/',

    /** ادغام سبد مهمان با سبد کاربر - POST */
    MERGE: '/orders/cart/merge/',
  },

  // =====================================================
  // محصولات
  // =====================================================
  PRODUCT: {
    /** فهرست کامل محصولات - GET */
    LIST: '/products/full-products/',

    /** جزئیات محصول - GET */
    DETAIL: (id: number): string =>
      `/products/${id}/`,

    /** فهرست واریانت‌های محصول - GET */
    VARIANTS: (
      productId: number,
    ): string =>
      `/products/${productId}/variants/`,

    /** جزئیات یک واریانت - GET */
    VARIANT_DETAIL: (
      variantId: number,
    ): string =>
      `/products/variants/${variantId}/`,

    /** بررسی موجودی واریانت - GET */
    STOCK_CHECK: (
      variantId: number,
    ): string =>
      `/products/variants/${variantId}/stock/`,

    /** جستجوی محصولات - GET */
    SEARCH: '/products/search/',

    /** فهرست دسته‌بندی‌ها - GET */
    CATEGORIES:
      '/products/categories/',

    /** فهرست برندها - GET */
    BRANDS: '/products/brands/',

    /** محصولات پیشنهادی مرتبط - GET */
    SUGGESTIONS: (id: number): string =>
      `/products/${id}/suggestions/`,

    /** محصولات پربازدید - GET */
    POPULAR: '/products/popular/',

    /** محصولات دارای تخفیف - GET */
    DISCOUNTED:
      '/products/discounted/',
  },

  // =====================================================
  // سفارش‌ها
  // =====================================================
  ORDER: {
    /** ثبت سفارش از سبد خرید - POST */
    CREATE: '/orders/create/',

    /** فهرست سفارش‌های کاربر - GET */
    LIST: '/orders/',

    /** جزئیات یک سفارش - GET */
    DETAIL: (id: number): string =>
      `/orders/${id}/`,

    /** لغو سفارش در وضعیت pending - POST */
    CANCEL: (id: number): string =>
      `/orders/${id}/cancel/`,

    /** پیگیری سفارش با کد رهگیری - GET */
    TRACK: (
      trackingCode: string,
    ): string =>
      `/orders/track/${encodeURIComponent(
        trackingCode,
      )}/`,

    /** ثبت درخواست مرجوعی - POST */
    RETURN: '/orders/returns/',
  },

  // =====================================================
  // پرداخت
  // =====================================================
  PAYMENT: {
    /**
     * ساخت درخواست پرداخت برای سفارش.
     *
     * Method: POST
     *
     * Body:
     * {
     *   order_id: number
     * }
     */
    CREATE: '/payments/create/',

    /**
     * تأیید نتیجه پرداخت.
     *
     * Method: POST
     *
     * Body:
     * {
     *   payment_id: number
     *   authority: string
     *   mock_status: 'success' | 'failed' | 'cancelled'
     * }
     */
    VERIFY: '/payments/verify/',

    

    /** تأیید بازگشت واقعی زرین‌پال - POST */
    ZARINPAL_CALLBACK: '/payments/callback/zarinpal/',


    /**
     * دریافت جزئیات و وضعیت فعلی پرداخت.
     *
     * Method: GET
     */
    DETAIL: (
      paymentId: number,
    ): string =>
      `/payments/${paymentId}/`,
  },

  // =====================================================
  // کاربر و آدرس‌ها
  // =====================================================
  USER: {
    /** فهرست آدرس‌ها یا افزودن آدرس - GET/POST */
    ADDRESSES:
      '/customers/addresses/',

    /** دریافت، ویرایش یا حذف آدرس */
    ADDRESS: (id: number): string =>
      `/customers/addresses/${id}/`,

    /** انتخاب آدرس پیش‌فرض */
    DEFAULT_ADDRESS: (
      id: number,
    ): string =>
      `/customers/addresses/${id}/default/`,

    /** فهرست علاقه‌مندی‌ها - GET */
    WISHLIST:
      '/customers/wishlist/',

    /** افزودن محصول به علاقه‌مندی‌ها - POST */
    ADD_TO_WISHLIST:
      '/customers/wishlist/add/',

    /** حذف محصول از علاقه‌مندی‌ها - DELETE */
    REMOVE_FROM_WISHLIST: (
      productId: number,
    ): string =>
      `/customers/wishlist/${productId}/`,

    /** فهرست دیدگاه‌های کاربر - GET */
    REVIEWS:
      '/customers/reviews/',

    /** دریافت، ویرایش یا حذف دیدگاه */
    REVIEW: (id: number): string =>
      `/customers/reviews/${id}/`,
  },

  // =====================================================
  // بسته‌بندی و هزینه ارسال
  // =====================================================
  PACKING: {
    /**
     * محاسبه هزینه ارسال سبد خرید براساس آدرس.
     *
     * Method: POST
     *
     * Body:
     * {
     *   address_id: number
     * }
     */
    CART_SHIPPING_QUOTE:
      '/bazbia-packing/cart/shipping-quote/',

    /**
     * موتور عمومی بسته‌بندی برای مصرف‌کنندگان خارجی API.
     */
    EXTERNAL_PACKING:
      '/bazbia-packing/external/packing/',
  },
} as const


// =========================================================
// Type exports
// =========================================================

export type ApiEndpoints =
  typeof API_ENDPOINTS


// =========================================================
// Utility types
// =========================================================

export type QueryParameterValue =
  | string
  | number
  | boolean
  | null
  | undefined

export type QueryParameters =
  Record<
    string,
    QueryParameterValue
  >


// =========================================================
// توابع کمکی URL
// =========================================================

/**
 * دریافت base URL تنظیم‌شده برای API.
 *
 * اسلش‌های انتهایی حذف می‌شوند تا هنگام اتصال مسیر،
 * آدرس دارای دو اسلش نشود.
 */
export function getApiBaseUrl(): string {
  const configuredBaseUrl =
    import.meta.env.VITE_API_URL

  const fallbackBaseUrl =
    'https://backend.bazbia.ir/api'

  return (
    configuredBaseUrl ||
    fallbackBaseUrl
  ).replace(/\/+$/, '')
}


/**
 * استانداردسازی مسیر نسبی API.
 *
 * خروجی همیشه با یک / شروع می‌شود.
 */
export function normalizeApiPath(
  path: string,
): string {
  const trimmedPath = path.trim()

  if (!trimmedPath) {
    return '/'
  }

  return trimmedPath.startsWith('/')
    ? trimmedPath
    : `/${trimmedPath}`
}


/**
 * دریافت آدرس کامل یک endpoint.
 *
 * نمونه:
 *
 * getFullUrl('/orders/create/')
 *
 * خروجی:
 *
 * https://backend.bazbia.ir/api/orders/create/
 */
export function getFullUrl(
  path: string,
): string {
  const baseUrl = getApiBaseUrl()

  const normalizedPath =
    normalizeApiPath(path)

  return `${baseUrl}${normalizedPath}`
}


/**
 * ساخت query string از یک object.
 *
 * مقادیر undefined و null در خروجی قرار نمی‌گیرند.
 */
export function buildQueryString(
  params: QueryParameters,
): string {
  const searchParams =
    new URLSearchParams()

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value === undefined ||
        value === null
      ) {
        return
      }

      searchParams.append(
        key,
        String(value),
      )
    },
  )

  const queryString =
    searchParams.toString()

  return queryString
    ? `?${queryString}`
    : ''
}


/**
 * اتصال مسیر API به query string.
 */
export function buildUrl(
  path: string,
  params?: QueryParameters,
): string {
  const normalizedPath =
    normalizeApiPath(path)

  if (!params) {
    return normalizedPath
  }

  return (
    normalizedPath +
    buildQueryString(params)
  )
}


/**
 * ساخت آدرس کامل همراه با query string.
 */
export function buildFullUrl(
  path: string,
  params?: QueryParameters,
): string {
  return getFullUrl(
    buildUrl(path, params),
  )
}
