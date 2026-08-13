<!-- src/views/products/ProductDetail/ProductDetail.vue -->
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
                v-if="currentImage"
                :src="currentImage" 
                :alt="product.name"
                @error="handleImageError"
              >
              <div v-else class="product-gallery__empty">
                تصویر موجود نیست
              </div>
            </div>

            <div v-if="galleryImages.length > 1" class="product-gallery__thumbs">
              <button 
                v-for="(img, index) in galleryImages"
                :key="`${imageUrl(img)}-${index}`"
                class="thumb-btn"
                :class="{ 'thumb-btn--active': currentImage === imageUrl(img) }"
                @click="currentImage = imageUrl(img)"
              >
                <img
                  :src="imageUrl(img)"
                  :alt="img.alt_text || `تصویر ${index + 1}`"
                >
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

            <!-- انتخاب واریانت -->
            <section
              v-if="variants.length > 1"
              class="variant-picker"
            >
              <h2 class="variant-picker__title">انتخاب مدل</h2>

              <div class="variant-picker__list">
                <button
                  v-for="variant in variants"
                  :key="variant.id"
                  type="button"
                  class="variant-option"
                  :class="{
                    'variant-option--selected': selectedVariantId === variant.id,
                    'variant-option--unavailable': !variantIsInStock(variant),
                  }"
                  :disabled="!variantIsInStock(variant)"
                  @click="selectVariant(variant.id)"
                >
                  <span class="variant-option__label">
                    {{ variantLabel(variant) }}
                  </span>

                  <span class="variant-option__price">
                    <template v-if="variantIsInStock(variant)">
                      {{ formatPrice(variantFinalPrice(variant)) }} تومان
                    </template>
                    <template v-else>ناموجود</template>
                  </span>
                </button>
              </div>
            </section>

            <div
              v-else-if="currentVariant && currentVariant.attributes?.length"
              class="single-variant-label"
            >
              مدل: {{ variantLabel(currentVariant) }}
            </div>

            <!-- قیمت -->
            <div class="product-info__price-section" v-if="currentVariant">
              <div class="product-info__price">
                <span class="current-price">
                  {{ formatPrice(variantFinalPrice(currentVariant)) }} تومان
                </span>
                <span v-if="variantHasDiscount(currentVariant)" class="old-price">
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
                :disabled="!isInStock || loadingAddToCart"
              >
                <span v-if="!loadingAddToCart">
                  {{ isInStock ? 'افزودن به سبد خرید' : 'ناموجود' }}
                </span>
                <span v-else class="btn-loading">
                  <span class="spinner-small"></span>
                  در حال افزودن...
                </span>
              </button>

              <button 
                class="wishlist-btn" 
                @click="addToWishlist"
                :disabled="loadingWishlist"
              >
                ♡
              </button>
            </div>

            <!-- پیام موفقیت -->
            <transition name="fade">
              <div v-if="successMessage" class="success-message">
                ✅ {{ successMessage }}
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/core/store/cartStore'
import { useWishlistStore } from '@/core/store/wishlistStore'
import { productService } from '@/services/product.service'
import type {
  ProductDetail,
  ProductImage,
  Variant,
} from '@/types/product.types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const loading = ref(false)
const error = ref<string | null>(null)
const product = ref<ProductDetail | null>(null)
const currentImage = ref('')
const selectedVariantId = ref<number | null>(null)
const loadingAddToCart = ref(false)
const loadingWishlist = ref(false)
const successMessage = ref<string | null>(null)

const variants = computed<Variant[]>(() => {
  return product.value?.variants ?? []
})

const currentVariant = computed<Variant | null>(() => {
  if (!variants.value.length) return null

  if (selectedVariantId.value !== null) {
    const selectedVariant = variants.value.find(
      variant => variant.id === selectedVariantId.value,
    )

    if (selectedVariant) return selectedVariant
  }

  return variants.value[0] ?? null
})

const galleryImages = computed<ProductImage[]>(() => {
  const variantImages = currentVariant.value?.images?.filter(
    image => Boolean(imageUrl(image)),
  ) ?? []

  if (variantImages.length) return variantImages

  return product.value?.images?.filter(
    image => Boolean(imageUrl(image)),
  ) ?? []
})

const isInStock = computed(() => {
  return currentVariant.value
    ? variantIsInStock(currentVariant.value)
    : false
})

const stockClass = computed(() => {
  if (!currentVariant.value) return {}

  const stock = Number(currentVariant.value.stock ?? 0)

  return {
    'in-stock': stock > 5,
    'low-stock': stock > 0 && stock <= 5,
    'out-of-stock': stock <= 0,
  }
})

const stockText = computed(() => {
  if (!currentVariant.value) return ''

  const stock = Number(currentVariant.value.stock ?? 0)

  if (stock > 5) return 'موجود در انبار'
  if (stock > 0) return `تنها ${stock.toLocaleString('fa-IR')} عدد باقی‌مانده`
  return 'ناموجود'
})

const formatPrice = (price: string | number | undefined | null) => {
  return productService.formatPrice(Number(price))
}

const imageUrl = (image: ProductImage): string => {
  return image.image || image.source_url || ''
}

const variantIsInStock = (variant: Variant): boolean => {
  if (typeof variant.in_stock === 'boolean') {
    return variant.in_stock
  }

  return Number(variant.stock ?? 0) > 0
}

const variantHasDiscount = (variant: Variant): boolean => {
  const price = Number(variant.price ?? 0)
  const discountPrice = Number(variant.discount_price ?? 0)

  return (
    discountPrice > 0 &&
    price > 0 &&
    discountPrice < price
  )
}

const variantFinalPrice = (variant: Variant): number => {
  const apiFinalPrice = Number(variant.final_price ?? 0)

  if (apiFinalPrice > 0) return apiFinalPrice

  if (variantHasDiscount(variant)) {
    return Number(variant.discount_price)
  }

  return Number(variant.price ?? 0)
}

const variantLabel = (variant: Variant): string => {
  if (variant.label?.trim()) return variant.label

  const attributes = variant.attributes ?? []
  const label = attributes
    .map(attribute => `${attribute.attribute_name}: ${attribute.value}`)
    .join(' / ')

  return label || variant.sku || `مدل ${variant.id}`
}

const setCurrentImage = () => {
  const images = galleryImages.value
  const mainImage = images.find(image => image.is_main) ?? images[0]

  currentImage.value = mainImage ? imageUrl(mainImage) : ''
}

const replaceVariantQuery = async (variantId: number) => {
  if (String(route.query.variant ?? '') === String(variantId)) return

  await router.replace({
    query: {
      ...route.query,
      variant: String(variantId),
    },
  })
}

const selectVariant = (variantId: number, updateUrl = true) => {
  const variant = variants.value.find(item => item.id === variantId)

  if (!variant || !variantIsInStock(variant)) return

  selectedVariantId.value = variant.id
  setCurrentImage()

  if (updateUrl) {
    void replaceVariantQuery(variant.id)
  }
}

const chooseInitialVariant = () => {
  const queryVariantId = Number(route.query.variant)
  const queryVariant = Number.isFinite(queryVariantId)
    ? variants.value.find(variant => variant.id === queryVariantId)
    : undefined

  const selectedVariant = (
    queryVariant ??
    variants.value.find(variant => variantIsInStock(variant)) ??
    variants.value[0] ??
    null
  )

  selectedVariantId.value = selectedVariant?.id ?? null
  setCurrentImage()

  if (
    selectedVariant &&
    queryVariant?.id !== selectedVariant.id
  ) {
    void replaceVariantQuery(selectedVariant.id)
  }
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/placeholder.jpg'
}

const fetchProduct = async () => {
  const slug = route.params.slug as string

  if (!slug) {
    product.value = null
    error.value = 'آدرس محصول معتبر نیست'
    return
  }

  loading.value = true
  error.value = null

  try {
    product.value = await productService.getProductBySlug(slug)
    chooseInitialVariant()
  } catch (err: any) {
    product.value = null
    error.value = (
      err?.response?.data?.detail ||
      err?.message ||
      'خطا در دریافت اطلاعات محصول'
    )
  } finally {
    loading.value = false
  }
}

const addToCart = async () => {
  if (!currentVariant.value) {
    alert('مدل محصول انتخاب نشده است')
    return
  }

  if (!isInStock.value) {
    alert('مدل انتخاب‌شده موجود نیست')
    return
  }

  loadingAddToCart.value = true
  successMessage.value = null

  try {
    await cartStore.addItem({
      variant_id: currentVariant.value.id,
      quantity: 1,
    })

    successMessage.value = `${variantLabel(currentVariant.value)} به سبد خرید اضافه شد`

    window.setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err: any) {
    const errorMessage = (
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      err?.message ||
      'خطا در افزودن به سبد خرید'
    )

    alert(errorMessage)
  } finally {
    loadingAddToCart.value = false
  }
}

const addToWishlist = async () => {
  if (!product.value) return

  loadingWishlist.value = true

  try {
    await wishlistStore.addItem(product.value.id)
    alert('محصول به علاقه‌مندی‌ها اضافه شد')
  } catch (err: any) {
    alert(err?.message || 'خطا در افزودن به علاقه‌مندی‌ها')
  } finally {
    loadingWishlist.value = false
  }
}

const goBack = () => {
  router.push('/products')
}

watch(
  () => route.params.slug,
  () => {
    void fetchProduct()
  },
  { immediate: true },
)

watch(
  () => route.query.variant,
  value => {
    if (!product.value) return

    const variantId = Number(value)
    const variant = variants.value.find(item => item.id === variantId)

    if (variant && variant.id !== selectedVariantId.value) {
      selectedVariantId.value = variant.id
      setCurrentImage()
    }
  },
)
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
  padding: 1rem;
  object-fit: contain;
}

.product-gallery__empty {
  display: grid;
  height: 100%;
  place-items: center;
  color: #94a3b8;
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
  transition: all 0.3s;
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

.variant-picker {
  margin-bottom: 1.5rem;
}

.variant-picker__title {
  margin: 0 0 0.75rem;
  color: #334155;
  font-size: 1rem;
}

.variant-picker__list {
  display: grid;
  gap: 0.65rem;
}

.variant-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 0.8rem 0.9rem;
  border: 1px solid #dbe4df;
  border-radius: 0.65rem;
  background: #fff;
  color: #334155;
  cursor: pointer;
  text-align: right;
  transition: 0.2s ease;
}

.variant-option:hover:not(:disabled) {
  border-color: #22c55e;
  background: #f0fdf4;
}

.variant-option--selected {
  border-color: #16a34a;
  background: #f0fdf4;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.12);
}

.variant-option--unavailable {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
  text-decoration: line-through;
}

.variant-option__label {
  font-weight: 700;
}

.variant-option__price {
  flex-shrink: 0;
  font-size: 0.85rem;
}

.single-variant-label {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #f8fafc;
  color: #475569;
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

/* مشخصات */
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

/* دکمه‌ها */
.product-info__actions {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  position: relative;
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
  transition: all 0.3s;
  min-height: 3.5rem;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.wishlist-btn {
  width: 3.5rem;
  height: 3.5rem;
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

.wishlist-btn:hover:not(:disabled) {
  border-color: #dc3545;
  color: #dc3545;
  transform: scale(1.1);
}

.wishlist-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* پیام موفقیت */
.success-message {
  position: absolute;
  bottom: -3rem;
  left: 0;
  right: 0;
  text-align: center;
  padding: 0.75rem;
  background: #d4edda;
  color: #155724;
  border-radius: 0.5rem;
  font-weight: 500;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* حالت‌های بارگذاری و خطا */
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
  transition: background 0.3s;
}

.back-btn:hover {
  background: #0052a3;
}

/* انیمیشن fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ریسپانسیو */
@media (max-width: 768px) {
  .product-detail__content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .product-detail__container {
    padding: 1rem;
  }
  
  .product-info__title {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 1.5rem;
  }
  
  .old-price {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .product-gallery__thumbs {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .product-info__actions {
    flex-direction: column;
  }
  
  .wishlist-btn {
    width: 100%;
    height: 3rem;
  }
}
</style>
