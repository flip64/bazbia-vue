export interface Category {
  id: number
  name: string
  slug: string
  image: string
  subcategories: any[]
}

export interface Specification {
  name: string
  value: string
}

export interface Variant {
  id: number
  sku: string
  price: string
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

export interface ProductDetail {
  id: number
  name: string
  slug: string
  description: string
  base_price: string
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
  quantity: number
  }
