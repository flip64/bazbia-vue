// core/store/featuredProductStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '@/services/product.service'
import type { Product } from '@/types/product.types'

export const useFeaturedProductStore = defineStore('featuredProduct', () => {
  // ================= State =================
  const featuredProducts = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ================= Getters =================
  const hasFeatured = computed(() => featuredProducts.value.length > 0)

  // ================= Actions =================
  async function fetchFeaturedProducts(limit: number = 8) {
    console.log("fetchFeaturedProducts called")
    loading.value = true
    error.value = null

    try {
      featuredProducts.value =
        await productService.getFeaturedProducts(limit)
    } catch (err: any) {
      error.value = err.message || 'خطا در دریافت محصولات ویژه'
    } finally {
      loading.value = false
    }
  }

  return {
    featuredProducts,
    loading,
    error,
    hasFeatured,
    fetchFeaturedProducts
  }
})
