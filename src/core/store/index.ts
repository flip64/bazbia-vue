// src/core/store/index.ts
import { createPinia } from 'pinia'
export const store = createPinia()

export { useAuthStore } from './authStore'
export { useCartStore } from './cartStore'
// export { useWishlistStore } from './wishlistStore'
