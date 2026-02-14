<template>
  <header class="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200 shadow-sm">

    <div class="max-w-7xl mx-auto px-4">

      <!-- Top Row -->
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <div
          @click="goHome"
          class="flex items-center gap-2 font-bold text-lg cursor-pointer group"
        >
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 text-white flex items-center justify-center shadow group-hover:scale-105 transition">
            B
          </div>
          <span class="hidden sm:block text-gray-700 group-hover:text-blue-600 transition">
            {{ logoText }}
          </span>
        </div>

        <!-- Search -->
        <div class="flex-1 mx-6 hidden md:block">
          <div class="relative">

            <input
              v-model="search"
              placeholder="جستجوی محصول، برند، دسته‌بندی..."
              class="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 focus:bg-white border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />

            <!-- icon -->
            <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M20 20L17 17" stroke="currentColor" stroke-width="2"/>
            </svg>

          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">

          <!-- Wishlist -->
          <button class="iconBtn">❤</button>

          <!-- Cart -->
          <button class="iconBtn relative">
            🛒
            <span
              v-if="cartCount"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow"
            >
              {{ cartCount }}
            </span>
          </button>

          <!-- Profile -->
          <button class="iconBtn">👤</button>

        </div>

      </div>

      <!-- Categories -->
      <nav class="hidden md:flex gap-6 pb-3 text-sm font-medium text-gray-700">

        <div
          v-for="cat in categories"
          :key="cat.name"
          class="relative group"
        >

          <span class="hover:text-blue-600 cursor-pointer flex items-center gap-1">
            {{ cat.icon }} {{ cat.name }}
          </span>

          <!-- Dropdown -->
          <div
            v-if="cat.children"
            class="absolute opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 bg-white shadow-xl rounded-2xl top-8 w-48 p-3 border"
          >
            <div
              v-for="sub in cat.children"
              :key="sub"
              class="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition"
            >
              {{ sub }}
            </div>
          </div>

        </div>

      </nav>

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

interface Props {
  logoText?: string
  cartItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  logoText: "بازبیا",
  cartItems: 3
})

const router = useRouter()

const search = ref("")
const cartCount = computed(() => props.cartItems)

function goHome() {
  router.push("/")
}

const categories = ref([
  {
    name: "دیجیتال",
    icon: "📱",
    children: ["موبایل", "لپ‌تاپ", "هدفون", "ساعت هوشمند"]
  },
  {
    name: "پوشاک",
    icon: "👕",
    children: ["مردانه", "زنانه", "بچگانه"]
  },
  { name: "خانه", icon: "🏠" },
  { name: "کتاب", icon: "📚" },
  { name: "سرگرمی", icon: "🎮" }
])
</script>

<style scoped>
.iconBtn{
  @apply w-10 h-10 rounded-xl flex items-center justify-center
  hover:bg-blue-50 text-gray-700 hover:text-blue-600
  transition duration-200;
}
</style>
