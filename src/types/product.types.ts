// src/types/product.types.ts
export interface Product {
  id: number
  name: string
  slug: string
  price: number
  discount_price: number | null
  category: string
  thumb: string
  variants: any | null
  created_at: string
}

export interface ProductsResponse {
  current_page: number
  total_pages: number
  count: number
  next: string | null
  previous: string | null
  data: Product[]
}

export interface ProductsQueryParams {
  page?: number
  category?: string
  search?: string
  ordering?: string
}
