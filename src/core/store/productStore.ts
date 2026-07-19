// core/store/productStore.ts

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { productService } from '@/services/product.service'

import type { Product } from '@/types/product.types'

export const useProductStore = defineStore(
  'product',
  () => {
    // ================= STATE =================

    const products = ref<Product[]>([])

    const suggestedProducts = ref<
      Product[]
    >([])

    const loading = ref(false)

    const error = ref<string | null>(
      null,
    )

    // ================= GETTERS =================

    const totalProducts = computed(
      () => products.value.length,
    )

    const hasProducts = computed(
      () => products.value.length > 0,
    )

    // ================= ACTIONS =================

    async function fetchProducts(
      params?: Record<string, unknown>,
    ) {
      loading.value = true
      error.value = null

      try {
        const res =
          await productService.getProducts(
            params,
          )

        console.log(
          'product response:',
          res,
        )

        if (Array.isArray(res)) {
          products.value = res
        } else if (
          Array.isArray(res?.data?.data)
        ) {
          // پاسخ کامل Axios:
          // res.data.data
          products.value = res.data.data
        } else if (
          Array.isArray(res?.data)
        ) {
          // اگر سرویس response.data
          // را برگرداند
          products.value = res.data
        } else if (
          Array.isArray(res?.results)
        ) {
          products.value = res.results
        } else {
          products.value = []
        }
      } catch (err: unknown) {
        console.error(
          'خطا در دریافت محصولات:',
          err,
        )

        if (err instanceof Error) {
          error.value = err.message
        } else {
          error.value =
            'خطا در دریافت محصولات'
        }

        products.value = []
      } finally {
        loading.value = false
      }
    }

    async function fetchSuggestedProducts() {
      loading.value = true
      error.value = null

      try {
        const res =
          await productService
            .getSuggestedProducts?.()

        if (Array.isArray(res)) {
          suggestedProducts.value = res
        } else if (
          Array.isArray(res?.data?.data)
        ) {
          suggestedProducts.value =
            res.data.data
        } else if (
          Array.isArray(res?.data)
        ) {
          suggestedProducts.value =
            res.data
        } else {
          suggestedProducts.value = []
        }
      } catch (err: unknown) {
        console.error(
          'خطا در دریافت محصولات پیشنهادی:',
          err,
        )

        if (err instanceof Error) {
          error.value = err.message
        } else {
          error.value =
            'خطا در دریافت محصولات پیشنهادی'
        }

        suggestedProducts.value = []
      } finally {
        loading.value = false
      }
    }

    return {
      products,
      suggestedProducts,
      loading,
      error,

      totalProducts,
      hasProducts,

      fetchProducts,
      fetchSuggestedProducts,
    }
  },
)
