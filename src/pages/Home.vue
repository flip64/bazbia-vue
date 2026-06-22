<template>
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
      <section class="px-4">
        <FeaturedProductsSwiper
    :products="featuredStore.featuredProducts"
  />
</section>

<!-- سایر بخش‌ها -->
<!-- ================= new product ================= -->

    
    <section>
  <div>

    
    <LatestProductsCarousel
      :products="products"
      :loading="loading"
    />

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
import FeaturedProductsSwiper from '@/components/home/FeaturedProductsSwiper.vue'
  
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


import LatestProductsCarousel from "@/components/home/LatestProductsCarouel.vue"
import { ref, onMounted } from "vue"

// دیتا
const products = ref([])
const loading = ref(true)

// نمونه API (یا سرویس خودت)
async function fetchLatestProducts() {
  loading.value = true

  try {
    const res = await fetch("/api/products/latest")
    products.value = await res.json()
  } finally {
    loading.value = false
  }
}


  
// load data
onMounted(() => {
  bannerStore.fetchBanners()
  categoryStore.fetchCategories()
  featuredStore.fetchFeaturedProducts()
})
  console.log("product :", featuredStore)
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
