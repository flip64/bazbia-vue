<!-- src/views/products/ProductsView.vue -->
<template>
  <div class="products-page">
    <!-- هدر -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">محصولات</h1>
        <p class="hero-subtitle">
          {{ pagination?.total_products || 0 }} محصول از {{ totalCategories }} دسته‌بندی
        </p>
      </div>
    </div>

    <div class="container">
      <!-- مسیر دسته‌بندی (Breadcrumb) -->
      <div v-if="categoryPath.length" class="breadcrumb">
        <router-link to="/products" class="breadcrumb-item">همه محصولات</router-link>
        <span v-for="(cat, index) in categoryPath" :key="cat.id" class="breadcrumb-item">
          <span class="separator">/</span>
          <router-link :to="`/products?category=${cat.slug}`">{{ cat.name }}</router-link>
        </span>
      </div>

      <!-- ابزارک‌ها -->
      <div class="toolbar-wrapper">
        <div class="toolbar">
          <!-- انتخاب دسته‌بندی - طراحی جدید برای درخت -->
          <div class="categories-dropdown">
            <button class="categories-btn" @click="toggleCategoriesSidebar">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" stroke-width="2"/>
                <rect x="14" y="3" width="7" height="7" stroke-width="2"/>
                <rect x="3" y="14" width="7" height="7" stroke-width="2"/>
                <rect x="14" y="14" width="7" height="7" stroke-width="2"/>
              </svg>
              <span>دسته‌بندی‌ها</span>
            </button>
          </div>

          <!-- مرتب‌سازی -->
          <div class="sort-dropdown">
            <select v-model="filters.ordering" @change="handleOrderingChange" class="sort-select">
              <option value="">مرتب‌سازی پیش‌فرض</option>
              <option value="price">قیمت: کم به زیاد</option>
              <option value="-price">قیمت: زیاد به کم</option>
              <option value="-created_at">جدیدترین</option>
              <option value="-discount">بیشترین تخفیف</option>
              <option value="-sold">پرفروش‌ترین</option>
              <option value="name">نام: الف تا ی</option>
              <option value="-name">نام: ی تا الف</option>
            </select>
          </div>
        </div>
      </div>

      <!-- سایدبار دسته‌بندی (موبایل/دسکتاپ) -->
      <div class="products-layout">
        <!-- سایدبار دسته‌بندی برای دسکتاپ -->
        <aside class="categories-sidebar" :class="{ 'mobile-open': showMobileSidebar }">
          <div class="sidebar-header">
            <h3>دسته‌بندی‌ها</h3>
            <button class="close-sidebar" @click="showMobileSidebar = false">×</button>
          </div>
          
          <div class="sidebar-search">
            <input 
              v-model="categorySearch" 
              type="text" 
              placeholder="جستجوی دسته‌بندی..."
            />
          </div>

          <div v-if="loadingCategories" class="sidebar-loading">
            <div class="spinner-small"></div>
          </div>

          <div v-else class="categories-tree">
            <CategoryTree 
              :categories="filteredCategories"
              :selected-slug="filters.category"
              :expanded-cats="expandedCategories"
              @select="selectCategory"
              @toggle="toggleCategory"
            />
          </div>
        </aside>

        <!-- اویرلی برای موبایل -->
        <div 
          v-if="showMobileSidebar" 
          class="sidebar-overlay"
          @click="showMobileSidebar = false"
        ></div>

        <!-- لیست محصولات -->
        <main class="products-main">
          <!-- حالت بارگذاری -->
          <div v-if="loading" class="products-grid">
            <div v-for="n in 8" :key="n" class="product-skeleton">
              <div class="skeleton-image"></div>
              <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-category"></div>
                <div class="skeleton-price"></div>
              </div>
            </div>
          </div>

          <!-- حالت خطا -->
          <div v-else-if="error" class="error-container">
            <div class="error-card">
              <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke-width="1.5"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
              <h3 class="error-title">خطا در بارگذاری</h3>
              <p class="error-message">{{ error }}</p>
              <button @click="retryLoad" class="retry-btn">
                تلاش مجدد
              </button>
            </div>
          </div>

          <!-- حالت خالی -->
          <div v-else-if="!products.length" class="empty-state">
            <div class="empty-card">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
                <path d="M8 12h8" stroke-width="1.5"/>
              </svg>
              <h3 class="empty-title">محصولی یافت نشد</h3>
              <p class="empty-message">
                هیچ محصولی در این دسته‌بندی وجود ندارد.
              </p>
              <router-link to="/products" class="retry-btn">
                مشاهده همه محصولات
              </router-link>
            </div>
          </div>

          <!-- گرید محصولات -->
          <div v-else class="products-grid">
            <div v-for="product in products" :key="product.id" class="product-card">
              <!-- برچسب تخفیف -->
              <div v-if="product.discount_percent > 0" class="product-badge discount-badge">
                {{ product.discount_percent }}% تخفیف
              </div>
              <div v-else-if="product.stock < 5" class="product-badge stock-badge">
                فقط {{ product.stock }} عدد باقی‌مانده
              </div>

              <!-- تصویر محصول -->
              <router-link :to="`/products/${product.slug}`" class="product-image-link">
                <div class="product-image-wrapper">
                  <img 
                    :src="product.primary_image || '/images/placeholder.jpg'" 
                    :alt="product.name"
                    class="product-image"
                    loading="lazy"
                  />
                  <div class="image-overlay"></div>
                </div>
              </router-link>

              <!-- محتوای محصول -->
              <div class="product-content">
                <router-link :to="`/products/${product.slug}`" class="product-info-link">
                  <h3 class="product-title">{{ product.name }}</h3>
                  <p class="product-category">{{ product.category_name }}</p>
                </router-link>

                <!-- قیمت -->
                <div class="product-price-wrapper">
                  <div class="price-box">
                    <span class="current-price">{{ product.price.toLocaleString('fa-IR') }}</span>
                    <span class="price-unit">تومان</span>
                  </div>
                  <span v-if="product.discount_percent > 0" class="old-price">
                    {{ product.old_price?.toLocaleString('fa-IR') }}
                  </span>
                </div>

                <!-- دکمه افزودن به سبد خرید -->
                <button 
                  class="add-to-cart-btn"
                  :class="{ 'out-of-stock': product.stock === 0 }"
                  :disabled="product.stock === 0 || cartStore.loading"
                  @click="cartStore.addToCart(product)"
                >
                  <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="9" cy="21" r="1" stroke-width="2"/>
                    <circle cx="20" cy="21" r="1" stroke-width="2"/>
                    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" stroke-width="2"/>
                  </svg>
                  <span v-if="product.stock === 0">ناموجود</span>
                  <span v-else>افزودن به سبد خرید</span>
                </button>
              </div>
            </div>
          </div>

          <!-- صفحه‌بندی -->
          <div v-if="pagination.total_pages > 1" class="pagination-wrapper">
            <div class="pagination">
              <button 
                class="pagination-btn"
                :class="{ disabled: pagination.current_page === 1 }"
                :disabled="pagination.current_page === 1"
                @click="handlePageChange(pagination.current_page - 1)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 18l-6-6 6-6" stroke-width="2"/>
                </svg>
              </button>

              <span class="pagination-info">
                صفحه {{ pagination.current_page.toLocaleString('fa-IR') }} از {{ pagination.total_pages.toLocaleString('fa-IR') }}
              </span>

              <button 
                class="pagination-btn"
                :class="{ disabled: pagination.current_page === pagination.total_pages }"
                :disabled="pagination.current_page === pagination.total_pages"
                @click="handlePageChange(pagination.current_page + 1)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 18l6-6-6-6" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/core/store/cartStore'
import { productService } from '@/services/product.service'
import { categoryService } from '@/services/category.service'
import CategoryTree from '@/components/categories/CategoryTree.vue'
import type { Product } from '@/types/product.types'
import type { Category } from '@/types/category.types'

// ========== Router ==========
const route = useRoute()
const router = useRouter()

// ========== Stores ==========
const cartStore = useCartStore()

// ========== State ==========
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const categories = ref<Category[]>([])
const loadingCategories = ref(false)
const showMobileSidebar = ref(false)
const categorySearch = ref('')
const expandedCategories = ref<number[]>([])
const categoryPath = ref<Category[]>([])

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
const totalCategories = computed(() => {
  return categoryService.getAllCategoriesFlat(categories.value).length
})

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

// ========== Methods ==========

/**
 * دریافت دسته‌بندی‌ها
 */
const loadCategories = async () => {
  loadingCategories.value = true
  try {
    categories.value = await categoryService.getCategories()
    console.log('✅ دسته‌بندی‌ها:', categories.value)
  } catch (err) {
    console.error('❌ خطا در دریافت دسته‌بندی‌ها:', err)
  } finally {
    loadingCategories.value = false
  }
}

/**
 * دریافت مسیر دسته‌بندی از روی slug
 */
const loadCategoryPath = async (slug: string) => {
  if (!slug) {
    categoryPath.value = []
    return
  }
  
  try {
    categoryPath.value = await categoryService.getCategoryPath(slug)
  } catch (err) {
    console.error('❌ خطا در دریافت مسیر دسته‌بندی:', err)
    categoryPath.value = []
  }
}

/**
 * باز کردن سایدبار در موبایل
 */
const toggleCategoriesSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
}

/**
 * انتخاب دسته‌بندی
 */
const selectCategory = (slug: string) => {
  filters.category = slug
  showMobileSidebar.value = false
  
  // آپدیت URL
  router.push({
    query: {
      ...route.query,
      category: slug || undefined
    }
  })
  
  loadProducts(1)
}

/**
 * باز و بسته کردن زیردسته
 */
const toggleCategory = (categoryId: number) => {
  if (expandedCategories.value.includes(categoryId)) {
    expandedCategories.value = expandedCategories.value.filter(id => id !== categoryId)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

/**
 * بارگذاری محصولات
 */
const loadProducts = async (page: number = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const params: any = {
      page,
      ...(filters.category && { category: filters.category }),
      ...(filters.ordering && { ordering: filters.ordering })
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

/**
 * تغییر مرتب‌سازی
 */
const handleOrderingChange = () => {
  loadProducts(1)
}

/**
 * تغییر صفحه
 */
const handlePageChange = (page: number) => {
  loadProducts(page)
  // اسکرول به بالای صفحه
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * تلاش مجدد
 */
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
  console.log('🔥 ProductsView mounted')
  
  // دریافت دسته‌بندی‌ها
  await loadCategories()
  
  // بررسی category از URL
  if (route.query.category) {
    filters.category = route.query.category as string
    await loadCategoryPath(filters.category)
  }
  
  // دریافت محصولات
  await loadProducts()
})
</script>

<style scoped>
/* متغیرهای رنگ */
:root {
  --primary: #8B5CF6;
  --primary-dark: #7C3AED;
  --primary-light: #A78BFA;
  --secondary: #EC4899;
  --success: #10B981;
  --danger: #EF4444;
  --warning: #F59E0B;
  --dark: #1F2937;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
}

.products-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gray-50) 0%, #FFFFFF 100%);
}

/* هیرو سکشن */
.hero-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 4rem 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 70%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  transform: rotate(30deg);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: fadeInUp 0.6s ease;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255,255,255,0.9);
  animation: fadeInUp 0.8s ease;
}

/* کانتینر */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

/* مسیر دسته‌بندی */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  flex-wrap: wrap;
}

.breadcrumb-item {
  color: var(--gray-500);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-item a {
  color: var(--gray-700);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-item a:hover {
  color: var(--primary);
}

.separator {
  color: var(--gray-400);
  margin-left: 0.5rem;
}

/* تولبار */
.toolbar-wrapper {
  margin-bottom: 2.5rem;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid var(--gray-200);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.categories-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 0.75rem;
  color: var(--gray-700);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.categories-btn:hover {
  background: var(--gray-100);
  border-color: var(--gray-300);
}

.categories-btn .icon {
  width: 20px;
  height: 20px;
}

.sort-select {
  padding: 0.75rem 2.5rem 0.75rem 1.5rem;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 0.75rem;
  color: var(--gray-700);
  font-size: 0.95rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 0.75rem center;
  background-size: 1rem;
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* لایه‌بندی محصولات */
.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  position: relative;
}

/* سایدبار دسته‌بندی */
.categories-sidebar {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid var(--gray-200);
  height: fit-content;
  position: sticky;
  top: 1rem;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.sidebar-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray-800);
}

.close-sidebar {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--gray-500);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

.close-sidebar:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

.sidebar-search {
  margin-bottom: 1.5rem;
}

.sidebar-search input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-200);
  border-radius: 0.75rem;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.sidebar-search input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.sidebar-loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* اویرلی موبایل */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(4px);
}

/* گرید محصولات */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

/* کارت محصول */
.product-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 30px -10px rgba(139, 92, 246, 0.2);
  border-color: var(--primary-light);
}

/* برچسب محصول */
.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  animation: slideIn 0.3s ease;
}

.discount-badge {
  background: linear-gradient(135deg, var(--danger), #F87171);
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
}

.stock-badge {
  background: linear-gradient(135deg, var(--warning), #FBBF24);
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
}

/* تصویر محصول */
.product-image-link {
  display: block;
  text-decoration: none;
}

.product-image-wrapper {
  position: relative;
  padding-top: 100%;
  background: linear-gradient(135deg, var(--gray-100), var(--gray-200));
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

/* محتوای محصول */
.product-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-info-link {
  text-decoration: none;
  margin-bottom: 1rem;
}

.product-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  line-height: 1.5;
  margin-bottom: 0.25rem;
  transition: color 0.2s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-info-link:hover .product-title {
  color: var(--primary);
}

.product-category {
  font-size: 0.85rem;
  color: var(--gray-500);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* قیمت */
.product-price-wrapper {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.price-box {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1.2;
}

.old-price {
  font-size: 0.9rem;
  color: var(--gray-400);
  text-decoration: line-through;
}

.price-unit {
  font-size: 0.8rem;
  color: var(--gray-500);
}

/* دکمه افزودن به سبد خرید */
.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: auto;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(139, 92, 246, 0.4);
}

.add-to-cart-btn:active:not(:disabled) {
  transform: translateY(0);
}

.add-to-cart-btn.out-of-stock {
  background: var(--gray-400);
  cursor: not-allowed;
  opacity: 0.7;
}

.add-to-cart-btn:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
}

.cart-icon {
  width: 20px;
  height: 20px;
}

/* اسکلتون لودینگ */
.product-skeleton {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid var(--gray-200);
}

.skeleton-image {
  width: 100%;
  padding-top: 100%;
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  padding: 1.5rem;
}

.skeleton-title {
  height: 1.5rem;
  width: 80%;
  background: var(--gray-200);
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.skeleton-category {
  height: 1rem;
  width: 50%;
  background: var(--gray-200);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.skeleton-price {
  height: 1.75rem;
  width: 40%;
  background: var(--gray-200);
  border-radius: 0.5rem;
}

/* حالت خطا */
.error-container,
.empty-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-card,
.empty-card {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

.error-icon,
.empty-icon {
  width: 80px;
  height: 80px;
  color: var(--gray-400);
  margin: 0 auto 1.5rem;
}

.error-title,
.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
}

.error-message,
.empty-message {
  color: var(--gray-500);
  margin-bottom: 2rem;
}

.retry-btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(139, 92, 246, 0.4);
}

/* صفحه‌بندی */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.75rem;
  border-radius: 3rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid var(--gray-200);
}

.pagination-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: var(--gray-50);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: var(--gray-700);
}

.pagination-btn svg {
  width: 20px;
  height: 20px;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary);
  color: white;
  transform: scale(1.1);
}

.pagination-btn.disabled,
.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--gray-100);
}

.pagination-info {
  font-size: 0.95rem;
  color: var(--gray-700);
  min-width: 120px;
  text-align: center;
}

/* انیمیشن‌ها */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ریسپانسیو */
@media (max-width: 1024px) {
  .products-layout {
    grid-template-columns: 250px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .container {
    padding: 0 1rem 2rem;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .categories-btn,
  .sort-select {
    width: 100%;
  }
  
  .products-layout {
    grid-template-columns: 1fr;
  }
  
  .categories-sidebar {
    display: none;
    position: fixed;
    top: 0;
    right: -100%;
    width: 300px;
    height: 100vh;
    border-radius: 0;
    z-index: 1000;
    transition: right 0.3s ease;
    overflow-y: auto;
  }
  
  .categories-sidebar.mobile-open {
    display: block;
    right: 0;
  }
  
  .sidebar-header {
    display: flex;
  }
  
  .close-sidebar {
    display: block;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .product-content {
    padding: 1rem;
  }
  
  .current-price {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .pagination-info {
    order: -1;
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>
