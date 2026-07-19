<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ProductCard from '@/components/products/ProductCard.vue'
import ProductFilters from '@/components/products/ProductFilters.vue'
import ProductsToolbar from '@/components/products/ProductsToolbar.vue'
import ProductPagination from '@/components/products/ProductPagination.vue'

import { productService } from '@/services/product.service'
import { categoryService } from '@/services/category.service'

import type { Product } from '@/types/product.types'
import type { Category } from '@/types/category.types'

const route = useRoute()
const router = useRouter()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const categoryPath = ref<Category[]>([])

const loading = ref(false)
const loadingCategories = ref(false)
const error = ref<string | null>(null)

const showMobileFilters = ref(false)

const searchQuery = ref(
  typeof route.query.search === 'string'
    ? route.query.search
    : '',
)

const filters = reactive({
  category:
    typeof route.query.category === 'string'
      ? route.query.category
      : '',

  ordering:
    typeof route.query.ordering === 'string'
      ? route.query.ordering
      : '',

  inStock: route.query.in_stock === 'true',

  hasDiscount:
    route.query.has_discount === 'true',

  minPrice:
    typeof route.query.min_price === 'string'
      ? route.query.min_price
      : '',

  maxPrice:
    typeof route.query.max_price === 'string'
      ? route.query.max_price
      : '',
})

const pagination = reactive({
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
})

let searchTimer: ReturnType<typeof setTimeout> | null =
  null

const activeCategoryName = computed(() => {
  if (!categoryPath.value.length) {
    return ''
  }

  return (
    categoryPath.value[
      categoryPath.value.length - 1
    ]?.name ?? ''
  )
})

const activeFiltersCount = computed(() => {
  let count = 0

  if (searchQuery.value.trim()) count++
  if (filters.category) count++
  if (filters.inStock) count++
  if (filters.hasDiscount) count++
  if (filters.minPrice) count++
  if (filters.maxPrice) count++

  return count
})

const loadCategories = async () => {
  loadingCategories.value = true

  try {
    categories.value =
      await categoryService.getCategories()
  } catch (err) {
    console.error(
      'خطا در دریافت دسته‌بندی‌ها:',
      err,
    )
  } finally {
    loadingCategories.value = false
  }
}

const loadCategoryPath = async (
  slug: string,
) => {
  if (!slug) {
    categoryPath.value = []
    return
  }

  try {
    categoryPath.value =
      await categoryService.getCategoryPath(slug)
  } catch (err) {
    console.error(
      'خطا در دریافت مسیر دسته‌بندی:',
      err,
    )

    categoryPath.value = []
  }
}

const loadProducts = async (
  page: number = 1,
) => {
  loading.value = true
  error.value = null

  try {
    const params: Record<
      string,
      string | number | boolean
    > = {
      page,
    }

    const search = searchQuery.value.trim()

    if (search) {
      params.search = search
    }

    if (filters.category) {
      params.category = filters.category
    }

    if (filters.ordering) {
      params.ordering = filters.ordering
    }

    if (filters.inStock) {
      params.in_stock = true
    }

    if (filters.hasDiscount) {
      params.has_discount = true
    }

    if (filters.minPrice) {
      params.min_price = filters.minPrice
    }

    if (filters.maxPrice) {
      params.max_price = filters.maxPrice
    }

    const response =
      await productService.getProducts(params)

    products.value = response.data ?? []

    pagination.currentPage =
      response.current_page ?? page

    pagination.totalPages =
      response.total_pages ?? 1

    pagination.totalProducts =
      response.count ?? 0
  } catch (err: any) {
    console.error(
      'خطا در دریافت محصولات:',
      err,
    )

    error.value =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'خطا در دریافت محصولات'
  } finally {
    loading.value = false
  }
}

const updateRouteQuery = async () => {
  const query: Record<string, string> = {}

  if (searchQuery.value.trim()) {
    query.search = searchQuery.value.trim()
  }

  if (filters.category) {
    query.category = filters.category
  }

  if (filters.ordering) {
    query.ordering = filters.ordering
  }

  if (filters.inStock) {
    query.in_stock = 'true'
  }

  if (filters.hasDiscount) {
    query.has_discount = 'true'
  }

  if (filters.minPrice) {
    query.min_price = filters.minPrice
  }

  if (filters.maxPrice) {
    query.max_price = filters.maxPrice
  }

  if (pagination.currentPage > 1) {
    query.page = String(
      pagination.currentPage,
    )
  }

  await router.replace({ query })
}

const applyFilters = async () => {
  pagination.currentPage = 1

  await updateRouteQuery()
  await loadProducts(1)
}

const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(() => {
    applyFilters()
  }, 500)
}

const clearSearch = async () => {
  searchQuery.value = ''
  await applyFilters()
}

const selectCategory = async (
  slug: string,
) => {
  filters.category = slug
  showMobileFilters.value = false

  await loadCategoryPath(slug)
  await applyFilters()
}

const clearCategory = async () => {
  filters.category = ''
  categoryPath.value = []

  await applyFilters()
}

const clearAllFilters = async () => {
  searchQuery.value = ''

  filters.category = ''
  filters.ordering = ''
  filters.inStock = false
  filters.hasDiscount = false
  filters.minPrice = ''
  filters.maxPrice = ''

  categoryPath.value = []

  pagination.currentPage = 1

  await router.replace({
    query: {},
  })

  await loadProducts(1)
}

const changeOrdering = async (
  ordering: string,
) => {
  filters.ordering = ordering
  await applyFilters()
}

const handlePageChange = async (
  page: number,
) => {
  if (
    page < 1 ||
    page > pagination.totalPages ||
    page === pagination.currentPage ||
    loading.value
  ) {
    return
  }

  pagination.currentPage = page

  await updateRouteQuery()
  await loadProducts(page)

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const retryLoad = () => {
  loadProducts(pagination.currentPage)
}

onMounted(async () => {
  await loadCategories()

  if (filters.category) {
    await loadCategoryPath(
      filters.category,
    )
  }

  const initialPage = Number(
    route.query.page,
  )

  const page =
    Number.isFinite(initialPage) &&
    initialPage > 0
      ? initialPage
      : 1

  await loadProducts(page)
})

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
})
</script>

<template>
  <div class="products-page">
    <!-- هدر فروشگاه -->
    <section class="store-hero">
      <div class="store-hero__pattern"></div>

      <div class="store-hero__content">
        <span class="store-hero__badge">
          فروشگاه بازبیا
        </span>

        <h1 class="store-hero__title">
          خرید راحت، انتخاب مطمئن
        </h1>

        <p class="store-hero__description">
          محصولات کاربردی را با قیمت مناسب
          پیدا کن و دوباره به بازبیا برگرد.
        </p>

        <div class="main-search">
          <svg
            class="main-search__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke-width="2"
            />

            <path
              d="m20 20-3.5-3.5"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>

          <input
            v-model="searchQuery"
            type="search"
            class="main-search__input"
            placeholder="نام محصول را جستجو کنید..."
            @input="handleSearch"
          />

          <button
            v-if="searchQuery"
            type="button"
            class="main-search__clear"
            @click="clearSearch"
          >
            ×
          </button>
        </div>
      </div>
    </section>

    <div class="page-container">
      <!-- مسیر صفحه -->
      <nav class="breadcrumb">
        <RouterLink
          to="/"
          class="breadcrumb__link"
        >
          خانه
        </RouterLink>

        <span class="breadcrumb__separator">
          /
        </span>

        <button
          type="button"
          class="breadcrumb__link"
          @click="clearCategory"
        >
          محصولات
        </button>

        <template
          v-for="category in categoryPath"
          :key="category.id"
        >
          <span class="breadcrumb__separator">
            /
          </span>

          <span class="breadcrumb__current">
            {{ category.name }}
          </span>
        </template>
      </nav>

      <div class="products-layout">
        <ProductFilters
          v-model:category="filters.category"
          v-model:in-stock="filters.inStock"
          v-model:has-discount="
            filters.hasDiscount
          "
          v-model:min-price="filters.minPrice"
          v-model:max-price="filters.maxPrice"
          :categories="categories"
          :loading="loadingCategories"
          :mobile-open="showMobileFilters"
          :active-filters-count="
            activeFiltersCount
          "
          @apply="applyFilters"
          @clear="clearAllFilters"
          @select-category="selectCategory"
          @close="
            showMobileFilters = false
          "
        />

        <main class="products-content">
          <ProductsToolbar
            :title="
              activeCategoryName ||
              'همه محصولات'
            "
            :total-products="
              pagination.totalProducts
            "
            :ordering="filters.ordering"
            :active-filters-count="
              activeFiltersCount
            "
            @change-ordering="
              changeOrdering
            "
            @open-filters="
              showMobileFilters = true
            "
          />

          <!-- Loading -->
          <div
            v-if="loading"
            class="products-grid"
          >
            <div
              v-for="item in 8"
              :key="item"
              class="product-skeleton"
            >
              <div
                class="product-skeleton__image"
              ></div>

              <div
                class="product-skeleton__body"
              >
                <div
                  class="product-skeleton__line"
                ></div>

                <div
                  class="product-skeleton__line product-skeleton__line--short"
                ></div>

                <div
                  class="product-skeleton__price"
                ></div>

                <div
                  class="product-skeleton__button"
                ></div>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div
            v-else-if="error"
            class="message-state"
          >
            <div class="message-state__icon">
              !
            </div>

            <h3>
              دریافت محصولات ناموفق بود
            </h3>

            <p>{{ error }}</p>

            <button
              type="button"
              @click="retryLoad"
            >
              تلاش دوباره
            </button>
          </div>

          <!-- Empty -->
          <div
            v-else-if="
              products.length === 0
            "
            class="message-state"
          >
            <div class="message-state__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 7h18M5 7l1 13h12l1-13M9 11v5M15 11v5M9 4h6"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <h3>محصولی پیدا نشد</h3>

            <p>
              فیلترها یا عبارت جستجو را
              تغییر بده.
            </p>

            <button
              type="button"
              @click="clearAllFilters"
            >
              پاک کردن فیلترها
            </button>
          </div>

          <!-- Products -->
          <div
            v-else
            class="products-grid"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>

          <ProductPagination
            v-if="
              !loading &&
              pagination.totalPages > 1
            "
            :current-page="
              pagination.currentPage
            "
            :total-pages="
              pagination.totalPages
            "
            @change="handlePageChange"
          />
        </main>
      </div>
    </div>

    <Transition name="fade">
      <button
        v-if="showMobileFilters"
        type="button"
        class="filters-overlay"
        @click="
          showMobileFilters = false
        "
      ></button>
    </Transition>
  </div>
</template>

<style scoped>
.products-page {
  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      #f0fdf4 0,
      #f8fafc 340px
    );
  direction: rtl;
}

.store-hero {
  position: relative;
  overflow: hidden;
  padding: 48px 20px 58px;
  background:
    linear-gradient(
      135deg,
      #064e3b 0%,
      #047857 55%,
      #059669 100%
    );
}

.store-hero__pattern {
  position: absolute;
  inset: 0;
  opacity: 0.12;
  background-image:
    radial-gradient(
      circle at 20% 20%,
      #fde047 0 4px,
      transparent 5px
    ),
    radial-gradient(
      circle at 80% 60%,
      #ffffff 0 3px,
      transparent 4px
    );
  background-size:
    80px 80px,
    65px 65px;
}

.store-hero__content {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
}

.store-hero__badge {
  display: inline-flex;
  margin-bottom: 14px;
  padding: 7px 14px;
  border: 1px solid
    rgba(254, 240, 138, 0.55);
  border-radius: 999px;
  background:
    rgba(254, 240, 138, 0.13);
  color: #fef08a;
  font-size: 13px;
  font-weight: 700;
}

.store-hero__title {
  margin: 0;
  color: white;
  font-size: clamp(
    28px,
    5vw,
    44px
  );
  font-weight: 900;
}

.store-hero__description {
  max-width: 570px;
  margin: 14px auto 26px;
  color:
    rgba(255, 255, 255, 0.82);
  line-height: 1.9;
}

.main-search {
  position: relative;
  max-width: 620px;
  margin: 0 auto;
}

.main-search__icon {
  position: absolute;
  top: 50%;
  right: 18px;
  width: 22px;
  height: 22px;
  color: #059669;
  transform: translateY(-50%);
}

.main-search__input {
  width: 100%;
  height: 58px;
  padding: 0 52px 0 50px;
  border: 2px solid transparent;
  border-radius: 18px;
  background: white;
  font-family: inherit;
  outline: none;
  box-shadow:
    0 20px 45px
    rgba(6, 78, 59, 0.26);
}

.main-search__input:focus {
  border-color: #fde047;
}

.main-search__clear {
  position: absolute;
  top: 50%;
  left: 14px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 10px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 22px;
  cursor: pointer;
  transform: translateY(-50%);
}

.page-container {
  width: min(
    1440px,
    calc(100% - 32px)
  );
  margin: 0 auto;
  padding: 24px 0 60px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  overflow-x: auto;
  color: #94a3b8;
  font-size: 13px;
  white-space: nowrap;
}

.breadcrumb__link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #64748b;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
}

.breadcrumb__current {
  color: #1f2937;
  font-weight: 700;
}

.products-layout {
  display: grid;
  grid-template-columns:
    270px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.products-content {
  min-width: 0;
}

.products-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.product-skeleton {
  overflow: hidden;
  border: 1px solid #e6eee9;
  border-radius: 18px;
  background: white;
}

.product-skeleton__image {
  aspect-ratio: 1;
  background:
    linear-gradient(
      90deg,
      #f1f5f9 25%,
      #e7edea 50%,
      #f1f5f9 75%
    );
  background-size: 200% 100%;
  animation:
    skeleton 1.3s infinite;
}

.product-skeleton__body {
  padding: 15px;
}

.product-skeleton__line,
.product-skeleton__price,
.product-skeleton__button {
  border-radius: 7px;
  background:
    linear-gradient(
      90deg,
      #f1f5f9 25%,
      #e7edea 50%,
      #f1f5f9 75%
    );
  background-size: 200% 100%;
  animation:
    skeleton 1.3s infinite;
}

.product-skeleton__line {
  height: 13px;
  margin-bottom: 9px;
}

.product-skeleton__line--short {
  width: 65%;
}

.product-skeleton__price {
  width: 45%;
  height: 20px;
  margin: 22px 0 14px;
}

.product-skeleton__button {
  height: 43px;
}

.message-state {
  display: flex;
  min-height: 400px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px 20px;
  border: 1px solid #e6eee9;
  border-radius: 20px;
  background: white;
  text-align: center;
}

.message-state__icon {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin-bottom: 18px;
  border-radius: 22px;
  background: #ecfdf5;
  color: #059669;
  font-size: 30px;
  font-weight: 900;
}

.message-state__icon svg {
  width: 34px;
  height: 34px;
}

.message-state button {
  min-height: 42px;
  padding: 0 20px;
  border: 0;
  border-radius: 12px;
  background: #059669;
  color: white;
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
}

.filters-overlay {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes skeleton {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 1250px) {
  .products-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .products-layout {
    grid-template-columns: 1fr;
  }

  .filters-overlay {
    position: fixed;
    z-index: 1000;
    inset: 0;
    display: block;
    border: 0;
    background:
      rgba(15, 23, 42, 0.48);
  }
}

@media (max-width: 720px) {
  .store-hero {
    padding: 36px 16px 45px;
  }

  .page-container {
    width: calc(100% - 22px);
  }

  .products-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}
</style>
