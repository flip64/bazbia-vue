
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productService } from '@/services/product.service'
import type { Product } from '@/types/product.types'

export const cheapestProductStore = defineStore('cheapestProducts', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCheapestProducts() {
    loading.value = true
    error.value = null

    try {
      const res = await productService.getCheapestProducts()

      if (Array.isArray(res)) {
        products.value = res
      } else {
        products.value = res.data ?? res.results ?? []
      }
    } catch (err: any) {
      error.value = err.message || 'خطا در دریافت جدیدترین محصولات'
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchCheapestProducts,
  }
})
