<template>
  <div class="products-page">
    <div class="products-header">
      <div class="products-header__container">
        <h1 class="products-header__title">محصولات</h1>
        <p class="products-header__count">{{ totalProducts }} محصول</p>
      </div>
    </div>

    <div class="products-container">
      <div class="products-layout">
        <!-- فیلترها -->
        <ProductFilters 
          v-model:filters="filters"
          @update:filters="handleFilterChange"
        />

        <main class="products-main">
          <!-- مرتب‌سازی -->
          <ProductSort v-model:sort="filters.ordering" @update:sort="handleSortChange" />

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
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              :selected-variant="selectedVariants[product.id]"
              @select-variant="selectVariant"
              @add-to-cart="addToCart"
            />
          </div>

          <!-- حالت خالی -->
          <div v-else class="products-empty">
            <p>محصولی یافت نشد</p>
            <button @click="resetFilters" class="reset-filters-btn">حذف فیلترها</button>
          </div>

          <!-- صفحه‌بندی -->
          <ProductPagination
            v-if="pagination.total_pages > 1"
            :current-page="pagination.current_page"
            :total-pages="pagination.total_pages"
            @page-change="handlePageChange"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProductFilters from '@/components/products/ProductFilters.vue'
import ProductSort from '@/components/products/ProductSort.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import ProductPagination from '@/components/products/ProductPagination.vue'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/core/store/cartStore'
import type { Product, ProductVariant } from '@/types/product.types'

const route = useRoute()
const cartStore = useCartStore()

const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedVariants = ref<Record<number, ProductVariant | null>>({})

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

const totalProducts = computed(() => pagination.total_products)

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
    
    updateUrlParams()
    
  } catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری محصولات'
  } finally {
    loading.value = false
  }
}

const updateUrlParams = () => {
  const query: any = {}
  if (filters.category) query.category = filters.category
  if (filters.ordering) query.sort = filters.ordering
  if (filters.min_price) query.min_price = filters.min_price
  if (filters.max_price) query.max_price = filters.max_price
  if (filters.in_stock) query.in_stock = 'true'
  if (pagination.current_page > 1) query.page = pagination.current_page
  
  useRouter().push({ query })
}

const handleFilterChange = () => loadProducts(1)
const handleSortChange = () => loadProducts(1)
const handlePageChange = (page: number) => loadProducts(page)

const selectVariant = (productId: number, variant: ProductVariant) => {
  if (variant.in_stock) {
    selectedVariants.value[productId] = variant
  }
}

const addToCart = async (product: Product) => {
  let variantId: number
  
  if (product.variants?.length > 1) {
    const selected = selectedVariants.value[product.id]
    if (!selected) return alert('لطفاً یک مدل انتخاب کنید')
    variantId = selected.id
  } else if (product.variants?.length === 1) {
    variantId = product.variants[0].id
  } else {
    variantId = product.id
  }
  
  try {
    await cartStore.addItem({ variant_id: variantId, quantity: 1 })
  } catch (err: any) {
    alert(err.message)
  }
}

onMounted(() => {
  const query = route.query
  filters.category = (query.category as string) || ''
  filters.ordering = (query.sort as string) || ''
  filters.min_price = (query.min_price as string) || ''
  filters.max_price = (query.max_price as string) || ''
  filters.in_stock = query.in_stock === 'true'
  
  const page = query.page ? parseInt(query.page as string) : 1
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

.products-main {
  min-width: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.products-loading,
.products-error,
.products-empty {
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

.retry-btn,
.reset-filters-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .products-layout {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>
