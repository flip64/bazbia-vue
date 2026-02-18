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
  const initialized = ref(false)

  // ========== Getters ==========
  const items = computed(() => {
    console.log('🔍 computed items called, cart.value:', cart.value)
    console.log('📦 items from cart:', cart.value?.items)
    return cart.value?.items || []
  })
  
  const totalItems = computed(() => {
    const total = items.value.reduce((sum, item) => sum + item.quantity, 0)
    console.log('🧮 totalItems computed:', total)
    return total
  })
  
  const totalPrice = computed(() => 
    items.value.reduce((sum, item) => sum + item.total_price, 0)
  )
  
  const selectedTotalPrice = computed(() => 
    items.value
      .filter(item => selectedItems.value.includes(item.id))
      .reduce((sum, item) => sum + item.total_price, 0)
  )
  
  const selectedCount = computed(() => {
    console.log('✅ selectedCount:', selectedItems.value.length)
    return selectedItems.value.length
  })
  
  const isEmpty = computed(() => {
    const empty = items.value.length === 0
    console.log('🫙 isEmpty:', empty)
    return empty
  })
  
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
      console.log('🔑 New session key generated:', sessionKey.value)
    }
    return sessionKey.value
  }

  // ========== Initialization ==========
  
  const initializeCart = async () => {
    console.log('🚀 initializeCart started')
    console.log('📊 initialized:', initialized.value)
    console.log('🔑 sessionKey:', sessionKey.value)
    
    if (initialized.value) {
      console.log('⏭️ Already initialized, skipping')
      return
    }
    
    const auth = useAuthStore()
    console.log('👤 auth.isAuthenticated:', auth.isAuthenticated)
    
    if (!sessionKey.value && !auth.isAuthenticated) {
      sessionKey.value = generateSessionKey()
      localStorage.setItem('session_key', sessionKey.value)
      console.log('🔑 Generated new session key:', sessionKey.value)
    }
    
    console.log('🔄 Fetching cart...')
    await fetchCart()
    initialized.value = true
    console.log('✅ initializeCart completed')
  }

  // ========== API Methods ==========
  
  const fetchCart = async () => {
    console.log('📡 fetchCart STARTED')
    console.log('🔑 sessionKey:', sessionKey.value)
    
    loading.value = true
    error.value = null
    
    try {
      const auth = useAuthStore()
      const sessionKeyToUse = auth.isAuthenticated ? undefined : getSessionKey()
      console.log('🔐 Using session key:', sessionKeyToUse)
      
      const response = await cartService.getCart(sessionKeyToUse)
      console.log('✅ fetchCart response:', response)
      
      cart.value = response
      console.log('📦 cart.value set to:', cart.value)
      console.log('🛒 items in cart:', cart.value?.items)
      
      syncSelectedItems()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در دریافت سبد خرید'
      console.error('❌ Fetch cart error:', err)
      
      if (err.response?.status === 401 && !isAuthenticated.value) {
        console.log('🔄 401 error, generating new session key')
        sessionKey.value = generateSessionKey()
        localStorage.setItem('session_key', sessionKey.value)
        await fetchCart()
      }
    } finally {
      loading.value = false
      console.log('🏁 fetchCart completed, loading:', loading.value)
    }
  }

  const addItem = async (payload: AddToCartPayload) => {
    console.log('🛒 addItem STARTED with payload:', payload)
    
    loading.value = true
    error.value = null
    
    try {
      const auth = useAuthStore()
      const sessionKeyToUse = auth.isAuthenticated ? undefined : getSessionKey()
      console.log('🔐 Using session key:', sessionKeyToUse)
      
      const response = await cartService.addToCart({
        variant_id: payload.variant_id,
        quantity: payload.quantity,
        session_key: sessionKeyToUse
      })
      
      console.log('✅ addItem response:', response)
      
      console.log('🔄 Fetching updated cart...')
      await fetchCart()
      
      console.log('🎉 Item added successfully')
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در افزودن به سبد خرید'
      console.error('❌ Add item error:', err)
      throw err
    } finally {
      loading.value = false
      console.log('🏁 addItem completed')
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    console.log('✏️ updateQuantity:', { itemId, quantity })
    
    loading.value = true
    error.value = null
    
    try {
      const auth = useAuthStore()
      await cartService.updateQuantity(
        itemId, 
        quantity, 
        auth.isAuthenticated ? undefined : sessionKey.value!
      )
      
      console.log('🔄 Fetching updated cart...')
      await fetchCart()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در بروزرسانی تعداد'
      console.error('❌ Update quantity error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeItem = async (itemId: number) => {
    console.log('🗑️ removeItem:', itemId)
    
    loading.value = true
    error.value = null
    
    try {
      const auth = useAuthStore()
      await cartService.removeItem(
        itemId, 
        auth.isAuthenticated ? undefined : sessionKey.value!
      )
      
      selectedItems.value = selectedItems.value.filter(id => id !== itemId)
      
      console.log('🔄 Fetching updated cart...')
      await fetchCart()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در حذف آیتم'
      console.error('❌ Remove item error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeSelectedItems = async () => {
    if (selectedItems.value.length === 0) return
    
    console.log('🗑️ removeSelectedItems:', selectedItems.value)
    
    loading.value = true
    error.value = null
    
    try {
      const promises = selectedItems.value.map(id => removeItem(id))
      await Promise.all(promises)
      selectedItems.value = []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در حذف آیتم‌ها'
      console.error('❌ Remove selected items error:', err)
    } finally {
      loading.value = false
    }
  }

  const mergeGuestCart = async (guestSessionKey: string) => {
    console.log('🔄 mergeGuestCart:', guestSessionKey)
    
    loading.value = true
    error.value = null
    
    try {
      const response = await cartService.mergeCart(guestSessionKey)
      console.log('✅ merge response:', response)
      
      localStorage.removeItem('session_key')
      sessionKey.value = null
      
      await fetchCart()
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در ادغام سبد خرید'
      console.error('❌ Merge cart error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    console.log('🧹 clearCart')
    
    loading.value = true
    error.value = null
    
    try {
      const auth = useAuthStore()
      await cartService.clearCart(
        auth.isAuthenticated ? undefined : sessionKey.value!
      )
      
      cart.value = null
      selectedItems.value = []
      console.log('✅ Cart cleared')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در پاک کردن سبد خرید'
      console.error('❌ Clear cart error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ========== Selection Methods ==========
  
  const syncSelectedItems = () => {
    const validItemIds = new Set(items.value.map(item => item.id))
    selectedItems.value = selectedItems.value.filter(id => validItemIds.has(id))
    console.log('🔄 syncSelectedItems completed, selected:', selectedItems.value)
  }

  const toggleItemSelection = (itemId: number) => {
    if (selectedItems.value.includes(itemId)) {
      selectedItems.value = selectedItems.value.filter(id => id !== itemId)
    } else {
      selectedItems.value.push(itemId)
    }
    console.log('✅ toggleItemSelection:', selectedItems.value)
  }

  const selectAll = () => {
    if (isAllSelected.value) {
      selectedItems.value = []
    } else {
      selectedItems.value = items.value.map(item => item.id)
    }
    console.log('✅ selectAll:', selectedItems.value)
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
    console.log('🔄 Resetting cart store')
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
