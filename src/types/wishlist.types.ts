import type {
  Product,
} from '@/types/product.types'


export interface WishlistItem {
  id: number

  product: Product

  created_at: string
}
