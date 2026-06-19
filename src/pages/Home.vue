<template>
  <pre>{{ featuredStore.featuredProducts }}</pre>
  <div class="min-h-screen bg-gray-50">

    <!-- ================= Banner ================= -->
    <section class="px-4 pt-4">
      <div
        v-if="bannerStore.loading"
        class="h-44 rounded-2xl bg-white flex items-center justify-center"
      >
        در حال بارگذاری...
      </div>

      <BannerCarousel
        v-else-if="bannerStore.banners.length"
        :banners="bannerStore.banners"
      />

      <div
        v-else
        class="h-44 rounded-2xl bg-white flex items-center justify-center text-gray-400"
      >
        بنری موجود نیست
      </div>
    </section>

    <!-- ================= Categories ================= -->
    <section class="mt-8 px-4 w-full">

      <h2 class="mb-4 text-base font-bold text-gray-800 relative inline-block">
        دسته‌بندی‌ها
        <span class="absolute left-0 -bottom-1 w-12 h-1 bg-blue-500 rounded-full"></span>
      </h2>

      <CategoryGrid
        :categories="categoryStore.categories"
      />
    </section>

    <!-- ================= Featured Products ================= -->
    <section class="mt-8 px-4">

      <div class="flex justify-between items-center mb-4">
        <h2 class="font-bold text-lg">
          محصولات ویژه
        </h2>

        <span class="text-blue-500 text-sm cursor-pointer">
          مشاهده همه
        </span>
      </div>

      <!-- Loading -->
      <div
        v-if="featuredStore.loading"
        class="grid grid-cols-2 gap-4"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white rounded-2xl border p-3 animate-pulse"
        >
          <div class="h-36 bg-gray-200 rounded-xl"></div>
          <div class="h-4 bg-gray-200 mt-3 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 mt-2 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Products -->
      <div v-else class="grid grid-cols-2 gap-4">

        <div
          v-for="p in featuredStore.featuredProducts"
          :key="p.id"
          class="bg-white rounded-2xl border p-3 transition hover:shadow-lg"
        >

          <img
            :src="p.image"
            class="w-full h-36 object-cover rounded-xl"
          />

          <h3 class="mt-3 text-sm font-semibold line-clamp-2 h-10">
            {{ p.name }}
          </h3>

          <div class="mt-2 text-green-600 font-bold text-sm">
            {{ formatPrice(p.price) }}
          </div>

          <button
            @click="addToCart(p)"
            class="mt-3 w-full bg-blue-500 text-white rounded-lg py-2 text-sm"
          >
            افزودن به سبد
          </button>

        </div>

      </div>

    </section>

    <!-- ================= Trust ================= -->
    <section class="mt-8 mb-8 px-4">

      <div class="bg-white rounded-2xl border p-5">

        <h2 class="font-bold text-lg mb-4">
          چرا بازبیا؟
        </h2>

        <div class="space-y-3 text-sm text-gray-700">
          <div>🐦 خرید هوشمند بدون تبلیغات مزاحم</div>
          <div>💰 مقایسه شفاف قیمت‌ها</div>
          <div>⚡ تجربه خرید سریع و ساده</div>
        </div>

      </div>

    </section>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"

import CategoryGrid from "@/components/home/CategoryGrid.vue"
import BannerCarousel from "@/components/home/BannerCarousel.vue"

// stores
import { useCategoryStore } from "@/core/store/categoryStore"
import { useBannerStore } from "@/core/store/bannerStore"
import { useFeaturedProductStore } from "@/core/store/featuredProductStore"

// init stores
const categoryStore = useCategoryStore()
const bannerStore = useBannerStore()
const featuredStore = useFeaturedProductStore()

// price format
function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان"
}

// cart (placeholder)
function addToCart(product: any) {
  console.log("add to cart:", product)
}

// load data
onMounted(() => {
  bannerStore.fetchBanners()
  categoryStore.fetchCategories()
  featuredStore.fetchFeaturedProducts()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
