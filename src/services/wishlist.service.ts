import api from '@/core/api/client'
import { API_ENDPOINTS } from '@/core/api/endpoints'

import type {
  WishlistItem,
} from '@/types/wishlist.types'


export const wishlistService = {
  // ==========================================
  // دریافت علاقه‌مندی‌ها
  // ==========================================

  async getWishlist(): Promise<WishlistItem[]> {
    const response =
      await api.get<WishlistItem[]>(
        API_ENDPOINTS.USER.WISHLIST,
      )

    return response.data
  },


  // ==========================================
  // افزودن محصول
  // ==========================================

  async addToWishlist(
    productId: number,
  ): Promise<WishlistItem> {
    const response =
      await api.post<WishlistItem>(
        API_ENDPOINTS.USER.WISHLIST,
        {
          product_id: productId,
        },
      )

    return response.data
  },


  // ==========================================
  // حذف محصول
  // ==========================================

  async removeFromWishlist(
    productId: number,
  ): Promise<void> {
    await api.delete(
      API_ENDPOINTS.USER.REMOVE_FROM_WISHLIST(
        productId,
      ),
    )
  },
}
