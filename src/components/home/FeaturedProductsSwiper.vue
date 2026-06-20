<template>
  <section class="mt-8">

    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-bold text-lg">
        محصولات ویژه
      </h2>

      <span class="text-blue-500 text-sm cursor-pointer">
        مشاهده همه
      </span>
    </div>

    <!-- Swiper -->
    <Swiper
      :modules="modules"
      :slides-per-view="1.2"
      :space-between="20"
      :breakpoints="breakpoints"
      :navigation="true"
      class="pb-6"
    >

      <SwiperSlide
        v-for="product in products"
        :key="product.id"
      >
        <div
          class="group bg-white border rounded-2xl overflow-hidden transition hover:shadow-xl"
        >

          <!-- Image wrapper -->
          <div class="relative overflow-hidden">

            <!-- Discount badge -->
            <div
              v-if="product.discount_price"
              class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10"
            >
              تخفیف
            </div>

            <!-- Stock badge -->
            <div
              v-if="!product.in_stock"
              class="absolute top-2 left-2 bg-gray-600 text-white text-xs px-2 py-1 rounded-full z-10"
            >
              ناموجود
            </div>

            <!-- Product image -->
            <img
              :src="product.thumb"
              :alt="product.name"
              class="w-full h-44 object-cover transition duration-300 group-hover:scale-105"
            />

            <!-- Quick add overlay -->
            <button
              class="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition bg-blue-600 text-white text-xs py-2 rounded-lg"
              @click="addToCart(product)"
            >
              افزودن سریع
            </button>

          </div>

          <!-- Content -->
          <div class="p-4 flex flex-col gap-2">

            <h3 class="text-sm line-clamp-2 h-10 text-gray-800">
              {{ product.name }}
            </h3>

            <!-- Price -->
            <div class="flex items-center justify-between">

              <div>
                <div class="font-bold text-green-600">
                  {{ formatPrice(product.price) }}
                </div>

                <div
                  v-if="product.discount_price"
                  class="text-xs text-gray-400 line-through"
                >
                  {{ formatPrice(product.discount_price) }}
                </div>
              </div>

              <!-- Discount percent -->
              <div
                v-if="product.discount_price"
                class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full"
              >
                تخفیف
              </div>

            </div>

            <!-- Add to cart -->
            <button
              class="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm transition active:scale-95"
              @click="addToCart(product)"
              :disabled="!product.in_stock"
              :class="{ 'opacity-50 cursor-not-allowed': !product.in_stock }"
            >
              {{ product.in_stock ? 'افزودن به سبد' : 'ناموجود' }}
            </button>

          </div>
        </div>
      </SwiperSlide>

    </Swiper>

  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

import type { Product } from '@/types/product.types'

const modules = [Navigation]

defineProps<{
  products: Product[]
}>()

const breakpoints = {
  320: {
    slidesPerView: 1.1,
    spaceBetween: 16,
  },
  640: {
    slidesPerView: 2.2,
    spaceBetween: 18,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 24,
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

function addToCart(product: Product) {
  console.log('🛒 add to cart:', product)
}
</script>
