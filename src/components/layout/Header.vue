<template>
  <header class="bg-white shadow sticky top-0 z-50">

    <div class="container mx-auto px-4 py-3 flex items-center justify-between gap-4">

      <!-- logo -->
      <div class="text-xl font-bold text-blue-600 cursor-pointer" @click="goHome">
        {{ logoText }}
      </div>


      <!-- search -->
      <div class="flex-1 hidden md:block">
        <input
          v-model="search"
          type="text"
          placeholder="جستجوی محصول..."
          class="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
          @keyup.enter="emitSearch"
        />
      </div>


      <!-- actions -->
      <div class="flex items-center gap-4">

        <button
          class="border px-4 py-2 rounded hover:bg-gray-100"
          @click="$router.push('/login')"
        >
          ورود
        </button>


        <!-- cart -->
        <div class="relative cursor-pointer" @click="$router.push('/cart')">

          🛒

          <span
            v-if="cartCount"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
          >
            {{ cartCount }}
          </span>

        </div>

      </div>

    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

/* ---------------- TYPES ---------------- */

interface Props {
  logoText?: string
  cartItems?: number
}

interface Emits {
  (e: "search", value: string): void
}

/* ---------------- DEFINE ---------------- */

const props = withDefaults(defineProps<Props>(), {
  logoText: "بازبیا",
  cartItems: 0
})

const emit = defineEmits<Emits>()

const router = useRouter()

/* ---------------- STATE ---------------- */

const search = ref<string>("")

const cartCount = computed<number>(() => props.cartItems)

/* ---------------- METHODS ---------------- */

function emitSearch() {
  emit("search", search.value)
}

function goHome() {
  router.push("/")
}
</script>
