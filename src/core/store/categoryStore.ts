import { defineStore } from "pinia"
import { categoryService } from "@/services/category.service"
import type { Category } from "@/types/category.types"

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    loaded: false,
    error: null as string | null,
  }),

  actions: {
    async fetchCategories(force = false) {
      // اگر قبلاً لود شده و force نیست → دوباره نزن
      if (this.loaded && !force) return

      this.loading = true
      this.error = null

      try {
        const data = await categoryService.getCategories()
        this.categories = data
        this.loaded = true

        console.log("📦 Categories loaded:", data)
      } catch (err: any) {
        this.error = err.message || "خطا در دریافت دسته‌بندی‌ها"
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    getBySlug(slug: string) {
      const find = (cats: Category[]): Category | null => {
        for (const c of cats) {
          if (c.slug === slug) return c
          if (c.subcategories?.length) {
            const result = find(c.subcategories)
            if (result) return result
          }
        }
        return null
      }

      return find(this.categories)
    },
  },

  getters: {
    flatCategories: (state) => {
      const flat: Category[] = []

      const walk = (cats: Category[]) => {
        for (const c of cats) {
          flat.push(c)
          if (c.subcategories?.length) {
            walk(c.subcategories)
          }
        }
      }

      walk(state.categories)
      return flat
    },
  },
})
