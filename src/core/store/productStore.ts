// core/store/productStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '@/services/product.service'
import type { Product } from '@/types/product.types'

export const useProductStore = defineStore('product', () => {
  // ================= State =================
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ================= Getters =================
  const totalProducts = computed(() => products.value.length)
  const hasProducts = computed(() => products.value.length > 0)

  // ================= Actions =================
  async function fetchProducts(params?: any) {
    loading.value = true
    error.value = null

    try {
      products.value = await productService.getProducts(params)
    } catch (err: any) {
      error.value = err.message || 'خطا در دریافت محصولات'
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    totalProducts,
    hasProducts,
    fetchProducts
  }
})
