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
    <section class="mt-8 px-4">

      <div class="flex justify-between items-center mb-4">
        <h2 class="font-bold text-lg">
        بازبیا   دسته‌بندی‌ها
        </h2>

        <span class="text-blue-500 text-sm cursor-pointer">
          همه
        </span>
      </div>

      <div class="flex flex-nowrap overflow-x-auto gap-4 pb-2 scrollbar-hide">

        <div
          v-for="c in categoryStore.categories"
          :key="c.id"
          class="flex-shrink-0 w-20 text-center cursor-pointer group"
        >

          <div
            class="w-16 h-16 rounded-full bg-white border border-gray-200 shadow-sm mx-auto flex items-center justify-center group-hover:shadow-lg transition"
          >
            <img
              :src="c.image || '/images/category-placeholder.webp'"
              :alt="c.name"
              class="w-9 h-9 object-contain"
            />
          </div>

          <div
            class="text-xs mt-2 h-8 leading-4 overflow-hidden text-gray-700"
          >
            {{ c.name }}
          </div>

        </div>

      </div>

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
import { ref, onMounted } from "vue"
import axios from "axios"
import BannerCarousel from "@/components/BannerCarousel.vue"
import { useCategoryStore } from "@/core/store/categoryStore"

const categoryStore = useCategoryStore()

const banners = ref([])
const bannerLoading = ref(true)

const featuredProducts = ref([
  {
    id: 1,
    name: "آیفون 14 پرو مکس",
    price: 42000000,
    image: "/assets/p1.jpg"
  },
  {
    id: 2,
    name: "لپ تاپ ایسوس",
    price: 38000000,
    image: "/assets/p2.jpg"
  },
  {
    id: 3,
    name: "هدفون سونی",
    price: 2500000,
    image: "/assets/p3.jpg"
  },
  {
    id: 4,
    name: "اپل واچ",
    price: 12000000,
    image: "/assets/p4.jpg"
  }
])

async function fetchBanners() {
  try {
    const res = await axios.get(
      "https://backend.bazbia.ir/api/promotions/banners/"
    )
    banners.value = res.data
  } finally {
    bannerLoading.value = false
  }
}

function addToCart(product: any) {
  console.log(product)
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان"
}

onMounted(() => {
  fetchBanners()
  categoryStore.fetchCategories()
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
