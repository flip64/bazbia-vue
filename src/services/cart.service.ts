// src/services/cart.service.ts
import apiClient from '@/core/api/client'
import { API_ENDPOINTS } from '@/core/api/endpoints'
import type { 
  Cart, 
  AddToCartPayload, 
  UpdateQuantityPayload,
  MergeCartResponse,
  StockCheckResponse 
} from '@/types/cart.types'

class CartService {
  
  /**
   * دریافت سبد خرید
   * @param sessionKey - کلید جلسه برای کاربران مهمان (اختیاری)
   */
  async getCart(sessionKey?: string): Promise<Cart> {
    try {
      const config = sessionKey 
        ? { params: { session_key: sessionKey } }
        : {}
      
      const response = await apiClient.get<Cart>(
        API_ENDPOINTS.CART.GET,
        config
      )
      
      return response.data
    } catch (error) {
      console.error('Error fetching cart:', error)
      throw error
    }
  }

  /**
   * افزودن محصول به سبد خرید
   * @param payload - اطلاعات محصول و session_key (برای مهمان)
   */
  async addToCart(payload: AddToCartPayload, sessionKey?: string): Promise<Cart> {
  try {
    const config = sessionKey
      ? { params: { session_key: sessionKey } }  // ← اضافه شد
      : {}

    const response = await apiClient.post<Cart>(
      API_ENDPOINTS.CART.ADD,
      payload,
      config  // ← ارسال config با params
    )

    return response.data
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

  /**
   * بروزرسانی تعداد آیتم
   * @param itemId - شناسه آیتم
   * @param quantity - تعداد جدید
   * @param sessionKey - کلید جلسه (برای مهمان)
   */

async updateQuantity(
  itemId: number, 
  quantity: number, 
  sessionKey?: string
): Promise<Cart> {
  try {
    // بک‌اند به variant_id هم نیاز دارد
    // باید ابتدا آیتم را پیدا کنیم و variant_id را استخراج کنیم
    const cart = await this.getCart(sessionKey)
    const item = cart.items.find(i => i.id === itemId)
    
    if (!item) {
      throw new Error('آیتم مورد نظر یافت نشد')
    }
    console.log("item =",item,quantity)
    // payload صحیح: هم quantity و هم variant_id
    const payload = {
      variant_id: item.id,
      quantity: quantity
    }
    
    const config = sessionKey 
      ? { params: { session_key: sessionKey } }
      : {}
    
    console.log('🔍 Sending payload:', payload)
    
    const response = await apiClient.put<Cart>(
      API_ENDPOINTS.CART.UPDATE(itemId),
      payload,
      config
    )
    
    return response.data
  } catch (error) {
    console.error('❌ Error updating cart item:', error)
    throw error
  }
}

  /**
   * حذف آیتم از سبد خرید
   * @param itemId - شناسه آیتم
   * @param sessionKey - کلید جلسه (برای مهمان)
   */
  async removeItem(itemId: number, sessionKey?: string): Promise<Cart> {
    try {
      const config = sessionKey 
        ? { params: { session_key: sessionKey } }
        : {}
      
      const response = await apiClient.delete<Cart>(
        API_ENDPOINTS.CART.DELETE(itemId),
        config
      )
      
      return response.data
    } catch (error) {
      console.error('Error removing cart item:', error)
      throw error
    }
  }

  /**
   * ادغام سبد خرید مهمان با کاربر
   * @param sessionKey - کلید جلسه مهمان
   */
  async mergeCart(sessionKey: string): Promise<MergeCartResponse> {
    try {
      const response = await apiClient.post<MergeCartResponse>(
        API_ENDPOINTS.CART.MERGE,
        { session_key: sessionKey }
      )
      
      return response.data
    } catch (error) {
      console.error('Error merging cart:', error)
      throw error
    }
  }

  /**
   * خالی کردن کامل سبد خرید
   * @param sessionKey - کلید جلسه (برای مهمان)
   */
  async clearCart(sessionKey?: string): Promise<void> {
    try {
      const config = sessionKey 
        ? { params: { session_key: sessionKey } }
        : {}
      
      await apiClient.delete(
        API_ENDPOINTS.CART.CLEAR,
        config
      )
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  /**
   * بررسی موجودی محصول
   * @param variantId - شناسه واریانت
   * @param quantity - تعداد مورد نظر
   */
  async checkStock(variantId: number, quantity: number): Promise<StockCheckResponse> {
    try {
      const response = await apiClient.get<StockCheckResponse>(
        API_ENDPOINTS.PRODUCT.STOCK_CHECK(variantId),
        { params: { quantity } }
      )
      
      return response.data
    } catch (error) {
      console.error('Error checking stock:', error)
      throw error
    }
  }

  /**
   * دریافت تعداد آیتم‌های سبد خرید (برای نمایش در header)
   * @param sessionKey - کلید جلسه (برای مهمان)
   */
  async getCartCount(sessionKey?: string): Promise<number> {
    try {
      const cart = await this.getCart(sessionKey)
      return cart.items?.length || 0
    } catch (error) {
      console.error('Error getting cart count:', error)
      return 0
    }
  }

  /**
   * اعمال کد تخفیف
   * @param code - کد تخفیف
   * @param sessionKey - کلید جلسه (برای مهمان)
   */
  async applyCoupon(code: string, sessionKey?: string): Promise<Cart> {
    try {
      const payload = { code }
      const config = sessionKey 
        ? { params: { session_key: sessionKey } }
        : {}
      
      const response = await apiClient.post<Cart>(
        API_ENDPOINTS.CART.APPLY_COUPON,
        payload,
        config
      )
      
      return response.data
    } catch (error) {
      console.error('Error applying coupon:', error)
      throw error
    }
  }

  /**
   * حذف کد تخفیف
   * @param sessionKey - کلید جلسه (برای مهمان)
   */
  async removeCoupon(sessionKey?: string): Promise<Cart> {
    try {
      const config = sessionKey 
        ? { params: { session_key: sessionKey } }
        : {}
      
      const response = await apiClient.delete<Cart>(
        API_ENDPOINTS.CART.REMOVE_COUPON,
        config
      )
      
      return response.data
    } catch (error) {
      console.error('Error removing coupon:', error)
      throw error
    }
  }

  /**
   * محاسبه هزینه ارسال
   * @param addressId - شناسه آدرس
   * @param sessionKey - کلید جلسه (برای مهمان)
   */
  async calculateShipping(addressId: number, sessionKey?: string): Promise<number> {
    try {
      const payload = { address_id: addressId }
      const config = sessionKey 
        ? { params: { session_key: sessionKey } }
        : {}
      
      const response = await apiClient.post<{ shipping_cost: number }>(
        API_ENDPOINTS.CART.CALCULATE_SHIPPING,
        payload,
        config
      )
      
      return response.data.shipping_cost
    } catch (error) {
      console.error('Error calculating shipping:', error)
      throw error
    }
  }
}

export const cartService = new CartService()
