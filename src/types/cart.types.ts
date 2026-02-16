// src/types/cart.types.ts
export interface CartItem {
  id: number
  productId: number
  productName: string
  price: number
  quantity: number
  image: string
  variant?: string
  availableStock: number
}

export interface Cart {
  id: number
  userId: number
  items: CartItem[]
  totalPrice: number
  deliveryFee: number
  finalPrice: number
  createdAt?: string
  updatedAt?: string
}

export interface AddToCartDto {
  productId: number
  quantity: number
  variant?: string
}

export interface UpdateCartItemDto {
  quantity: number
}

export interface CartResponse {
  success: boolean
  data: Cart
  message?: string
}
