<template>
  <section class="mt-10 px-4">

    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg md:text-xl font-bold text-gray-800">
        جدیدترین محصولات
      </h2>

      <button
        class="text-sm text-green-600 hover:text-green-700"
        @click="goToAll"
      >
        مشاهده همه
      </button>
    </div>

    <!-- Left/Right Buttons -->
    <div class="relative">

      <button
        @click="scrollLeft"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-8 h-8 hidden md:flex items-center justify-center"
      >
        ‹
      </button>

      <button
        @click="scrollRight"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-8 h-8 hidden md:flex items-center justify-center"
      >
        ›
      </button>

      <!-- Slider -->
      <div
        ref="slider"
        class="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-2"
      >

        <!-- Skeleton -->
        <div
          v-if="loading"
          v-for="n in 6"
          :key="n"
          class="min-w-[160px] md:min-w-[200px] animate-pulse bg-gray-100 rounded-2xl p-3"
        >
          <div class="h-32 bg-gray-200 rounded-xl"></div>
          <div class="mt-3 h-3 bg-gray-200 rounded w-3/4"></div>
          <div class="mt-2 h-3 bg-gray-200 rounded w-1/2"></div>
        </div>

        <!-- Products -->
        <div
          v-else
          v-for="product in products"
          :key="product.id"
          class="min-w-[160px] md:min-w-[200px] bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer group"
          @click="goToProduct(product)"
        >

          <!-- Image -->
          <div class="relative h-32 md:h-36 bg-gray-50 flex items-center justify-center">
            <img
              :src="product.image"
              class="w-full h-full object-contain group-hover:scale-105 transition"
            />

            <!-- Discount Badge -->
            <span
              v-if="product.discount"
              class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {{ product.discount }}%
            </span>
          </div>

          <!-- Info -->
          <div class="p-3">

            <h3 class="text-sm font-medium text-gray-800 line-clamp-2 min-h-[38px]">
              {{ product.name }}
            </h3>

            <!-- Price -->
            <div class="mt-2">
              <div class="flex items-center justify-between">

                <span class="text-green-600 font-bold text-sm">
                  {{ formatPrice(product.price) }}
                </span>

                <span
                  v-if="product.old_price"
                  class="text-xs text-gray-400 line-through"
                >
                  {{ formatPrice(product.old_price) }}
                </span>

              </div>
            </div>

            <!-- Add to cart -->
            <button
              class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg transition"
              @click.stop="addToCart(product)"
            >
              افزودن به سبد
            </button>

          </div>

        </div>

      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const slider = ref<HTMLElement | null>(null)

defineProps<{
  products: {
    id: number | string
    name: string
    image: string
    price: number
    old_price?: number
    discount?: number
    slug?: string
  }[]
  loading?: boolean
}>()

function scrollLeft() {
  slider.value?.scrollBy({ left: -300, behavior: "smooth" })
}

function scrollRight() {
  slider.value?.scrollBy({ left: 300, behavior: "smooth" })
}

function goToProduct(product: any) {
  router.push(`/product/${product.slug || product.id}`)
}

function goToAll() {
  router.push("/products")
}

function addToCart(product: any) {
  console.log("ADD TO CART:", product)
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان"
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
