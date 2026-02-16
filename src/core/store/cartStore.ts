// stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService } from '@/services/cart.service'
import type { Cart, CartItem as ApiCartItem } from '@/types/cart.types'

export interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  image: string
  variant?: {
    color: string
    size?: string
  }
  maxStock: number
}

export const useCartStore = defineStore('cart', () => {
  // ========== State ==========
  const items = ref<CartItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isOnline = ref(false) // false = localStorage, true = API
  
  // ========== LocalStorage Methods ==========
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('bazbia-cart')
      if (savedCart) {
        items.value = JSON.parse(savedCart)
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err)
    }
  }
  
  const saveCartToStorage = () => {
    try {
      localStorage.setItem('bazbia-cart', JSON.stringify(items.value))
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err)
    }
  }
  
  // ========== API Methods ==========
  const convertApiItemToCartItem = (apiItem: any): CartItem => {
    return {
      id: apiItem.id,
      productId: apiItem.productId,
      name: apiItem.productName,
      price: apiItem.price,
      quantity: apiItem.quantity,
      image: apiItem.image,
      variant: apiItem.variant ? { color: apiItem.variant } : undefined,
      maxStock: apiItem.availableStock
    }
  }
  
  const convertCartItemToApiDto = (item: CartItem, quantity: number = item.quantity) => {
    return {
      productId: item.productId,
      quantity,
      variant: item.variant?.color
    }
  }
  
  // دریافت سبد خرید از API
  const fetchCart = async () => {
    if (!isOnline.value) return
    
    loading.value = true
    error.value = null
    
    try {
      const cart = await cartService.getCart()
      items.value = cart.items.map(convertApiItemToCartItem)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'خطا در دریافت سبد خرید'
      console.error('Fetch cart error:', err)
    } finally {
      loading.value = false
    }
  }
  
  // ========== Getters ==========
  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )
  
  const totalPrice = computed(() => 
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )
  
  const shippingCost = computed(() => {
    return totalPrice.value > 500000 ? 0 : 30000
  })
  
  const finalPrice = computed(() => totalPrice.value + shippingCost.value)
  
  const isEmpty = computed(() => items.value.length === 0)
  
  // ========== Actions ==========
  
  // افزودن آیتم (هم API هم localStorage)
  const addItem = async (product: any, quantity: number = 1, variant?: any) => {
    loading.value = true
    error.value = null
    
    try {
      if (isOnline.value) {
        // حالت آنلاین - ارسال به API
        await cartService.addToCart({
          productId: product.id,
          quantity,
          variant: variant?.color
        })
        await fetchCart() // دریافت مجدد سبد خرید
      } else {
        // حالت آفلاین - ذخیره در localStorage
        const existingItem = items.value.find(item => 
          item.productId === product.id && 
          JSON.stringify(item.variant) === JSON.stringify(variant)
        )
        
        if (existingItem) {
          if (existingItem.quantity + quantity <= existingItem.maxStock) {
            existingItem.quantity += quantity
          } else {
            throw new Error('موجودی انبار کافی نیست')
          }
        } else {
          items.value.push({
            id: Date.now(),
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images?.[0] || product.image,
            variant,
            maxStock: product.stock || 10
          })
        }
        
        saveCartToStorage()
      }
    } catch (err: any) {
      error.value = err.message || 'خطا در افزودن به سبد خرید'
      console.error('Add item error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // بروزرسانی تعداد
  const updateQuantity = async (itemId: number, quantity: number) => {
    loading.value = true
    error.value = null
    
    try {
      if (isOnline.value) {
        // حالت آنلاین
        await cartService.updateCartItem(itemId, { quantity })
        await fetchCart()
      } else {
        // حالت آفلاین
        const item = items.value.find(i => i.id === itemId)
        if (item) {
          if (quantity <= 0) {
            await removeItem(itemId)
          } else if (quantity <= item.maxStock) {
            item.quantity = quantity
            saveCartToStorage()
          }
        }
      }
    } catch (err: any) {
      error.value = err.message || 'خطا در بروزرسانی سبد خرید'
      console.error('Update quantity error:', err)
    } finally {
      loading.value = false
    }
  }
  
  // حذف آیتم
  const removeItem = async (itemId: number) => {
    loading.value = true
    error.value = null
    
    try {
      if (isOnline.value) {
        // حالت آنلاین
        await cartService.removeCartItem(itemId)
        await fetchCart()
      } else {
        // حالت آفلاین
        items.value = items.value.filter(i => i.id !== itemId)
        saveCartToStorage()
      }
    } catch (err: any) {
      error.value = err.message || 'خطا در حذف از سبد خرید'
      console.error('Remove item error:', err)
    } finally {
      loading.value = false
    }
  }
  
  // خالی کردن سبد خرید
  const clearCart = async () => {
    loading.value = true
    error.value = null
    
    try {
      if (isOnline.value) {
        // حالت آنلاین
        await cartService.clearCart()
        items.value = []
      } else {
        // حالت آفلاین
        items.value = []
        saveCartToStorage()
      }
    } catch (err: any) {
      error.value = err.message || 'خطا در خالی کردن سبد خرید'
      console.error('Clear cart error:', err)
    } finally {
      loading.value = false
    }
  }
  
  // سوییچ بین حالت آنلاین/آفلاین
  const setOnlineMode = async (online: boolean) => {
    isOnline.value = online
    
    if (online) {
      // اگر قبلاً آیتم‌هایی در localStorage داشتیم،
      // می‌توانیم منطق sync رو اینجا پیاده‌سازی کنیم
      if (items.value.length > 0) {
        // TODO: Sync local items with server
        console.log('Syncing local items with server...')
      }
      await fetchCart()
    } else {
      loadCartFromStorage()
    }
  }
  
  // ========== Initialize ==========
  // شروع با حالت آفلاین
  loadCartFromStorage()
  
  return {
    // State
    items,
    loading,
    error,
    isOnline,
    
    // Getters
    totalItems,
    totalPrice,
    shippingCost,
    finalPrice,
    isEmpty,
    
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart,
    setOnlineMode
  }
})
