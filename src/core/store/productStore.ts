// core/store/productStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '@/services/product.service'
import type { Product } from '@/types/product.types'

export const useProductStore = defineStore('product', () => {
  // ================= STATE =================
  const products = ref<Product[]>([])
  const suggestedProducts = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ================= GETTERS =================
  const totalProducts = computed(() => products.value.length)
  const hasProducts = computed(() => products.value.length > 0)

  // ================= ACTIONS =================

  // دریافت همه محصولات
  async function fetchProducts(params?: any) {
    loading.value = true
    error.value = null

    try {
      const res = await productService.getProducts(params)

      // اگر API مستقیم array داد
      if (Array.isArray(res)) {
        products.value = res
      } else {
        // اگر response paginated بود
        products.value = res.data ?? res.results ?? []
      }

    } catch (err: any) {
      error.value = err.message || 'خطا در دریافت محصولات'
    } finally {
      loading.value = false
    }
  }

  // 🔥 پیشنهاد محصولات (Fix error تو)
  async function fetchSuggestedProducts() {
    loading.value = true
    error.value = null

    try {
      const res = await productService.getSuggestedProducts?.()

      if (Array.isArray(res)) {
        suggestedProducts.value = res
      } else {
        suggestedProducts.value = res?.data ?? []
      }

    } catch (err: any) {
      error.value = err.message || 'خطا در دریافت محصولات پیشنهادی'
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    products,
    suggestedProducts,
    loading,
    error,

    // getters
    totalProducts,
    hasProducts,

    // actions
    fetchProducts,
    fetchSuggestedProducts
  }
})
