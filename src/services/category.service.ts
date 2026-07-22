import apiClient from '@/core/api/client'
import type { Category } from '@/types/category.types'

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const res = await apiClient.get<Category[]>(
        '/products/categories/'
      )

      return res.data
    } catch (error: any) {
      console.error(
        '❌ خطا در دریافت دسته‌بندی‌ها:',
        error
      )

      throw new Error(
        error.response?.data?.detail ||
        'خطا در دریافت دسته‌بندی‌ها'
      )
    }
  },

  async getCategoryBySlug(
    slug: string
  ): Promise<Category> {
    const categories = await this.getCategories()

    const findCategory = (
      items: Category[]
    ): Category | null => {
      for (const category of items) {
        if (category.slug === slug) {
          return category
        }

        if (category.subcategories?.length) {
          const result = findCategory(
            category.subcategories
          )

          if (result) {
            return result
          }
        }
      }

      return null
    }

    const result = findCategory(categories)

    if (!result) {
      throw new Error('دسته‌بندی یافت نشد')
    }

    return result
  },

  async getSubCategories(
    parentId: number
  ): Promise<Category[]> {
    const categories = await this.getCategories()

    const findCategory = (
      items: Category[]
    ): Category | null => {
      for (const category of items) {
        if (category.id === parentId) {
          return category
        }

        if (category.subcategories?.length) {
          const result = findCategory(
            category.subcategories
          )

          if (result) {
            return result
          }
        }
      }

      return null
    }

    return (
      findCategory(categories)?.subcategories ?? []
    )
  },

  async getCategoryPath(
    slug: string
  ): Promise<Category[]> {
    const categories = await this.getCategories()

    const findPath = (
      items: Category[],
      path: Category[] = []
    ): Category[] | null => {
      for (const category of items) {
        const currentPath = [
          ...path,
          category,
        ]

        if (category.slug === slug) {
          return currentPath
        }

        if (category.subcategories?.length) {
          const result = findPath(
            category.subcategories,
            currentPath
          )

          if (result) {
            return result
          }
        }
      }

      return null
    }

    return findPath(categories) ?? []
  },
}
