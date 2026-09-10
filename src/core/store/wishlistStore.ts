// src/core/store/wishlistStore.ts

import {
  computed,
  ref,
} from 'vue'

import {
  defineStore,
} from 'pinia'

import {
  wishlistService,
} from '@/services/wishlist.service'

import type {
  WishlistItem,
} from '@/types/wishlist.types'


interface ApiError {
  response?: {
    status?: number

    data?: {
      detail?: string
      message?: string
      non_field_errors?: string[]
    }
  }

  message?: string
}


export const useWishlistStore =
  defineStore(
    'wishlist',
    () => {
      // ==========================================
      // State
      // ==========================================

      const items =
        ref<WishlistItem[]>([])

      const loading =
        ref(false)

      const error =
        ref<string | null>(null)

      const initialized =
        ref(false)

      const addingProductId =
        ref<number | null>(null)

      const removingProductId =
        ref<number | null>(null)


      // ==========================================
      // Getters
      // ==========================================

      const wishlistItems =
        computed(
          () => items.value,
        )


      const wishlistCount =
        computed(
          () => items.value.length,
        )


      const productIds =
        computed(
          () =>
            new Set(
              items.value.map(
                item =>
                  item.product.id,
              ),
            ),
        )


      const isInWishlist = (
        productId: number,
      ): boolean => {
        return productIds.value.has(
          productId,
        )
      }


      // ==========================================
      // Error helper
      // ==========================================

      function getErrorMessage(
        caughtError: unknown,
        fallback: string,
      ): string {
        const apiError =
          caughtError as ApiError

        const data =
          apiError.response?.data

        if (data?.detail) {
          return data.detail
        }

        if (data?.message) {
          return data.message
        }

        if (
          data?.non_field_errors?.length
        ) {
          return (
            data.non_field_errors[0]
          )
        }

        if (
          apiError.response?.status ===
          401
        ) {
          return (
            'برای استفاده از علاقه‌مندی‌ها وارد حساب کاربری شوید.'
          )
        }

        if (
          apiError.response?.status ===
          404
        ) {
          return (
            'محصول موردنظر پیدا نشد.'
          )
        }

        if (
          apiError.response?.status &&
          apiError.response.status >= 500
        ) {
          return (
            'خطایی در سرور رخ داده است.'
          )
        }

        if (
          !apiError.response
        ) {
          return (
            'ارتباط با سرور برقرار نشد.'
          )
        }

        return fallback
      }


      // ==========================================
      // دریافت لیست
      // ==========================================

      async function fetchWishlist(
        force = false,
      ): Promise<boolean> {
        if (
          initialized.value &&
          !force
        ) {
          return true
        }

        loading.value = true
        error.value = null

        try {
          const response =
            await wishlistService
              .getWishlist()

          items.value =
            Array.isArray(response)
              ? response
              : []

          initialized.value = true

          return true
        } catch (
          caughtError: unknown
        ) {
          error.value =
            getErrorMessage(
              caughtError,
              'دریافت علاقه‌مندی‌ها انجام نشد.',
            )

          return false
        } finally {
          loading.value = false
        }
      }


      // ==========================================
      // افزودن
      // ==========================================

      async function addItem(
        productId: number,
      ): Promise<boolean> {
        if (
          isInWishlist(productId)
        ) {
          return true
        }

        addingProductId.value =
          productId

        error.value = null

        try {
          const item =
            await wishlistService
              .addToWishlist(
                productId,
              )

          const alreadyExists =
            items.value.some(
              currentItem =>
                currentItem.product.id ===
                productId,
            )

          if (!alreadyExists) {
            items.value.unshift(
              item,
            )
          }

          initialized.value = true

          return true
        } catch (
          caughtError: unknown
        ) {
          error.value =
            getErrorMessage(
              caughtError,
              'افزودن محصول به علاقه‌مندی‌ها انجام نشد.',
            )

          return false
        } finally {
          addingProductId.value =
            null
        }
      }


      // ==========================================
      // حذف
      // ==========================================

      async function removeItem(
        productId: number,
      ): Promise<boolean> {
        removingProductId.value =
          productId

        error.value = null

        try {
          await wishlistService
            .removeFromWishlist(
              productId,
            )

          items.value =
            items.value.filter(
              item =>
                item.product.id !==
                productId,
            )

          return true
        } catch (
          caughtError: unknown
        ) {
          error.value =
            getErrorMessage(
              caughtError,
              'حذف محصول از علاقه‌مندی‌ها انجام نشد.',
            )

          return false
        } finally {
          removingProductId.value =
            null
        }
      }


      // ==========================================
      // Toggle
      // ==========================================

      async function toggleItem(
        productId: number,
      ): Promise<boolean> {
        if (
          isInWishlist(productId)
        ) {
          return removeItem(
            productId,
          )
        }

        return addItem(
          productId,
        )
      }


      // ==========================================
      // Reset
      // ==========================================

      function resetWishlist(): void {
        items.value = []

        error.value = null

        initialized.value = false

        addingProductId.value =
          null

        removingProductId.value =
          null
      }


      function clearError(): void {
        error.value = null
      }


      return {
        // state
        items,
        loading,
        error,
        initialized,
        addingProductId,
        removingProductId,

        // getters
        wishlistItems,
        wishlistCount,

        // actions
        fetchWishlist,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        resetWishlist,
        clearError,
      }
    },
  )
