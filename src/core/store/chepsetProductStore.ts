
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productService } from '@/services/product.service'
import type { Product } from '@/types/product.types'

export const useChepsettProductStore = defineStore('latestProducts', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchChepsetProducts() {
    loading.value = true
    error.value = null

    try {
      const res = await productService.getChesetProducts()

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
    fetchChepsetProducts,
  }
})
