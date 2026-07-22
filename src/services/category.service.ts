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

    const find = (
      cats: Category[]
    ): Category | null => {
      for (const cat of cats) {
        if (cat.slug === slug) {
          return cat
        }

        if (cat.subcategories?.length) {
          const found = find(cat.subcategories)

          if (found) {
            return found
          }
        }
      }

      return null
    }

    const result = find(categories)

    if (!result) {
      throw new Error('دسته‌بندی یافت نشد')
    }

    return result
  },

  async getSubCategories(
    parentId: number
  ): Promise<Category[]> {
    const categories = await this.getCategories()

    const find = (
      cats: Category[]
    ): Category | null => {
      for (const cat of cats) {
        if (cat.id === parentId) {
          return cat
        }

        if (cat.subcategories?.length) {
          const found = find(cat.subcategories)

          if (found) {
            return found
          }
        }
      }

      return null
    }

    return find(categories)?.subcategories || []
  },

  async getCategoryPath(
    slug: string
  ): Promise<Category[]> {
    const categories = await this.getCategories()

    const findPath = (
      cats: Category[],
      path: Category[] = []
    ): Category[] | null => {
      for (const category of cats) {
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

    return findPath(categories) || []
  },
}import apiClient from '@/core/api/client'
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

    const find = (
      cats: Category[]
    ): Category | null => {
      for (const cat of cats) {
        if (cat.slug === slug) {
          return cat
        }

        if (cat.subcategories?.length) {
          const found = find(cat.subcategories)

          if (found) {
            return found
          }
        }
      }

      return null
    }

    const result = find(categories)

    if (!result) {
      throw new Error('دسته‌بندی یافت نشد')
    }

    return result
  },

  async getSubCategories(
    parentId: number
  ): Promise<Category[]> {
    const categories = await this.getCategories()

    const find = (
      cats: Category[]
    ): Category | null => {
      for (const cat of cats) {
        if (cat.id === parentId) {
          return cat
        }

        if (cat.subcategories?.length) {
          const found = find(cat.subcategories)

          if (found) {
            return found
          }
        }
      }

      return null
    }

    return find(categories)?.subcategories || []
  },

  async getCategoryPath(
    slug: string
  ): Promise<Category[]> {
    const categories = await this.getCategories()

    const findPath = (
      cats: Category[],
      path: Category[] = []
    ): Category[] | null => {
      for (const category of cats) {
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

    return findPath(categories) || []
  },
}
