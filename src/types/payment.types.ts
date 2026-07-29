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
  order_status: string
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


export interface CreatePaymentPayload {
  order_id: number
}


export interface CreatePaymentResponse {
  message: string
  payment_url: string
  payment: Payment
}


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


export interface PaymentApiError {
  error?: string
  detail?: string

  order_id?: string[]
  payment_id?: string[]
  authority?: string[]
  mock_status?: string[]
}
