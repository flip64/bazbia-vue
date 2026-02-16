// src/services/product.service.ts
import axios, { isAxiosError } from 'axios'
import type { ProductsResponse, ProductsQueryParams, Product } from '@/types/product.types'

const API_BASE_URL = 'https://backend.bazbia.ir/api'
const PLACEHOLDER_IMAGE = '/images/placeholder.jpg'

export const productService = {
  // متد موجود برای لیست محصولات
  async getProducts(params: ProductsQueryParams = {}) {
    try {
      const response = await axios.get<ProductsResponse>(`${API_BASE_URL}/products/`, {
        params: {
          page: params.page || 1,
          category: params.category,
          search: params.search,
          ordering: params.ordering
        }
      })
      return response.data
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('خطا در دریافت محصولات:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        })
        throw new Error(error.response?.data?.detail || 'خطا در ارتباط با سرور')
      }
      throw error
    }
  },

  // متد جدید برای دریافت جزئیات محصول با slug
  async getProductBySlug(slug: string) {
    try {
      const response = await axios.get<Product>(`${API_BASE_URL}/products/${slug}/`)
      return response.data
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(`خطا در دریافت محصول با slug ${slug}:`, {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        })
        
        // مدیریت خطاهای خاص
        if (error.response?.status === 404) {
          throw new Error('محصول مورد نظر یافت نشد')
        }
        throw new Error(error.response?.data?.detail || 'خطا در دریافت اطلاعات محصول')
      }
      throw error
    }
  },

  // متد برای دریافت جزئیات محصول با ID (اختیاری - اگر نیاز دارید)
  async getProductById(id: number | string) {
    try {
      const response = await axios.get<Product>(`${API_BASE_URL}/products/${id}/`)
      return response.data
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(`خطا در دریافت محصول ${id}:`, {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        })
        
        if (error.response?.status === 404) {
          throw new Error('محصول مورد نظر یافت نشد')
        }
        throw new Error(error.response?.data?.detail || 'خطا در دریافت اطلاعات محصول')
      }
      throw error
    }
  },

  // متدهای کمکی موجود با بهبود
  formatPrice(price: number | string | undefined | null): string {
    if (price == null) return '۰'
    
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
    
    if (isNaN(numericPrice)) return '۰'
    
    return numericPrice.toLocaleString('fa-IR')
  },

  getProductImageUrl(thumb: string | null | undefined): string {
    if (!thumb) return PLACEHOLDER_IMAGE
    
    if (thumb.startsWith('http')) return thumb
    
    const normalizedThumb = thumb.startsWith('/') ? thumb : `/${thumb}`
    return `${API_BASE_URL}${normalizedThumb}`
  },

  // متدهای کمکی جدید
  calculateDiscountedPrice(price: number, discountPercent: number): number {
    if (discountPercent <= 0) return price
    return price * (1 - discountPercent / 100)
  },

  formatDiscountedPrice(price: number, discountPercent: number) {
    const discountedPrice = this.calculateDiscountedPrice(price, discountPercent)
    
    return {
      original: this.formatPrice(price),
      discounted: this.formatPrice(discountedPrice),
      discount: discountPercent,
      hasDiscount: discountPercent > 0
    }
  }
                         }
