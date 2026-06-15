<template>
  <div class="home-page p-4 md:p-8 bg-gray-50 space-y-10">

    <!-- HERO / BANNER -->
    <section class="hero">
      <div v-if="bannerLoading" class="py-10 text-center text-gray-500">
        در حال بارگذاری بنر...
      </div>

      <BannerCarousel
        v-else-if="banners.length"
        :banners="banners"
      />

      <div v-else class="py-10 text-center text-gray-400">
        بنری موجود نیست
      </div>
    </section>


    <!-- CATEGORIES -->
    <section>
  <h2 class="text-lg font-bold mb-4">
    دسته‌بندی‌ها
  </h2>

  <div
    class="flex overflow-x-auto gap-4 pb-2 scrollbar-hide"
  >
    <div
      v-for="c in categoryStore.categories"
      :key="c.id"
      class="flex-shrink-0 w-20 text-center group cursor-pointer"
    >
      <div
        class="w-16 h-16 mx-auto rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center"
      >
        <img
          :src="c.image || '/images/category-placeholder.webp'"
          :alt="c.name"
          class="w-10 h-10 object-contain"
        />
      </div>

      <p
        class="text-xs mt-2 leading-4 h-8 overflow-hidden"
      >
        {{ c.name }}
      </p>
    </div>
  </div>
</section>

    <!-- FLASH / FEATURED -->
    <section>
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-lg font-bold">محصولات پیشنهادی</h2>
        <span class="text-sm text-blue-500 cursor-pointer">مشاهده همه</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="p in featuredProducts"
          :key="p.id"
          class="group bg-white border rounded-xl p-3 hover:shadow-lg transition"
        >

          <img
            :src="p.image"
            class="w-full h-36 object-cover rounded-lg group-hover:scale-105 transition"
          />

          <h3 class="text-sm font-semibold mt-2 line-clamp-2">
            {{ p.name }}
          </h3>

          <p class="text-green-600 font-bold mt-1">
            {{ formatPrice(p.price) }}
          </p>

          <button
            @click="addToCart(p)"
            class="mt-3 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg text-sm hover:opacity-90"
          >
            افزودن به سبد 🛒
          </button>

        </div>
      </div>
    </section>


    <!-- TRUST SECTION -->
    <section class="bg-white rounded-2xl p-5 border">
      <h2 class="text-lg font-bold mb-4">چرا بازبیا؟ 🐦</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>✔ خرید هوشمند بدون تبلیغ مزاحم</div>
        <div>✔ قیمت واقعی و مقایسه شفاف</div>
        <div>✔ تجربه سریع و ساده</div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import axios from "axios"
import BannerCarousel from "@/components/BannerCarousel.vue"

import type { Category } from "@/types/category.types"
import { useCategoryStore } from "@/core/store/categoryStore"

const categoryStore = useCategoryStore()

  
/* ---------------- BANNERS ---------------- */
const banners = ref<any[]>([])
const bannerLoading = ref(true)

const fetchBanners = async () => {
  try {
    const res = await axios.get(
      "https://backend.bazbia.ir/api/promotions/banners/"
    )
    banners.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    bannerLoading.value = false
  }
}


/* ---------------- CATEGORIES ---------------- */
onMounted(() => {
  fetchBanners()
  categoryStore.fetchCategories()
})

/* ---------------- PRODUCTS ---------------- */
const featuredProducts = ref([
  { id: 1, name: "آیفون 14 پرو مکس", price: 42000000, image: "/assets/p1.jpg" },
  { id: 2, name: "لپ‌تاپ ایسوس ROG", price: 38000000, image: "/assets/p2.jpg" },
  { id: 3, name: "هدفون بی‌سیم سونی", price: 2500000, image: "/assets/p3.jpg" },
  { id: 4, name: "ساعت اپل واچ", price: 12000000, image: "/assets/p4.jpg" }
])


/* ---------------- CART ---------------- */
function addToCart(product: any) {
  console.log("ADD TO CART:", product)
}


/* ---------------- UTILS ---------------- */
function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان"
}


/* ---------------- INIT ---------------- */

</script>

<style scoped>
.hero {
  border-radius: 16px;
  overflow: hidden;
}
</style>
