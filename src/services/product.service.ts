async getLatestProducts(limit = 12) {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/`, {
      params: {
        page_size: limit,
        ordering: '-id' // یا newest اگر backend ساپورت کنه
      }
    })

    console.log("🆕 Latest products loaded")

    return (response.data.data ?? []).map(normalizeProduct)

  } catch (error) {
    console.error('❌ خطا در دریافت جدیدترین محصولات:', error)
    return []
  }
}
