<template>
  <header class="bg-blue-600 text-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">

      <!-- Top -->
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <div class="flex items-center gap-2 font-bold text-xl cursor-pointer">
          <div class="w-9 h-9 bg-white text-blue-600 rounded-xl flex items-center justify-center font-black">
            B
          </div>
          <span class="hidden sm:block">Bazbia</span>
        </div>

        <!-- Search -->
        <div class="flex-1 mx-4 hidden md:block">
          <div class="relative">
            <input
              type="text"
              placeholder="جستجوی محصول، برند، دسته‌بندی..."
              class="w-full rounded-xl px-5 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>

        <!-- Icons -->
        <div class="flex items-center gap-4">

          <button class="hover:bg-blue-500 p-2 rounded-lg transition">❤️</button>

          <button class="relative hover:bg-blue-500 p-2 rounded-lg transition">
            🛒
            <span class="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">
              {{ cartCount }}
            </span>
          </button>

          <button class="hover:bg-blue-500 p-2 rounded-lg transition">👤</button>

          <!-- Mobile menu btn -->
          <button @click="open = !open" class="md:hidden text-2xl">☰</button>
        </div>
      </div>

      <!-- Categories -->
      <nav
        :class="[
          'md:flex gap-6 pb-3 text-sm transition-all',
          open ? 'block' : 'hidden md:flex'
        ]"
      >

        <div v-for="cat in categories" :key="cat.name" class="group relative cursor-pointer">
          <span class="hover:text-blue-200">{{ cat.icon }} {{ cat.name }}</span>

          <!-- dropdown -->
          <div
            v-if="cat.children"
            class="absolute hidden group-hover:block bg-white text-gray-700 shadow-xl rounded-xl p-4 top-6 w-44"
          >
            <p v-for="sub in cat.children"
               :key="sub"
               class="hover:text-blue-600 cursor-pointer py-1">
              {{ sub }}
            </p>
          </div>
        </div>

      </nav>

    </div>
  </header>
</template>

<script setup>
import { ref } from "vue"

const open = ref(false)
const cartCount = ref(2)

const categories = ref([
  {
    name: "دیجیتال",
    icon: "📱",
    children: ["موبایل", "لپ‌تاپ", "لوازم جانبی"]
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
