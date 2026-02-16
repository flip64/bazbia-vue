// src/services/cart.service.ts
import apiClient from '@/core/api/client'
import { API_ENDPOINTS } from '@/core/api/endpoints'
import type { Cart, AddToCartDto, UpdateCartItemDto, CartResponse } from '@/types/cart.types'

class CartService {
  // دریافت سبد خرید
  async getCart(): Promise<Cart> {
    try {
      const response = await apiClient.get<CartResponse>(API_ENDPOINTS.CART.GET)
      return response.data.data
    } catch (error) {
      console.error('Error fetching cart:', error)
      throw error
    }
  }

  // افزودن محصول به سبد خرید
  async addToCart(data: AddToCartDto): Promise<Cart> {
    try {
      const response = await apiClient.post<CartResponse>(API_ENDPOINTS.CART.ADD, data)
      return response.data.data
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  // بروزرسانی آیتم
  async updateCartItem(itemId: number, data: UpdateCartItemDto): Promise<Cart> {
    try {
      const response = await apiClient.put<CartResponse>(
        API_ENDPOINTS.CART.UPDATE(itemId), 
        data
      )
      return response.data.data
    } catch (error) {
      console.error('Error updating cart item:', error)
      throw error
    }
  }

  // حذف آیتم از سبد خرید
  async removeCartItem(itemId: number): Promise<Cart> {
    try {
      const response = await apiClient.delete<CartResponse>(
        API_ENDPOINTS.CART.DELETE(itemId)
      )
      return response.data.data
    } catch (error) {
      console.error('Error removing cart item:', error)
      throw error
    }
  }

  // پاک کردن کل سبد خرید
  async clearCart(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.CART.CLEAR)
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }
}

export const cartService = new CartService()
