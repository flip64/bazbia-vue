<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Banner -->
    <section class="px-4 pt-4">
      <div v-if="bannerLoading" class="h-44 rounded-2xl bg-white flex items-center justify-center">
        در حال بارگذاری...
      </div>

      <BannerCarousel
        v-else-if="banners.length"
        :banners="banners"
      />

      <div
        v-else
        class="h-44 rounded-2xl bg-white flex items-center justify-center text-gray-400"
      >
        بنری موجود نیست
      </div>
    </section>

    <!-- Categories -->
    
  <section class="mt-8 px-4 w-full">

    <!-- Title (اختیاری ولی استاندارد) -->
  <h2 class="mb-4 text-base font-bold text-gray-800 relative inline-block">
  دسته‌بندی‌ها

  <span class="absolute left-0 -bottom-1 w-12 h-1 bg-blue-500 rounded-full"></span>
</h2>

    <!-- Grid -->
    <CategoryGrid
      :categories="categoryStore.categories"
    />

  </section>


    <!-- Featured Products -->
    <section class="mt-8 px-4">

      <div class="flex justify-between items-center mb-4">
        <h2 class="font-bold text-lg">
          محصولات پیشنهادی
        </h2>

        <span class="text-blue-500 text-sm cursor-pointer">
          مشاهده همه
        </span>
      </div>

      <div class="grid grid-cols-2 gap-4">

        <div
          v-for="p in featuredProducts"
          :key="p.id"
          class="bg-white rounded-2xl border p-3 transition hover:shadow-lg"
        >

          <img
            :src="p.image"
            class="w-full h-36 object-cover rounded-xl"
          />

          <h3
            class="mt-3 text-sm font-semibold line-clamp-2 h-10"
          >
            {{ p.name }}
          </h3>

          <div
            class="mt-2 text-green-600 font-bold text-sm"
          >
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

    <!-- Trust -->
    <section class="mt-8 mb-8 px-4">

      <div class="bg-white rounded-2xl border p-5">

        <h2 class="font-bold text-lg mb-4">
          چرا بازبیا؟
        </h2>

        <div class="space-y-3 text-sm text-gray-700">

          <div>
            🐦 خرید هوشمند بدون تبلیغات مزاحم
          </div>

          <div>
            💰 مقایسه شفاف قیمت‌ها
          </div>

          <div>
            ⚡ تجربه خرید سریع و ساده
          </div>

        </div>

      </div>

    </section>

  </div>
</template>


<script setup lang="ts">
import CategoryGrid from "@/components/home/CategoryGrid.vue"
import { ref, onMounted } from "vue"
import axios from "axios"
import BannerCarousel from "@/components/home/BannerCarousel.vue"
import { useCategoryStore } from "@/core/store/categoryStore"

const categoryStore = useCategoryStore()

// =====================
// Banner
// =====================
const banners = ref<any[]>([])
const bannerLoading = ref(true)

// =====================
// Featured Products (API)
// =====================
const featuredProducts = ref<any[]>([])
const featuredLoading = ref(true)

// =====================
// Fetch Banners
// =====================
async function fetchBanners() {
  try {
    const res = await axios.get(
      "https://backend.bazbia.ir/api/promotions/banners/"
    )
    banners.value = res.data
  } catch (err) {
    console.error("banner error", err)
  } finally {
    bannerLoading.value = false
  }
}

// =====================
// Fetch Featured Products
// =====================
async function fetchFeaturedProducts() {
  try {
    const res = await axios.get(
      "https://backend.bazbia.ir/api/products/featured/"
    )
    featuredProducts.value = res.data
  } catch (err) {
    console.error("featured products error", err)
  } finally {
    featuredLoading.value = false
  }
}

// =====================
// Cart
// =====================
function addToCart(product: any) {
  console.log("add to cart:", product)
}

// =====================
// Price format
// =====================
function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان"
}

// =====================
// Mounted
// =====================
onMounted(() => {
  fetchBanners()
  categoryStore.fetchCategories()
  fetchFeaturedProducts()
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
