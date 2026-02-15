<template>
  <div class="products-page">
    <!-- هدر صفحه -->
    <div class="products-header">
      <div class="products-header__container">
        <h1 class="products-header__title">محصولات</h1>
        <nav class="products-breadcrumb">
          <router-link to="/" class="products-breadcrumb__link">خانه</router-link>
          <span class="products-breadcrumb__separator">/</span>
          <span class="products-breadcrumb__current">محصولات</span>
        </nav>
      </div>
    </div>

    <div class="products-container">
      <div class="products-layout">
        <!-- سایدبار فیلترها -->
        <aside class="products-sidebar" :class="{ 'products-sidebar--open': isFilterOpen }">
          <div class="product-filters">
            <div class="product-filters__header">
              <h3 class="product-filters__title">فیلترها</h3>
              <button class="product-filters__close" @click="isFilterOpen = false">✕</button>
            </div>

            <!-- دسته‌بندی‌ها -->
            <div class="product-filters__section">
              <h4 class="product-filters__section-title">دسته‌بندی</h4>
              <div class="product-filters__options">
                <label v-for="category in categories" :key="category.id" class="product-filters__option">
                  <input type="checkbox" v-model="selectedCategories" :value="category.name">
                  <span>{{ category.name }} ({{ category.count }})</span>
                </label>
              </div>
            </div>

            <!-- برندها -->
            <div class="product-filters__section">
              <h4 class="product-filters__section-title">برند</h4>
              <div class="product-filters__options">
                <label v-for="brand in brands" :key="brand.id" class="product-filters__option">
                  <input type="checkbox" v-model="selectedBrands" :value="brand.name">
                  <span>{{ brand.name }} ({{ brand.count }})</span>
                </label>
              </div>
            </div>

            <!-- محدوده قیمت -->
            <div class="product-filters__section">
              <h4 class="product-filters__section-title">محدوده قیمت</h4>
              <div class="product-filters__price-range">
                <div class="product-filters__price-inputs">
                  <input type="number" v-model.number="minPrice" placeholder="از">
                  <span>تا</span>
                  <input type="number" v-model.number="maxPrice" placeholder="تا">
                </div>
              </div>
            </div>

            <!-- دکمه اعمال فیلتر -->
            <button class="product-filters__apply" @click="applyFilters">
              اعمال فیلتر
            </button>
          </div>
        </aside>

        <!-- محتوای اصلی -->
        <main class="products-main">
          <!-- نوار ابزار -->
          <div class="products-toolbar">
            <button class="products-filter-toggle" @click="isFilterOpen = true">
              <span>☰</span>
              <span>فیلترها</span>
            </button>

            <div class="products-view-options">
              <button 
                class="products-view-option" 
                :class="{ 'products-view-option--active': viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                ☷
              </button>
              <button 
                class="products-view-option" 
                :class="{ 'products-view-option--active': viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                ≡
              </button>
            </div>

            <select v-model="sortBy" class="products-sort">
              <option value="newest">جدیدترین</option>
              <option value="popular">محبوب‌ترین</option>
              <option value="cheapest">ارزان‌ترین</option>
              <option value="expensive">گران‌ترین</option>
            </select>
          </div>

          <!-- تعداد محصولات -->
          <div class="products-count">
            <span>{{ totalProducts }} محصول یافت شد</span>
          </div>

          <!-- لیست محصولات -->
          <div v-if="loading" class="products-loading">
            <div class="products-loading__spinner"></div>
            <p>در حال بارگذاری محصولات...</p>
          </div>

          <div v-else-if="products.length === 0" class="products-empty">
            <p>محصولی یافت نشد</p>
            <button @click="resetFilters" class="products-empty__btn">حذف فیلترها</button>
          </div>

          <div v-else :class="['products-grid', `products-grid--${viewMode}`]">
            <div v-for="product in products" :key="product.id" class="product-card">
              <div class="product-card__image-wrapper">
                <router-link :to="`/product/${product.id}`">
                  <img :src="product.image" :alt="product.name" class="product-card__image">
                </router-link>
                
                <div class="product-card__badges">
                  <span v-if="product.discount" class="product-card__badge product-card__badge--discount">
                    {{ product.discount }}% تخفیف
                  </span>
                </div>
              </div>

              <div class="product-card__content">
                <router-link :to="`/product/${product.id}`" class="product-card__title">
                  {{ product.name }}
                </router-link>

                <div class="product-card__rating">
                  <span class="product-card__stars">{{ '★'.repeat(product.rating) }}{{ '☆'.repeat(5-product.rating) }}</span>
                  <span class="product-card__reviews">({{ product.reviewCount }})</span>
                </div>

                <div class="product-card__prices">
                  <span class="product-card__price">{{ formatPrice(product.price) }} تومان</span>
                  <span v-if="product.oldPrice" class="product-card__old-price">
                    {{ formatPrice(product.oldPrice) }} تومان
                  </span>
                </div>

                <button class="product-card__add-to-cart" @click="addToCart(product.id)">
                  افزودن به سبد خرید
                </button>
              </div>
            </div>
          </div>

          <!-- صفحه‌بندی -->
          <div v-if="totalPages > 1" class="products-pagination">
            <button 
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              قبلی
            </button>

            <div class="pagination-pages">
              <button 
                v-for="page in displayedPages" 
                :key="page"
                class="pagination-page"
                :class="{ 'pagination-page--active': page === currentPage }"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </div>

            <button 
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
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
import { ref, computed, onMounted } from 'vue'

// State
const loading = ref(false)
const products = ref<any[]>([])
const totalProducts = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const viewMode = ref<'grid' | 'list'>('grid')
const isFilterOpen = ref(false)
const sortBy = ref('newest')

// فیلترها
const selectedCategories = ref<string[]>([])
const selectedBrands = ref<string[]>([])
const minPrice = ref(0)
const maxPrice = ref(10000000)

// داده‌های نمونه
const categories = ref([
  { id: 1, name: 'الکترونیک', count: 45 },
  { id: 2, name: 'پوشاک', count: 32 },
  { id: 3, name: 'کتاب', count: 28 },
])

const brands = ref([
  { id: 1, name: 'سامسونگ', count: 23 },
  { id: 2, name: 'اپل', count: 18 },
  { id: 3, name: 'شیائومی', count: 15 },
])

// صفحه‌بندی
const displayedPages = computed(() => {
  const delta = 2
  const range = []
  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
      range.push(i)
    }
  }
  return range
})

// متدها
const formatPrice = (price: number) => {
  return price.toLocaleString('fa-IR')
}

const fetchProducts = async () => {
  loading.value = true
  try {
    // داده‌های نمونه
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const sampleProducts = []
    for (let i = 1; i <= 12; i++) {
      sampleProducts.push({
        id: i,
        name: `محصول ${i}`,
        price: Math.floor(Math.random() * 5000000) + 100000,
        oldPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 6000000) + 200000 : undefined,
        image: `https://via.placeholder.com/300x300?text=Product+${i}`,
        rating: Math.floor(Math.random() * 5) + 1,
        reviewCount: Math.floor(Math.random() * 100) + 1,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : undefined,
      })
    }
    
    products.value = sampleProducts
    totalProducts.value = 156
    totalPages.value = 13
  } catch (error) {
    console.error('خطا در دریافت محصولات:', error)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchProducts()
  isFilterOpen.value = false
}

const resetFilters = () => {
  selectedCategories.value = []
  selectedBrands.value = []
  minPrice.value = 0
  maxPrice.value = 10000000
  applyFilters()
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const addToCart = (productId: number) => {
  console.log('افزودن به سبد خرید:', productId)
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.products-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.products-header__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.products-header__title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.products-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.products-breadcrumb__link {
  color: white;
  text-decoration: none;
}

.products-breadcrumb__link:hover {
  text-decoration: underline;
}

.products-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.products-sidebar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.product-filters {
  padding: 1.5rem;
}

.product-filters__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.product-filters__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}

.product-filters__close {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.product-filters__section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.product-filters__section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.product-filters__options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-filters__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #4b5563;
  font-size: 0.95rem;
}

.product-filters__option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.product-filters__price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-filters__price-inputs input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
}

.product-filters__apply {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.product-filters__apply:hover {
  background: #5a67d8;
}

.products-main {
  min-width: 0;
}

.products-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.products-filter-toggle {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
}

.products-view-options {
  display: flex;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.25rem;
}

.products-view-option {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.3s ease;
}

.products-view-option:hover {
  background: #f3f4f6;
}

.products-view-option--active {
  background: #667eea;
  color: white;
}

.products-sort {
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  cursor: pointer;
}

.products-count {
  margin-bottom: 1.5rem;
  color: #6b7280;
}

.products-loading {
  text-align: center;
  padding: 3rem;
}

.products-loading__spinner {
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
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
}

.products-empty p {
  color: #6b7280;
  margin-bottom: 1rem;
}

.products-empty__btn {
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.products-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.products-grid--grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.products-grid--list {
  grid-template-columns: 1fr;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.product-card__image-wrapper {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.product-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

.product-card__badges {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-card__badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
}

.product-card__badge--discount {
  background: #ef4444;
}

.product-card__content {
  padding: 1.5rem;
}

.product-card__title {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  margin-bottom: 0.5rem;
}

.product-card__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.product-card__stars {
  color: #fbbf24;
}

.product-card__reviews {
  font-size: 0.85rem;
  color: #6b7280;
}

.product-card__prices {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.product-card__price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #374151;
}

.product-card__old-price {
  font-size: 0.95rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.product-card__add-to-cart {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.product-card__add-to-cart:hover {
  background: #5a67d8;
}

.products-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.5rem;
}

.pagination-page {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-page:hover {
  background: #f3f4f6;
}

.pagination-page--active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

@media (max-width: 768px) {
  .products-layout {
    grid-template-columns: 1fr;
  }

  .products-sidebar {
    position: fixed;
    top: 0;
    right: -100%;
    bottom: 0;
    width: 280px;
    z-index: 1100;
    border-radius: 0;
    transition: right 0.3s ease;
    overflow-y: auto;
  }

  .products-sidebar--open {
    right: 0;
  }

  .product-filters__close {
    display: block;
  }

  .products-filter-toggle {
    display: flex;
  }
}
</style>
