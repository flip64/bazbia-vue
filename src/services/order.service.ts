// src/services/order.service.ts

import axios from 'axios'

import apiClient from '@/core/api/client'
import { API_ENDPOINTS } from '@/core/api/endpoints'

import type {
  CancelOrderResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  Order,
  OrderApiError,
} from '@/types/order.types'


/**
 * خطای استاندارد عملیات سفارش.
 *
 * به‌جای اینکه کامپوننت‌های Vue مستقیماً با ساختار
 * پیچیده خطای Axios کار کنند، سرویس خطا را به این
 * ساختار تبدیل می‌کند.
 */
export class OrderServiceError extends Error {
  readonly status: number | null

  readonly data: OrderApiError | null

  constructor(
    message: string,
    status: number | null = null,
    data: OrderApiError | null = null,
  ) {
    super(message)

    this.name = 'OrderServiceError'
    this.status = status
    this.data = data

    Object.setPrototypeOf(
      this,
      OrderServiceError.prototype,
    )
  }
}


/**
 * استخراج اولین پیام خطای Serializer.
 */
function getFirstFieldError(
  errors: string[] | undefined,
): string | null {
  if (!errors?.length) {
    return null
  }

  return errors[0]
}


/**
 * استخراج پیام مناسب از پاسخ خطای بک‌اند.
 */
function getOrderErrorMessage(
  data: OrderApiError | null,
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

  const fieldError =
    getFirstFieldError(data.address_id) ||
    getFirstFieldError(
      data.shipping_quote_id,
    ) ||
    getFirstFieldError(
      data.shipping_method_code,
    ) ||
    getFirstFieldError(
      data.payment_method,
    )

  return fieldError || fallbackMessage
}


/**
 * تبدیل خطای ناشناخته یا Axios به OrderServiceError.
 */
function normalizeOrderError(
  error: unknown,
  fallbackMessage: string,
): OrderServiceError {
  if (error instanceof OrderServiceError) {
    return error
  }

  if (!axios.isAxiosError<OrderApiError>(error)) {
    return new OrderServiceError(
      fallbackMessage,
    )
  }

  if (!error.response) {
    return new OrderServiceError(
      'ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.',
      null,
      null,
    )
  }

  const status =
    error.response.status ?? null

  const data =
    error.response.data ?? null

  const message = getOrderErrorMessage(
    data,
    fallbackMessage,
  )

  return new OrderServiceError(
    message,
    status,
    data,
  )
}


/**
 * بررسی معتبر بودن شناسه عددی.
 */
function validatePositiveId(
  id: number,
  label: string,
): void {
  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new OrderServiceError(
      `${label} معتبر نیست.`,
    )
  }
}


/**
 * بررسی اطلاعات ثبت سفارش پیش از ارسال.
 */
function validateCreateOrderPayload(
  payload: CreateOrderPayload,
): void {
  validatePositiveId(
    payload.address_id,
    'شناسه آدرس',
  )

  if (
    !payload.shipping_quote_id.trim()
  ) {
    throw new OrderServiceError(
      'شناسه محاسبه ارسال موجود نیست.',
    )
  }

  if (
    !payload.shipping_method_code.trim()
  ) {
    throw new OrderServiceError(
      'روش ارسال انتخاب نشده است.',
    )
  }

  if (
    payload.payment_method !== 'online' &&
    payload.payment_method !== 'cod'
  ) {
    throw new OrderServiceError(
      'روش پرداخت معتبر نیست.',
    )
  }
}


class OrderService {
  /**
   * ثبت سفارش از سبد خرید فعال کاربر.
   */
  async createOrder(
    payload: CreateOrderPayload,
  ): Promise<CreateOrderResponse> {
    validateCreateOrderPayload(payload)

    const normalizedPayload:
      CreateOrderPayload = {
        address_id: payload.address_id,

        shipping_quote_id:
          payload.shipping_quote_id.trim(),

        shipping_method_code:
          payload.shipping_method_code.trim(),

        payment_method:
          payload.payment_method,
      }

    try {
      const response =
        await apiClient.post<CreateOrderResponse>(
          API_ENDPOINTS.ORDER.CREATE,
          normalizedPayload,
        )

      return response.data
    } catch (error: unknown) {
      throw normalizeOrderError(
        error,
        'ثبت سفارش انجام نشد.',
      )
    }
  }


  /**
   * دریافت فهرست سفارش‌های کاربر واردشده.
   */
  async getOrders(): Promise<Order[]> {
    try {
      const response =
        await apiClient.get<Order[]>(
          API_ENDPOINTS.ORDER.LIST,
        )

      return response.data
    } catch (error: unknown) {
      throw normalizeOrderError(
        error,
        'دریافت فهرست سفارش‌ها انجام نشد.',
      )
    }
  }


  /**
   * دریافت جزئیات یک سفارش.
   */
  async getOrderById(
    orderId: number,
  ): Promise<Order> {
    validatePositiveId(
      orderId,
      'شناسه سفارش',
    )

    try {
      const response =
        await apiClient.get<Order>(
          API_ENDPOINTS.ORDER.DETAIL(
            orderId,
          ),
        )

      return response.data
    } catch (error: unknown) {
      throw normalizeOrderError(
        error,
        'دریافت جزئیات سفارش انجام نشد.',
      )
    }
  }


  /**
   * لغو سفارش pending.
   *
   * بک‌اند پس از لغو، موجودی کالاها را برمی‌گرداند.
   */
  async cancelOrder(
    orderId: number,
  ): Promise<CancelOrderResponse> {
    validatePositiveId(
      orderId,
      'شناسه سفارش',
    )

    try {
      const response =
        await apiClient.post<CancelOrderResponse>(
          API_ENDPOINTS.ORDER.CANCEL(
            orderId,
          ),
        )

      return response.data
    } catch (error: unknown) {
      throw normalizeOrderError(
        error,
        'لغو سفارش انجام نشد.',
      )
    }
  }


  /**
   * پیگیری سفارش با کد رهگیری.
   *
   * این متد زمانی قابل استفاده است که مدل Order
   * در بک‌اند دارای tracking_code باشد.
   */
  async trackOrder(
    trackingCode: string,
  ): Promise<Order> {
    const normalizedTrackingCode =
      trackingCode.trim()

    if (!normalizedTrackingCode) {
      throw new OrderServiceError(
        'کد رهگیری الزامی است.',
      )
    }

    try {
      const response =
        await apiClient.get<Order>(
          API_ENDPOINTS.ORDER.TRACK(
            normalizedTrackingCode,
          ),
        )

      return response.data
    } catch (error: unknown) {
      throw normalizeOrderError(
        error,
        'پیگیری سفارش انجام نشد.',
      )
    }
  }


  /**
   * ثبت درخواست مرجوعی.
   *
   * endpoint فعلی بک‌اند هنوز به مدل مرجوعی متصل نشده
   * و فقط یک پیام موفقیت برمی‌گرداند.
   */
  async createReturnRequest(
    payload: Record<string, unknown>,
  ): Promise<{ message: string }> {
    try {
      const response =
        await apiClient.post<{
          message: string
        }>(
          API_ENDPOINTS.ORDER.RETURN,
          payload,
        )

      return response.data
    } catch (error: unknown) {
      throw normalizeOrderError(
        error,
        'ثبت درخواست مرجوعی انجام نشد.',
      )
    }
  }
}


export const orderService =
  new OrderService()

export default orderService
