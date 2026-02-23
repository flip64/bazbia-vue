// types/category.types.ts
export interface Category {
  id: number
  name: string
  slug: string
  image: string | null
  parent_id?: number | null
  subcategories: Category[]  // آرایه‌ای از زیردسته‌ها
}

// API مستقیم آرایه برمی‌گردونه، نه object با results
export type CategoriesResponse = Category[]
