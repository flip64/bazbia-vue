// src/services/product.service.ts
import axios from 'axios'
import type { ProductsResponse, ProductsQueryParams } from '@/types/product.types'

const API_BASE_URL = 'https://backend.bazbia.ir/api'

export const productService = {
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
      console.error('خطا در دریافت محصولات:', error)
      throw error
    }
  },

  formatPrice(price: number): string {
    return price.toLocaleString('fa-IR')
  },

  getProductImageUrl(thumb: string): string {
    // اگه آدرس کامل نیست، بیس URL رو اضافه کن
    if (thumb.startsWith('http')) {
      return thumb
    }
    return `${API_BASE_URL}${thumb}`
  }
}
