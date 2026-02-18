// core/store/productStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'  // ✅ حتماً computed رو import کن
import { productService } from '@/services/product.service'
import type { Product } from '@/types/product.types'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([])
  const suggestedProducts = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters - با computed
  const totalProducts = computed(() => products.value.length)
  const hasProducts = computed(() => products.value.length > 0)
  const hasSuggested = computed(() => suggestedProducts.value.length > 0)

  // Actions
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

  async function fetchSuggestedProducts(limit: number = 3) {
    loading.value = true
    error.value = null
    try {
      suggestedProducts.value = await productService.getSuggestedProducts(limit)
    } catch (err: any) {
      error.value = err.message || 'خطا در دریافت محصولات پیشنهادی'
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    products,
    suggestedProducts,
    loading,
    error,
    
    // Getters
    totalProducts,
    hasProducts,
    hasSuggested,
    
    // Actions
    fetchProducts,
    fetchSuggestedProducts
  }
})
