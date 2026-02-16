// stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  // State
  const items = ref<CartItem[]>([])
  
  // Load cart from localStorage on init
  const loadCart = () => {
    const savedCart = localStorage.getItem('bazbia-cart')
    if (savedCart) {
      items.value = JSON.parse(savedCart)
    }
  }
  
  // Save cart to localStorage
  const saveCart = () => {
    localStorage.setItem('bazbia-cart', JSON.stringify(items.value))
  }
  
  // Getters
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
  
  // Actions
  const addItem = (product: any, quantity: number = 1, variant?: any) => {
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
        image: product.images[0],
        variant,
        maxStock: product.stock || 10
      })
    }
    
    saveCart()
  }
  
  const updateQuantity = (itemId: number, quantity: number) => {
    const item = items.value.find(i => i.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId)
      } else if (quantity <= item.maxStock) {
        item.quantity = quantity
        saveCart()
      }
    }
  }
  
  const removeItem = (itemId: number) => {
    items.value = items.value.filter(i => i.id !== itemId)
    saveCart()
  }
  
  const clearCart = () => {
    items.value = []
    saveCart()
  }
  
  // Initialize
  loadCart()
  
  return {
    // State
    items,
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
    clearCart
  }
})
