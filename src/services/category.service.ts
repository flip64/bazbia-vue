// services/category.service.ts
import axios, { isAxiosError } from 'axios'
import type { Category } from '@/types/category.types'

const API_BASE_URL = 'https://backend.bazbia.ir/api'

export const categoryService = {
  /**
   * دریافت لیست دسته‌بندی‌ها (آرایه مستقیم)
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get<Category[]>(`${API_BASE_URL}/categories/`)
      console.log('📁 دسته‌بندی‌ها:', response.data)
      return response.data
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('❌ خطا در دریافت دسته‌بندی‌ها:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        })
        throw new Error(error.response?.data?.detail || 'خطا در دریافت دسته‌بندی‌ها')
      }
      throw error
    }
  },

  /**
   * دریافت یک دسته‌بندی با slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      // از اونجایی که API مستقیم با slug نداره، همه رو می‌گیریم و فیلتر می‌کنیم
      const categories = await this.getCategories()
      const findCategory = (cats: Category[]): Category | null => {
        for (const cat of cats) {
          if (cat.slug === slug) return cat
          if (cat.subcategories?.length) {
            const found = findCategory(cat.subcategories)
            if (found) return found
          }
        }
        return null
      }
      
      const category = findCategory(categories)
      if (!category) throw new Error('دسته‌بندی یافت نشد')
      return category
    } catch (error) {
      console.error(`❌ خطا در دریافت دسته‌بندی ${slug}:`, error)
      throw error
    }
  },

  /**
   * دریافت زیردسته‌های یک دسته‌بندی
   */
  async getSubCategories(parentId: number): Promise<Category[]> {
    try {
      const categories = await this.getCategories()
      
      const findCategory = (cats: Category[]): Category | null => {
        for (const cat of cats) {
          if (cat.id === parentId) return cat
          if (cat.subcategories?.length) {
            const found = findCategory(cat.subcategories)
            if (found) return found
          }
        }
        return null
      }
      
      const category = findCategory(categories)
      return category?.subcategories || []
    } catch (error) {
      console.error('❌ خطا در دریافت زیردسته‌ها:', error)
      return []
    }
  },

  /**
   * دریافت مسیر کامل یک دسته‌بندی (برای breadcrumb)
   */
  async getCategoryPath(slug: string): Promise<Category[]> {
    try {
      const categories = await this.getCategories()
      const path: Category[] = []
      
      const findPath = (cats: Category[], targetSlug: string): boolean => {
        for (const cat of cats) {
          if (cat.slug === targetSlug) {
            path.push(cat)
            return true
          }
          if (cat.subcategories?.length) {
            if (findPath(cat.subcategories, targetSlug)) {
              path.unshift(cat)
              return true
            }
          }
        }
        return false
      }
      
      findPath(categories, slug)
      return path
    } catch (error) {
      console.error('❌ خطا در دریافت مسیر دسته‌بندی:', error)
      return []
    }
  },

  /**
   * دریافت همه دسته‌بندی‌ها به صورت flat (بدون ساختار درختی)
   */
  getAllCategoriesFlat(categories: Category[]): Category[] {
    let flat: Category[] = []
    
    const flatten = (cats: Category[]) => {
      for (const cat of cats) {
        flat.push(cat)
        if (cat.subcategories?.length) {
          flatten(cat.subcategories)
        }
      }
    }
    
    flatten(categories)
    return flat
  }
}
