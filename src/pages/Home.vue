<template>
  <div
    class="flex min-h-screen flex-col gap-10 bg-gray-50 py-8"
  >
    <!-- ================= Banner ================= -->
    <section class="px-4">
      <div
        v-if="bannerStore.loading"
        class="flex h-44 items-center justify-center rounded-2xl bg-white"
      >
        در حال بارگذاری...
      </div>

      <BannerCarousel
        v-else-if="bannerStore.banners.length"
        :banners="bannerStore.banners"
      />

      <div
        v-else
        class="flex h-44 items-center justify-center rounded-2xl
               bg-white text-gray-400"
      >
        بنری موجود نیست
      </div>
    </section>

    <!-- ================= Categories ================= -->
    <section class="px-4">
      <h2
        class="relative mb-4 inline-block text-base
               font-bold text-gray-800"
      >
        دسته‌بندی‌ها

        <span
          class="absolute -bottom-1 left-0 h-1 w-12
                 rounded-full bg-blue-500"
        ></span>
      </h2>

      <CategoryGrid
        :categories="categoryStore.categories"
      />
    </section>

    <!-- ================= Featured ================= -->
    <section class="px-4">
      <FeaturedProductsSwiper
        :products="featuredStore.featuredProducts"
      />
    </section>

    <!-- ================= Latest ================= -->
    <section class="px-4">
      <LatestProductsCarousel
        :products="products"
        :loading="loading"
      />
    </section>

    <!-- ================= Promotion ================= -->
    <section class="px-4">
      <PromoBanner />
    </section>

    <!-- ================= Cheapest ================= -->
    <section class="px-4">
      <CheapestProductsCarouel
        :products="featuredStore.featuredProducts"
      />
    </section>
    <!-- ================= Trust ================= -->
      <section class="px-4">
       <WhyBazbia />
      </section>
    

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

import BannerCarousel from "@/components/home/BannerCarousel.vue"
import CategoryGrid from "@/components/home/CategoryGrid.vue"
import CheapestProductsCarouel from "@/components/home/CheapestProductsCarouel.vue"
import FeaturedProductsSwiper from "@/components/home/FeaturedProductsSwiper.vue"
import LatestProductsCarousel from "@/components/home/LatestProductsCarouel.vue"
import PromoBanner from "@/components/home/PromoBanner.vue"
import WhyBazbia from "@/components/home/WhyBazbia.vue"


  
import { useBannerStore } from "@/core/store/bannerStore"
import { useCategoryStore } from "@/core/store/categoryStore"
import { useFeaturedProductStore } from "@/core/store/featuredProductStore"

const categoryStore = useCategoryStore()
const bannerStore = useBannerStore()
const featuredStore = useFeaturedProductStore()

const products = ref<any[]>([])
const loading = ref(false)

async function fetchLatestProducts() {
  loading.value = true

  try {
    const response = await fetch("/api/products/latest")

    if (!response.ok) {
      throw new Error(
        `خطا در دریافت جدیدترین محصولات: ${response.status}`
      )
    }

    products.value = await response.json()
  } catch (error) {
    console.error(error)
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  bannerStore.fetchBanners()
  categoryStore.fetchCategories()
  featuredStore.fetchFeaturedProducts()
  fetchLatestProducts()
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
