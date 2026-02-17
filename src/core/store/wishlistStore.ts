// src/core/store/wishlistStore.ts
import { defineStore } from 'pinia'

export interface WishlistItem {
  id: number
  name: string
  price: number
  image: string
  slug?: string
}

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as WishlistItem[]
  }),
  
  getters: {
    wishlistCount: (state) => state.items.length,
    
    isInWishlist: (state) => (productId: number) => {
      return state.items.some(item => item.id === productId)
    },
    
    wishlistItems: (state) => state.items
  },
  
  actions: {
    addToWishlist(product: WishlistItem) {
      if (!this.isInWishlist(product.id)) {
        this.items.push(product)
        this.saveToLocalStorage()
      }
    },
    
    removeFromWishlist(productId: number) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveToLocalStorage()
    },
    
    toggleWishlist(product: WishlistItem) {
      if (this.isInWishlist(product.id)) {
        this.removeFromWishlist(product.id)
      } else {
        this.addToWishlist(product)
      }
    },
    
    saveToLocalStorage() {
      localStorage.setItem('wishlist', JSON.stringify(this.items))
    },
    
    loadFromLocalStorage() {
      const saved = localStorage.getItem('wishlist')
      if (saved) {
        try {
          this.items = JSON.parse(saved)
        } catch {
          this.items = []
        }
      }
    }
  }
})
