<template>
  <div class="wishlist-page">
    <div class="wishlist-container">

      <!-- Header -->
      <header class="wishlist-header">
        <div class="wishlist-header__title">
          <RouterLink
            :to="{ name: 'profile' }"
            class="back-button"
            aria-label="بازگشت"
          >
            <ArrowRight :size="20" />
          </RouterLink>

          <div>
            <h1>
              علاقه‌مندی‌های من
            </h1>

            <p>
              محصولاتی که برای بعد ذخیره کرده‌اید
            </p>
          </div>
        </div>

        <span
          v-if="
            !wishlistStore.loading &&
            wishlistStore.wishlistCount
          "
          class="wishlist-count"
        >
          {{
            wishlistStore.wishlistCount
              .toLocaleString('fa-IR')
          }}
          محصول
        </span>
      </header>


      <!-- Loading -->
      <section
        v-if="wishlistStore.loading"
        class="state-card"
      >
        <div class="loader"></div>

        <p>
          در حال دریافت علاقه‌مندی‌ها...
        </p>
      </section>


      <!-- Error -->
      <section
        v-else-if="wishlistStore.error"
        class="state-card state-card--error"
      >
        <CircleAlert
          :size="38"
          :stroke-width="1.6"
        />

        <h2>
          دریافت علاقه‌مندی‌ها انجام نشد
        </h2>

        <p>
          {{ wishlistStore.error }}
        </p>

        <button
          type="button"
          class="retry-button"
          @click="reloadWishlist"
        >
          <RefreshCw :size="17" />

          تلاش دوباره
        </button>
      </section>


      <!-- Empty -->
      <section
        v-else-if="
          wishlistStore.wishlistItems.length === 0
        "
        class="state-card"
      >
        <div class="heart-empty">
          <Heart
            :size="42"
            :stroke-width="1.5"
          />
        </div>

        <h2>
          لیست علاقه‌مندی‌های شما خالی است
        </h2>

        <p>
          محصولاتی که دوست دارید را با زدن
          علامت قلب برای بعد ذخیره کنید.
        </p>

        <RouterLink
          :to="{ name: 'products' }"
          class="products-button"
        >
          مشاهده محصولات
        </RouterLink>
      </section>


      <!-- Products -->
      <div
        v-else
        class="wishlist-grid"
      >
        <article
          v-for="item in wishlistStore.wishlistItems"
          :key="item.id"
          class="wishlist-card"
        >

          <!-- Image -->
          <RouterLink
            :to="{
              name: 'product-detail',
              params: {
                slug: item.product.slug,
              },
            }"
            class="product-image"
          >
            <img
              :src="productImage(item.product)"
              :alt="item.product.name"
              loading="lazy"
              @error="handleImageError"
            >

            <span
              v-if="hasDiscount(item.product)"
              class="discount-badge"
            >
              تخفیف
            </span>
          </RouterLink>


          <!-- Content -->
          <div class="wishlist-card__content">
            <RouterLink
              :to="{
                name: 'product-detail',
                params: {
                  slug: item.product.slug,
                },
              }"
              class="product-name"
            >
              {{ item.product.name }}
            </RouterLink>


            <!-- Stock -->
            <div
              class="stock-status"
              :class="{
                'stock-status--available':
                  isProductAvailable(
                    item.product,
                  ),
                'stock-status--unavailable':
                  !isProductAvailable(
                    item.product,
                  ),
              }"
            >
              {{
                isProductAvailable(
                  item.product,
                )
                  ? 'موجود'
                  : 'ناموجود'
              }}
            </div>


            <!-- Price -->
            <div class="price-section">
              <span
                v-if="hasDiscount(item.product)"
                class="old-price"
              >
                {{
                  formatPrice(
                    item.product.price,
                  )
                }}
              </span>

              <div class="final-price">
                <strong>
                  {{
                    formatPrice(
                      productFinalPrice(
                        item.product,
                      ),
                    )
                  }}
                </strong>

                <span>
                  تومان
                </span>
              </div>
            </div>


            <!-- Actions -->
            <div class="card-actions">
              <button
                type="button"
                class="cart-button"
                :disabled="
                  !isProductAvailable(
                    item.product,
                  ) ||
                  addingToCartId ===
                    item.product.id
                "
                @click="
                  addProductToCart(
                    item.product,
                  )
                "
              >
                <LoaderCircle
                  v-if="
                    addingToCartId ===
                    item.product.id
                  "
                  class="spin"
                  :size="18"
                />

                <ShoppingCart
                  v-else
                  :size="18"
                />

                <span>
                  {{
                    addingToCartId ===
                    item.product.id
                      ? 'در حال افزودن'
                      : isProductAvailable(
                          item.product,
                        )
                        ? 'افزودن به سبد'
                        : 'ناموجود'
                  }}
                </span>
              </button>


              <button
                type="button"
                class="remove-button"
                :disabled="
                  wishlistStore
                    .removingProductId ===
                    item.product.id
                "
                title="حذف از علاقه‌مندی‌ها"
                @click="
                  removeProduct(
                    item.product.id,
                  )
                "
              >
                <LoaderCircle
                  v-if="
                    wishlistStore
                      .removingProductId ===
                    item.product.id
                  "
                  class="spin"
                  :size="18"
                />

                <Trash2
                  v-else
                  :size="18"
                />
              </button>
            </div>
          </div>
        </article>
      </div>


      <transition name="fade">
        <div
          v-if="message"
          class="page-message"
        >
          {{ message }}
        </div>
      </transition>

    </div>
  </div>
</template>


<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'

import {
  RouterLink,
} from 'vue-router'

import {
  ArrowRight,
  CircleAlert,
  Heart,
  LoaderCircle,
  RefreshCw,
  ShoppingCart,
  Trash2,
} from 'lucide-vue-next'

import {
  useWishlistStore,
} from '@/core/store/wishlistStore'

import {
  useCartStore,
} from '@/core/store/cartStore'

import type {
  Product,
  Variant,
} from '@/types/product.types'


const wishlistStore =
  useWishlistStore()

const cartStore =
  useCartStore()


const addingToCartId =
  ref<number | null>(null)

const message =
  ref<string | null>(null)


let messageTimer:
  number | null = null


// ==========================================
// Message
// ==========================================

function showMessage(
  text: string,
): void {
  message.value = text

  if (messageTimer) {
    window.clearTimeout(
      messageTimer,
    )
  }

  messageTimer =
    window.setTimeout(
      () => {
        message.value = null
      },
      3000,
    )
}


// ==========================================
// Image
// ==========================================

function productImage(
  product: Product,
): string {
  if (product.thumb) {
    return product.thumb
  }

  const mainImage =
    product.images?.find(
      image => image.is_main,
    )

  if (mainImage?.image) {
    return mainImage.image
  }

  if (mainImage?.source_url) {
    return mainImage.source_url
  }

  const firstImage =
    product.images?.[0]

  return (
    firstImage?.image ||
    firstImage?.source_url ||
    '/images/placeholder.jpg'
  )
}


function handleImageError(
  event: Event,
): void {
  const image =
    event.target as HTMLImageElement

  image.src =
    '/images/placeholder.jpg'
}


// ==========================================
// Price
// ==========================================

function hasDiscount(
  product: Product,
): boolean {
  const price =
    Number(product.price ?? 0)

  const discountPrice =
    Number(
      product.discount_price ?? 0,
    )

  return (
    price > 0 &&
    discountPrice > 0 &&
    discountPrice < price
  )
}


function productFinalPrice(
  product: Product,
): number {
  if (
    hasDiscount(product)
  ) {
    return Number(
      product.discount_price,
    )
  }

  return Number(
    product.price ??
    product.base_price ??
    0,
  )
}


function formatPrice(
  value:
    | string
    | number
    | undefined
    | null,
): string {
  const price =
    Number(value ?? 0)

  return price.toLocaleString(
    'fa-IR',
  )
}


// ==========================================
// Stock
// ==========================================

function variantAvailable(
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
      variant.stock ?? 0,
    ) > 0
  )
}


function isProductAvailable(
  product: Product,
): boolean {
  if (
    product.variants?.length
  ) {
    return product.variants.some(
      variant =>
        variantAvailable(
          variant,
        ),
    )
  }

  return (
    Number(
      product.in_stock ??
      product.stock ??
      0,
    ) > 0
  )
}


function getAvailableVariant(
  product: Product,
): Variant | null {
  if (
    !product.variants?.length
  ) {
    return null
  }

  return (
    product.variants.find(
      variant =>
        variantAvailable(
          variant,
        ),
    ) ??
    product.variants[0] ??
    null
  )
}


// ==========================================
// Cart
// ==========================================

async function addProductToCart(
  product: Product,
): Promise<void> {
  const variant =
    getAvailableVariant(
      product,
    )

  if (!variant) {
    showMessage(
      'برای این محصول واریانت قابل خرید پیدا نشد.',
    )

    return
  }

  if (
    !variantAvailable(
      variant,
    )
  ) {
    showMessage(
      'این محصول در حال حاضر ناموجود است.',
    )

    return
  }

  addingToCartId.value =
    product.id

  try {
    const success =
      await cartStore.addToCart(
        variant.id,
        1,
      )

    if (success) {
      showMessage(
        'محصول به سبد خرید اضافه شد.',
      )
    } else {
      showMessage(
        cartStore.error ||
        'افزودن به سبد خرید انجام نشد.',
      )
    }
  } finally {
    addingToCartId.value =
      null
  }
}


// ==========================================
// Remove
// ==========================================

async function removeProduct(
  productId: number,
): Promise<void> {
  const success =
    await wishlistStore.removeItem(
      productId,
    )

  if (success) {
    showMessage(
      'محصول از علاقه‌مندی‌ها حذف شد.',
    )
  } else {
    showMessage(
      wishlistStore.error ||
      'حذف محصول انجام نشد.',
    )
  }
}


// ==========================================
// Reload
// ==========================================

async function reloadWishlist():
  Promise<void> {
  await wishlistStore.fetchWishlist(
    true,
  )
}


// ==========================================
// Mount
// ==========================================

onMounted(
  async () => {
    await wishlistStore.fetchWishlist(
      true,
    )
  },
)
</script>


<style scoped>
.wishlist-page {
  min-height: 70vh;
  padding: 24px 16px 48px;
  background: #f8fafc;
}

.wishlist-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}


/* Header */

.wishlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.wishlist-header__title {
  display: flex;
  align-items: center;
  gap: 13px;
}

.wishlist-header h1 {
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 800;
}

.wishlist-header p {
  margin: 5px 0 0;
  color: #6b7280;
  font-size: 12px;
}

.back-button {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  color: #374151;
  text-decoration: none;
}

.wishlist-count {
  padding: 7px 11px;
  border-radius: 999px;
  background: #ecfdf5;
  color: #15803d;
  font-size: 11px;
  font-weight: 800;
}


/* State */

.state-card {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #fff;
  text-align: center;
  color: #6b7280;
}

.state-card--error {
  color: #dc2626;
  border-color: #fecaca;
}

.state-card h2 {
  margin: 15px 0 7px;
  color: #1f2937;
  font-size: 17px;
}

.state-card p {
  max-width: 420px;
  margin: 0;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.9;
}

.heart-empty {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  background: #fef2f2;
  color: #ef4444;
}

.products-button,
.retry-button {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 18px;
  padding: 0 16px;
  border: 0;
  border-radius: 11px;
  background: #15803d;
  color: white;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.loader {
  width: 32px;
  height: 32px;
  margin-bottom: 15px;
  border: 3px solid #dcfce7;
  border-top-color: #15803d;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}


/* Grid */

.wishlist-grid {
  display: grid;
  grid-template-columns:
    repeat(
      auto-fill,
      minmax(230px, 1fr)
    );
  gap: 15px;
}

.wishlist-card {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: white;
  transition:
    transform .2s ease,
    box-shadow .2s ease;
}

.wishlist-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 30px
    rgba(15, 23, 42, .06);
}


/* Image */

.product-image {
  position: relative;
  display: block;
  height: 220px;
  overflow: hidden;
  background: #f9fafb;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform .25s ease;
}

.wishlist-card:hover
.product-image img {
  transform: scale(1.02);
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #dc2626;
  color: white;
  font-size: 10px;
  font-weight: 800;
}


/* Content */

.wishlist-card__content {
  padding: 14px;
}

.product-name {
  min-height: 44px;
  display: block;
  color: #1f2937;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.8;
  text-decoration: none;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-name:hover {
  color: #15803d;
}

.stock-status {
  width: fit-content;
  margin-top: 8px;
  font-size: 10px;
  font-weight: 800;
}

.stock-status--available {
  color: #15803d;
}

.stock-status--unavailable {
  color: #dc2626;
}


/* Price */

.price-section {
  min-height: 55px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 10px;
}

.old-price {
  color: #9ca3af;
  font-size: 10px;
  text-decoration: line-through;
}

.final-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: #111827;
}

.final-price strong {
  font-size: 16px;
}

.final-price span {
  font-size: 10px;
  color: #6b7280;
}


/* Buttons */

.card-actions {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr) 42px;
  gap: 8px;
  margin-top: 13px;
}

.cart-button,
.remove-button {
  min-height: 42px;
  border-radius: 11px;
  font-family: inherit;
  cursor: pointer;
}

.cart-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  background: #15803d;
  color: white;
  font-size: 11px;
  font-weight: 800;
}

.cart-button:hover:not(:disabled) {
  background: #166534;
}

.remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fecaca;
  background: #fff;
  color: #dc2626;
}

.remove-button:hover:not(:disabled) {
  background: #fef2f2;
}

.cart-button:disabled,
.remove-button:disabled {
  opacity: .55;
  cursor: not-allowed;
}


/* Message */

.page-message {
  position: fixed;
  right: 50%;
  bottom: 25px;
  z-index: 1000;
  transform: translateX(50%);
  padding: 11px 18px;
  border-radius: 11px;
  background: #1f2937;
  color: #fff;
  box-shadow:
    0 8px 28px
    rgba(0, 0, 0, .15);
  font-size: 12px;
  font-weight: 700;
}


/* animations */

.spin {
  animation: spin .75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


/* Mobile */

@media (max-width: 600px) {
  .wishlist-page {
    padding: 18px 11px 35px;
  }

  .wishlist-header h1 {
    font-size: 18px;
  }

  .wishlist-header p {
    display: none;
  }

  .wishlist-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 9px;
  }

  .product-image {
    height: 165px;
  }

  .wishlist-card__content {
    padding: 10px;
  }

  .product-name {
    min-height: 42px;
    font-size: 11px;
  }

  .final-price strong {
    font-size: 13px;
  }

  .cart-button span {
    font-size: 9px;
  }
}

@media (max-width: 360px) {
  .wishlist-grid {
    grid-template-columns: 1fr;
  }

  .product-image {
    height: 230px;
  }
}
</style>
