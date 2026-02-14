<template>
  <header class="bg-blue-600 text-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">

      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <div @click="goHome" class="flex items-center gap-2 font-bold text-xl cursor-pointer">
          <div class="w-9 h-9 bg-white text-blue-600 rounded-xl flex items-center justify-center font-black">
            B
          </div>
          <span class="hidden sm:block">{{ logoText }}</span>
        </div>

        <!-- Search -->
        <div class="flex-1 mx-4 hidden md:block">
          <input
            v-model="search"
            @keyup.enter="emitSearch"
            placeholder="جستجوی محصول، برند، دسته‌بندی..."
            class="w-full rounded-xl px-5 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <!-- Icons -->
        <div class="flex items-center gap-4">

          <button class="hover:bg-blue-500 p-2 rounded-lg transition">❤️</button>

          <button class="relative hover:bg-blue-500 p-2 rounded-lg transition">
            🛒
            <span
              v-if="cartCount"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
            >
              {{ cartCount }}
            </span>
          </button>

          <button class="hover:bg-blue-500 p-2 rounded-lg transition">👤</button>

        </div>

      </div>

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
  cartItems: 0
})

const router = useRouter()

const search = ref("")

const cartCount = computed(() => props.cartItems)

function emitSearch() {
  console.log("search:", search.value)
}

function goHome() {
  router.push("/")
}
</script>
