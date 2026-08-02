<template>
  <section class="w-full">
    <div
      class="overflow-hidden rounded-3xl border border-emerald-100
             bg-gradient-to-l from-emerald-50 via-white to-green-50
             p-4 shadow-sm md:p-6"
    >
      <!-- Header -->
      <div class="mb-5 flex items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-3">
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center
                   rounded-2xl bg-white shadow-sm ring-1 ring-emerald-100"
          >
            <img
              src="/images/bazbin.svg"
              alt="بازبین"
              class="h-8 w-8 object-contain"
            />
          </div>

          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="font-bold text-gray-900 md:text-lg">
                محصولات ویژه
              </h2>

              <span
                class="rounded-full bg-red-500 px-2.5 py-1
                       text-[10px] font-bold text-white shadow-sm"
              >
                فقط امروز
              </span>
            </div>

            <p class="mt-1 text-xs text-gray-500">
              پیشنهادهای منتخب بازبیا با قیمت ویژه
            </p>
          </div>
        </div>

        <button
          type="button"
          class="shrink-0 rounded-xl px-3 py-2 text-xs font-medium
                 text-emerald-700 transition
                 hover:bg-emerald-100 md:text-sm"
        >
          مشاهده همه
        </button>
      </div>

      <!-- Empty -->
      <div
        v-if="!sortedProducts.length"
        class="flex min-h-52 items-center justify-center rounded-2xl
               border border-dashed border-gray-200 bg-white/70
               text-sm text-gray-400"
      >
        محصول ویژه‌ای موجود نیست
      </div>

      <!-- Swiper -->
      <Swiper
        v-else
        :modules="modules"
        slides-per-view="auto"
        :space-between="14"
        :navigation="true"
        class="featured-products-swiper !overflow-visible pb-4"
      >
        <SwiperSlide
          v-for="product in sortedProducts"
          :key="product.id"
          class="!h-auto !w-[210px] sm:!w-[230px] lg:!w-[245px]"
        >
          <article
            class="group flex h-full flex-col overflow-hidden rounded-2xl
                   border border-gray-100 bg-white shadow-sm
                   transition duration-300
                   hover:-translate-y-1 hover:shadow-xl"
            :class="{
              'opacity-90': !isProductInStock(product),
            }"
          >
            <!-- Image -->
            <div class="relative aspect-square overflow-hidden bg-gray-50">
              <span
                v-if="
                  isProductInStock(product) &&
                  hasDiscount(product)
                "
                class="absolute right-3 top-3 z-10 rounded-full
                       bg-red-500 px-2.5 py-1 text-[11px]
                       font-bold text-white shadow"
              >
                پیشنهاد ویژه
              </span>

              <span
                v-if="!isProductInStock(product)"
                class="absolute inset-0 z-10 flex items-center justify-center
                       bg-white/70 text-sm font-bold text-gray-600
                       backdrop-blur-[2px]"
              >
                ناموجود
              </span>

              <img
                v-if="product.thumb"
                :src="product.thumb"
                :alt="product.name"
                loading="lazy"
                class="h-full w-full object-contain p-3
                       transition duration-500
                       group-hover:scale-105"
                :class="{
                  'grayscale-[20%] opacity-70':
                    !isProductInStock(product),
                }"
              />

              <div
                v-else
                class="flex h-full w-full items-center justify-center
                       text-xs text-gray-400"
              >
                تصویر موجود نیست
              </div>
            </div>

            <!-- Content -->
            <div class="flex flex-1 flex-col p-4">
              <h3
                class="line-clamp-2 min-h-11 text-center text-sm
                       font-medium leading-6 text-gray-800"
              >
                {{ product.name }}
              </h3>

              <!-- Price -->
              <div class="mt-4 flex min-h-[58px] flex-col justify-end">
                <template v-if="isProductInStock(product)">
                  <div
                    v-if="hasDiscount(product)"
                    class="mb-1 text-xs text-gray-400 line-through"
                  >
                    {{ formatPrice(product.price) }}
                  </div>

                  <div class="flex items-end justify-between gap-2">
                    <span class="text-base font-bold text-emerald-600">
                      {{ formatPrice(getFinalPrice(product)) }}
                    </span>

                    <span
                      v-if="hasDiscount(product)"
                      class="rounded-lg bg-red-50 px-2 py-1
                             text-[10px] font-bold text-red-500"
                    >
                      {{ getDiscountPercent(product) }}٪ تخفیف
                    </span>
                  </div>
                </template>

                <div
                  v-else
                  class="flex min-h-[42px] items-center justify-center
                         text-sm font-bold text-gray-500"
                >
                  ناموجود
                </div>
              </div>

              <!-- Button -->
              <button
                type="button"
                class="mt-4 flex w-full items-center justify-center
                       rounded-xl bg-emerald-500 px-3 py-2.5
                       text-sm font-bold text-white
                       transition active:scale-95
                       hover:bg-emerald-600
                       disabled:cursor-not-allowed
                       disabled:bg-gray-200 disabled:text-gray-400
                       disabled:active:scale-100"
                :disabled="
                  !isProductInStock(product) ||
                  addingProductId === product.id
                "
                @click.stop="addToCart(product)"
              >
                <template v-if="addingProductId === product.id">
                  در حال افزودن...
                </template>

                <template v-else-if="addedProductId === product.id">
                  به سبد اضافه شد ✓
                </template>

                <template v-else>
                  {{
                    isProductInStock(product)
                      ? 'افزودن به سبد خرید'
                      : 'ناموجود'
                  }}
                </template>
              </button>
            </div>
          </article>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import { Navigation } from 'swiper/modules'
import {
  Swiper,
  SwiperSlide,
} from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'

import { useCartStore } from '@/core/store/cartStore'
import type { Product } from '@/types/product.types'

const modules = [Navigation]

const props = defineProps<{
  products: Product[]
}>()

const cartStore = useCartStore()

const addingProductId =
  ref<number | null>(null)

const addedProductId =
  ref<number | null>(null)

const sortedProducts = computed<Product[]>(() => {
  return [...props.products].sort(
    (
      firstProduct,
      secondProduct,
    ) => {
      const firstIsInStock =
        isProductInStock(firstProduct)

      const secondIsInStock =
        isProductInStock(secondProduct)

      if (
        firstIsInStock ===
        secondIsInStock
      ) {
        return 0
      }

      return firstIsInStock ? -1 : 1
    },
  )
})

function getAvailableVariant(
  product: Product,
) {
  const variants =
    product.variants ?? []

  return (
    variants.find(
      (variant) =>
        Number(variant.id) > 0 &&
        Number(variant.stock) > 0,
    ) ?? null
  )
}

function isProductInStock(
  product: Product,
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
      product.in_stock ?? 0,
    ) > 0
  )
}

function hasDiscount(
  product: Product,
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
  product: Product,
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
  product: Product,
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

async function addToCart(
  product: Product,
) {
  if (
    !isProductInStock(product) ||
    addingProductId.value !== null
  ) {
    return
  }

  const variant =
    getAvailableVariant(product)

  if (!variant?.id) {
    console.error(
      'واریانت دارای موجودی پیدا نشد:',
      product,
    )

    return
  }

  addingProductId.value =
    product.id

  addedProductId.value = null

  try {
    await cartStore.addItem({
      variant_id: Number(
        variant.id,
      ),
      quantity: 1,
    })

    addedProductId.value =
      product.id

    window.setTimeout(() => {
      if (
        addedProductId.value ===
        product.id
      ) {
        addedProductId.value = null
      }
    }, 2000)
  } catch (error) {
    console.error(
      'خطا در افزودن محصول ویژه به سبد:',
      error,
    )
  } finally {
    addingProductId.value = null
  }
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
.featured-products-swiper {
  --swiper-navigation-size: 16px;
}

.featured-products-swiper :deep(.swiper-button-next),
.featured-products-swiper :deep(.swiper-button-prev) {
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  background: white;
  color: #059669;
  box-shadow: 0 4px 14px rgb(0 0 0 / 10%);
}

.featured-products-swiper :deep(.swiper-button-disabled) {
  opacity: 0;
}
</style>
