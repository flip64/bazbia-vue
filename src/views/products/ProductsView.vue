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
          <ProductFilters 
            :categories="categories"
            :brands="brands"
            :price-range="priceRange"
            @filter-change="handleFilterChange"
            @close="isFilterOpen = false"
          />
        </aside>

        <!-- محتوای اصلی -->
        <main class="products-main">
          <!-- نوار ابزار -->
          <div class="products-toolbar">
            <button class="products-filter-toggle" @click="isFilterOpen = true">
              <FilterIcon class="products-filter-toggle__icon" />
              <span>فیلترها</span>
            </button>

            <div class="products-view-options">
              <button 
                class="products-view-option" 
                :class="{ 'products-view-option--active': viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                <GridIcon />
              </button>
              <button 
                class="products-view-option" 
                :class="{ 'products-view-option--active': viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <ListIcon />
              </button>
            </div>

            <ProductSort v-model="sortBy" @change="handleSortChange" />
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
            <PackageIcon class="products-empty__icon" />
            <h3>محصولی یافت نشد</h3>
            <p>با تغییر فیلترها می‌توانید محصولات بیشتری پیدا کنید</p>
            <button @click="resetFilters" class="products-empty__btn">حذف فیلترها</button>
          </div>

          <div v-else :class="['products-grid', `products-grid--${viewMode}`]">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @add-to-cart="handleAddToCart"
              @add-to-wishlist="handleAddToWishlist"
            />
          </div>

          <!-- صفحه‌بندی -->
          <ProductPagination
            v-model:current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FilterIcon, GridIcon, ListIcon, PackageIcon } from 'lucide-vue-next'
import ProductCard from '@/components/products/ProductCard.vue'
import ProductFilters from '@/components/products/ProductFilters.vue'
import ProductSort from '@/components/products/ProductSort.vue'
import ProductPagination from '@/components/products/ProductPagination.vue'
import './ProductsView.css'

// تعریف تایپ‌ها
interface Product {
  id: number
  name: string
  price: number
  oldPrice?: number
  image: string
  category: string
  brand: string
  rating: number
  reviewCount: number
  inStock: boolean
  discount?: number
}

interface FilterState {
  categories: string[]
  brands: string[]
  minPrice: number
  maxPrice: number
  inStock: boolean
  hasDiscount: boolean
}

const router = useRouter()
const route = useRoute()

// وضعیت
const loading = ref(false)
const products = ref<Product[]>([])
const totalProducts = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const viewMode = ref<'grid' | 'list'>('grid')
const isFilterOpen = ref(false)
const sortBy = ref('newest')

// داده‌های فیلتر
const categories = ref([
  { id: 1, name: 'الکترونیک', count: 45 },
  { id: 2, name: 'پوشاک', count: 32 },
  { id: 3, name: 'کتاب', count: 28 },
  { id: 4, name: 'خانه و آشپزخانه', count: 19 },
  { id: 5, name: 'ورزشی', count: 15 },
])

const brands = ref([
  { id: 1, name: 'سامسونگ', count: 23 },
  { id: 2, name: 'اپل', count: 18 },
  { id: 3, name: 'شیائومی', count: 15 },
  { id: 4, name: 'نایکی', count: 12 },
  { id: 5, name: 'آدیداس', count: 10 },
])

const priceRange = ref({ min: 0, max: 10000000 })

// فیلترهای فعال
const activeFilters = ref<FilterState>({
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 10000000,
  inStock: false,
  hasDiscount: false,
})

// متدها
const fetchProducts = async () => {
  loading.value = true
  try {
    // اینجا به API بک‌اند وصل میشه
    // const response = await axios.get('/api/products/', {
    //   params: {
    //     page: currentPage.value,
    //     sort: sortBy.value,
    //     ...activeFilters.value
    //   }
    // })
    
    // داده‌های نمونه
    await new Promise(resolve => setTimeout(resolve, 1000))
    products.value = generateSampleProducts()
    totalProducts.value = 156
    totalPages.value = 16
  } catch (error) {
    console.error('خطا در دریافت محصولات:', error)
  } finally {
    loading.value = false
  }
}

const generateSampleProducts = (): Product[] => {
  const products: Product[] = []
  for (let i = 1; i <= 12; i++) {
    products.push({
      id: i,
      name: `محصول ${i}`,
      price: Math.floor(Math.random() * 5000000) + 100000,
      oldPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 6000000) + 200000 : undefined,
      image: `https://via.placeholder.com/300x300?text=Product+${i}`,
      category: categories.value[Math.floor(Math.random() * categories.value.length)].name,
      brand: brands.value[Math.floor(Math.random() * brands.value.length)].name,
      rating: Math.floor(Math.random() * 5) + 1,
      reviewCount: Math.floor(Math.random() * 100) + 1,
      inStock: Math.random() > 0.2,
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : undefined,
    })
  }
  return products
}

const handleFilterChange = (filters: FilterState) => {
  activeFilters.value = filters
  currentPage.value = 1
  fetchProducts()
  // آپدیت URL برای state management
  router.push({ 
    query: { 
      ...route.query,
      ...filters,
      page: currentPage.value 
    } 
  })
}

const handleSortChange = (value: string) => {
  sortBy.value = value
  fetchProducts()
  router.push({ query: { ...route.query, sort: value } })
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchProducts()
  router.push({ query: { ...route.query, page: page.toString() } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleAddToCart = (productId: number) => {
  console.log('افزودن به سبد خرید:', productId)
  // اینجا منطق افزودن به سبد خرید
}

const handleAddToWishlist = (productId: number) => {
  console.log('افزودن به علاقه‌مندی‌ها:', productId)
  // اینجا منطق افزودن به علاقه‌مندی‌ها
}

const resetFilters = () => {
  activeFilters.value = {
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 10000000,
    inStock: false,
    hasDiscount: false,
  }
  fetchProducts()
}

// واکشی اولیه و واکنش به تغییرات route
onMounted(() => {
  // بازیابی فیلترها از URL
  const query = route.query
  if (query.page) currentPage.value = Number(query.page)
  if (query.sort) sortBy.value = query.sort as string
  // ... بازیابی بقیه فیلترها
  fetchProducts()
})

watch(() => route.query, () => {
  fetchProducts()
})
</script>
