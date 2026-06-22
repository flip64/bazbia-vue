<template>
  <section class="mt-10 px-4">

    <!-- Header -->
<div class="flex items-center justify-between mb-4">
  <h2 class="flex items-center gap-2 text-lg md:text-xl font-bold text-gray-800">

    <!-- آیکن -->
    <span
      class="flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-white"
    >
      🆕
    </span>

    جدیدترین محصولات

  </h2>

  <button
    class="text-sm text-green-600 hover:text-green-700"
    @click="goToAll"
  >
    مشاهده همه
  </button>
</div>

    <div class="relative">

      <!-- Left -->
      

      <!-- List -->
      <div
        ref="slider"
        class="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-2"
      >

        <!-- Skeleton -->
        <template v-if="store.loading">
          <div
            v-for="n in 6"
            :key="n"
            class="min-w-[260px] md:min-w-[290px] animate-pulse bg-gray-100 rounded-2xl p-3"
          >
            <div class="h-40 bg-gray-200 rounded-xl"></div>
            <div class="mt-3 h-3 bg-gray-200 rounded w-3/4"></div>
            <div class="mt-2 h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </template>

        <!-- Products -->
        <template v-else>
          <div
            v-for="product in store.products"
            :key="product.id"
            class="group min-w-[180px] md:min-w-[220px] bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer"
            @click="goToProduct(product)"
          >

            <!-- Image -->
            <div class="relative overflow-hidden bg-gray-50">

              <img
                :src="product.thumb"
                class="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
              />

              <!-- Discount -->
              <span
                v-if="product.discount"
                class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              >
                -{{ product.discount }}%
              </span>

            </div>

            <!-- Content -->
            <div class="p-3 flex flex-col gap-2">

              <h3 class="text-sm text-gray-800 line-clamp-2 min-h-[40px] text-center">
                {{ product.name }}
              </h3>

              <!-- Price -->
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

              <!-- Button -->
              <button
                class="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg transition active:scale-95"
                @click.stop="addToCart(product)"
              >
                افزودن به سبد
              </button>

            </div>

          </div>
        </template>

      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useLatestProductStore } from "@/core/store/latestProductStore"

const router = useRouter()
const slider = ref<HTMLElement | null>(null)

const store = useLatestProductStore()

onMounted(() => {
  store.fetchLatestProducts()
})

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
