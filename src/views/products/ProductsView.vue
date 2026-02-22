<!-- src/views/products/ProductsView.vue -->
<template>
  <div class="products-page">
    <!-- هدر صفحه -->
    <div class="products-header">
      <div class="products-header__container">
        <h1 class="products-header__title">محصولات</h1>
        <p class="products-header__count">{{ totalProducts }} محصول</p>
      </div>
    </div>

    <div class="products-container">
      <div class="products-layout">
        <!-- فیلترها -->
        <aside class="products-sidebar">
          <div class="filter-section">
            <h3>دسته‌بندی</h3>
            <select v-model="filters.category" @change="handleCategoryChange">
              <option value="">همه دسته‌ها</option>
              <option value="الکترونیک">الکترونیک</option>
              <option value="خانه">خانه</option>
              <option value="ورزشی">ورزشی</option>
            </select>
          </div>
        </aside>

        <!-- لیست محصولات -->
        <main class="products-main">
          <!-- مرتب‌سازی -->
          <div class="products-toolbar">
            <select v-model="filters.ordering" @change="handleOrderingChange">
              <option value="">مرتب‌سازی پیش‌فرض</option>
              <option value="price">ارزان‌ترین</option>
              <option value="-price">گران‌ترین</option>
              <option value="-created_at">جدیدترین</option>
            </select>
          </div>

          <!-- وضعیت بارگذاری -->
          <div v-if="loading" class="products-loading">
            <div class="spinner"></div>
            <p>در حال بارگذاری محصولات...</p>
          </div>

          <!-- لیست محصولات -->
          <div v-else-if="products.length" class="products-grid">
            <div v-for="product in products" :key="product.id" class="product-card">
              <router-link :to="`/product/${product.slug}`" class="product-card__link">
                <div class="product-card__image">
                  <img 
                    :src="getProductImage(product.thumb)" 
                    :alt="product.name"
                    loading="lazy"
                    @error="handleImageError"
                  >
                </div>
                <div class="product-card__content">
                  <h3 class="product-card__title">{{ product.name }}</h3>
                  <p class="product-card__category">{{ product.category }}</p>
                  <div class="product-card__price">
                    <span class="current-price">
                      {{ formatPrice(product.discount_price || product.price) }} تومان
                    </span>
                    <span v-if="product.discount_price" class="old-price">
                      {{ formatPrice(product.price) }} تومان
                    </span>
                  </div>
                </div>
              </router-link>
              <button 
                class="product-card__add-to-cart"
                @click="addToCart(product)"
                :disabled="!product.in_stock"
              >
                {{ product.in_stock ? 'افزودن به سبد خرید' : 'ناموجود' }}
              </button>
            </div>
          </div>

          <!-- حالت خالی -->
          <div v-else class="products-empty">
            <p>محصولی یافت نشد</p>
          </div>

          <!-- صفحه‌بندی -->
          <div v-if="pagination.total_pages > 1" class="products-pagination">
            <button 
              :disabled="pagination.current_page === 1"
              @click="handlePageChange(pagination.current_page - 1)"
            >
              قبلی
            </button>
            
            <span>صفحه {{ pagination.current_page }} از {{ pagination.total_pages }}</span>
            
            <button 
              :disabled="pagination.current_page === pagination.total_pages"
              @click="handlePageChange(pagination.current_page + 1)"
            >
              بعدی
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/core/store/cartStore'
import type { Product, ProductsResponse } from '@/types/product.types'

// ========== Router ==========
const router = useRouter()

// ========== Stores ==========
const cartStore = useCartStore()

// ========== State ==========
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = reactive({
  current_page: 1,
  total_pages: 1,
  total_products: 0
})

const filters = reactive({
  category: '',
  ordering: ''
})

// ========== Computed ==========
const totalProducts = computed(() => pagination.total_products)

// ========== Methods ==========

/**
 * بارگذاری محصولات
 */
const loadProducts = async (page: number = 1) => {
  console.log('📦 ====== PRODUCTS VIEW ======')
  console.log('📊 بارگذاری محصولات - صفحه:', page)
  console.log('🔍 فیلترها:', filters)
  
  loading.value = true
  error.value = null
  
  try {
    const params: any = {
      page,
      ...(filters.category && { category: filters.category }),
      ...(filters.ordering && { ordering: filters.ordering })
    }
    
    console.log('📡 ارسال درخواست با پارامترها:', params)
    
    const response = await productService.getProducts(params)
    
    console.log('✅ پاسخ دریافت شد:', {
      count: response.count,
      current_page: response.current_page,
      total_pages: response.total_pages,
      products_count: response.data.length
    })
    
    products.value = response.data
    pagination.current_page = response.current_page
    pagination.total_pages = response.total_pages
    pagination.total_products = response.count
    
    console.log('📋 محصولات:', products.value.map(p => ({ id: p.id, name: p.name })))
    
  } catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری محصولات'
    console.error('❌ خطا:', err)
  } finally {
    loading.value = false
    console.log('🏁 بارگذاری کامل شد')
  }
}

/**
 * تغییر دسته‌بندی
 */
const handleCategoryChange = () => {
  console.log('🔽 تغییر دسته‌بندی به:', filters.category)
  loadProducts(1)
}

/**
 * تغییر مرتب‌سازی
 */
const handleOrderingChange = () => {
  console.log('🔽 تغییر مرتب‌سازی به:', filters.ordering)
  loadProducts(1)
}

/**
 * تغییر صفحه
 */
const handlePageChange = (page: number) => {
  console.log('📄 تغییر صفحه به:', page)
  loadProducts(page)
}

/**
 * فرمت قیمت
 */
const formatPrice = (price: number) => {
  return productService.formatPrice(price)
}

/**
 * دریافت آدرس تصویر
 */
const getProductImage = (thumb: string) => {
  return productService.getProductImageUrl(thumb)
}

/**
 * مدیریت خطای تصویر
 */
const handleImageError = (e: Event) => {
  console.log('🖼️ خطا در لود تصویر')
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/300x300?text=عکس+موجود+نیست'
}

/**
 * افزودن به سبد خرید
 */
const addToCart = async (product: Product) => {
  console.log('🛒 ====== ADD TO CART ======')
  console.log('🆔 محصول:', product.id)
  console.log('📝 نام محصول:', product.name)
  console.log('💰 قیمت:', product.price)
  console.log('🔢 موجودی:', product.in_stock)
  
  if (!product.in_stock) {
    console.log('❌ محصول ناموجود است')
    alert('این محصول موجود نیست')
    return
  }
  
  // انتخاب اولین واریانت (اگه محصول واریانت داره)
  let variantId = product.id
  console.log("varua" ,product.variants )
  if (product.variants && product.variants.length > 0) {
    variantId = product.variants[0].id
    console.log('🎨 استفاده از واریانت:', {
      id: variantId,
      name: product.variants[0].name
    })
  }
  console.log('📦 درخواست افزودن به سبد خرید:', {
    variant_id: variantId,
    quantity: 1
  })
  
  try {
    await cartStore.addItem({
      variant_id: variantId,
      quantity: 1
    })
    
    console.log('✅ محصول با موفقیت به سبد خرید اضافه شد')
    
    // نمایش پیام موفقیت
    alert('محصول به سبد خرید اضافه شد')
    
  } catch (error: any) {
    console.error('❌ خطا در افزودن به سبد خرید:', error)
    alert(error.message || 'خطا در افزودن به سبد خرید')
  }
  
  console.log('🏁 ====== END ADD TO CART ======')
}

// ========== Lifecycle ==========
onMounted(() => {
  console.log('🔥 ProductsView mounted')
  loadProducts()
})
</script>

<style scoped>
/* استایل‌های قبلی */
.products-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.products-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;
}

.products-header__title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.products-header__count {
  font-size: 1.1rem;
  opacity: 0.9;
}

.products-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

.products-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.products-sidebar {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.filter-section h3 {
  color: #374151;
  margin-bottom: 1rem;
}

.filter-section select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
}

.products-toolbar {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-end;
}

.products-toolbar select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.product-card__link {
  text-decoration: none;
  color: inherit;
  flex: 1;
}

.product-card__image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-card__image img {
  transform: scale(1.05);
}

.product-card__content {
  padding: 1rem;
}

.product-card__title {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.product-card__category {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.product-card__price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #667eea;
}

.old-price {
  font-size: 0.85rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.product-card__add-to-cart {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: auto;
}

.product-card__add-to-cart:hover:not(:disabled) {
  background: #5a67d8;
}

.product-card__add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.products-loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.products-empty {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.products-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.products-pagination button {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.products-pagination button:hover:not(:disabled) {
  background: #f3f4f6;
}

.products-pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .products-layout {
    grid-template-columns: 1fr;
  }

  .products-header__title {
    font-size: 2rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
}
</style>
