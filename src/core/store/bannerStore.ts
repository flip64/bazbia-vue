import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bannerService } from '@/services/banner.service'
import type { Banner } from '@/types/banner.types'

export const useBannerStore = defineStore('banner', () => {
  // =====================
  // State
  // =====================
  const banners = ref<Banner[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // =====================
  // Getters
  // =====================
  const hasBanners = computed(() => banners.value.length > 0)
  const bannerCount = computed(() => banners.value.length)

  // =====================
  // Actions
  // =====================
  async function fetchBanners() {
    loading.value = true
    error.value = null

    try {
      banners.value = await bannerService.getBanners()
    } catch (err: any) {
      error.value = err.message || 'خطا در دریافت بنرها'
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    banners,
    loading,
    error,

    // getters
    hasBanners,
    bannerCount,

    // actions
    fetchBanners
  }
})
