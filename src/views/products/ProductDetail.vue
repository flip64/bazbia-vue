<template>
  <div class="product-detail-page">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری محصول...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
      <button @click="goBack" class="back-btn">بازگشت به محصولات</button>
    </div>

    <div v-else-if="product" class="product-detail">
      <div class="product-detail__container">
        <!-- مسیریاب -->
        <nav class="breadcrumb">
          <router-link to="/">خانه</router-link> /
          <router-link to="/products">محصولات</router-link> /
          <router-link :to="`/category/${product.category.slug}`">
            {{ product.category.name }}
          </router-link> /
          <span>{{ product.name }}</span>
        </nav>

        <div class="product-detail__content">
          <!-- گالری تصاویر -->
          <div class="product-gallery">
            <div class="product-gallery__main">
              <img 
                :src="currentImage" 
                :alt="product.name"
                @error="handleImageError"
              >
            </div>
            <div v-if="product.images.length > 1" class="product-gallery__thumbs">
              <button 
                v-for="(img, index) in product.images" 
                :key="index"
                class="thumb-btn"
                :class="{ 'thumb-btn--active': currentImage === getFullImageUrl(img.image) }"
                @click="currentImage = getFullImageUrl(img.image)"
              >
                <img :src="getFullImageUrl(img.image)" :alt="`تصویر ${index + 1}`">
              </button>
            </div>
          </div>

          <!-- اطلاعات محصول -->
          <div class="product-info">
            <h1 class="product-info__title">{{ product.name }}</h1>
            
            <!-- برچسب‌ها -->
            <div class="product-info__tags">
              <span v-for="tag in product.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>

            <!-- قیمت -->
            <div class="product-info__price-section">
              <div class="product-info__price">
                <span class="current-price">
                  {{ formatPrice(currentVariant.price) }} تومان
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

            <!-- انتخاب تنوع (اگر چند تنوع داشت) -->
            <div v-if="product.variants.length > 1" class="product-info__variants">
              <h3>تنوع‌ها</h3>
              <select v-model="selectedVariantId" class="variant-select">
                <option v-for="variant in product.variants" :key="variant.id" :value="variant.id">
                  {{ variant.attributes.length ? variant.attributes.join(' - ') : 'نوع اصلی' }} 
                  ({{ formatPrice(variant.price) }} تومان)
                </option>
              </select>
            </div>

            <!-- مشخصات فنی -->
            <div v-if="product.specifications.length" class="product-info__specs">
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/product.service'
import type { ProductDetail, Variant } from '@/types/product.types'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref<string | null>(null)
const product = ref<ProductDetail | null>(null)
const currentImage = ref('')
const selectedVariantId = ref<number | null>(null)

// تنوع انتخاب شده
const currentVariant = computed<Variant>(() => {
  if (!product.value) return {} as Variant
  if (selectedVariantId.value) {
    return product.value.variants.find(v => v.id === selectedVariantId.value) || product.value.variants[0]
  }
  return product.value.variants[0]
})

// وضعیت موجودی
const isInStock = computed(() => currentVariant.value.stock > 0)
const stockClass = computed(() => ({
  'in-stock': currentVariant.value.stock > 5,
  'low-stock': currentVariant.value.stock > 0 && currentVariant.value.stock <= 5,
  'out-of-stock': currentVariant.value.stock === 0
}))

const stockText = computed(() => {
  if (currentVariant.value.stock > 5) return 'موجود در انبار'
  if (currentVariant.value.stock > 0) return `تنها ${currentVariant.value.stock} عدد باقی‌مانده`
  return 'ناموجود'
})

const fetchProduct = async () => {
  const slug = route.params.slug as string
  if (!slug) {
    error.value = 'محصول مورد نظر یافت نشد'
    return
  }

  loading.value = true
  error.value = null

  try {
    product.value = await productService.getProductBySlug(slug)
    if (product.value.images.length) {
      const mainImage = product.value.images.find(img => img.is_main) || product.value.images[0]
      currentImage.value = getFullImageUrl(mainImage.image)
    }
    if (product.value.variants.length) {
      selectedVariantId.value = product.value.variants[0].id
    }
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'خطا در دریافت اطلاعات محصول'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: string | number) => {
  return productService.formatPrice(Number(price))
}

const getFullImageUrl = (path: string) => {
  return productService.getProductImageUrl(path)
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/600x600?text=عکس+موجود+نیست'
}

const addToCart = () => {
  if (!isInStock.value) return
  console.log('افزودن به سبد خرید:', {
    productId: product.value?.id,
    variantId: currentVariant.value.id,
    quantity: 1
  })
}

const addToWishlist = () => {
  console.log('افزودن به علاقه‌مندی‌ها:', product.value?.id)
}

const goBack = () => {
  router.push('/products')
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
/* استایل‌های قبلی + استایل‌های جدید */

.product-info__tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
}

.product-info__price-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.product-info__stock {
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 500;
}

.in-stock {
  background: #d1fae5;
  color: #059669;
}

.low-stock {
  background: #fed7aa;
  color: #c2410c;
}

.out-of-stock {
  background: #fee2e2;
  color: #b91c1c;
}

.product-gallery__thumbs {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.thumb-btn {
  width: 70px;
  height: 70px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.thumb-btn:hover {
  border-color: #667eea;
}

.thumb-btn--active {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.variant-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  background: white;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.specs-table th {
  text-align: right;
  background: #f3f4f6;
  padding: 0.5rem;
  width: 30%;
  color: #374151;
}

.specs-table td {
  padding: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
  color: #4b5563;
}
</style>
