// src/services/product.service.ts
import axios, { isAxiosError } from 'axios'
import type { ProductsResponse, ProductsQueryParams, Product } from '@/types/product.types'

const API_BASE_URL = 'https://backend.bazbia.ir/api'
const PLACEHOLDER_IMAGE = '/images/placeholder.jpg'

// تابع کمکی برای نرمالایز کردن محصول
const normalizeProduct = (product: any): Product => {
  // قیمت از واریانت اول
  const mainVariant = product.variants?.[0]
  const variantPrice = mainVariant ? parseFloat(mainVariant.price) : 0

  // **تصویر اصلی - اصلاح شده**
  // اول از thumb مستقیم استفاده کن (برای لیست محصولات)
  // بعد از images (برای صفحه جزئیات)
  const mainImage = product.thumb || 
                   product.images?.find((img: any) => img.is_main)?.image || 
                   product.images?.[0]?.image || 
                   null

  return {
    ...product,
    // فیلدهای computed
    price: variantPrice,
    discount_price: mainVariant?.discount_price ? parseFloat(mainVariant.discount_price) : null,
    in_stock: (mainVariant?.stock || product.quantity || 0) > 0,
    thumb: mainImage,  // <-- حالا مقدار صحیح را دارد
    
    // اطمینان از وجود آرایه‌ها با مقدار پیش‌فرض
    variants: product.variants || [],
    images: product.images || [],  // <-- اگر نباشد، آرایه خالی
    tags: product.tags || [],
    specifications: product.specifications || []
  }
}

export const productService = {
  // متد برای لیست محصولات
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
      
      // نرمالایز کردن هر محصول در لیست
      const normalizedData = {
        ...response.data,
        data: response.data.data.map(normalizeProduct)
      }
      
      console.log('📦 Products loaded:', normalizedData.data.length)
      return normalizedData
      
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('❌ خطا در دریافت محصولات:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        })
        throw new Error(error.response?.data?.detail || 'خطا در ارتباط با سرور')
      }
      throw error
    }
  },


 // متدی برای محصولات ویژه 
async getFeaturedProducts(limit = 12) {
  const response = await axios.get(`${API_BASE_URL}/products/`,
    {
      params: {
        special: true,
        page_size: limit
      }
    }
  )
  console.log("🚀 getFeaturedProducts START")
  
  return response.data.data.map(normalizeProduct)
},

  
  // متد برای دریافت جزئیات محصول با slug
  async getProductBySlug(slug: string) {
    try {
      const response = await axios.get<any>(`${API_BASE_URL}/products/${slug}/`)
      
      // نرمالایز کردن محصول
      const normalizedProduct = normalizeProduct(response.data)
      
      console.log('📦 Product loaded:', normalizedProduct.name)
      return normalizedProduct
      
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(`❌ خطا در دریافت محصول با slug ${slug}:`, {
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

  // متد برای دریافت محصولات مشابه
  async getRelatedProducts(productId: number, limit: number = 4) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}/related/`, {
        params: { limit }
      })
      
      return response.data.map(normalizeProduct)
      
    } catch (error) {
      console.error('❌ خطا در دریافت محصولات مشابه:', error)
      return []
    }
  },

  // متدهای کمکی
  formatPrice(price: number | string | undefined | null): string {
    if (price == null) return '۰'
    
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
    
    if (isNaN(numericPrice)) return '۰'
    
    return numericPrice.toLocaleString('fa-IR')
  },

  getProductImageUrl(thumb: string | null | undefined): string {
    if (!thumb) return PLACEHOLDER_IMAGE
    
    if (thumb.startsWith('http')) return thumb
    
    // اگه آدرس با /media شروع میشه، مستقیم استفاده کن
    if (thumb.startsWith('/media')) {
      return `https://backend.bazbia.ir${thumb}`
    }
    
    const normalizedThumb = thumb.startsWith('/') ? thumb : `/${thumb}`
    return `https://backend.bazbia.ir${normalizedThumb}`
  },

  // محاسبه قیمت با تخفیف
  calculateDiscountedPrice(price: number, discountPercent: number): number {
    if (discountPercent <= 0) return price
    return Math.round(price * (1 - discountPercent / 100))
  },

  // گرفتن بهترین قیمت (با تخفیف یا بدون تخفیف)
  getBestPrice(product: Product): { price: number; originalPrice?: number; hasDiscount: boolean } {
    if (product.discount_price && product.discount_price < product.price) {
      return {
        price: product.discount_price,
        originalPrice: product.price,
        hasDiscount: true
      }
    }
    return {
      price: product.price,
      hasDiscount: false
    }
  }
}
