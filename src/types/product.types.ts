// =========================
// 🔹 CATEGORY
// =========================
export interface Category {
  id: number
  name: string
  slug: string
  image: string | null
  parent_id?: number
  subcategories: Category[]

  // computed (frontend)
  products_count?: number
}


// =========================
// 🔹 ATTRIBUTE (اختیاری برای variant)
// =========================
export interface AttributeValue {
  id: number
  attribute_name: string
  value: string
}


// =========================
// 🔹 VARIANT (طبق Django Serializer)
// =========================
export interface Variant {
  id: number
  sku: string
  price: string
  discount_price: string | null

  stock: number
  low_stock_threshold: number
  expiration_date: string | null

  attributes: AttributeValue[]

  // frontend computed
  name?: string
  in_stock?: boolean
  color_code?: string
  type?: string
}


// =========================
// 🔹 PRODUCT IMAGE
// =========================
export interface ProductImage {
  image: string
  source_url?: string
  alt_text: string | null
  is_main: boolean
}


// =========================
// 🔹 SPECIFICATION
// =========================
export interface Specification {
  name: string
  value: string
}


// =========================
// 🔹 PRODUCT (MAIN - sync with Django ProductSerializer)
// =========================
export interface Product {
  id: number
  name: string
  slug: string
  description: string
  base_price: string

  category: string | string[] | Category
  images: ProductImage[]
  variants: Variant[]
  thumb?: string

  created_at: string
  updated_at?: string

  quantity: number

  // computed backend (or frontend fallback)
  price?: number
  discount_price?: number | null
  in_stock?: number

  // frontend-only (used in UI)
  stock?: number
  rating?: number
  reviews_count?: number
  discount_percent?: number
  old_price?: number | string
  short_description?: string
  is_new?: boolean
}


// =========================
// 🔹 PRODUCT LIST RESPONSE
// =========================
export interface ProductsResponse {
  count: number
  next: string | null
  previous: string | null
  current_page: number
  total_pages: number
  data: Product[]
}
