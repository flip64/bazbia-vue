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
                    %{{ calculateMaxDiscount(product) }} تخفیف
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
import { ref, reactive, onMounted, watch, computed } from 'vue'
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
const totalProducts = computed(() => pagination.total_products)

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
  img.src = '/images/placeholder-product.jpg'
  img.onerror = null
}

const getDisplayedPages = () => {
  const total = pagination.total_pages
  const current = pagination.current_page
  const delta = 2
  
  const range: number[] = []
  
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }
  
  return range
}

// ========== Lifecycle ==========
onMounted(() => {
  const page = readFiltersFromUrl()
  loadProducts(page)
})

// ========== Watchers ==========
watch(() => route.query, () => {
  const page = readFiltersFromUrl()
  loadProducts(page)
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f8f9fa;
  direction: rtl;
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
  font-weight: bold;
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
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.products-sidebar {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.filter-section {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.5rem;
}

.filter-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.filter-section h3 {
  color: #374151;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.filter-section select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
}

.price-range {
  display: flex;
  gap: 0.5rem;
}

.price-range input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #374151;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.products-main {
  min-width: 0;
}

.products-toolbar {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-end;
}

.products-toolbar select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  min-width: 200px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
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
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
  background: #f3f4f6;
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

.variants-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(102, 126, 234, 0.95);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ef4444;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 2;
}

.product-card__content {
  padding: 1rem;
}

.product-card__title {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.25rem;
  line-height: 1.4;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__category {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.product-variants {
  margin: 0.75rem 0;
}

.variant-section {
  margin-bottom: 0.75rem;
}

.variant-label {
  font-size: 0.75rem;
  color: #6b7280;
  display: block;
  margin-bottom: 0.25rem;
}

.color-variants {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.color-variant {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.color-variant.selected {
  border-color: #667eea;
  transform: scale(1.1);
  box-shadow: 0 0 0 2px white, 0 0 0 4px #667eea;
}

.color-variant.out-of-stock {
  opacity: 0.5;
  cursor: not-allowed;
  position: relative;
}

.color-variant.out-of-stock::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #ef4444;
  transform: rotate(45deg);
}

.size-variants {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.size-variant {
  min-width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  padding: 0 0.5rem;
}

.size-variant.selected {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.size-variant.out-of-stock {
  opacity: 0.5;
  cursor: not-allowed;
  text-decoration: line-through;
}

.variant-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.85rem;
  background: white;
}

.product-card__price {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.current-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #667eea;
  margin-left: 0.5rem;
}

.old-price {
  font-size: 0.85rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.price-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-left: 0.25rem;
}

.product-card__add-to-cart {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  font-weight: 500;
}

.product-card__add-to-cart:hover:not(:disabled) {
  background: #5a67d8;
}

.product-card__add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.product-card__add-to-cart.success {
  background: #10b981;
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

.products-error {
  text-align: center;
  padding: 3rem;
  color: #ef4444;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
}

.products-empty {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.reset-filters-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #e5e7eb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #374151;
}

.products-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
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

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-number {
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

.pagination-number:hover {
  background: #f3f4f6;
}

.pagination-number.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
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

  .products-sidebar {
    position: static;
    margin-bottom: 1rem;
  }

  .product-card__title {
    font-size: 0.9rem;
  }

  .current-price {
    font-size: 1rem;
  }

  .color-variant {
    width: 24px;
    height: 24px;
  }

  .size-variant {
    min-width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}
</style>
