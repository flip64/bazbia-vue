<!-- src/views/products/ProductsView.vue -->
<template>
  <div class="products-page">
    <!-- هدر با جستجو -->
    <div class="products-header">
      <div class="header-content">
        <h1 class="page-title">✨ فروشگاه تخصصی</h1>
        <p class="page-subtitle">بهترین محصولات با بهترین قیمت‌ها</p>
        
        <!-- نوار جستجو -->
        <div class="search-box">
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="جستجوی محصول مورد نظر..."
            @input="handleSearch"
            class="search-input"
          />
          <button class="search-btn">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" stroke-width="2"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- مسیر دسته‌بندی -->
      <nav class="breadcrumb" v-if="categoryPath.length">
        <router-link to="/" class="breadcrumb-link">
          <svg class="home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 10L12 3L21 10V20H3V10Z" stroke-width="2"/>
          </svg>
        </router-link>
        <span class="separator">›</span>
        <router-link to="/products" class="breadcrumb-link">محصولات</router-link>
        <span v-for="(cat, index) in categoryPath" :key="cat.id" class="breadcrumb-item">
          <span class="separator">›</span>
          <span class="breadcrumb-current">{{ cat.name }}</span>
        </span>
      </nav>

      <!-- فیلترهای سریع -->
      <div class="quick-filters">
        <button 
          v-for="filter in quickFilters" 
          :key="filter.value"
          class="quick-filter-btn"
          :class="{ active: filters.ordering === filter.value }"
          @click="setQuickFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- بخش اصلی -->
      <div class="products-layout">
        <!-- سایدبار فیلتر -->
        <aside class="filter-sidebar" :class="{ 'mobile-open': showFilters }">
          <div class="sidebar-header">
            <h3 class="sidebar-title">فیلترها</h3>
            <button class="close-filters" @click="showFilters = false">✕</button>
          </div>

          <!-- دسته‌بندی‌ها -->
          <div class="filter-section">
            <h4 class="filter-title">دسته‌بندی‌ها</h4>
            <div class="filter-search">
              <input 
                v-model="categorySearch" 
                type="text" 
                placeholder="جستجوی دسته‌بندی..."
                class="filter-search-input"
              />
            </div>
            <div v-if="loadingCategories" class="filter-loading">
              <div class="spinner"></div>
            </div>
            <div v-else class="categories-list">
              <div 
                v-for="category in filteredCategories" 
                :key="category.id"
                class="category-item"
                :class="{ 'has-children': category.subcategories?.length }"
              >
                <div class="category-row" @click="toggleCategory(category)">
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-count">({{ category.products_count || 0 }})</span>
                  <svg 
                    v-if="category.subcategories?.length" 
                    class="chevron" 
                    :class="{ rotated: expandedCategories.includes(category.id) }"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <polyline points="6 9 12 15 18 9" stroke-width="2"/>
                  </svg>
                </div>
                
                <!-- زیردسته‌ها -->
                <div 
                  v-if="category.subcategories?.length && expandedCategories.includes(category.id)"
                  class="subcategories"
                >
                  <div 
                    v-for="sub in category.subcategories" 
                    :key="sub.id"
                    class="subcategory-item"
                    @click="selectCategory(sub.slug)"
                  >
                    <span>{{ sub.name }}</span>
                    <span>({{ sub.products_count || 0 }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- فیلتر قیمت -->
          <div class="filter-section">
            <h4 class="filter-title">محدوده قیمت</h4>
            <div class="price-range">
              <div class="price-inputs">
                <div class="price-input">
                  <label>از</label>
                  <input 
                    type="number" 
                    v-model="priceRange.min" 
                    placeholder="0"
                    class="price-field"
                  />
                </div>
                <span class="price-sep">تا</span>
                <div class="price-input">
                  <label>تا</label>
                  <input 
                    type="number" 
                    v-model="priceRange.max" 
                    placeholder="نامحدود"
                    class="price-field"
                  />
                </div>
              </div>
              <button class="apply-price" @click="applyPriceFilter">اعمال</button>
            </div>
          </div>

          <!-- فیلتر موجودی -->
          <div class="filter-section">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="filters.inStock" 
                @change="loadProducts(1)"
              />
              <span>فقط محصولات موجود</span>
            </label>
          </div>

          <!-- فیلتر تخفیف دار -->
          <div class="filter-section">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="filters.hasDiscount" 
                @change="loadProducts(1)"
              />
              <span>محصولات با تخفیف</span>
            </label>
          </div>

          <!-- دکمه پاک کردن فیلترها -->
          <button class="clear-filters" @click="clearAllFilters">
            پاک کردن همه فیلترها
          </button>
        </aside>

        <!-- بخش محصولات -->
        <main class="products-main">
          <!-- نوار ابزار -->
          <div class="products-toolbar">
            <div class="toolbar-left">
              <button class="filter-toggle" @click="showFilters = true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                  <line x1="9" y1="9" x2="15" y2="9" stroke-width="2"/>
                  <line x1="9" y1="15" x2="15" y2="15" stroke-width="2"/>
                </svg>
                <span>فیلترها</span>
              </button>
              
              <span class="products-count">
                {{ pagination.total_products.toLocaleString('fa-IR') }} محصول
              </span>
            </div>

            <div class="toolbar-right">
              <select v-model="filters.ordering" @change="loadProducts(1)" class="sort-select">
                <option value="">پیش‌فرض</option>
                <option value="-created_at">جدیدترین</option>
                <option value="-sold">پرفروش‌ترین</option>
                <option value="price">قیمت: کم به زیاد</option>
                <option value="-price">قیمت: زیاد به کم</option>
                <option value="-discount">بیشترین تخفیف</option>
              </select>

              <div class="view-toggle">
                <button 
                  class="view-btn" 
                  :class="{ active: viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="7" height="7" stroke-width="2"/>
                    <rect x="14" y="3" width="7" height="7" stroke-width="2"/>
                    <rect x="3" y="14" width="7" height="7" stroke-width="2"/>
                    <rect x="14" y="14" width="7" height="7" stroke-width="2"/>
                  </svg>
                </button>
                <button 
                  class="view-btn" 
                  :class="{ active: viewMode === 'list' }"
                  @click="viewMode = 'list'"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="3" y1="6" x2="21" y2="6" stroke-width="2"/>
                    <line x1="3" y1="12" x2="21" y2="12" stroke-width="2"/>
                    <line x1="3" y1="18" x2="21" y2="18" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- نتایج -->
          <div v-if="loading" class="loading-state">
            <div class="spinner-large"></div>
            <p>در حال بارگذاری محصولات...</p>
          </div>

          <div v-else-if="error" class="error-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke-width="1.5"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            <h3>خطا در بارگذاری</h3>
            <p>{{ error }}</p>
            <button @click="retryLoad" class="retry-btn">تلاش مجدد</button>
          </div>

          <div v-else-if="!products.length" class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
              <path d="M8 12h8" stroke-width="1.5"/>
            </svg>
            <h3>محصولی یافت نشد</h3>
            <p>هیچ محصولی با این مشخصات وجود ندارد</p>
            <button @click="clearAllFilters" class="clear-filters-btn">پاک کردن فیلترها</button>
          </div>

          <!-- نمایش محصولات - گرید یا لیست -->
          <div v-else :class="['products-container', viewMode]">
            <div 
              v-for="product in products" 
              :key="product.id" 
              class="product-item"
            >
              <!-- حالت گرید -->
              <template v-if="viewMode === 'grid'">
                <div class="product-card">
                  <!-- برچسب‌ها -->
                  <div class="product-badges">
                    <span v-if="product.discount_percent > 0" class="badge discount">
                      {{ product.discount_percent }}% تخفیف
                    </span>
                    <span v-if="product.is_new" class="badge new">جدید</span>
                    <span v-if="product.stock < 5" class="badge stock">
                      فقط {{ product.stock }} عدد
                    </span>
                  </div>

                  <!-- تصویر -->
                  <router-link :to="`/product/${product.slug}`" class="product-image">
                    <img 
                      :src="product.thumb || '/images/placeholder.jpg'" 
                      :alt="product.name"
                      loading="lazy"
                    />
                    <button 
                      v-if="product.stock > 0"
                      class="quick-add"
                      @click.prevent="quickAddToCart(product)"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
                      </svg>
                    </button>
                  </router-link>

                  <!-- اطلاعات -->
                  <div class="product-info">
                    <router-link :to="`/products/${product.slug}`" class="product-name">
                      {{ product.name }}
                    </router-link>
                    
                    <div class="product-rating">
                      <div class="stars">
                        <span 
                          v-for="star in 5" 
                          :key="star"
                          class="star"
                          :class="{ filled: star <= Math.round(product.rating || 0) }"
                        >★</span>
                      </div>
                      <span class="rating-count">({{ product.reviews_count || 0 }})</span>
                    </div>

                    <div class="product-price">
                      <span class="current-price">
                        {{ product.price.toLocaleString('fa-IR') }}
                      </span>
                      <span class="currency">تومان</span>
                      <span v-if="product.discount_percent > 0" class="old-price">
                        {{ product.old_price?.toLocaleString('fa-IR') }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>

              <!-- حالت لیست -->
              <template v-else>
                <div class="product-list-item">
                  <router-link :to="`/products/${product.slug}`" class="list-image">
                    <img 
                      :src="product.thumb || '/images/placeholder.jpg'" 
                      :alt="product.name"
                      loading="lazy"
                    />
                  </router-link>

                  <div class="list-content">
                    <div class="list-header">
                      <router-link :to="`/products/${product.slug}`" class="list-title">
                        {{ product.name }}
                      </router-link>
                      <div class="list-badges">
                        <span v-if="product.discount_percent > 0" class="badge discount">
                          {{ product.discount_percent }}% تخفیف
                        </span>
                        <span v-if="product.stock < 5" class="badge stock">
                          فقط {{ product.stock }} عدد
                        </span>
                      </div>
                    </div>

                    <p class="list-description">{{ product.short_description }}</p>

                    <div class="list-rating">
                      <div class="stars">
                        <span 
                          v-for="star in 5" 
                          :key="star"
                          class="star"
                          :class="{ filled: star <= Math.round(product.rating || 0) }"
                        >★</span>
                      </div>
                      <span>({{ product.reviews_count || 0 }} نظر)</span>
                    </div>

                    <div class="list-footer">
                      <div class="list-price">
                        <span class="price-current">
                          {{ product.price.toLocaleString('fa-IR') }}
                        </span>
                        <span class="currency">تومان</span>
                        <span v-if="product.discount_percent > 0" class="price-old">
                          {{ product.old_price?.toLocaleString('fa-IR') }}
                        </span>
                      </div>

                      <button 
                        class="add-to-cart"
                        :disabled="product.stock === 0"
                        @click="cartStore.addToCart(product)"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="9" cy="21" r="1"/>
                          <circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
                        </svg>
                        <span>افزودن به سبد خرید</span>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- صفحه‌بندی -->
          <div v-if="pagination.total_pages > 1" class="pagination">
            <button 
              class="page-btn"
              :disabled="pagination.current_page === 1"
              @click="handlePageChange(pagination.current_page - 1)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6" stroke-width="2"/>
              </svg>
            </button>

            <div class="page-numbers">
              <button 
                v-for="page in displayedPages" 
                :key="page"
                class="page-number"
                :class="{ active: page === pagination.current_page }"
                @click="handlePageChange(page)"
              >
                {{ page.toLocaleString('fa-IR') }}
              </button>
            </div>

            <button 
              class="page-btn"
              :disabled="pagination.current_page === pagination.total_pages"
              @click="handlePageChange(pagination.current_page + 1)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </main>
      </div>

      <!-- اورلی موبایل -->
      <div v-if="showFilters" class="filter-overlay" @click="showFilters = false"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/core/store/cartStore'
import { productService } from '@/services/product.service'
import { categoryService } from '@/services/category.service'
import type { Product } from '@/types/product.types'
import type { Category } from '@/types/category.types'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

// ========== State ==========
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const categories = ref<Category[]>([])
const loadingCategories = ref(false)
const showFilters = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const categorySearch = ref('')
const expandedCategories = ref<number[]>([])
const categoryPath = ref<Category[]>([])

const pagination = reactive({
  current_page: 1,
  total_pages: 1,
  total_products: 0
})

const priceRange = reactive({
  min: 0,
  max: null as number | null
})

const filters = reactive({
  category: '',
  ordering: '',
  inStock: false,
  hasDiscount: false,
  minPrice: 0,
  maxPrice: null as number | null
})

// ========== Computed ==========
const quickFilters = [
  { label: 'همه', value: '' },
  { label: 'پرفروش‌ترین', value: '-sold' },
  { label: 'تخفیف‌دار', value: '-discount' },
  { label: 'جدیدترین', value: '-created_at' }
]

const filteredCategories = computed(() => {
  if (!categorySearch.value) return categories.value
  
  const search = categorySearch.value.toLowerCase()
  
  const filterTree = (cats: Category[]): Category[] => {
    return cats.reduce<Category[]>((acc, cat) => {
      const matches = cat.name.toLowerCase().includes(search)
      const hasMatchingChildren = cat.subcategories?.length && 
        filterTree(cat.subcategories).length > 0
      
      if (matches || hasMatchingChildren) {
        acc.push({
          ...cat,
          subcategories: filterTree(cat.subcategories || [])
        })
      }
      return acc
    }, [])
  }
  
  return filterTree(categories.value)
})

const displayedPages = computed(() => {
  const total = pagination.total_pages
  const current = pagination.current_page
  const delta = 2
  
  const range: number[] = []
  
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i)
    }
  }
  
  return range
})

// ========== Methods ==========
const loadCategories = async () => {
  loadingCategories.value = true
  try {
    categories.value = await categoryService.getCategories()
  } catch (err) {
    console.error('خطا در دریافت دسته‌بندی‌ها:', err)
  } finally {
    loadingCategories.value = false
  }
}

const loadCategoryPath = async (slug: string) => {
  if (!slug) {
    categoryPath.value = []
    return
  }
  
  try {
    categoryPath.value = await categoryService.getCategoryPath(slug)
  } catch (err) {
    console.error('خطا در دریافت مسیر دسته‌بندی:', err)
    categoryPath.value = []
  }
}

const toggleCategory = (category: Category) => {
  if (!category.subcategories?.length) {
    selectCategory(category.slug)
    return
  }
  
  if (expandedCategories.value.includes(category.id)) {
    expandedCategories.value = expandedCategories.value.filter(id => id !== category.id)
  } else {
    expandedCategories.value.push(category.id)
  }
}

const selectCategory = (slug: string) => {
  filters.category = slug
  showFilters.value = false
  
  router.push({
    query: { ...route.query, category: slug || undefined }
  })
  
  loadProducts(1)
}

const loadProducts = async (page: number = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const params: any = {
      page,
      search: searchQuery.value,
      ...(filters.category && { category: filters.category }),
      ...(filters.ordering && { ordering: filters.ordering }),
      ...(filters.inStock && { in_stock: true }),
      ...(filters.hasDiscount && { has_discount: true }),
      ...(filters.minPrice > 0 && { min_price: filters.minPrice }),
      ...(filters.maxPrice && { max_price: filters.maxPrice })
    }
    
    const response = await productService.getProducts(params)
    
    products.value = response.data
    pagination.current_page = response.current_page
    pagination.total_pages = response.total_pages
    pagination.total_products = response.count
    
  } catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری محصولات'
    console.error('❌ خطا:', err)
  } finally {
    loading.value = false
  }
}

const setQuickFilter = (value: string) => {
  filters.ordering = value
  loadProducts(1)
}

const handleSearch = () => {
  loadProducts(1)
}

const applyPriceFilter = () => {
  filters.minPrice = priceRange.min
  filters.maxPrice = priceRange.max
  loadProducts(1)
}

const clearAllFilters = () => {
  filters.category = ''
  filters.ordering = ''
  filters.inStock = false
  filters.hasDiscount = false
  filters.minPrice = 0
  filters.maxPrice = null
  priceRange.min = 0
  priceRange.max = null
  searchQuery.value = ''
  categorySearch.value = ''
  
  router.push({ query: {} })
  loadProducts(1)
}

const handlePageChange = (page: number) => {
  loadProducts(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const quickAddToCart = async (product: Product) => {
  try {
    await cartStore.addToCart(product)
    toast.success('محصول به سبد خرید اضافه شد')
  } catch (err) {
    toast.error('خطا در افزودن به سبد خرید')
  }
}

const retryLoad = () => {
  loadProducts(pagination.current_page)
}

// ========== Watchers ==========
watch(() => route.query.category, (newCategory) => {
  if (typeof newCategory === 'string') {
    filters.category = newCategory
    loadCategoryPath(newCategory)
  } else {
    filters.category = ''
    categoryPath.value = []
  }
})

// ========== Lifecycle ==========
onMounted(async () => {
  await loadCategories()
  
  if (route.query.category) {
    filters.category = route.query.category as string
    await loadCategoryPath(filters.category)
  }
  
  await loadProducts()
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* Header */
.products-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 3rem;
  font-size: 1rem;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
}

.search-btn {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: #667eea;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
}

.search-btn:hover {
  background: #764ba2;
  transform: translateY(-50%) scale(1.05);
}

.search-icon {
  width: 20px;
  height: 20px;
}

/* Container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #667eea;
}

.home-icon {
  width: 18px;
  height: 18px;
}

.separator {
  color: #9ca3af;
  font-size: 1.2rem;
  line-height: 1;
}

.breadcrumb-current {
  color: #374151;
  font-weight: 500;
}

/* Quick Filters */
.quick-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.quick-filter-btn {
  padding: 0.5rem 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 2rem;
  color: #4b5563;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-filter-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.quick-filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

/* Layout */
.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  position: relative;
}

/* Filter Sidebar */
.filter-sidebar {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 1rem;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
}

.close-filters {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

.close-filters:hover {
  background: #f3f4f6;
  color: #4b5563;
}

/* Filter Sections */
.filter-section {
  margin-bottom: 2rem;
}

.filter-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.filter-search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.filter-search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Categories */
.categories-list {
  max-height: 300px;
  overflow-y: auto;
}

.category-item {
  margin-bottom: 0.5rem;
}

.category-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.category-row:hover {
  background: #f3f4f6;
}

.category-name {
  flex: 1;
  color: #4b5563;
}

.category-count {
  color: #9ca3af;
  font-size: 0.85rem;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.subcategories {
  padding-right: 1.5rem;
  margin-top: 0.25rem;
}

.subcategory-item {
  padding: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  transition: all 0.2s;
}

.subcategory-item:hover {
  background: #f3f4f6;
  color: #667eea;
}

/* Price Range */
.price-range {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.75rem;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.price-input {
  flex: 1;
}

.price-input label {
  display: block;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.price-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.price-sep {
  color: #9ca3af;
  font-size: 0.9rem;
}

.apply-price {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.apply-price:hover {
  background: #764ba2;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #4b5563;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

/* Clear Filters */
.clear-filters {
  width: 100%;
  padding: 0.75rem;
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filters:hover {
  background: #e5e7eb;
}

/* Products Main */
.products-main {
  min-height: 600px;
}

/* Toolbar */
.products-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-toggle {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  color: #4b5563;
  cursor: pointer;
}

.filter-toggle svg {
  width: 20px;
  height: 20px;
}

.products-count {
  color: #6b7280;
  font-size: 0.95rem;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
  .toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  color: #4b5563;
  font-size: 0.95rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 0.75rem center;
  background-size: 1rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.75rem;
}

.view-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 0.5rem;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn svg {
  width: 20px;
  height: 20px;
}

.view-btn:hover {
  color: #4b5563;
}

.view-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Products Grid */
.products-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Product Card */
.product-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.product-badges {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge.discount {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.badge.new {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.badge.stock {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.product-image {
  position: relative;
  display: block;
  padding-top: 100%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.quick-add {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #667eea;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;
}

.product-card:hover .quick-add {
  opacity: 1;
  transform: translateY(0);
}

.quick-add:hover {
  background: #667eea;
  color: white;
}

.quick-add svg {
  width: 20px;
  height: 20px;
}

.product-info {
  padding: 1rem;
}

.product-name {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  margin-bottom: 0.5rem;
  line-height: 1.5;
  height: 3rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.2s;
}

.product-name:hover {
  color: #667eea;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #d1d5db;
  font-size: 1rem;
}

.star.filled {
  color: #fbbf24;
}

.rating-count {
  color: #9ca3af;
  font-size: 0.8rem;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
}

.currency {
  font-size: 0.8rem;
  color: #9ca3af;
}

.old-price {
  font-size: 0.85rem;
  color: #9ca3af;
  text-decoration: line-through;
}

/* List View */
.products-container.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-list-item {
  display: flex;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.product-list-item:hover {
  transform: translateX(-5px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.15);
}

.list-image {
  width: 200px;
  min-width: 200px;
  height: 200px;
  overflow: hidden;
}

.list-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-list-item:hover .list-image img {
  transform: scale(1.05);
}

.list-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.list-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  transition: color 0.2s;
}

.list-title:hover {
  color: #667eea;
}

.list-badges {
  display: flex;
  gap: 0.5rem;
}

.list-description {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  }

.list-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.list-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.list-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.price-current {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.price-old {
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.add-to-cart {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.add-to-cart:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.add-to-cart svg {
  width: 20px;
  height: 20px;
}

/* Loading States */
.loading-state {
  text-align: center;
  padding: 4rem;
}

.spinner-large {
  width: 50px;
  height: 50px;
  border: 3px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 2px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error & Empty States */
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.error-state svg,
.empty-state svg {
  width: 80px;
  height: 80px;
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.error-state h3,
.empty-state h3 {
  font-size: 1.5rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.error-state p,
.empty-state p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.retry-btn,
.clear-filters-btn {
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover,
.clear-filters-btn:hover {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s;
}

.page-btn svg {
  width: 20px;
  height: 20px;
}

.page-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s;
}

.page-number:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.page-number.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Mobile Overlay */
.filter-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  backdrop-filter: blur(4px);
}

/* Responsive */
@media (max-width: 1024px) {
  .products-layout {
    grid-template-columns: 250px 1fr;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .products-layout {
    grid-template-columns: 1fr;
  }
  
  .filter-sidebar {
    display: none;
    position: fixed;
    top: 0;
    right: -100%;
    width: 300px;
    height: 100vh;
    border-radius: 0;
    z-index: 999;
    transition: right 0.3s ease;
    overflow-y: auto;
  }
  
  .filter-sidebar.mobile-open {
    display: block;
    right: 0;
  }
  
  .filter-toggle {
    display: flex;
  }
  
  .close-filters {
    display: block;
  }
  
  .filter-overlay {
    display: block;
  }
  
  .products-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .product-list-item {
    flex-direction: column;
  }
  
  .list-image {
    width: 100%;
    height: 200px;
  }
  
  .list-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .add-to-cart {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .products-header {
    padding: 3rem 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .container {
    padding: 1rem;
  }
  
  .toolbar-right {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sort-select {
    width: 100%;
  }
  
  .products-container.grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
  
  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
}
</style>
  
