// core/store/productStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productService } from '@/services/product.service'
import type { Product } from '@/types/product.types'

export const useProductStore = defineStore('product', () => {
  // State
  const suggestedProducts = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<number | null>(null)

  // Getters
  const isStale = computed(() => {
    if (!lastFetched.value) return true
    const FIVE_MINUTES = 5 * 60 * 1000
    return Date.now() - lastFetched.value > FIVE_MINUTES
  })

  // Actions
  async function fetchSuggestedProducts(force = false) {
    // اگه داده داریم و تازه هست، درخواست نده
    if (!force && suggestedProducts.value.length > 0 && !isStale.value) {
      return suggestedProducts.value
    }

    loading.value = true
    error.value = null
    
    try {
      suggestedProducts.value = await productService.getSuggestedProducts(3)
      lastFetched.value = Date.now()
    } catch (err: any) {
      error.value = err.message || 'خطا در دریافت محصولات پیشنهادی'
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    suggestedProducts,
    loading,
    error,
    
    // Actions
    fetchSuggestedProducts
  }
})
