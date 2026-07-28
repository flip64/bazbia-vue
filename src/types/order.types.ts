// src/types/order.types.ts

/**
 * وضعیت‌های سفارش مطابق مدل Order در Django.
 */
export type OrderStatus =
  | 'pending'
  | 'cancelled'
  | 'paid'
  | 'shipped'
  | 'completed'


/**
 * روش‌های پرداخت قابل قبول بک‌اند.
 */
export type PaymentMethod =
  | 'online'
  | 'cod'


/**
 * داده‌ای که برای ثبت سفارش به بک‌اند ارسال می‌شود.
 *
 * مبلغ کالاها، هزینه ارسال و مبلغ نهایی ارسال نمی‌شوند؛
 * بک‌اند این مقادیر را دوباره محاسبه می‌کند.
 */
export interface CreateOrderPayload {
  address_id: number
  shipping_quote_id: string
  shipping_method_code: string
  payment_method: PaymentMethod
}


/**
 * نسخه ثابت آدرس در زمان ثبت سفارش.
 *
 * حتی اگر مشتری بعداً آدرس حساب خود را تغییر دهد،
 * اطلاعات سفارش قبلی بدون تغییر باقی می‌ماند.
 */
export interface OrderAddressSnapshot {
  address_id: number

  title?: string | null

  recipient_name?: string | null

  recipient_phone?: string | null

  province?: string | null

  city?: string | null

  address?: string | null

  postal_code?: string | null
}


/**
 * یکی از آیتم‌های ثبت‌شده داخل سفارش.
 */
export interface OrderItem {
  id: number

  /**
   * شناسه واریانت.
   *
   * بسته به Serializer بک‌اند ممکن است با نام
   * variant یا variant_id برگردد.
   */
  variant: number
  variant_id?: number

  product_name?: string

  product_slug?: string

  variant_name?: string

  quantity: number

  /**
   * قیمت یک واحد محصول بر حسب تومان.
   *
   * DecimalField جنگو معمولاً در JSON به‌صورت string
   * برگردانده می‌شود.
   */
  price: string

  /**
   * قیمت کل این ردیف بر حسب تومان.
   */
  total_price?: string

  image?: string | null
}


/**
 * ساختار کامل یک سفارش.
 */
export interface Order {
  id: number

  user: number

  status: OrderStatus

  status_display: string

  payment_method: PaymentMethod

  payment_method_display: string

  shipping_address: number | null

  shipping_address_snapshot:
    OrderAddressSnapshot

  shipping_method_code: string

  shipping_method_title: string

  shipping_quote_id: string

  /**
   * مجموع قیمت کالاها بر حسب تومان.
   */
  items_total: string

  /**
   * هزینه ارسال بر حسب تومان.
   */
  shipping_cost: string

  /**
   * مبلغ تخفیف بر حسب تومان.
   */
  discount_amount: string

  /**
   * مبلغ نهایی سفارش بر حسب تومان.
   */
  total_price: string

  created_at: string

  updated_at: string

  items: OrderItem[]
}


/**
 * پاسخ موفق ثبت سفارش.
 */
export interface CreateOrderResponse {
  message: string
  order: Order
}


/**
 * پاسخ موفق لغو سفارش.
 */
export interface CancelOrderResponse {
  message: string
  order: Order
}


/**
 * ساختار عمومی خطاهای API سفارش.
 */
export interface OrderApiError {
  error?: string
  detail?: string

  address_id?: string[]

  shipping_quote_id?: string[]

  shipping_method_code?: string[]

  payment_method?: string[]

  variant_id?: number

  available_stock?: number
}
