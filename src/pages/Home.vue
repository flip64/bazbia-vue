<template>
  <div class="home-page">

    <!-- بنر بالا -->
    <section class="hero-banner">
      <img src="/assets/banner.jpg" alt="پیشنهاد ویژه" class="w-full rounded-lg" />
    </section>

    <!-- دسته‌بندی‌ها -->
    <section class="categories my-6">
      <h2 class="text-xl font-bold mb-4">دسته‌بندی‌ها</h2>
      <div class="grid grid-cols-4 gap-4">
        <div v-for="category in categories" :key="category.id" class="category-card p-2 border rounded">
          <img :src="category.image" :alt="category.name" class="w-full h-20 object-cover rounded" />
          <p class="text-center mt-2">{{ category.name }}</p>
        </div>
      </div>
    </section>

    <!-- محصولات پرطرفدار -->
    <section class="featured-products my-6">
      <h2 class="text-xl font-bold mb-4">محصولات پرطرفدار</h2>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="product in featuredProducts" :key="product.id" class="product-card border rounded p-4">
          <img :src="product.image" :alt="product.name" class="w-full h-40 object-cover rounded" />
          <h3 class="font-semibold mt-2">{{ product.name }}</h3>
          <p class="text-red-600 font-bold mt-1">{{ formatPrice(product.price) }}</p>
          <button @click="addToCart(product)" class="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            افزودن به سبد خرید
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

// نمونه داده‌ها
const categories = ref([
  { id: 1, name: "موبایل", image: "/assets/cat-mobile.jpg" },
  { id: 2, name: "لپ‌تاپ", image: "/assets/cat-laptop.jpg" },
  { id: 3, name: "هدفون", image: "/assets/cat-headphone.jpg" },
  { id: 4, name: "ساعت هوشمند", image: "/assets/cat-watch.jpg" }
])

const featuredProducts = ref([
  { id: 1, name: "موبایل آیفون ۱۴", price: 40000000, image: "/assets/product-iphone14.jpg" },
  { id: 2, name: "لپ‌تاپ ایسوس", price: 25000000, image: "/assets/product-laptop.jpg" },
  { id: 3, name: "هدفون بی‌سیم", price: 1500000, image: "/assets/product-headphone.jpg" },
  { id: 4, name: "ساعت هوشمند اپل", price: 9000000, image: "/assets/product-watch.jpg" }
])

// متد افزودن به سبد خرید
function addToCart(product: any) {
  console.log("افزودن به سبد خرید:", product)
  // اینجا می‌تونی کال تو استور یا Pinia بزنی
}

// فرمت قیمت
function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان"
}
</script>

<style scoped>
.hero-banner img {
  max-height: 300px;
  object-fit: cover;
}
</style>
