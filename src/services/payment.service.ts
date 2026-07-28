// src/services/payment.service.ts

import axios from 'axios'

import apiClient from '@/core/api/client'
import { API_ENDPOINTS } from '@/core/api/endpoints'

import type {
  CreatePaymentPayload,
  CreatePaymentResponse,
  PaymentApiError,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from '@/types/payment.types'


export class PaymentServiceError extends Error {
  readonly status: number | null
  readonly data: PaymentApiError | null

  constructor(
    message: string,
    status: number | null = null,
    data: PaymentApiError | null = null,
  ) {
    super(message)

    this.name = 'PaymentServiceError'
    this.status = status
    this.data = data

    Object.setPrototypeOf(
      this,
      PaymentServiceError.prototype,
    )
  }
}


function getFirstError(
  errors: string[] | undefined,
): string | null {
  if (!errors?.length) {
    return null
  }

  return errors[0]
}


function getPaymentErrorMessage(
  data: PaymentApiError | null,
  fallbackMessage: string,
): string {
  if (!data) {
    return fallbackMessage
  }

  if (data.error) {
    return data.error
  }

  if (data.detail) {
    return data.detail
  }

  return (
    getFirstError(data.order_id) ||
    getFirstError(data.payment_id) ||
    getFirstError(data.authority) ||
    getFirstError(data.mock_status) ||
    fallbackMessage
  )
}


function normalizePaymentError(
  error: unknown,
  fallbackMessage: string,
): PaymentServiceError {
  if (error instanceof PaymentServiceError) {
    return error
  }

  if (!axios.isAxiosError<PaymentApiError>(error)) {
    return new PaymentServiceError(
      fallbackMessage,
    )
  }

  if (!error.response) {
    return new PaymentServiceError(
      'ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.',
    )
  }

  const status =
    error.response.status ?? null

  const data =
    error.response.data ?? null

  return new PaymentServiceError(
    getPaymentErrorMessage(
      data,
      fallbackMessage,
    ),
    status,
    data,
  )
}


function validatePositiveId(
  value: number,
  label: string,
): void {
  if (
    !Number.isInteger(value) ||
    value <= 0
  ) {
    throw new PaymentServiceError(
      `${label} معتبر نیست.`,
    )
  }
}


class PaymentService {
  /**
   * ساخت درخواست پرداخت برای یک سفارش.
   */
  async createPayment(
    payload: CreatePaymentPayload,
  ): Promise<CreatePaymentResponse> {
    validatePositiveId(
      payload.order_id,
      'شناسه سفارش',
    )

    try {
      const response =
        await apiClient.post<CreatePaymentResponse>(
          API_ENDPOINTS.PAYMENT.CREATE,
          payload,
        )

      return response.data
    } catch (error: unknown) {
      throw normalizePaymentError(
        error,
        'ساخت درخواست پرداخت انجام نشد.',
      )
    }
  }


  /**
   * تأیید نتیجه پرداخت آزمایشی.
   */
  async verifyPayment(
    payload: VerifyPaymentPayload,
  ): Promise<VerifyPaymentResponse> {
    validatePositiveId(
      payload.payment_id,
      'شناسه پرداخت',
    )

    const authority =
      payload.authority.trim()

    if (!authority) {
      throw new PaymentServiceError(
        'شناسه تراکنش موجود نیست.',
      )
    }

    try {
      const response =
        await apiClient.post<VerifyPaymentResponse>(
          API_ENDPOINTS.PAYMENT.VERIFY,
          {
            payment_id:
              payload.payment_id,

            authority,

            mock_status:
              payload.mock_status,
          },
        )

      return response.data
    } catch (error: unknown) {
      throw normalizePaymentError(
        error,
        'تأیید پرداخت انجام نشد.',
      )
    }
  }
}


export const paymentService =
  new PaymentService()

export default paymentService
