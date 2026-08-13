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

export interface ProductImage {
  image?: string | null
  source_url?: string | null
  alt_text?: string | null
  is_main?: boolean
}

export interface VariantAttribute {
  id: number
  attribute_name: string
  value: string
}

// =========================
// Variant (خیلی آزاد)
// =========================
export interface Variant {
  id: number
  sku?: string
  price: string | number
  discount_price?: string | number | null
  final_price?: string | number
  stock?: number
  in_stock?: boolean
  low_stock_threshold?: number
  expiration_date?: string | null
  label?: string
  attributes?: VariantAttribute[]
  images?: ProductImage[]

  // UI helpers
  name?: string
  in_stock?: boolean
  color_code?: string
  type?: string
}

export type ProductVariant = Variant

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
  images?: ProductImage[]
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

export interface ProductDetail extends Product {
  tags?: string[]
  specifications?: Array<{
    name: string
    value: string
  }>
  videos?: Array<{
    video: string
    caption?: string | null
  }>
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface ProductsQueryParams {
  page?: number
  category?: string
  search?: string
  ordering?: string
  in_stock?: boolean
  has_discount?: boolean
  min_price?: number
  max_price?: number
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
