<template>
  <section class="mt-8 px-4">

    <!-- 🎯 Special Box -->
    <div class="bg-gradient-to-l from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-4">

      <!-- Header -->
      <div class="flex justify-between items-center mb-4">

        <div class="flex items-center gap-2">

          <!-- 🐦 Mascot -->
          <img
            src="/images/bazbin.svg"
            alt="بازبین"
            class="w-8 h-8"
          />

          <h2 class="font-bold text-lg text-green-800">
            محصولات ویژه
          </h2>

          <!-- 🔴 Only Today Badge -->
          <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            فقط امروز
          </span>

        </div>

        <span class="text-green-700 text-sm cursor-pointer">
          مشاهده همه
        </span>

      </div>

      <!-- 🌀 Swiper -->
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
          class="!w-[120px]"
        >

      
  




          

          <!-- 🧱 Card -->
          <div class="group bg-white border rounded-2xl overflow-hidden transition hover:shadow-xl w-full ">
          

            <!-- 🖼 Image -->
            <div class="relative overflow-hidden">

              <!-- Discount -->
              <div
                v-if="product.discount_price"
                class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10"
              >
                تخفیف
              </div>

              <!-- Image -->
              <img
                :src="product.thumb"
                :alt="product.name"
                class="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
              />

              <!-- ⚡ Quick Add -->
              <button
                class="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition bg-green-600 text-white text-xs py-2 rounded-lg"
                @click="addToCart(product)"
              >
                افزودن سریع
              </button>

            </div>

            <!-- 📦 Content -->
            <div class="p-4 flex flex-col gap-2">

              <!-- Name -->
              <h3 class="text-sm line-clamp-2 h-10 text-gray-800 text-center">
                {{ product.name }}
              </h3>

              <!-- Price -->
              <div class="flex items-center justify-between">

                <div >
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

                <!-- Tag -->
                <div
                  v-if="product.discount_price"
                  class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full"
                >
                  پیشنهاد
                </div>

              </div>

              <!-- 🛒 Button -->
              <button
                class="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm transition active:scale-95"
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

    </div>

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
    slidesPerView: 'auto',
    spaceBetween: 5,
  },
  480: {
    slidesPerView: 1.4,
    spaceBetween: 14,
  },
  640: {
    slidesPerView: 2.2,
    spaceBetween: 16,
  },
  768: {
    slidesPerView: 2.8,
    spaceBetween: 18,
  },
  1024: {
    slidesPerView: 3.5,
    spaceBetween: 20,
  },
  1280: {
    slidesPerView: 4.2,
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
