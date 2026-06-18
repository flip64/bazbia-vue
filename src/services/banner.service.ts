
import apiClient from '@/core/api/client'
export const bannerService = {
  async getBanners() {
    const res = await apiClient.get('/promotions/banners/')
    return res.data
  }
}
