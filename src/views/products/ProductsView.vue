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

          <!-- فیلتر قیمت -->
          <div class="filter-section">
            <h3>محدوده قیمت</h3>
            <div class="price-range">
              <input 
                type="number" 
                v-model="filters.min_price" 
                placeholder="از"
                @change="handlePriceChange"
              >
              <input 
                type="number" 
                v-model="filters.max_price" 
                placeholder="تا"
                @change="handlePriceChange"
              >
            </div>
          </div>

          <!-- فیلتر موجودی -->
          <div class="filter-section">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="filters.in_stock" 
                @change="handleStockChange"
              >
              فقط محصولات موجود
            </label>
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
              <option value="discount">بیشترین تخفیف</option>
            </select>
          </div>

          <!-- وضعیت بارگذاری -->
          <div v-if="loading" class="products-loading">
            <div class="spinner"></div>
            <p>در حال بارگذاری محصولات...</p>
          </div>

          <!-- پیام خطا -->
          <div v-else-if="error" class="products-error">
            <p>⚠️ {{ error }}</p>
            <button @click="loadProducts" class="retry-btn">تلاش مجدد</button>
          </div>

          <!-- لیست محصولات -->
          <div v-else-if="products.length" class="products-grid">
            <div v-for="product in products" :key="product.id" class="product-card">
              <router-link :to="`/product/${product.slug}`" class="product-card__link">
                <div class="product-card__image">
                  <img 
                    :src="getProductImage(currentImage(product))" 
                    :alt="product.name"
                    width="300"
                    height="300"
                    loading="lazy"
                    @error="handleImageError"
                  >
                  
                  <!-- نشانگر تعداد واریانت‌ها -->
                  <div v-if="product.variants?.length > 1" class="variants-badge">
                    {{ product.variants.length }} مدل
                  </div>

                  <!-- برچسب تخفیف -->
                  <div v-if="product.discount_price || hasDiscountVariant(product)" class="discount-badge">
                    ٪{{ calculateMaxDiscount(product) }} تخفیف
                  </div>
                </div>
                
                <div class="product-card__content">
                  <h3 class="product-card__title">{{ product.name }}</h3>
                  <p class="product-card__category">{{ product.category }}</p>
                  
                  <!-- نمایش واریانت‌ها -->
                  <div v-if="product.variants?.length > 0" class="product-variants">
                    <!-- واریانت‌های رنگی -->
                    <div v-if="hasColorVariants(product)" class="variant-section">
                      <span class="variant-label">رنگ:</span>
                      <div class="color-variants">
                        <button
                          v-for="variant in getColorVariants(product)"
                          :key="variant.id"
                          class="color-variant"
                          :class="{ 
                            'selected': selectedVariants[product.id]?.id === variant.id,
                            'out-of-stock': !variant.in_stock 
                          }"
                          :style="{ backgroundColor: variant.color_code || '#ccc' }"
                          :title="variant.name"
                          @click.prevent="selectVariant(product.id, variant)"
                          @mouseenter.prevent="previewVariant(product.id, variant)"
                          @mouseleave.prevent="resetPreview(product.id)"
                        ></button>
                      </div>
                    </div>

                    <!-- واریانت‌های سایز -->
                    <div v-else-if="hasSizeVariants(product)" class="variant-section">
                      <span class="variant-label">سایز:</span>
                      <div class="size-variants">
                        <button
                          v-for="variant in getSizeVariants(product)"
                          :key="variant.id"
                          class="size-variant"
                          :class="{ 
                            'selected': selectedVariants[product.id]?.id === variant.id,
                            'out-of-stock': !variant.in_stock 
                          }"
                          @click.prevent="selectVariant(product.id, variant)"
                          @mouseenter.prevent="previewVariant(product.id, variant)"
                          @mouseleave.prevent="resetPreview(product.id)"
                        >
                          {{ variant.name }}
                        </button>
                      </div>
                    </div>

                    <!-- لیست کشویی برای سایر واریانت‌ها -->
                    <div v-else class="variant-section">
                      <span class="variant-label">نوع:</span>
                      <select 
                        class="variant-select"
                        @change="(e) => selectVariantFromSelect(product.id, e)"
                        :value="selectedVariants[product.id]?.id"
                      >
                        <option value="">انتخاب کنید</option>
                        <option 
                          v-for="variant in product.variants" 
                          :key="variant.id"
                          :value="variant.id"
                          :disabled="!variant.in_stock"
                        >
                          {{ variant.name }} 
                          <span v-if="variant.price !== product.price">
                            ({{ formatPrice(variant.price) }} تومان)
                          </span>
                          <span v-if="!variant.in_stock"> - ناموجود</span>
                        </option>
                      </select>
                    </div>
                  </div>
                  
                  <!-- قیمت -->
                  <div class="product-card__price">
                    <template v-if="selectedVariants[product.id]">
                      <!-- قیمت واریانت انتخاب شده -->
                      <span class="current-price">
                        {{ formatPrice(selectedVariants[product.id].discount_price || selectedVariants[product.id].price) }} تومان
                      </span>
                      <span v-if="selectedVariants[product.id].discount_price" class="old-price">
                        {{ formatPrice(selectedVariants[product.id].price) }} تومان
                      </span>
                    </template>
                    
                    <template v-else-if="product.variants?.length > 1">
                      <!-- محدوده قیمت برای محصولات با چند واریانت -->
                      <span class="price-label">از</span>
                      <span class="current-price">{{ formatPrice(minVariantPrice(product)) }} تومان</span>
                    </template>
                    
                    <template v-else>
                      <!-- قیمت عادی -->
                      <span class="current-price">
                        {{ formatPrice(product.discount_price || product.price) }} تومان
                      </span>
                      <span v-if="product.discount_price" class="old-price">
                        {{ formatPrice(product.price) }} تومان
                      </span>
                    </template>
                  </div>
                </div>
              </router-link>
              
              <!-- دکمه افزودن به سبد خرید -->
              <button 
                class="product-card__add-to-cart"
                @click="addToCart(product)"
                :disabled="!isProductAvailable(product) || isAddingToCart[product.id]"
              >
                <span v-if="isAddingToCart[product.id]">⏳ در حال افزودن...</span>
                <span v-else>{{ getAddToCartButtonText(product) }}</span>
              </button>
            </div>
          </div>

          <!-- حالت خالی -->
          <div v-else class="products-empty">
            <p>محصولی یافت نشد</p>
            <button @click="resetFilters" class="reset-filters-btn">حذف فیلترها</button>
          </div>

          <!-- صفحه‌بندی -->
          <div v-if="pagination.total_pages > 1" class="products-pagination">
            <button 
              :disabled="pagination.current_page === 1"
              @click="handlePageChange(pagination.current_page - 1)"
              class="pagination-btn"
            >
              قبلی
            </button>
            
            <div class="pagination-numbers">
              <button 
                v-for="page in getDisplayedPages()" 
                :key="page"
                class="pagination-number"
                :class="{ active: page === pagination.current_page }"
                @click="handlePageChange(page)"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              :disabled="pagination.current_page === pagination.total_pages"
              @click="handlePageChange(pagination.current_page + 1)"
              class="pagination-btn"
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/core/store/cartStore'
import type { Product, ProductVariant } from '@/types/product.types'

// ========== Router ==========
const router = useRouter()
const route = useRoute()

// ========== Stores ==========
const cartStore = useCartStore()

// ========== State ==========
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const isAddingToCart = ref<Record<number, boolean>>({})

const pagination = reactive({
  current_page: 1,
  total_pages: 1,
  total_products: 0
})

const filters = reactive({
  category: '',
  ordering: '',
  min_price: '',
  max_price: '',
  in_stock: false
})

const selectedVariants = ref<Record<number, ProductVariant | null>>({})
const previewVariants = ref<Record<number, ProductVariant | null>>({})

// ========== Computed ==========
const totalProducts = () => pagination.total_products

// ========== Methods ==========

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
      ...(filters.ordering && { ordering: filters.ordering }),
      ...(filters.min_price && { min_price: filters.min_price }),
      ...(filters.max_price && { max_price: filters.max_price }),
      ...(filters.in_stock && { in_stock: true })
    }
    
    const response = await productService.getProducts(params)
    
    products.value = response.data
    pagination.current_page = response.current_page
    pagination.total_pages = response.total_pages
    pagination.total_products = response.count
    
    // ریست واریانت‌های انتخاب شده برای محصولات جدید
    products.value.forEach(product => {
      if (product.variants?.length === 1) {
        selectedVariants.value[product.id] = product.variants[0]
      }
    })
    
    // به‌روزرسانی URL
    updateUrlParams()
    
  } catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری محصولات'
  } finally {
    loading.value = false
  }
}

/**
 * به‌روزرسانی پارامترهای URL
 */
const updateUrlParams = () => {
  const query: any = {}
  
  if (filters.category) query.category = filters.category
  if (filters.ordering) query.sort = filters.ordering
  if (filters.min_price) query.min_price = filters.min_price
  if (filters.max_price) query.max_price = filters.max_price
  if (filters.in_stock) query.in_stock = 'true'
  if (pagination.current_page > 1) query.page = pagination.current_page
  
  router.push({ query })
}

/**
 * خواندن فیلترها از URL
 */
const readFiltersFromUrl = () => {
  const query = route.query
  
  filters.category = (query.category as string) || ''
  filters.ordering = (query.sort as string) || ''
  filters.min_price = (query.min_price as string) || ''
  filters.max_price = (query.max_price as string) || ''
  filters.in_stock = query.in_stock === 'true'
  
  const page = query.page ? parseInt(query.page as string) : 1
  return page
}

// ========== Event Handlers ==========

const handleCategoryChange = () => {
  loadProducts(1)
}

const handleOrderingChange = () => {
  loadProducts(1)
}

const handlePriceChange = () => {
  loadProducts(1)
}

const handleStockChange = () => {
  loadProducts(1)
}

const handlePageChange = (page: number) => {
  loadProducts(page)
  // اسکرول به بالای صفحه
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetFilters = () => {
  filters.category = ''
  filters.ordering = ''
  filters.min_price = ''
  filters.max_price = ''
  filters.in_stock = false
  loadProducts(1)
}

// ========== Variant Methods ==========

const hasColorVariants = (product: Product): boolean => {
  return product.variants?.some(v => v.type === 'color' || v.color_code) || false
}

const hasSizeVariants = (product: Product): boolean => {
  return product.variants?.some(v => v.type === 'size') || false
}

const getColorVariants = (product: Product): ProductVariant[] => {
  return product.variants?.filter(v => v.type === 'color' || v.color_code) || []
}

const getSizeVariants = (product: Product): ProductVariant[] => {
  return product.variants?.filter(v => v.type === 'size') || []
}

const hasDiscountVariant = (product: Product): boolean => {
  return product.variants?.some(v => v.discount_price) || false
}

const calculateMaxDiscount = (product: Product): number => {
  let maxDiscount = 0
  
  if (product.discount_price) {
    maxDiscount = Math.round(((product.price - product.discount_price) / product.price) * 100)
  }
  
  product.variants?.forEach(variant => {
    if (variant.discount_price) {
      const discount = Math.round(((variant.price - variant.discount_price) / variant.price) * 100)
      if (discount > maxDiscount) {
        maxDiscount = discount
      }
    }
  })
  
  return maxDiscount
}

const minVariantPrice = (product: Product): number => {
  if (!product.variants?.length) return product.price
  
  const prices = product.variants.map(v => v.discount_price || v.price)
  return Math.min(...prices)
}

const selectVariant = (productId: number, variant: ProductVariant) => {
  if (variant.in_stock) {
    selectedVariants.value[productId] = variant
  }
}

const selectVariantFromSelect = (productId: number, event: Event) => {
  const select = event.target as HTMLSelectElement
  const variantId = Number(select.value)
  
  if (!variantId) {
    selectedVariants.value[productId] = null
    return
  }
  
  const product = products.value.find(p => p.id === productId)
  const variant = product?.variants?.find(v => v.id === variantId)
  
  if (variant) {
    selectVariant(productId, variant)
  }
}

const previewVariant = (productId: number, variant: ProductVariant) => {
  if (variant.image) {
    previewVariants.value[productId] = variant
  }
}

const resetPreview = (productId: number) => {
  previewVariants.value[productId] = null
}

const currentImage = (product: Product): string => {
  const previewVariant = previewVariants.value[product.id]
  if (previewVariant?.image) {
    return previewVariant.image
  }
  
  const selectedVariant = selectedVariants.value[product.id]
  if (selectedVariant?.image) {
    return selectedVariant.image
  }
  
  return product.thumb
}

const isProductAvailable = (product: Product): boolean => {
  if (product.variants?.length) {
    if (product.variants.length > 1) {
      const selected = selectedVariants.value[product.id]
      return selected ? selected.in_stock : product.variants.some(v => v.in_stock)
    } else {
      return product.variants[0]?.in_stock || false
    }
  }
  return product.in_stock
}

const getAddToCartButtonText = (product: Product): string => {
  if (product.variants?.length > 1) {
    const selected = selectedVariants.value[product.id]
    if (!selected) return 'ابتدا یک مدل انتخاب کنید'
    return selected.in_stock ? 'افزودن به سبد خرید' : 'ناموجود'
  }
  
  if (product.variants?.length === 1) {
    return product.variants[0].in_stock ? 'افزودن به سبد خرید' : 'ناموجود'
  }
  
  return product.in_stock ? 'افزودن به سبد خرید' : 'ناموجود'
}

// ========== Cart Methods ==========

const addToCart = async (product: Product) => {
  let variantId: number
  
  if (product.variants?.length > 1) {
    const selectedVariant = selectedVariants.value[product.id]
    
    if (!selectedVariant) {
      alert('لطفاً ابتدا یک مدل از محصول را انتخاب کنید')
      return
    }
    
    if (!selectedVariant.in_stock) {
      alert('این مدل محصول موجود نیست')
      return
    }
    
    variantId = selectedVariant.id
  } else if (product.variants?.length === 1) {
    if (!product.variants[0].in_stock) {
      alert('این محصول موجود نیست')
      return
    }
    variantId = product.variants[0].id
  } else {
    if (!product.in_stock) {
      alert('این محصول موجود نیست')
      return
    }
    variantId = product.id
  }
  
  isAddingToCart.value[product.id] = true
  
  try {
    await cartStore.addItem({
      variant_id: variantId,
      quantity: 1
    })
    
    // بازخورد موفقیت
    const button = document.activeElement as HTMLElement
    button?.classList.add('success')
    setTimeout(() => button?.classList.remove('success'), 1000)
    
  } catch (error: any) {
    alert(error.message || 'خطا در افزودن به سبد خرید')
  } finally {
    isAddingToCart.value[product.id] = false
  }
}

// ========== Utility Methods ==========

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const getProductImage = (thumb: string) => {
  return productService.getProductImageUrl(thumb)
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/placeholder-product.jpg' // تصویر پیش‌فرض لوکال
  img.onerror = null // جلوگیری از حلقه بی‌نهایت
}

const getDisplayedPages = () => {
  const total = pagination.total_pages
  const current = pagination.c
