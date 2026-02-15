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

        <!-- breadcrumb -->
        <nav class="breadcrumb">
          <router-link to="/">خانه</router-link> /
          <router-link to="/products">محصولات</router-link> /
          <router-link :to="`/category/${product?.category?.slug}`">
            {{ product?.category?.name }}
          </router-link> /
          <span>{{ product.name }}</span>
        </nav>

        <div class="product-detail__content">

          <!-- gallery -->
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

          <!-- info -->
          <div class="product-info">
            <h1 class="product-info__title">{{ product.name }}</h1>

            <!-- tags -->
            <div class="product-info__tags">
              <span v-for="(tag,index) in product.tags" :key="index" class="tag">
                {{ tag }}
              </span>
            </div>

            <!-- price -->
            <div class="product-info__price-section" v-if="currentVariant">
              <div class="product-info__price">
                <span class="current-price">
                  {{ formatPrice(currentVariant.discount_price || currentVariant.price) }} تومان
                </span>

                <span v-if="currentVariant.discount_price" class="old-price">
                  {{ formatPrice(currentVariant.price) }} تومان
                </span>
              </div>

              <!-- stock -->
              <div class="product-info__stock" :class="stockClass">
                {{ stockText }}
              </div>
            </div>

            <!-- variants -->
            <div v-if="product.variants?.length > 1" class="product-info__variants">
              <h3>تنوع‌ها</h3>
              <select v-model="selectedVariantId" class="variant-select">
                <option 
                  v-for="variant in product.variants" 
                  :key="variant.id" 
                  :value="variant.id"
                >
                  {{ variant.attributes.length ? variant.attributes.join(' - ') : 'نوع اصلی' }}
                  ({{ formatPrice(variant.price) }} تومان)
                </option>
              </select>
            </div>

            <!-- specs -->
            <div v-if="product.specifications?.length" class="product-info__specs">
              <h3>مشخصات</h3>
              <table class="specs-table">
                <tr v-for="spec in product.specifications" :key="spec.name">
                  <th>{{ spec.name }}</th>
                  <td>{{ spec.value }}</td>
                </tr>
              </table>
            </div>

            <!-- description -->
            <div v-if="product.description" class="product-info__description">
              <h3>توضیحات</h3>
              <p>{{ product.description }}</p>
            </div>

            <!-- actions -->
            <div class="product-info__actions">
              <button 
                class="add-to-cart-btn" 
                @click="addToCart"
                :disabled="!currentVariant || !isInStock"
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

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref<string | null>(null)
const product = ref<ProductDetail | null>(null)
const currentImage = ref('')
const selectedVariantId = ref<number | null>(null)

const currentVariant = computed<Variant | null>(() => {
  if (!product.value || !product.value.variants?.length) return null

  if (selectedVariantId.value) {
    return product.value.variants.find(v => v.id === selectedVariantId.value) 
      || product.value.variants[0]
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

const fetchProduct = async () => {
  const slug = route.params.slug as string
  if (!slug) return

  loading.value = true
  error.value = null

  try {
    const res = await productService.getProductBySlug(slug)
    const data = res.data ?? res

    product.value = data

    if (data.images?.length) {
      const main = data.images.find(i => i.is_main) || data.images[0]
      currentImage.value = main.image
    }

    selectedVariantId.value = data.variants?.[0]?.id ?? null

  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'خطا در دریافت اطلاعات محصول'
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: string | number) => {
  return productService.formatPrice(Number(price))
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/600x600?text=عکس+موجود+نیست'
}

const addToCart = () => {
  if (!currentVariant.value || !isInStock.value) return
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

onMounted(fetchProduct)
watch(() => route.params.slug, fetchProduct)
</script>
