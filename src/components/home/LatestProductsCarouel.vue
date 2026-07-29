<template>
  <section
    class="mx-4 mt-10 rounded-2xl bg-white p-5 py-6 shadow-md"
  >
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between">
      <h2
        class="flex items-center gap-2 text-lg font-bold text-gray-800 md:text-xl"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white"
        >
          🆕
        </span>

        جدیدترین محصولات
      </h2>

      <button
        type="button"
        class="text-sm text-green-600 transition hover:text-green-700"
        @click="goToAll"
      >
        مشاهده همه
      </button>
    </div>

    <div class="relative">
      <!-- List -->
      <div
        ref="slider"
        class="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        <!-- Skeleton -->
        <template v-if="store.loading">
          <div
            v-for="n in 6"
            :key="n"
            class="min-w-[180px] animate-pulse rounded-2xl bg-gray-100 p-3 md:min-w-[220px]"
          >
            <div class="h-44 rounded-xl bg-gray-200" />

            <div
              class="mt-3 h-3 w-3/4 rounded bg-gray-200"
            />

            <div
              class="mt-2 h-3 w-1/2 rounded bg-gray-200"
            />

            <div
              class="mt-4 h-9 rounded-lg bg-gray-200"
            />
          </div>
        </template>

        <!-- Products -->
        <template v-else>
          <article
            v-for="product in store.products"
            :key="product.id"
            class="group min-w-[180px] cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-xl md:min-w-[220px]"
            :class="{
              'border-gray-200 opacity-90':
                !isProductInStock(product),
            }"
            @click="goToProduct(product)"
          >
            <!-- Image -->
            <div class="relative overflow-hidden bg-gray-50">
              <img
                v-if="product.thumb"
                :src="product.thumb"
                :alt="product.name"
                loading="lazy"
                class="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                :class="{
                  'opacity-70 grayscale-[20%]':
                    !isProductInStock(product),
                }"
              />

              <div
                v-else
                class="flex h-44 items-center justify-center text-xs text-gray-400"
              >
                تصویر موجود نیست
              </div>

              <!-- Discount -->
              <span
                v-if="
                  isProductInStock(product) &&
                  hasDiscount(product)
                "
                class="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white"
              >
                -{{ getDiscountPercent(product) }}٪
              </span>

              <!-- Stock Badge -->
              <span
                class="absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold"
                :class="
                  isProductInStock(product)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-700 text-white'
                "
              >
                {{
                  isProductInStock(product)
                    ? 'موجود'
                    : 'ناموجود'
                }}
              </span>
            </div>

            <!-- Content -->
            <div class="flex flex-col gap-2 p-3">
              <h3
                class="line-clamp-2 min-h-[40px] text-center text-sm text-gray-800"
              >
                {{ product.name }}
              </h3>

              <!-- Price -->
              <div
                class="flex min-h-[48px] flex-col justify-center"
              >
                <template v-if="isProductInStock(product)">
                  <span
                    v-if="hasDiscount(product)"
                    class="mb-1 text-xs text-gray-400 line-through"
                  >
                    {{ formatPrice(product.price) }}
                  </span>

                  <span
                    class="text-sm font-bold text-green-600"
                  >
                    {{
                      formatPrice(
                        getFinalPrice(product),
                      )
                    }}
                  </span>
                </template>

                <div
                  v-else
                  class="flex min-h-[48px] items-center justify-center text-sm font-bold text-gray-500"
                >
                  ناموجود
                </div>
              </div>

              <!-- Button -->
              <button
                type="button"
                class="mt-2 w-full rounded-lg bg-green-600 py-2 text-xs font-bold text-white transition hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:active:scale-100"
                :disabled="
                  !isProductInStock(product)
                "
                @click.stop="
                  addToCart(product)
                "
              >
                {{
                  isProductInStock(product)
                    ? 'افزودن به سبد'
                    : 'ناموجود'
                }}
              </button>
            </div>
          </article>
        </template>

        <!-- Empty -->
        <div
          v-if="
            !store.loading &&
            store.products.length === 0
          "
          class="flex min-h-[180px] w-full items-center justify-center text-sm text-gray-500"
        >
          محصولی برای نمایش وجود ندارد.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'
import { useRouter } from 'vue-router'

import { useLatestProductStore } from '@/core/store/latestProductStore'

interface ProductVariant {
  id?: number
  stock?: number | string | null
}

interface LatestProduct {
  id: number
  slug?: string
  name: string
  thumb?: string | null
  price: number | string
  discount_price?:
    | number
    | string
    | null
  old_price?:
    | number
    | string
    | null
  discount?:
    | number
    | string
    | null
  in_stock?:
    | number
    | string
    | boolean
    | null
  stock?:
    | number
    | string
    | null
  variants?: ProductVariant[]
}

const router = useRouter()

const slider =
  ref<HTMLElement | null>(null)

const store = useLatestProductStore()

onMounted(() => {
  store.fetchLatestProducts()
})

function isProductInStock(
  product: LatestProduct,
): boolean {
  const variants =
    product.variants ?? []

  if (variants.length > 0) {
    return variants.some(
      (variant) =>
        Number(variant.stock) > 0,
    )
  }

  if (
    typeof product.in_stock ===
    'boolean'
  ) {
    return product.in_stock
  }

  return (
    Number(
      product.in_stock ??
        product.stock ??
        0,
    ) > 0
  )
}

function hasDiscount(
  product: LatestProduct,
): boolean {
  const price = Number(
    product.price ?? 0,
  )

  const discountPrice = Number(
    product.discount_price ?? 0,
  )

  return (
    isProductInStock(product) &&
    price > 0 &&
    discountPrice > 0 &&
    discountPrice < price
  )
}

function getFinalPrice(
  product: LatestProduct,
): number {
  if (hasDiscount(product)) {
    return Number(
      product.discount_price,
    )
  }

  return Number(
    product.price ?? 0,
  )
}

function getDiscountPercent(
  product: LatestProduct,
): number {
  if (!hasDiscount(product)) {
    return 0
  }

  const price = Number(
    product.price,
  )

  const discountPrice = Number(
    product.discount_price,
  )

  return Math.round(
    ((price - discountPrice) /
      price) *
      100,
  )
}

function goToProduct(
  product: LatestProduct,
) {
  router.push(
    `/product/${
      product.slug || product.id
    }`,
  )
}

function goToAll() {
  router.push('/products')
}

function addToCart(
  product: LatestProduct,
) {
  if (!isProductInStock(product)) {
    return
  }

  console.log(
    'ADD TO CART:',
    product,
  )
}

function formatPrice(
  price:
    | number
    | string
    | null
    | undefined,
): string {
  const numericPrice = Number(
    price ?? 0,
  )

  return (
    new Intl.NumberFormat(
      'fa-IR',
    ).format(numericPrice) +
    ' تومان'
  )
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
