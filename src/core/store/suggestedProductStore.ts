// core/store/suggestedProductStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '@/services/product.service'
import type { Product } from '@/types/product.types'

export const useSuggestedProductStore = defineStore('suggestedProduct', () => {
  // ================= State =================
  const suggestedProducts = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ================= Getters =================
  const hasSuggested = computed(() => suggestedProducts.value.length > 0)

  // ================= Actions =================
  async function fetchSuggestedProducts(limit: number = 6) {
    loading.value = true
    error.value = null

    try {
      suggestedProducts.value =
        await productService.getSuggestedProducts(limit)
    } catch (err: any) {
      error.value = err.message || 'خطا در دریافت محصولات پیشنهادی'
    } finally {
      loading.value = false
    }
  }

  return {
    suggestedProducts,
    loading,
    error,
    hasSuggested,
    fetchSuggestedProducts
  }
})
