// src/core/api/endpoints.ts
export const API_ENDPOINTS = {
  CART: {
    GET: '/cart/',                    // GET - دریافت سبد خرید
    ADD: '/cart/add/',                 // POST - افزودن آیتم
    UPDATE: (id: number) => `/cart/item/${id}/update/`,  // PUT - بروزرسانی
    DELETE: (id: number) => `/cart/item/${id}/delete/`,  // DELETE - حذف
    CLEAR: '/cart/clear/',             // POST - خالی کردن سبد
  },
  ORDERS: {
    CREATE: '/orders/create/',
    LIST: '/orders/',
    DETAIL: (id: number) => `/orders/${id}/`,
    CANCEL: (id: number) => `/orders/${id}/cancel/`
  }
}
