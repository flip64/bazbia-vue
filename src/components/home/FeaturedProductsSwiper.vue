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
        v-if="!products.length"
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
          v-for="product in products"
          :key="product.id"
          class="!h-auto !w-[210px] sm:!w-[230px] lg:!w-[245px]"
        >
          <article
            class="group flex h-full flex-col overflow-hidden rounded-2xl
                   border border-gray-100 bg-white shadow-sm
                   transition duration-300
                   hover:-translate-y-1 hover:shadow-xl"
          >
            <!-- Image -->
            <div class="relative aspect-square overflow-hidden bg-gray-50">
              <span
                v-if="product.discount_price"
                class="absolute right-3 top-3 z-10 rounded-full
                       bg-red-500 px-2.5 py-1 text-[11px]
                       font-bold text-white shadow"
              >
                پیشنهاد ویژه
              </span>

              <span
                v-if="!product.in_stock"
                class="absolute inset-0 z-10 flex items-center justify-center
                       bg-white/70 text-sm font-bold text-gray-600
                       backdrop-blur-[2px]"
              >
                ناموجود
              </span>

              <img
                :src="product.thumb"
                :alt="product.name"
                loading="lazy"
                class="h-full w-full object-contain p-3
                       transition duration-500
                       group-hover:scale-105"
              />
            </div>

            <!-- Content -->
            <div class="flex flex-1 flex-col p-4">
              <h3
                class="line-clamp-2 min-h-11 text-center text-sm
                       font-medium leading-6 text-gray-800"
              >
                {{ product.name }}
              </h3>

              <div class="mt-4">
                <div
                  v-if="product.discount_price"
                  class="mb-1 text-xs text-gray-400 line-through"
                >
                  {{ formatPrice(product.discount_price) }}
                </div>

                <div class="flex items-end justify-between gap-2">
                  <span class="text-base font-bold text-emerald-600">
                    {{ formatPrice(product.price) }}
                  </span>

                  <span
                    v-if="product.discount_price"
                    class="rounded-lg bg-red-50 px-2 py-1
                           text-[10px] font-bold text-red-500"
                  >
                    تخفیف
                  </span>
                </div>
              </div>

              <button
                type="button"
                class="mt-4 flex w-full items-center justify-center
                       rounded-xl bg-emerald-500 px-3 py-2.5
                       text-sm font-bold text-white
                       transition active:scale-95
                       hover:bg-emerald-600
                       disabled:cursor-not-allowed
                       disabled:bg-gray-200 disabled:text-gray-400"
                :disabled="!product.in_stock"
                @click="addToCart(product)"
              >
                {{ product.in_stock ? "افزودن به سبد خرید" : "ناموجود" }}
              </button>
            </div>
          </article>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"

import type { Product } from "@/types/product.types"

const modules = [Navigation]

defineProps<{
  products: Product[]
}>()

function formatPrice(price: number | string | null | undefined) {
  const numericPrice = Number(price ?? 0)

  return (
    new Intl.NumberFormat("fa-IR").format(numericPrice) +
    " تومان"
  )
}

function addToCart(product: Product) {
  console.log("🛒 add to cart:", product)
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
