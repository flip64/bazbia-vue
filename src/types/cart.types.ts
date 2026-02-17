// src/types/cart.types.ts

/**
 * آیتم سبد خرید - مطابق با پاسخ بک‌اند
 */
export interface CartItem {
  /** شناسه آیتم در سبد خرید */
  id: number
  /** شناسه واریانت محصول */
  variant_id: number
  /** نام واریانت محصول */
  variant_name: string
  /** تعداد */
  quantity: number
  /** قیمت واحد */
  price: number
  /** قیمت کل (quantity * price) */
  total_price: number
  /** تصویر محصول */
  image: string
  /** حداکثر موجودی قابل خرید (اختیاری - برای اعتبارسنجی) */
  max_stock?: number
  /** آیا آیتم انتخاب شده (برای عملیات گروهی) */
  selected?: boolean
}

/**
 * سبد خرید - مطابق با پاسخ بک‌اند
 */
export interface Cart {
  /** شناسه سبد خرید */
  id: number
  /** شناسه کاربر (null برای مهمان) */
  user: number | null
  /** کلید جلسه برای مهمان */
  session_key: string | null
  /** لیست آیتم‌ها */
  items: CartItem[]
  /** قیمت کل */
  total_price: number
  /** تعداد کل آیتم‌ها */
  total_items: number
  /** کد تخفیف اعمال شده (اختیاری) */
  coupon?: Coupon | null
  /** تاریخ ایجاد */
  created_at?: string
  /** تاریخ بروزرسانی */
  updated_at?: string
}

/**
 * کد تخفیف
 */
export interface Coupon {
  /** شناسه کد تخفیف */
  id: number
  /** کد */
  code: string
  /** نوع تخفیف (درصدی یا مبلغ ثابت) */
  discount_type: 'percent' | 'fixed'
  /** مقدار تخفیف */
  discount_value: number
  /** حداکثر تخفیف (برای درصدی) */
  max_discount?: number
  /** حداقل مبلغ خرید */
  min_purchase?: number
  /** تاریخ انقضا */
  expires_at?: string
}

/**
 * موجودی محصول
 */
export interface StockInfo {
  /** آیا موجود است */
  available: boolean
  /** موجودی فعلی */
  current_stock: number
  /** حداکثر قابل خرید */
  max_purchase: number
  /** حداقل قابل خرید */
  min_purchase?: number
}

// ========== Request DTOs ==========

/**
 * افزودن به سبد خرید - DTO
 */
export interface AddToCartPayload {
  /** شناسه واریانت */
  variant_id: number
  /** تعداد */
  quantity: number
  /** کلید جلسه (برای مهمان) */
  session_key?: string
}

/**
 * بروزرسانی تعداد - DTO
 */
export interface UpdateQuantityPayload {
  /** تعداد جدید */
  quantity: number
}

/**
 * ادغام سبد خرید - DTO
 */
export interface MergeCartPayload {
  /** کلید جلسه مهمان */
  session_key: string
}

/**
 * اعمال کد تخفیف - DTO
 */
export interface ApplyCouponPayload {
  /** کد تخفیف */
  code: string
}

// ========== Response Types ==========

/**
 * پاسخ ادغام سبد خرید
 */
export interface MergeCartResponse {
  /** پیام */
  message: string
  /** تعداد آیتم‌های منتقل شده */
  items_moved: number
}

/**
 * پاسخ بررسی موجودی
 */
export interface StockCheckResponse {
  /** آیا موجود است */
  available: boolean
  /** موجودی فعلی */
  current_stock: number
  /** حداکثر قابل خرید */
  max_purchase: number
}

/**
 * پاسخ هزینه ارسال
 */
export interface ShippingResponse {
  /** هزینه ارسال */
  shipping_cost: number
  /** روش ارسال */
  shipping_method?: string
  /** زمان تخمینی ارسال */
  estimated_delivery?: string
}

// ========== Enums ==========

/**
 * وضعیت سبد خرید
 */
export enum CartStatus {
  ACTIVE = 'active',
  CHECKOUT = 'checkout',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

/**
 * روش‌های ارسال
 */
export enum ShippingMethod {
  EXPRESS = 'express',
  NORMAL = 'normal',
  ECONOMIC = 'economic'
}

// ========== Utility Types ==========

/**
 * خلاصه سبد خرید (برای نمایش در هدر)
 */
export interface CartSummary {
  /** تعداد کل آیتم‌ها */
  total_items: number
  /** قیمت کل */
  total_price: number
  /** آیا خالی است */
  is_empty: boolean
}

/**
 * آیتم سبد خرید با اطلاعات اضافی برای نمایش
 */
export interface CartItemDisplay extends CartItem {
  /** آیا در حال ویرایش است */
  is_editing?: boolean
  /** آیا در حال حذف است */
  is_deleting?: boolean
  /** خطا */
  error?: string
}

/**
 * خطاهای سبد خرید
 */
export interface CartError {
  /** کد خطا */
  code: string
  /** پیام خطا */
  message: string
  /** آیتم مرتبط (اختیاری) */
  item_id?: number
  /** فیلد مرتبط (اختیاری) */
  field?: string
}
