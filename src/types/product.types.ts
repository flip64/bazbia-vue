// =========================
// Category (ساده شده)
// =========================
export interface Category {
  id: number
  name: string
  slug: string
  image?: string | null
  parent_id?: number
  subcategories?: Category[]
  products_count?: number
}

// =========================
// Variant (خیلی آزاد)
// =========================
export interface Variant {
  id: number
  sku?: string
  price: string | number
  discount_price?: string | number | null
  stock?: number
  low_stock_threshold?: number
  expiration_date?: string | null
  attributes?: any[]

  // UI helpers
  name?: string
  in_stock?: boolean
  color_code?: string
  type?: string
}

// =========================
// Product (کاملاً flexible)
// =========================
export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  base_price: string | number

  category?: any
  images?: any[]
  variants?: Variant[]

  thumb?: string
  quantity?: number

  // UI / optional fields (برای جلوگیری از error)
  price?: number
  discount_price?: number
  in_stock?: boolean

  stock?: number
  rating?: number
  reviews_count?: number
  discount_percent?: number
  old_price?: number
  short_description?: string
  is_new?: boolean

  [key: string]: any
}

// =========================
export interface ProductsResponse {
  count?: number
  next?: string | null
  previous?: string | null
  current_page?: number
  total_pages?: number
  data?: Product[]
}
