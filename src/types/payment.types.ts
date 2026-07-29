// src/types/payment.types.ts

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'successful'
  | 'failed'
  | 'cancelled'


export type PaymentMethod =
  | 'online'
  | 'cod'
  | 'card_to_card'
  | 'wallet'
  | 'installment'


export interface Payment {
  id: number
  order: number

  /**
   * وضعیت فعلی سفارش مرتبط با پرداخت.
   */
  order_status: string

  /**
   * آیا امکان ایجاد درخواست پرداخت مجدد وجود دارد؟
   */
  can_retry: boolean

  /**
   * مبلغ پرداخت بر حسب تومان.
   */
  amount: string

  payment_method: PaymentMethod
  payment_method_display: string

  status: PaymentStatus
  status_display: string

  gateway: string
  authority: string

  tracking_code: string
  reference_id: string

  error_message: string

  paid_at: string | null
  created_at: string
  updated_at: string

  is_successful: boolean
}


// =====================================================
// ایجاد پرداخت
// =====================================================

export interface CreatePaymentPayload {
  order_id: number
}


export interface CreatePaymentResponse {
  message: string
  payment_url: string
  payment: Payment
}


// =====================================================
// پرداخت آزمایشی Mock
// =====================================================

export type MockPaymentStatus =
  | 'success'
  | 'failed'
  | 'cancelled'


export interface VerifyPaymentPayload {
  payment_id: number
  authority: string
  mock_status: MockPaymentStatus
}


export interface VerifyPaymentResponse {
  message: string
  payment: Payment
}


// =====================================================
// Callback واقعی زرین‌پال
// =====================================================

export type ZarinpalCallbackStatus =
  | 'OK'
  | 'NOK'


export interface ZarinpalCallbackPayload {
  authority: string
  status: ZarinpalCallbackStatus
}


export interface ZarinpalCallbackResponse {
  message: string
  payment: Payment
}


// =====================================================
// خطاهای API پرداخت
// =====================================================

export interface PaymentApiError {
  /**
   * خطای عمومی که بعضی Viewهای بک‌اند برمی‌گردانند.
   */
  error?: string

  /**
   * خطای استاندارد Django REST Framework.
   */
  detail?: string

  /**
   * پیام برخی پاسخ‌های callback یا verify.
   */
  message?: string

  /**
   * در پرداخت ناموفق ممکن است بک‌اند اطلاعات Payment
   * را همراه پاسخ خطا برگرداند.
   */
  payment?: Payment

  /**
   * خطاهای اعتبارسنجی Serializerها.
   */
  order_id?: string[]
  payment_id?: string[]
  authority?: string[]
  status?: string[]
  mock_status?: string[]

  /**
   * برای خطاهای پیش‌بینی‌نشده یا فیلدهای جدید بک‌اند.
   */
  [key: string]:
    | string
    | string[]
    | Payment
    | undefined
}
