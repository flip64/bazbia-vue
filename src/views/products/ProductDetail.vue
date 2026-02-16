<template>
  <div class="product-detail-page">
    <!-- حالت بارگذاری -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری محصول...</p>
    </div>

    <!-- خطا -->
    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
      <button @click="goBack" class="back-btn">بازگشت به محصولات</button>
    </div>

    <!-- محصول پیدا نشد -->
    <div v-else-if="!product" class="not-found-state">
      <p>🔍 محصولی یافت نشد</p>
      <button @click="goBack" class="back-btn">بازگشت به محصولات</button>
    </div>

    <!-- نمایش محصول -->
    <div v-else class="product-detail">
      <div class="product-detail__container">
        <!-- مسیر راهنما -->
        <nav class="breadcrumb">
          <router-link to="/">خانه</router-link> /
          <router-link to="/products">محصولات</router-link> /
          <span>{{ product.name }}</span>
        </nav>

        <div class="product-detail__content">
          <!-- گالری -->
          <div class="product-gallery">
            <div class="product-gallery__main">
              <img 
                :src="currentImage" 
                :alt="product.name"
                @error="handleImageError"
              >
            </div>

            <div v-if="product.images?.length > 1" class="product-gallery__thumbs">
              <button 
                v-for="(img, index) in product.images" 
                :key="index"
                class="thumb-btn"
                :class="{ 'thumb-btn--active': currentImage === img.image }"
                @click="currentImage = img.image"
              >
                <img :src="img.image" :alt="`تصویر ${index + 1}`">
              </button>
            </div>
          </div>

          <!-- اطلاعات محصول -->
          <div class="product-info">
            <h1 class="product-info__title">{{ product.name }}</h1>

            <!-- برچسب‌ها -->
            <div v-if="product.tags?.length" class="product-info__tags">
              <span v-for="tag in product.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>

            <!-- قیمت -->
            <div class="product-info__price-section" v-if="currentVariant">
              <div class="product-info__price">
                <span class="current-price">
                  {{ formatPrice(currentVariant.discount_price || currentVariant.price) }} تومان
                </span>
                <span v-if="currentVariant.discount_price" class="old-price">
                  {{ formatPrice(currentVariant.price) }} تومان
                </span>
              </div>

              <!-- موجودی -->
              <div class="product-info__stock" :class="stockClass">
                {{ stockText }}
              </div>
            </div>

            <!-- مشخصات فنی -->
            <div v-if="product.specifications?.length" class="product-info__specs">
              <h3>مشخصات</h3>
              <table class="specs-table">
                <tr v-for="spec in product.specifications" :key="spec.name">
                  <th>{{ spec.name }}</th>
                  <td>{{ spec.value }}</td>
                </tr>
              </table>
            </div>

            <!-- توضیحات -->
            <div v-if="product.description" class="product-info__description">
              <h3>توضیحات</h3>
              <p>{{ product.description }}</p>
            </div>

            <!-- دکمه‌ها -->
            <div class="product-info__actions">
              <button 
                class="add-to-cart-btn" 
                @click="addToCart"
                :disabled="!isInStock"
              >
                {{ isInStock ? 'افزودن به سبد خرید' : 'ناموجود' }}
              </button>

              <button class="wishlist-btn" @click="addToWishlist">
                ♡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/product.service'
import type { ProductDetail, Variant } from '@/types/product.types'

// ========== دیباگ ==========
console.log('🔥 PRODUCT DETAIL COMPONENT LOADED')
console.log('🕐 Time:', new Date().toISOString())

// ========== روت و روت‌ر ==========
const route = useRoute()
const router = useRouter()

console.log('📍 Route params:', route.params)

// ========== stateها ==========
const loading = ref(false)
const error = ref<string | null>(null)
const product = ref<ProductDetail | null>(null)
const currentImage = ref('')
const selectedVariantId = ref<number | null>(null)

// ========== computed properties ==========
const currentVariant = computed<Variant | null>(() => {
  if (!product.value || !product.value.variants?.length) return null

  if (selectedVariantId.value) {
    return product.value.variants.find(v => v.id === selectedVariantId.value) || product.value.variants[0]
  }

  return product.value.variants[0]
})

const isInStock = computed(() => currentVariant.value ? currentVariant.value.stock > 0 : false)

const stockClass = computed(() => {
  if (!currentVariant.value) return {}
  return {
    'in-stock': currentVariant.value.stock > 5,
    'low-stock': currentVariant.value.stock > 0 && currentVariant.value.stock <= 5,
    'out-of-stock': currentVariant.value.stock === 0
  }
})

const stockText = computed(() => {
  if (!currentVariant.value) return ''
  if (currentVariant.value.stock > 5) return 'موجود در انبار'
  if (currentVariant.value.stock > 0) return `تنها ${currentVariant.value.stock} عدد باقی‌مانده`
  return 'ناموجود'
})

// ========== توابع ==========
const formatPrice = (price: string | number) => {
  return productService.formatPrice(Number(price))
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/600x600?text=عکس+موجود+نیست'
}

const fetchProduct = async () => {
  console.log('🎯 fetchProduct STARTED')
  
  const slug = route.params.slug as string
  console.log('📌 slug:', slug)
  
  if (!slug) {
    console.log('⚠️ slug پیدا نشد')
    return
  }

  loading.value = true
  error.value = null

  try {
    console.log('📡 در حال دریافت محصول...')
    const res = await productService.getProductBySlug(slug)
    const data = res.data ?? res
    console.log('✅ محصول دریافت شد:', data)

    product.value = data

    if (data.images?.length) {
      const main = data.images.find(i => i.is_main) || data.images[0]
      currentImage.value = main.image
    }

    selectedVariantId.value = data.variants?.[0]?.id ?? null

  } catch (err: any) {
    console.error('❌ خطا:', err)
    error.value = err?.response?.data?.detail || err?.message || 'خطا در دریافت اطلاعات محصول'
  } finally {
    loading.value = false
    console.log('🏁 تمام شد')
  }
}

const addToCart = () => {
  if (!currentVariant.value || !isInStock.value) return
  console.log('🛒 افزودن به سبد خرید:', {
    productId: product.value?.id,
    variantId: currentVariant.value.id
  })
}

const addToWishlist = () => {
  console.log('❤️ افزودن به علاقه‌مندی‌ها:', product.value?.id)
}

const goBack = () => {
  router.push('/products')
}

// ========== lifecycle ==========
onMounted(() => {
  console.log('✅ onMounted اجرا شد')
  fetchProduct()
})

watch(() => route.params.slug, (newSlug) => {
  console.log('🔄 slug تغییر کرد:', newSlug)
  fetchProduct()
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: #f8f9fa;
  font-family: sans-serif;
}

.product-detail__container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* مسیر راهنما */
.breadcrumb {
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a {
  color: #0066cc;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.product-detail__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

/* گالری */
.product-gallery__main {
  position: relative;
  aspect-ratio: 1/1;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
}

.product-gallery__main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-gallery__thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.thumb-btn {
  border: 2px solid transparent;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  aspect-ratio: 1/1;
}

.thumb-btn:hover {
  border-color: #0066cc;
}

.thumb-btn--active {
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0,102,204,0.2);
}

.thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* اطلاعات محصول */
.product-info__title {
  font-size: 2rem;
  margin: 0 0 1rem;
  color: #333;
}

.product-info__tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tag {
  background: #f0f0f0;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.85rem;
}

.product-info__price-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.current-price {
  font-size: 2rem;
  font-weight: bold;
  color: #28a745;
  margin-left: 1rem;
}

.old-price {
  font-size: 1.25rem;
  color: #999;
  text-decoration: line-through;
}

.product-info__stock {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.in-stock {
  background: #d4edda;
  color: #155724;
}

.low-stock {
  background: #fff3cd;
  color: #856404;
}

.out-of-stock {
  background: #f8d7da;
  color: #721c24;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.specs-table tr {
  border-bottom: 1px solid #eee;
}

.specs-table th,
.specs-table td {
  padding: 0.75rem;
  text-align: right;
}

.specs-table th {
  color: #666;
  font-weight: normal;
  width: 40%;
}

.specs-table td {
  color: #333;
  font-weight: 500;
}

.product-info__actions {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.add-to-cart-btn {
  flex: 1;
  padding: 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-cart-btn:hover {
  background: #218838;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.wishlist-btn {
  width: 3rem;
  height: 3rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.wishlist-btn:hover {
  border-color: #dc3545;
  color: #dc3545;
}

.loading-state,
.error-state,
.not-found-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top-color: #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.back-btn {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .product-detail__content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .product-detail__container {
    padding: 1rem;
  }
}
</style>
