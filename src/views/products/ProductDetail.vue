<!-- src/views/products/ProductDetail.vue -->

<template>
  <div class="product-detail-page">

    <!-- ==========================================
         Loading
    =========================================== -->
    <div
      v-if="loading"
      class="loading-state"
    >
      <div class="spinner"></div>

      <p>
        در حال بارگذاری محصول...
      </p>
    </div>


    <!-- ==========================================
         Error
    =========================================== -->
    <div
      v-else-if="error"
      class="error-state"
    >
      <p>
        ❌ {{ error }}
      </p>

      <button
        type="button"
        class="back-btn"
        @click="goBack"
      >
        بازگشت به محصولات
      </button>
    </div>


    <!-- ==========================================
         Not found
    =========================================== -->
    <div
      v-else-if="!product"
      class="not-found-state"
    >
      <p>
        🔍 محصولی یافت نشد
      </p>

      <button
        type="button"
        class="back-btn"
        @click="goBack"
      >
        بازگشت به محصولات
      </button>
    </div>


    <!-- ==========================================
         Product
    =========================================== -->
    <div
      v-else
      class="product-detail"
    >
      <div class="product-detail__container">

        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <router-link to="/">
            خانه
          </router-link>

          <span>/</span>

          <router-link to="/products">
            محصولات
          </router-link>

          <span>/</span>

          <span>
            {{ product.name }}
          </span>
        </nav>


        <div class="product-detail__content">

          <!-- ======================================
               Gallery
          ======================================= -->
          <div class="product-gallery">

            <div class="product-gallery__main">
              <img
                v-if="currentImage"
                :src="currentImage"
                :alt="product.name"
                @error="handleImageError"
              >

              <div
                v-else
                class="product-gallery__empty"
              >
                تصویر موجود نیست
              </div>
            </div>


            <!-- Thumbnails -->
            <div
              v-if="galleryImages.length > 1"
              class="product-gallery__thumbs"
            >
              <button
                v-for="(img, index) in galleryImages"
                :key="`${imageUrl(img)}-${index}`"
                type="button"
                class="thumb-btn"
                :class="{
                  'thumb-btn--active':
                    currentImage === imageUrl(img),
                }"
                @click="
                  currentImage = imageUrl(img)
                "
              >
                <img
                  :src="imageUrl(img)"
                  :alt="
                    img.alt_text ||
                    `تصویر ${index + 1}`
                  "
                  @error="handleImageError"
                >
              </button>
            </div>

          </div>


          <!-- ======================================
               Product info
          ======================================= -->
          <div class="product-info">

            <!-- Title -->
            <h1 class="product-info__title">
              {{ product.name }}
            </h1>


            <!-- Tags -->
            <div
              v-if="product.tags?.length"
              class="product-info__tags"
            >
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>


            <!-- ====================================
                 Variant picker
            ===================================== -->
            <section
              v-if="variants.length > 1"
              class="variant-picker"
            >
              <h2 class="variant-picker__title">
                انتخاب مدل
              </h2>

              <div class="variant-picker__list">

                <button
                  v-for="variant in variants"
                  :key="variant.id"
                  type="button"
                  class="variant-option"
                  :class="{
                    'variant-option--selected':
                      selectedVariantId === variant.id,

                    'variant-option--unavailable':
                      !variantIsInStock(variant),
                  }"
                  :disabled="
                    !variantIsInStock(variant)
                  "
                  @click="
                    selectVariant(variant.id)
                  "
                >
                  <span class="variant-option__label">
                    {{ variantLabel(variant) }}
                  </span>

                  <span class="variant-option__price">

                    <template
                      v-if="
                        variantIsInStock(variant)
                      "
                    >
                      {{
                        formatPrice(
                          variantFinalPrice(
                            variant,
                          ),
                        )
                      }}
                      تومان
                    </template>

                    <template v-else>
                      ناموجود
                    </template>

                  </span>
                </button>

              </div>
            </section>


            <!-- Single variant label -->
            <div
              v-else-if="
                currentVariant &&
                currentVariant.attributes?.length
              "
              class="single-variant-label"
            >
              مدل:
              {{ variantLabel(currentVariant) }}
            </div>


            <!-- ====================================
                 Price
            ===================================== -->
            <div
              v-if="currentVariant"
              class="product-info__price-section"
            >
              <div class="product-info__price">

                <span class="current-price">
                  {{
                    formatPrice(
                      variantFinalPrice(
                        currentVariant,
                      ),
                    )
                  }}
                  تومان
                </span>


                <span
                  v-if="
                    variantHasDiscount(
                      currentVariant,
                    )
                  "
                  class="old-price"
                >
                  {{
                    formatPrice(
                      currentVariant.price,
                    )
                  }}
                  تومان
                </span>

              </div>


              <!-- Stock -->
              <div
                class="product-info__stock"
                :class="stockClass"
              >
                {{ stockText }}
              </div>
            </div>


            <!-- No variant -->
            <div
              v-else
              class="product-info__price-section"
            >
              <div
                class="product-info__stock out-of-stock"
              >
                این محصول در حال حاضر
                واریانت قابل خرید ندارد
              </div>
            </div>


            <!-- ====================================
                 Specifications
            ===================================== -->
            <div
              v-if="product.specifications?.length"
              class="product-info__specs"
            >
              <h3>
                مشخصات
              </h3>

              <table class="specs-table">
                <tbody>
                  <tr
                    v-for="
                      spec in product.specifications
                    "
                    :key="spec.name"
                  >
                    <th>
                      {{ spec.name }}
                    </th>

                    <td>
                      {{ spec.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>


            <!-- ====================================
                 Description
            ===================================== -->
            <div
              v-if="product.description"
              class="product-info__description"
            >
              <h3>
                توضیحات
              </h3>

              <p>
                {{ product.description }}
              </p>
            </div>


            <!-- ====================================
                 Actions
            ===================================== -->
            <div class="product-info__actions">

              <!-- Cart -->
              <button
                type="button"
                class="add-to-cart-btn"
                :disabled="
                  !isInStock ||
                  loadingAddToCart
                "
                @click="addToCart"
              >
                <span
                  v-if="!loadingAddToCart"
                >
                  {{
                    isInStock
                      ? 'افزودن به سبد خرید'
                      : 'ناموجود'
                  }}
                </span>


                <span
                  v-else
                  class="btn-loading"
                >
                  <span
                    class="spinner-small"
                  ></span>

                  در حال افزودن...
                </span>
              </button>


              <!-- Wishlist -->
              <button
                type="button"
                class="wishlist-btn"
                :class="{
                  'wishlist-btn--active':
                    isFavorite,
                }"
                :disabled="loadingWishlist"
                :aria-pressed="isFavorite"
                :aria-label="
                  isFavorite
                    ? 'حذف از علاقه‌مندی‌ها'
                    : 'افزودن به علاقه‌مندی‌ها'
                "
                :title="
                  isFavorite
                    ? 'حذف از علاقه‌مندی‌ها'
                    : 'افزودن به علاقه‌مندی‌ها'
                "
                @click="toggleWishlist"
              >

                <span
                  v-if="loadingWishlist"
                  class="wishlist-loader"
                ></span>


                <span
                  v-else
                  class="wishlist-heart"
                >
                  {{
                    isFavorite
                      ? '♥'
                      : '♡'
                  }}
                </span>

              </button>

            </div>


            <!-- ====================================
                 Messages
            ===================================== -->
            <transition name="fade">
              <div
                v-if="successMessage"
                class="success-message"
              >
                ✓ {{ successMessage }}
              </div>
            </transition>


            <transition name="fade">
              <div
                v-if="actionError"
                class="action-error"
              >
                {{ actionError }}
              </div>
            </transition>

          </div>
        </div>

        <!-- ======================================
             Reviews / Questions
        ======================================= -->
        <ProductCommunity v-if="product?.slug" :slug="product.slug" />

      </div>
    </div>

  </div>
</template>


<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/core/store/cartStore'
import { useWishlistStore } from '@/core/store/wishlistStore'
import { useAuthStore } from '@/core/store/authStore'
import { productService } from '@/services/product.service'
import ProductCommunity from '@/components/product/ProductCommunity.vue'
import type { ProductDetail, ProductImage, Variant } from '@/types/product.types'


// ==========================================
// Router
// ==========================================

const route =
  useRoute()

const router =
  useRouter()


// ==========================================
// Stores
// ==========================================

const cartStore =
  useCartStore()

const wishlistStore =
  useWishlistStore()

const authStore =
  useAuthStore()


// ==========================================
// State
// ==========================================

const loading =
  ref(false)

const error =
  ref<string | null>(null)

const product =
  ref<ProductDetail | null>(null)

const currentImage =
  ref('')

const selectedVariantId =
  ref<number | null>(null)

const loadingAddToCart =
  ref(false)

const loadingWishlist =
  ref(false)

const successMessage =
  ref<string | null>(null)

const actionError =
  ref<string | null>(null)


let successTimer:
  number | null = null

let errorTimer:
  number | null = null


// ==========================================
// Product variants
// ==========================================

const variants =
  computed<Variant[]>(() => {
    return (
      product.value?.variants ??
      []
    )
  })


const currentVariant =
  computed<Variant | null>(() => {

    if (!variants.value.length) {
      return null
    }


    if (
      selectedVariantId.value !== null
    ) {
      const selectedVariant =
        variants.value.find(
          variant =>
            variant.id ===
            selectedVariantId.value,
        )

      if (selectedVariant) {
        return selectedVariant
      }
    }


    return (
      variants.value[0] ??
      null
    )
  })


// ==========================================
// Wishlist
// ==========================================

const isFavorite =
  computed<boolean>(() => {

    if (
      !authStore.isAuthenticated ||
      !product.value
    ) {
      return false
    }


    return wishlistStore.isInWishlist(
      product.value.id,
    )
  })


// ==========================================
// Images
// ==========================================

const galleryImages =
  computed<ProductImage[]>(() => {

    const variantImages =
      currentVariant.value
        ?.images
        ?.filter(
          image =>
            Boolean(
              imageUrl(image),
            ),
        ) ?? []


    if (variantImages.length) {
      return variantImages
    }


    return (
      product.value
        ?.images
        ?.filter(
          image =>
            Boolean(
              imageUrl(image),
            ),
        ) ??
      []
    )
  })


// ==========================================
// Stock
// ==========================================

const isInStock =
  computed<boolean>(() => {

    if (!currentVariant.value) {
      return false
    }


    return variantIsInStock(
      currentVariant.value,
    )
  })


const stockClass =
  computed(() => {

    if (!currentVariant.value) {
      return {
        'out-of-stock': true,
      }
    }


    const stock =
      Number(
        currentVariant.value.stock ??
        0,
      )


    return {
      'in-stock':
        stock > 5,

      'low-stock':
        stock > 0 &&
        stock <= 5,

      'out-of-stock':
        stock <= 0,
    }
  })


const stockText =
  computed<string>(() => {

    if (!currentVariant.value) {
      return 'ناموجود'
    }


    if (
      !variantIsInStock(
        currentVariant.value,
      )
    ) {
      return 'ناموجود'
    }


    const stock =
      Number(
        currentVariant.value.stock ??
        0,
      )


    if (stock > 5) {
      return 'موجود در انبار'
    }


    if (stock > 0) {
      return (
        `تنها ${stock.toLocaleString('fa-IR')} عدد باقی‌مانده`
      )
    }


    /*
     * اگر API در آینده in_stock=true
     * بدهد ولی stock را برنگرداند.
     */
    if (
      currentVariant.value.in_stock
    ) {
      return 'موجود'
    }


    return 'ناموجود'
  })


// ==========================================
// Messages
// ==========================================

function showSuccess(
  message: string,
): void {

  successMessage.value =
    message

  actionError.value =
    null


  if (successTimer) {
    window.clearTimeout(
      successTimer,
    )
  }


  successTimer =
    window.setTimeout(
      () => {
        successMessage.value =
          null
      },
      3000,
    )
}


function showError(
  message: string,
): void {

  actionError.value =
    message


  if (errorTimer) {
    window.clearTimeout(
      errorTimer,
    )
  }


  errorTimer =
    window.setTimeout(
      () => {
        actionError.value =
          null
      },
      4000,
    )
}


// ==========================================
// Price
// ==========================================

function formatPrice(
  price:
    | string
    | number
    | undefined
    | null,
): string {

  return productService.formatPrice(
    Number(
      price ?? 0,
    ),
  )
}


function variantHasDiscount(
  variant: Variant,
): boolean {

  const price =
    Number(
      variant.price ??
      0,
    )


  const discountPrice =
    Number(
      variant.discount_price ??
      0,
    )


  return (
    discountPrice > 0 &&
    price > 0 &&
    discountPrice < price
  )
}


function variantFinalPrice(
  variant: Variant,
): number {

  const apiFinalPrice =
    Number(
      variant.final_price ??
      0,
    )


  if (apiFinalPrice > 0) {
    return apiFinalPrice
  }


  if (
    variantHasDiscount(
      variant,
    )
  ) {
    return Number(
      variant.discount_price,
    )
  }


  return Number(
    variant.price ??
    0,
  )
}


// ==========================================
// Image helpers
// ==========================================

function imageUrl(
  image: ProductImage,
): string {

  return (
    image.image ||
    image.source_url ||
    ''
  )
}


function handleImageError(
  event: Event,
): void {

  const image =
    event.target as HTMLImageElement


  if (
    image.src.endsWith(
      '/images/placeholder.jpg',
    )
  ) {
    return
  }


  image.src =
    '/images/placeholder.jpg'
}


// ==========================================
// Variant helpers
// ==========================================

function variantIsInStock(
  variant: Variant,
): boolean {

  if (
    typeof variant.in_stock ===
    'boolean'
  ) {
    return variant.in_stock
  }


  return (
    Number(
      variant.stock ??
      0,
    ) > 0
  )
}


function variantLabel(
  variant: Variant,
): string {

  if (
    variant.label?.trim()
  ) {
    return variant.label.trim()
  }


  if (
    variant.name?.trim()
  ) {
    return variant.name.trim()
  }


  const attributes =
    variant.attributes ??
    []


  const attributeLabel =
    attributes
      .map(
        attribute =>
          `${attribute.attribute_name}: ${attribute.value}`,
      )
      .join(' / ')


  if (attributeLabel) {
    return attributeLabel
  }


  /*
   * SKU فقط fallback است.
   * اگر نام/ویژگی وجود داشته باشد
   * SKU به کاربر نمایش داده نمی‌شود.
   */
  if (variant.sku) {
    return variant.sku
  }


  return `مدل ${variant.id}`
}


// ==========================================
// Gallery
// ==========================================

function setCurrentImage():
  void {

  const images =
    galleryImages.value


  const mainImage =
    images.find(
      image =>
        image.is_main,
    ) ??
    images[0]


  currentImage.value =
    mainImage
      ? imageUrl(mainImage)
      : ''
}


// ==========================================
// Variant query
// ==========================================

async function replaceVariantQuery(
  variantId: number,
): Promise<void> {

  if (
    String(
      route.query.variant ??
      '',
    ) ===
    String(variantId)
  ) {
    return
  }


  await router.replace({
    query: {
      ...route.query,

      variant:
        String(variantId),
    },
  })
}


// ==========================================
// Select variant
// ==========================================

function selectVariant(
  variantId: number,
  updateUrl = true,
): void {

  const variant =
    variants.value.find(
      item =>
        item.id ===
        variantId,
    )


  if (
    !variant ||
    !variantIsInStock(variant)
  ) {
    return
  }


  selectedVariantId.value =
    variant.id


  setCurrentImage()


  if (updateUrl) {
    void replaceVariantQuery(
      variant.id,
    )
  }
}


// ==========================================
// Initial variant
// ==========================================

function chooseInitialVariant():
  void {

  const queryVariantId =
    Number(
      route.query.variant,
    )


  const queryVariant =
    Number.isFinite(
      queryVariantId,
    )
      ? variants.value.find(
          variant =>
            variant.id ===
            queryVariantId,
        )
      : undefined


  /*
   * اولویت:
   *
   * 1. واریانت URL اگر موجود باشد
   * 2. اولین واریانت موجود
   * 3. اولین واریانت
   */
  const selectedVariant =
    (
      queryVariant &&
      variantIsInStock(
        queryVariant,
      )
    )
      ? queryVariant
      : (
          variants.value.find(
            variant =>
              variantIsInStock(
                variant,
              ),
          ) ??
          variants.value[0] ??
          null
        )


  selectedVariantId.value =
    selectedVariant?.id ??
    null


  setCurrentImage()


  if (
    selectedVariant &&
    queryVariant?.id !==
      selectedVariant.id
  ) {
    void replaceVariantQuery(
      selectedVariant.id,
    )
  }
}


// ==========================================
// Load wishlist
// ==========================================

async function loadWishlist():
  Promise<void> {

  if (
    !authStore.isAuthenticated
  ) {
    return
  }


  if (
    wishlistStore.initialized
  ) {
    return
  }


  /*
   * خطای Wishlist نباید
   * صفحه محصول را خراب کند.
   */
  try {
    await wishlistStore
      .fetchWishlist()
  } catch (
    caughtError
  ) {
    console.warn(
      'Wishlist load failed:',
      caughtError,
    )
  }
}


// ==========================================
// Fetch product
// ==========================================

async function fetchProduct():
  Promise<void> {

  const slug =
    route.params.slug as string


  if (!slug) {
    product.value =
      null

    error.value =
      'آدرس محصول معتبر نیست'

    return
  }


  loading.value =
    true

  error.value =
    null

  actionError.value =
    null


  try {
    product.value =
      await productService
        .getProductBySlug(
          slug,
        )


    chooseInitialVariant()


    /*
     * برای تعیین وضعیت قلب
     * Wishlist را دریافت می‌کنیم.
     */
    void loadWishlist()

  } catch (
    caughtError: any
  ) {

    product.value =
      null


    error.value =
      (
        caughtError
          ?.response
          ?.data
          ?.detail ||

        caughtError
          ?.response
          ?.data
          ?.message ||

        caughtError
          ?.message ||

        'خطا در دریافت اطلاعات محصول'
      )

  } finally {
    loading.value =
      false
  }
}


// ==========================================
// Add to cart
// ==========================================

async function addToCart():
  Promise<void> {

  if (
    !currentVariant.value
  ) {
    showError(
      'مدل محصول انتخاب نشده است.',
    )

    return
  }


  if (
    !isInStock.value
  ) {
    showError(
      'مدل انتخاب‌شده موجود نیست.',
    )

    return
  }


  loadingAddToCart.value =
    true

  actionError.value =
    null


  try {

    await cartStore.addItem({
      variant_id:
        currentVariant.value.id,

      quantity:
        1,
    })


    showSuccess(
      `${variantLabel(
        currentVariant.value,
      )} به سبد خرید اضافه شد`,
    )

  } catch (
    caughtError: any
  ) {

    const errorMessage =
      (
        caughtError
          ?.response
          ?.data
          ?.message ||

        caughtError
          ?.response
          ?.data
          ?.detail ||

        caughtError
          ?.message ||

        'خطا در افزودن به سبد خرید'
      )


    showError(
      errorMessage,
    )

  } finally {

    loadingAddToCart.value =
      false
  }
}


// ==========================================
// Toggle wishlist
// ==========================================

async function toggleWishlist():
  Promise<void> {

  if (!product.value) {
    return
  }


  // ========================================
  // Guest user
  // ========================================

  if (
    !authStore.isAuthenticated
  ) {

    await router.push({
      path: '/login',

      query: {
        redirect:
          route.fullPath,
      },
    })

    return
  }


  if (
    loadingWishlist.value
  ) {
    return
  }


  loadingWishlist.value =
    true

  actionError.value =
    null


  try {

    // ========================================
    // Ensure wishlist is loaded
    // ========================================

    if (
      !wishlistStore.initialized
    ) {

      const loaded =
        await wishlistStore
          .fetchWishlist()


      if (!loaded) {

        showError(
          wishlistStore.error ||
          'دریافت علاقه‌مندی‌ها انجام نشد.',
        )

        return
      }
    }


    // وضعیت قبل از تغییر
    const wasFavorite =
      wishlistStore.isInWishlist(
        product.value.id,
      )


    // ========================================
    // Add / Remove
    // ========================================

    const success =
      await wishlistStore
        .toggleItem(
          product.value.id,
        )


    if (!success) {

      showError(
        wishlistStore.error ||
        'تغییر علاقه‌مندی انجام نشد.',
      )

      return
    }


    // ========================================
    // Success message
    // ========================================

    if (wasFavorite) {

      showSuccess(
        'محصول از علاقه‌مندی‌ها حذف شد.',
      )

    } else {

      showSuccess(
        'محصول به علاقه‌مندی‌ها اضافه شد.',
      )
    }

  } catch (
    caughtError: any
  ) {

    const message =
      (
        caughtError
          ?.response
          ?.data
          ?.detail ||

        caughtError
          ?.response
          ?.data
          ?.message ||

        caughtError
          ?.message ||

        'خطا در تغییر علاقه‌مندی.'
      )


    showError(
      message,
    )

  } finally {

    loadingWishlist.value =
      false
  }
}


// ==========================================
// Back
// ==========================================

function goBack():
  void {

  void router.push(
    '/products',
  )
}


// ==========================================
// Watch slug
// ==========================================

watch(
  () =>
    route.params.slug,

  () => {
    void fetchProduct()
  },

  {
    immediate:
      true,
  },
)


// ==========================================
// Watch variant query
// ==========================================

watch(
  () =>
    route.query.variant,

  value => {

    if (!product.value) {
      return
    }


    const variantId =
      Number(value)


    if (
      !Number.isFinite(
        variantId,
      )
    ) {
      return
    }


    const variant =
      variants.value.find(
        item =>
          item.id ===
          variantId,
      )


    if (
      variant &&
      variant.id !==
        selectedVariantId.value
    ) {

      selectedVariantId.value =
        variant.id


      setCurrentImage()
    }
  },
)


// ==========================================
// Login/logout changes
// ==========================================

watch(
  () =>
    authStore.isAuthenticated,

  authenticated => {

    if (authenticated) {
      void loadWishlist()
    }
  },
)

</script>


<style scoped>

/* ==========================================
   Page
========================================== */

.product-detail-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: #f8f9fa;
}


.product-detail__container {
  max-width: 1200px;
  margin: 0 auto;

  padding: 2rem;

  border-radius: 1rem;

  background: #ffffff;

  box-shadow:
    0 2px 8px
    rgba(0, 0, 0, 0.08);
}


/* ==========================================
   Breadcrumb
========================================== */

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 0.4rem;

  margin-bottom: 2rem;

  color: #64748b;

  font-size: 0.85rem;
}


.breadcrumb a {
  color: #15803d;
  text-decoration: none;
}


.breadcrumb a:hover {
  text-decoration: underline;
}


/* ==========================================
   Main layout
========================================== */

.product-detail__content {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);

  gap: 3rem;
}


/* ==========================================
   Gallery
========================================== */

.product-gallery {
  min-width: 0;
}


.product-gallery__main {
  position: relative;

  aspect-ratio: 1 / 1;

  overflow: hidden;

  margin-bottom: 1rem;

  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;

  background: #ffffff;
}


.product-gallery__main img {
  width: 100%;
  height: 100%;

  box-sizing: border-box;

  padding: 1rem;

  object-fit: contain;
}


.product-gallery__empty {
  display: grid;

  width: 100%;
  height: 100%;

  place-items: center;

  color: #94a3b8;
}


/* Thumbnails */

.product-gallery__thumbs {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 0.5rem;
}


.thumb-btn {
  aspect-ratio: 1 / 1;

  overflow: hidden;

  padding: 0;

  border:
    2px solid transparent;

  border-radius: 0.55rem;

  background: #ffffff;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}


.thumb-btn:hover {
  border-color: #86efac;
}


.thumb-btn--active {
  border-color: #16a34a;

  box-shadow:
    0 0 0 2px
    rgba(22, 163, 74, 0.12);
}


.thumb-btn img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


/* ==========================================
   Product info
========================================== */

.product-info {
  min-width: 0;
}


.product-info__title {
  margin: 0 0 1rem;

  color: #1f2937;

  font-size: 2rem;
  font-weight: 800;

  line-height: 1.5;
}


/* ==========================================
   Tags
========================================== */

.product-info__tags {
  display: flex;
  flex-wrap: wrap;

  gap: 0.5rem;

  margin-bottom: 1.25rem;
}


.tag {
  padding:
    0.3rem
    0.75rem;

  border-radius: 2rem;

  background: #f3f4f6;

  color: #6b7280;

  font-size: 0.8rem;
}


/* ==========================================
   Variants
========================================== */

.variant-picker {
  margin-bottom: 1.5rem;
}


.variant-picker__title {
  margin:
    0
    0
    0.75rem;

  color: #334155;

  font-size: 1rem;
  font-weight: 800;
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

  padding:
    0.8rem
    0.9rem;

  border:
    1px solid #dbe4df;

  border-radius: 0.65rem;

  background: #ffffff;

  color: #334155;

  font-family: inherit;

  text-align: right;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}


.variant-option:hover:not(:disabled) {
  border-color: #22c55e;

  background: #f0fdf4;
}


.variant-option--selected {
  border-color: #16a34a;

  background: #f0fdf4;

  box-shadow:
    0 0 0 2px
    rgba(22, 163, 74, 0.12);
}


.variant-option--unavailable {
  background: #f8fafc;

  color: #94a3b8;

  cursor: not-allowed;
}


.variant-option__label {
  font-weight: 700;
}


.variant-option__price {
  flex-shrink: 0;

  font-size: 0.85rem;
}


/* Single variant */

.single-variant-label {
  margin-bottom: 1rem;

  padding: 0.75rem;

  border-radius: 0.5rem;

  background: #f8fafc;

  color: #475569;

  font-size: 0.9rem;
}


/* ==========================================
   Price
========================================== */

.product-info__price-section {
  margin-bottom: 1.5rem;

  padding: 1.5rem;

  border-radius: 0.75rem;

  background: #f8fafc;
}


.product-info__price {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 0.75rem;
}


.current-price {
  color: #15803d;

  font-size: 1.8rem;
  font-weight: 800;
}


.old-price {
  color: #9ca3af;

  font-size: 1.05rem;

  text-decoration: line-through;
}


/* ==========================================
   Stock
========================================== */

.product-info__stock {
  width: fit-content;

  margin-top: 1rem;

  padding:
    0.45rem
    0.75rem;

  border-radius: 0.45rem;

  font-size: 0.85rem;
  font-weight: 700;
}


.in-stock {
  background: #dcfce7;

  color: #166534;
}


.low-stock {
  background: #fef3c7;

  color: #92400e;
}


.out-of-stock {
  background: #fee2e2;

  color: #991b1b;
}


/* ==========================================
   Specifications
========================================== */

.product-info__specs {
  margin-top: 1.5rem;
}


.product-info__specs h3,
.product-info__description h3 {
  margin-bottom: 0.8rem;

  color: #1f2937;

  font-size: 1rem;
}


.specs-table {
  width: 100%;

  margin: 1rem 0;

  border-collapse: collapse;
}


.specs-table tr {
  border-bottom:
    1px solid #eeeeee;
}


.specs-table th,
.specs-table td {
  padding: 0.75rem;

  text-align: right;

  vertical-align: top;
}


.specs-table th {
  width: 40%;

  color: #6b7280;

  font-weight: 500;
}


.specs-table td {
  color: #374151;

  font-weight: 600;
}


/* ==========================================
   Description
========================================== */

.product-info__description {
  margin-top: 1.5rem;
}


.product-info__description p {
  margin: 0;

  color: #4b5563;

  line-height: 2;

  white-space: pre-line;
}


/* ==========================================
   Actions
========================================== */

.product-info__actions {
  display: flex;

  gap: 0.75rem;

  margin:
    2rem
    0
    1rem;
}


/* Cart */

.add-to-cart-btn {
  flex: 1;

  min-height: 3.5rem;

  padding: 1rem;

  border: 0;
  border-radius: 0.65rem;

  background: #15803d;

  color: #ffffff;

  font-family: inherit;

  font-size: 1rem;
  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}


.add-to-cart-btn:hover:not(:disabled) {
  background: #166534;

  transform:
    translateY(-1px);

  box-shadow:
    0 4px 12px
    rgba(21, 128, 61, 0.2);
}


.add-to-cart-btn:disabled {
  background: #d1d5db;

  color: #6b7280;

  cursor: not-allowed;

  opacity: 0.8;
}


.btn-loading {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 0.5rem;
}


/* ==========================================
   Wishlist
========================================== */

.wishlist-btn {
  width: 3.5rem;
  height: 3.5rem;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 0;

  border:
    1px solid #d1d5db;

  border-radius: 0.65rem;

  background: #ffffff;

  color: #64748b;

  cursor: pointer;

  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}


.wishlist-heart {
  display: block;

  font-size: 1.8rem;

  line-height: 1;
}


.wishlist-btn:hover:not(:disabled) {
  border-color: #fda4af;

  background: #fff1f2;

  color: #e11d48;

  transform:
    translateY(-1px);
}


/* Active heart */

.wishlist-btn--active {
  border-color: #fda4af;

  background: #fff1f2;

  color: #e11d48;
}


.wishlist-btn--active:hover:not(:disabled) {
  border-color: #fb7185;

  background: #ffe4e6;

  color: #be123c;
}


.wishlist-btn:disabled {
  opacity: 0.65;

  cursor: wait;
}


/* ==========================================
   Loaders
========================================== */

.spinner-small {
  width: 20px;
  height: 20px;

  border:
    2px solid
    rgba(255, 255, 255, 0.35);

  border-top-color: #ffffff;

  border-radius: 50%;

  animation:
    spin 0.8s linear infinite;
}


.wishlist-loader {
  width: 20px;
  height: 20px;

  border:
    2px solid #fecdd3;

  border-top-color: #e11d48;

  border-radius: 50%;

  animation:
    spin 0.7s linear infinite;
}


/* ==========================================
   Messages
========================================== */

.success-message,
.action-error {
  margin-top: 0.75rem;

  padding:
    0.75rem
    1rem;

  border-radius: 0.6rem;

  font-size: 0.85rem;
  font-weight: 700;

  text-align: center;
}


.success-message {
  border:
    1px solid #bbf7d0;

  background: #f0fdf4;

  color: #166534;
}


.action-error {
  border:
    1px solid #fecaca;

  background: #fef2f2;

  color: #b91c1c;
}


/* ==========================================
   Loading / Error page
========================================== */

.loading-state,
.error-state,
.not-found-state {
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  min-height: 400px;

  text-align: center;

  color: #4b5563;
}


.spinner {
  width: 50px;
  height: 50px;

  margin-bottom: 1rem;

  border:
    3px solid #e5e7eb;

  border-top-color: #15803d;

  border-radius: 50%;

  animation:
    spin 0.8s linear infinite;
}


@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}


.back-btn {
  margin-top: 1rem;

  padding:
    0.75rem
    2rem;

  border: 0;
  border-radius: 0.5rem;

  background: #15803d;

  color: #ffffff;

  font-family: inherit;

  font-weight: 700;

  cursor: pointer;
}


.back-btn:hover {
  background: #166534;
}


/* ==========================================
   Fade
========================================== */

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease;
}


.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


/* ==========================================
   Tablet
========================================== */

@media (max-width: 768px) {

  .product-detail-page {
    padding:
      1rem
      0.75rem;
  }


  .product-detail__content {
    grid-template-columns:
      1fr;

    gap: 2rem;
  }


  .product-detail__container {
    padding: 1rem;
  }


  .breadcrumb {
    margin-bottom: 1.25rem;

    font-size: 0.75rem;
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


/* ==========================================
   Mobile
========================================== */

@media (max-width: 480px) {

  .product-detail-page {
    padding:
      0.5rem;
  }


  .product-detail__container {
    padding:
      0.75rem;

    border-radius:
      0.75rem;
  }


  .product-detail__content {
    gap:
      1.25rem;
  }


  .product-gallery__thumbs {
    grid-template-columns:
      repeat(
        4,
        minmax(0, 1fr)
      );
  }


  .product-info__title {
    font-size:
      1.25rem;
  }


  .product-info__price-section {
    padding:
      1rem;
  }


  .current-price {
    font-size:
      1.3rem;
  }


  .variant-option {
    padding:
      0.7rem;

    gap:
      0.5rem;

    font-size:
      0.8rem;
  }


  .variant-option__price {
    font-size:
      0.72rem;
  }


  /*
   * روی موبایل دکمه قلب
   * کنار افزودن به سبد باقی بماند.
   */
  .product-info__actions {
    flex-direction:
      row;

    gap:
      0.5rem;
  }


  .wishlist-btn {
    width:
      3.5rem;

    min-width:
      3.5rem;

    height:
      3.5rem;
  }


  .add-to-cart-btn {
    min-width: 0;

    font-size:
      0.9rem;
  }


  .specs-table th,
  .specs-table td {
    padding:
      0.6rem
      0.4rem;

    font-size:
      0.8rem;
  }
}

</style>