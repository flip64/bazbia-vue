<!-- src/views/products/ProductsView.vue -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ProductCard from '@/components/products/ProductCard.vue'
import { productService } from '@/services/product.service'
import { categoryService } from '@/services/category.service'

import type { Product } from '@/types/product.types'
import type { Category } from '@/types/category.types'

const route = useRoute()
const router = useRouter()

// ========================================
// State
// ========================================

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const categoryPath = ref<Category[]>([])

const loading = ref(false)
const loadingCategories = ref(false)
const error = ref<string | null>(null)

const showMobileFilters = ref(false)
const categorySearch = ref('')
const expandedCategories = ref<number[]>([])

const searchQuery = ref(
  typeof route.query.search === 'string'
    ? route.query.search
    : '',
)

const pagination = reactive({
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
})

const priceRange = reactive({
  min: '',
  max: '',
})

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
  hasDiscount: route.query.has_discount === 'true',

  minPrice:
    typeof route.query.min_price === 'string'
      ? route.query.min_price
      : '',

  maxPrice:
    typeof route.query.max_price === 'string'
      ? route.query.max_price
      : '',
})

priceRange.min = filters.minPrice
priceRange.max = filters.maxPrice

let searchTimer: ReturnType<typeof setTimeout> | null = null

// ========================================
// Computed
// ========================================

const quickFilters = [
  {
    label: 'همه محصولات',
    value: '',
  },
  {
    label: 'جدیدترین',
    value: '-created_at',
  },
  {
    label: 'ارزان‌ترین',
    value: 'price',
  },
  {
    label: 'گران‌ترین',
    value: '-price',
  },
]

const activeFiltersCount = computed(() => {
  let count = 0

  if (filters.category) count++
  if (filters.inStock) count++
  if (filters.hasDiscount) count++
  if (filters.minPrice) count++
  if (filters.maxPrice) count++
  if (searchQuery.value.trim()) count++

  return count
})

const filteredCategories = computed(() => {
  const query = categorySearch.value.trim().toLowerCase()

  if (!query) {
    return categories.value
  }

  const filterTree = (items: Category[]): Category[] => {
    return items.reduce<Category[]>((result, category) => {
      const children = filterTree(category.subcategories ?? [])

      const categoryMatches = category.name
        .toLowerCase()
        .includes(query)

      if (categoryMatches || children.length > 0) {
        result.push({
          ...category,
          subcategories: children,
        })
      }

      return result
    }, [])
  }

  return filterTree(categories.value)
})

const displayedPages = computed(() => {
  const current = pagination.currentPage
  const total = pagination.totalPages

  if (total <= 5) {
    return Array.from(
      { length: total },
      (_, index) => index + 1,
    )
  }

  const pages = new Set<number>()

  pages.add(1)
  pages.add(total)
  pages.add(current)

  if (current > 1) {
    pages.add(current - 1)
  }

  if (current < total) {
    pages.add(current + 1)
  }

  return Array.from(pages).sort((a, b) => a - b)
})

const activeCategoryName = computed(() => {
  if (!categoryPath.value.length) {
    return ''
  }

  return categoryPath.value[
    categoryPath.value.length - 1
  ]?.name ?? ''
})

// ========================================
// API
// ========================================

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

const loadCategoryPath = async (slug: string) => {
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

const loadProducts = async (page = 1) => {
  loading.value = true
  error.value = null

  try {
    const params: Record<string, string | number | boolean> = {
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

// ========================================
// URL Query
// ========================================

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
    query.page = String(pagination.currentPage)
  }

  await router.replace({ query })
}

// ========================================
// Filters
// ========================================

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

const setQuickFilter = async (value: string) => {
  filters.ordering = value
  await applyFilters()
}

const applyPriceFilter = async () => {
  filters.minPrice = priceRange.min
  filters.maxPrice = priceRange.max

  await applyFilters()
}

const toggleStockFilter = async () => {
  await applyFilters()
}

const toggleDiscountFilter = async () => {
  await applyFilters()
}

const selectCategory = async (slug: string) => {
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
  categorySearch.value = ''

  filters.category = ''
  filters.ordering = ''
  filters.inStock = false
  filters.hasDiscount = false
  filters.minPrice = ''
  filters.maxPrice = ''

  priceRange.min = ''
  priceRange.max = ''

  categoryPath.value = []
  pagination.currentPage = 1

  await router.replace({ query: {} })
  await loadProducts(1)
}

// ========================================
// Categories
// ========================================

const toggleCategory = (category: Category) => {
  const hasChildren =
    Boolean(category.subcategories?.length)

  if (!hasChildren) {
    selectCategory(category.slug)
    return
  }

  if (
    expandedCategories.value.includes(
      category.id,
    )
  ) {
    expandedCategories.value =
      expandedCategories.value.filter(
        id => id !== category.id,
      )

    return
  }

  expandedCategories.value.push(category.id)
}

// ========================================
// Pagination
// ========================================

const handlePageChange = async (page: number) => {
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

// ========================================
// Lifecycle
// ========================================

watch(
  () => route.query.category,
  async newCategory => {
    if (typeof newCategory === 'string') {
      filters.category = newCategory
      await loadCategoryPath(newCategory)
    }
  },
)

onMounted(async () => {
  await loadCategories()

  if (filters.category) {
    await loadCategoryPath(filters.category)
  }

  const initialPage = Number(route.query.page)

  await loadProducts(
    Number.isFinite(initialPage) && initialPage > 0
      ? initialPage
      : 1,
  )
})

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
})
</script>

<template>
  <div class="products-page">
    <!-- هدر صفحه -->
    <section class="store-hero">
      <div class="store-hero__pattern"></div>

      <div class="store-hero__content">
        <div class="store-hero__badge">
          فروشگاه بازبیا
        </div>

        <h1 class="store-hero__title">
          خرید راحت، انتخاب مطمئن
        </h1>

        <p class="store-hero__description">
          محصولات کاربردی را با قیمت مناسب پیدا کن
          و دوباره به بازبیا برگرد.
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
            aria-label="پاک کردن جستجو"
            @click="
              searchQuery = '';
              applyFilters()
            "
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

      <!-- فیلترهای سریع -->
      <section class="quick-filters">
        <button
          v-for="filter in quickFilters"
          :key="filter.value"
          type="button"
          class="quick-filter"
          :class="{
            'quick-filter--active':
              filters.ordering === filter.value,
          }"
          @click="setQuickFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </section>

      <div class="products-layout">
        <!-- فیلتر دسکتاپ و موبایل -->
        <aside
          class="filters-panel"
          :class="{
            'filters-panel--open':
              showMobileFilters,
          }"
        >
          <div class="filters-panel__header">
            <div>
              <h2 class="filters-panel__title">
                فیلتر محصولات
              </h2>

              <span
                v-if="activeFiltersCount"
                class="filters-panel__count"
              >
                {{ activeFiltersCount.toLocaleString('fa-IR') }}
                فیلتر فعال
              </span>
            </div>

            <button
              type="button"
              class="filters-panel__close"
              aria-label="بستن فیلترها"
              @click="showMobileFilters = false"
            >
              ×
            </button>
          </div>

          <!-- دسته‌بندی -->
          <div class="filter-group">
            <div class="filter-group__heading">
              <h3 class="filter-group__title">
                دسته‌بندی
              </h3>

              <button
                v-if="filters.category"
                type="button"
                class="filter-group__reset"
                @click="clearCategory"
              >
                حذف
              </button>
            </div>

            <div
              v-if="activeCategoryName"
              class="selected-category"
            >
              {{ activeCategoryName }}
            </div>

            <input
              v-model="categorySearch"
              type="search"
              class="category-search"
              placeholder="جستجوی دسته‌بندی..."
            />

            <div
              v-if="loadingCategories"
              class="filter-loading"
            >
              <span class="spinner"></span>
            </div>

            <div
              v-else
              class="categories-list"
            >
              <div
                v-for="category in filteredCategories"
                :key="category.id"
                class="category-item"
              >
                <button
                  type="button"
                  class="category-row"
                  :class="{
                    'category-row--active':
                      filters.category === category.slug,
                  }"
                  @click="toggleCategory(category)"
                >
                  <span class="category-row__name">
                    {{ category.name }}
                  </span>

                  <span
                    v-if="category.products_count !== undefined"
                    class="category-row__count"
                  >
                    {{
                      Number(
                        category.products_count || 0,
                      ).toLocaleString('fa-IR')
                    }}
                  </span>

                  <svg
                    v-if="category.subcategories?.length"
                    class="category-row__arrow"
                    :class="{
                      'category-row__arrow--open':
                        expandedCategories.includes(
                          category.id,
                        ),
                    }"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <div
                  v-if="
                    category.subcategories?.length &&
                    expandedCategories.includes(
                      category.id,
                    )
                  "
                  class="subcategories"
                >
                  <button
                    v-for="subcategory in category.subcategories"
                    :key="subcategory.id"
                    type="button"
                    class="subcategory"
                    :class="{
                      'subcategory--active':
                        filters.category ===
                        subcategory.slug,
                    }"
                    @click="
                      selectCategory(
                        subcategory.slug,
                      )
                    "
                  >
                    <span>
                      {{ subcategory.name }}
                    </span>

                    <span>
                      {{
                        Number(
                          subcategory.products_count ||
                            0,
                        ).toLocaleString('fa-IR')
                      }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- قیمت -->
          <div class="filter-group">
            <h3 class="filter-group__title">
              محدوده قیمت
            </h3>

            <div class="price-inputs">
              <label class="price-field">
                <span>حداقل قیمت</span>

                <input
                  v-model="priceRange.min"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  placeholder="۰"
                />
              </label>

              <label class="price-field">
                <span>حداکثر قیمت</span>

                <input
                  v-model="priceRange.max"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  placeholder="بدون محدودیت"
                />
              </label>
            </div>

            <button
              type="button"
              class="apply-price-button"
              @click="applyPriceFilter"
            >
              اعمال محدوده قیمت
            </button>
          </div>

          <!-- وضعیت -->
          <div class="filter-group">
            <h3 class="filter-group__title">
              وضعیت محصول
            </h3>

            <label class="switch-row">
              <span class="switch-row__label">
                فقط محصولات موجود
              </span>

              <input
                v-model="filters.inStock"
                type="checkbox"
                @change="toggleStockFilter"
              />

              <span class="switch"></span>
            </label>

            <label class="switch-row">
              <span class="switch-row__label">
                فقط محصولات تخفیف‌دار
              </span>

              <input
                v-model="filters.hasDiscount"
                type="checkbox"
                @change="toggleDiscountFilter"
              />

              <span class="switch"></span>
            </label>
          </div>

          <button
            type="button"
            class="clear-all-button"
            @click="clearAllFilters"
          >
            پاک کردن همه فیلترها
          </button>
        </aside>

        <!-- محصولات -->
        <main class="products-content">
          <header class="products-toolbar">
            <div class="products-toolbar__start">
              <button
                type="button"
                class="mobile-filter-button"
                @click="showMobileFilters = true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M4 6h16M7 12h10M10 18h4"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>

                فیلترها

                <span
                  v-if="activeFiltersCount"
                  class="mobile-filter-button__count"
                >
                  {{ activeFiltersCount }}
                </span>
              </button>

              <div>
                <h2 class="products-toolbar__title">
                  {{
                    activeCategoryName ||
                    'همه محصولات'
                  }}
                </h2>

                <p class="products-toolbar__count">
                  {{
                    pagination.totalProducts.toLocaleString(
                      'fa-IR',
                    )
                  }}
                  محصول
                </p>
              </div>
            </div>

            <label class="sort-control">
              <span>مرتب‌سازی:</span>

              <select
                v-model="filters.ordering"
                @change="applyFilters"
              >
                <option value="">
                  پیش‌فرض
                </option>

                <option value="-created_at">
                  جدیدترین
                </option>

                <option value="price">
                  ارزان‌ترین
                </option>

                <option value="-price">
                  گران‌ترین
                </option>
              </select>
            </label>
          </header>

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
              <div class="product-skeleton__image"></div>

              <div class="product-skeleton__body">
                <div class="product-skeleton__line"></div>
                <div class="product-skeleton__line product-skeleton__line--short"></div>
                <div class="product-skeleton__price"></div>
                <div class="product-skeleton__button"></div>
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

            <h3>دریافت محصولات ناموفق بود</h3>

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
            v-else-if="products.length === 0"
            class="message-state"
          >
            <div class="message-state__icon">
              ‌
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 7h18M5 7l1 13h12l1-13M9 11v5M15 11v5M9 4h6"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <h3>محصولی پیدا نشد</h3>

            <p>
              فیلترها یا عبارت جستجو را تغییر بده.
            </p>

            <button
              type="button"
              @click="clearAllFilters"
            >
              پاک کردن فیلترها
            </button>
          </div>

          <!-- Grid -->
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

          <!-- Pagination -->
          <nav
            v-if="
              !loading &&
              pagination.totalPages > 1
            "
            class="pagination"
            aria-label="صفحه‌بندی محصولات"
          >
            <button
              type="button"
              class="pagination__button pagination__button--arrow"
              :disabled="
                pagination.currentPage === 1
              "
              aria-label="صفحه قبلی"
              @click="
                handlePageChange(
                  pagination.currentPage - 1,
                )
              "
            >
              ‹
            </button>

            <template
              v-for="(page, index) in displayedPages"
              :key="page"
            >
              <span
                v-if="
                  index > 0 &&
                  page -
                    displayedPages[index - 1] >
                    1
                "
                class="pagination__dots"
              >
                …
              </span>

              <button
                type="button"
                class="pagination__button"
                :class="{
                  'pagination__button--active':
                    page ===
                    pagination.currentPage,
                }"
                @click="handlePageChange(page)"
              >
                {{ page.toLocaleString('fa-IR') }}
              </button>
            </template>

            <button
              type="button"
              class="pagination__button pagination__button--arrow"
              :disabled="
                pagination.currentPage ===
                pagination.totalPages
              "
              aria-label="صفحه بعدی"
              @click="
                handlePageChange(
                  pagination.currentPage + 1,
                )
              "
            >
              ›
            </button>
          </nav>
        </main>
      </div>
    </div>

    <!-- اورلی موبایل -->
    <Transition name="fade">
      <button
        v-if="showMobileFilters"
        type="button"
        class="filters-overlay"
        aria-label="بستن فیلترها"
        @click="showMobileFilters = false"
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

/* ========================================
   Hero
======================================== */

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
  background-size: 80px 80px, 65px 65px;
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
  border: 1px solid rgba(254, 240, 138, 0.55);
  border-radius: 999px;
  background: rgba(254, 240, 138, 0.13);
  color: #fef08a;
  font-size: 13px;
  font-weight: 700;
}

.store-hero__title {
  margin: 0;
  color: #ffffff;
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 900;
  letter-spacing: -1px;
}

.store-hero__description {
  max-width: 570px;
  margin: 14px auto 26px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 15px;
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
  pointer-events: none;
}

.main-search__input {
  width: 100%;
  height: 58px;
  padding: 0 52px 0 50px;
  border: 2px solid transparent;
  border-radius: 18px;
  background: #ffffff;
  color: #1f2937;
  font-family: inherit;
  font-size: 15px;
  outline: none;
  box-shadow: 0 20px 45px rgba(6, 78, 59, 0.26);
  transition: 0.2s ease;
}

.main-search__input:focus {
  border-color: #fde047;
  box-shadow:
    0 20px 45px rgba(6, 78, 59, 0.3),
    0 0 0 4px rgba(253, 224, 71, 0.18);
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
  line-height: 1;
  cursor: pointer;
  transform: translateY(-50%);
}

/* ========================================
   Container
======================================== */

.page-container {
  width: min(1440px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px 0 60px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  margin-bottom: 18px;
  overflow-x: auto;
  color: #9ca3af;
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

.breadcrumb__link:hover {
  color: #047857;
}

.breadcrumb__current {
  color: #1f2937;
  font-weight: 700;
}

.breadcrumb__separator {
  color: #cbd5e1;
}

/* ========================================
   Quick filters
======================================== */

.quick-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  padding-bottom: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.quick-filters::-webkit-scrollbar {
  display: none;
}

.quick-filter {
  flex: 0 0 auto;
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid #dbe5df;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.9);
  color: #475569;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.quick-filter:hover {
  border-color: #6ee7b7;
  color: #047857;
}

.quick-filter--active {
  border-color: #047857;
  background: #047857;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(4, 120, 87, 0.18);
}

/* ========================================
   Layout
======================================== */

.products-layout {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

/* ========================================
   Filters panel
======================================== */

.filters-panel {
  position: sticky;
  top: 18px;
  padding: 20px;
  border: 1px solid #e6eee9;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.06);
}

.filters-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf2ef;
}

.filters-panel__title {
  margin: 0;
  color: #1f2937;
  font-size: 17px;
  font-weight: 900;
}

.filters-panel__count {
  display: block;
  margin-top: 6px;
  color: #059669;
  font-size: 11px;
  font-weight: 700;
}

.filters-panel__close {
  display: none;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 23px;
  cursor: pointer;
}

.filter-group {
  padding: 20px 0;
  border-bottom: 1px solid #edf2ef;
}

.filter-group__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-group__title {
  margin: 0 0 14px;
  color: #334155;
  font-size: 14px;
  font-weight: 900;
}

.filter-group__reset {
  margin-bottom: 14px;
  padding: 0;
  border: 0;
  background: none;
  color: #dc2626;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
}

.selected-category {
  margin-bottom: 12px;
  padding: 9px 11px;
  border-radius: 10px;
  background: #ecfdf5;
  color: #047857;
  font-size: 12px;
  font-weight: 800;
}

.category-search {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 0 12px;
  border: 1px solid #dfe7e2;
  border-radius: 11px;
  background: #f8fafc;
  color: #334155;
  font-family: inherit;
  outline: none;
}

.category-search:focus {
  border-color: #34d399;
  background: #ffffff;
}

.filter-loading {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.spinner {
  width: 25px;
  height: 25px;
  border: 3px solid #d1fae5;
  border-top-color: #059669;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.categories-list {
  max-height: 330px;
  overflow-y: auto;
}

.category-item {
  margin-bottom: 3px;
}

.category-row {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  gap: 8px;
  padding: 0 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #475569;
  font-family: inherit;
  text-align: right;
  cursor: pointer;
}

.category-row:hover,
.category-row--active {
  background: #ecfdf5;
  color: #047857;
}

.category-row__name {
  flex: 1;
  font-size: 13px;
  font-weight: 700;
}

.category-row__count {
  color: #94a3b8;
  font-size: 11px;
}

.category-row__arrow {
  width: 15px;
  height: 15px;
  transition: 0.2s ease;
}

.category-row__arrow--open {
  transform: rotate(180deg);
}

.subcategories {
  margin: 5px 14px 8px 0;
  padding-right: 10px;
  border-right: 2px solid #d1fae5;
}

.subcategory {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 8px 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-family: inherit;
  font-size: 12px;
  text-align: right;
  cursor: pointer;
}

.subcategory:hover,
.subcategory--active {
  background: #f0fdf4;
  color: #047857;
}

.price-inputs {
  display: grid;
  gap: 10px;
}

.price-field {
  display: grid;
  gap: 6px;
}

.price-field span {
  color: #64748b;
  font-size: 11px;
}

.price-field input {
  width: 100%;
  height: 40px;
  padding: 0 11px;
  border: 1px solid #dfe7e2;
  border-radius: 10px;
  background: #f8fafc;
  color: #334155;
  font-family: inherit;
  outline: none;
}

.price-field input:focus {
  border-color: #34d399;
  background: #ffffff;
}

.apply-price-button {
  width: 100%;
  height: 40px;
  margin-top: 12px;
  border: 0;
  border-radius: 11px;
  background: #ecfdf5;
  color: #047857;
  font-family: inherit;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.apply-price-button:hover {
  background: #d1fae5;
}

.switch-row {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 43px;
  cursor: pointer;
}

.switch-row input {
  position: absolute;
  opacity: 0;
}

.switch-row__label {
  flex: 1;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}

.switch {
  position: relative;
  width: 40px;
  height: 23px;
  border-radius: 999px;
  background: #cbd5e1;
  transition: 0.2s ease;
}

.switch::after {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #ffffff;
  content: "";
  transition: 0.2s ease;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.22);
}

.switch-row input:checked + .switch {
  background: #059669;
}

.switch-row input:checked + .switch::after {
  transform: translateX(-17px);
}

.clear-all-button {
  width: 100%;
  height: 43px;
  margin-top: 18px;
  border: 1px solid #fecaca;
  border-radius: 12px;
  background: #fff7f7;
  color: #dc2626;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.clear-all-button:hover {
  background: #fee2e2;
}

/* ========================================
   Products content
======================================== */

.products-content {
  min-width: 0;
}

.products-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  margin-bottom: 18px;
  padding: 14px 18px;
  border: 1px solid #e6eee9;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.045);
}

.products-toolbar__start {
  display: flex;
  align-items: center;
  gap: 12px;
}

.products-toolbar__title {
  margin: 0;
  color: #1e293b;
  font-size: 17px;
  font-weight: 900;
}

.products-toolbar__count {
  margin: 5px 0 0;
  color: #94a3b8;
  font-size: 12px;
}

.mobile-filter-button {
  display: none;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dbe5df;
  border-radius: 11px;
  background: #f8fafc;
  color: #475569;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
}

.mobile-filter-button svg {
  width: 18px;
  height: 18px;
}

.mobile-filter-button__count {
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  background: #059669;
  color: #ffffff;
  font-size: 10px;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #64748b;
  font-size: 12px;
}

.sort-control select {
  height: 41px;
  min-width: 150px;
  padding: 0 12px;
  border: 1px solid #dbe5df;
  border-radius: 11px;
  background: #f8fafc;
  color: #334155;
  font-family: inherit;
  outline: none;
  cursor: pointer;
}

/* ========================================
   Grid
======================================== */

.products-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 16px;
}

/* ========================================
   Skeleton
======================================== */

.product-skeleton {
  overflow: hidden;
  border: 1px solid #e6eee9;
  border-radius: 18px;
  background: #ffffff;
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
  animation: skeleton 1.3s infinite;
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
  animation: skeleton 1.3s infinite;
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

/* ========================================
   Empty and error
======================================== */

.message-state {
  display: flex;
  min-height: 400px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px 20px;
  border: 1px solid #e6eee9;
  border-radius: 20px;
  background: #ffffff;
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

.message-state h3 {
  margin: 0;
  color: #1e293b;
  font-size: 19px;
}

.message-state p {
  margin: 10px 0 22px;
  color: #64748b;
  font-size: 13px;
}

.message-state button {
  min-height: 42px;
  padding: 0 20px;
  border: 0;
  border-radius: 12px;
  background: #059669;
  color: #ffffff;
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
}

/* ========================================
   Pagination
======================================== */

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 30px;
}

.pagination__button {
  display: grid;
  place-items: center;
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  border: 1px solid #dbe5df;
  border-radius: 11px;
  background: #ffffff;
  color: #475569;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.pagination__button:hover:not(:disabled) {
  border-color: #6ee7b7;
  color: #047857;
}

.pagination__button--active {
  border-color: #047857;
  background: #047857;
  color: #ffffff;
}

.pagination__button--arrow {
  font-size: 24px;
}

.pagination__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__dots {
  color: #94a3b8;
}

/* ========================================
   Mobile filters
======================================== */

.filters-overlay {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========================================
   Animations
======================================== */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes skeleton {
  to {
    background-position: -200% 0;
  }
}

/* ========================================
   Responsive
======================================== */

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

  .filters-panel {
    position: fixed;
    z-index: 1001;
    top: 0;
    right: 0;
    width: min(340px, 88vw);
    height: 100dvh;
    overflow-y: auto;
    border-radius: 0;
    transform: translateX(110%);
    transition: transform 0.25s ease;
  }

  .filters-panel--open {
    transform: translateX(0);
  }

  .filters-panel__close {
    display: block;
  }

  .mobile-filter-button {
    display: inline-flex;
  }

  .filters-overlay {
    position: fixed;
    z-index: 1000;
    inset: 0;
    display: block;
    border: 0;
    background: rgba(15, 23, 42, 0.48);
    backdrop-filter: blur(2px);
  }
}

@media (max-width: 720px) {
  .store-hero {
    padding: 36px 16px 45px;
  }

  .page-container {
    width: min(100% - 22px, 1440px);
    padding-top: 16px;
  }

  .products-toolbar {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .products-toolbar__start {
    justify-content: space-between;
  }

  .sort-control {
    justify-content: space-between;
  }

  .sort-control select {
    flex: 1;
  }

  .products-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}

@media (max-width: 420px) {
  .store-hero__description {
    font-size: 13px;
  }

  .main-search__input {
    height: 53px;
    font-size: 13px;
  }

  .products-toolbar__title {
    font-size: 15px;
  }

  .products-toolbar__count {
    font-size: 11px;
  }
}
</style>
