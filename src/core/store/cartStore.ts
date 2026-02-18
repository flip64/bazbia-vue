// core/store/cartStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService } from '@/services/cart.service'
import { useAuthStore } from './authStore'
import type { Cart, CartItem as ApiCartItem, AddToCartPayload } from '@/types/cart.types'

export interface CartItem {
  id: number
  variant_id: number
  variant_name: string
  quantity: number
  price: number
  total_price: number
  image: string
  max_stock?: number
  selected?: boolean
}

export const useCartStore = defineStore('cart', () => {
  // ========== State ==========
  const cart = ref<Cart | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sessionKey = ref<string | null>(localStorage.getItem('session_key'))
  const selectedItems = ref<number[]>([])
  const initialized = ref(false)  // برای جلوگیری از مقداردهی مجدد

  // ========== Getters ==========
  const items = computed(() => cart.value?.items || [])
  
  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )
  
  const totalPrice = computed(() => 
    items.value.reduce((sum, item) => sum + item.total_price, 0)
  )
  
  const selectedTotalPrice = computed(() => 
    items.value
      .filter(item => selectedItems.value.includes(item.id))
      .reduce((sum, item) => sum + item.total_price, 0)
  )
  
  const selectedCount = computed(() => selectedItems.value.length)
  
  const isEmpty = computed(() => items.value.length === 0)
  
  const isAllSelected = computed(() => 
    items.value.length > 0 && selectedItems.value.length === items.value.length
  )
  
  const isAuthenticated = computed(() => {
    const auth = useAuthStore()
    return auth.isAuthenticated
  })

  // ========== LocalStorage Methods ==========
  
  const generateSessionKey = (): string => {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
      const r = Math.floor(Math.random() * 36)
      return r.toString(36)
    })
  }

  const getSessionKey = (): string => {
    if (!sessionKey.value) {
      sessionKey.value = generateSessionKey()
      localStorage.setItem('session_key', sessionKey.value)
    }
    return sessionKey.value
  }

  // ========== Initialization ==========
  
  /**
   * مقداردهی اولیه سبد خرید
   */
  const initializeCart = async () => {
    // اگه قبلاً مقداردهی شده، دوباره اینکارو نکن
    if (initialized.value) return
    
    const auth = useAuthStore()
    
    // اگه session key نداریم و کاربر مهمانه، یکی بسازیم
    if (!sessionKey.value && !auth.isAuthenticated) {
      sessionKey.value = generateSessionKey()
      localStorage.setItem('session_key', sessionKey.value)
    }
    
    // دریافت سبد خرید
    await fetchCart()
    initialized.value = true
  }

  // ========== API Methods ==========
  
  const fetchCart = async () => {
    loading.value = true
    error.value = null
    
    try {
      const auth = useAuthStore()
      const response = await cartService.getCart(
        auth.isAuthenticated ? undefined : getSessionKey()
      )
      cart.value = response
      syncSelectedItems()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در دریافت سبد خرید'
      console.error('Fetch cart error:', err)
      
      if (err.response?.status === 401 && !isAuthenticated.value) {
        sessionKey.value = generateSessionKey()
        localStorage.setItem('session_key', sessionKey.value)
        await fetchCart()
      }
    } finally {
      loading.value = false
    }
  }

  const addItem = async (payload: AddToCartPayload) => {
    loading.value = true
    error.value = null
    
    try {
      const auth = useAuthStore()
      const response = await cartService.addToCart({
        variant_id: payload.variant_id,
        quantity: payload.quantity,
        session_key: auth.isAuthenticated ? undefined : getSessionKey()
      })
      
      await fetchCart()
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در افزودن به سبد خرید'
      console.error('Add item error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    loading.value = true
    error.value = null
    
    try {
      const auth = useAuthStore()
      await cartService.updateQuantity(
        itemId, 
        quantity, 
        auth.isAuthenticated ? undefined : sessionKey.value!
      )
      
      await fetchCart()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در بروزرسانی تعداد'
      console.error('Update quantity error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeItem = async (itemId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const auth = useAuthStore()
      await cartService.removeItem(
        itemId, 
        auth.isAuthenticated ? undefined : sessionKey.value!
      )
      
      selectedItems.value = selectedItems.value.filter(id => id !== itemId)
      await fetchCart()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در حذف آیتم'
      console.error('Remove item error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeSelectedItems = async () => {
    if (selectedItems.value.length === 0) return
    
    loading.value = true
    error.value = null
    
    try {
      const promises = selectedItems.value.map(id => removeItem(id))
      await Promise.all(promises)
      selectedItems.value = []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در حذف آیتم‌ها'
      console.error('Remove selected items error:', err)
    } finally {
      loading.value = false
    }
  }

  const mergeGuestCart = async (guestSessionKey: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await cartService.mergeCart(guestSessionKey)
      localStorage.removeItem('session_key')
      sessionKey.value = null
      await fetchCart()
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در ادغام سبد خرید'
      console.error('Merge cart error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    loading.value = true
    error.value = null
    
    try {
      const auth = useAuthStore()
      await cartService.clearCart(
        auth.isAuthenticated ? undefined : sessionKey.value!
      )
      
      cart.value = null
      selectedItems.value = []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در پاک کردن سبد خرید'
      console.error('Clear cart error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ========== Selection Methods ==========
  
  const syncSelectedItems = () => {
    const validItemIds = new Set(items.value.map(item => item.id))
    selectedItems.value = selectedItems.value.filter(id => validItemIds.has(id))
  }

  const toggleItemSelection = (itemId: number) => {
    if (selectedItems.value.includes(itemId)) {
      selectedItems.value = selectedItems.value.filter(id => id !== itemId)
    } else {
      selectedItems.value.push(itemId)
    }
  }

  const selectAll = () => {
    if (isAllSelected.value) {
      selectedItems.value = []
    } else {
      selectedItems.value = items.value.map(item => item.id)
    }
  }

  // ========== Utility Methods ==========
  
  const checkStock = async (variantId: number, quantity: number): Promise<boolean> => {
    try {
      const response = await cartService.checkStock(variantId, quantity)
      return response.available
    } catch (err) {
      console.error('Stock check error:', err)
      return false
    }
  }

  const calculateShipping = (items: CartItem[], addressId?: number) => {
    return totalPrice.value > 500000 ? 0 : 30000
  }

  const $reset = () => {
    cart.value = null
    loading.value = false
    error.value = null
    selectedItems.value = []
    initialized.value = false
  }

  return {
    // State
    cart,
    loading,
    error,
    sessionKey,
    selectedItems,
    initialized,
    
    // Getters
    items,
    totalItems,
    totalPrice,
    selectedTotalPrice,
    selectedCount,
    isEmpty,
    isAllSelected,
    isAuthenticated,
    
    // Actions
    initializeCart,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    removeSelectedItems,
    mergeGuestCart,
    clearCart,
    toggleItemSelection,
    selectAll,
    checkStock,
    calculateShipping,
    $reset
  }
})
