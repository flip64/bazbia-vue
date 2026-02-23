// types/product.types.ts

export interface Category {
  id: number
  name: string
  slug: string
  image: string | null
  parent_id?: number
  subcategories: Category[]
}

export interface Specification {
  name: string
  value: string
}

export interface Variant {
  id: number
  sku: string
  price: string  // price به صورت string میاد
  discount_price: string | null
  stock: number
  low_stock_threshold: number
  expiration_date: string | null
  attributes: any[]
}

export interface ProductImage {
  image: string
  source_url?: string
  alt_text: string | null
  is_main: boolean
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  base_price: string  // string هست نه number
  category: Category
  tags: string[]
  specifications: Specification[]
  variants: Variant[]
  images: ProductImage[]
  videos: any[]
  is_active: boolean
  created_at: string
  updated_at: string
  is_special: boolean
  special_details: any | null
  quantity: number  // موجودی کل
  
  // فیلدهای computed برای استفاده در فرانت
  price?: number
  discount_price?: number | null
  in_stock?: boolean
  thumb?: string
}

export interface ProductsResponse {
  count: number
  next: string | null
  previous: string | null
  current_page: number
  total_pages: number
  data: Product[]
}
