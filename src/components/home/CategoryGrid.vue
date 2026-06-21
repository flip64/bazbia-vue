<template>
  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">

    <!-- Skeleton -->
    <template v-if="loading">
      <div
        v-for="n in 12"
        :key="n"
        class="animate-pulse flex flex-col items-center"
      >
        <div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gray-200"></div>
        <div class="mt-3 w-16 h-3 bg-gray-200 rounded"></div>
      </div>
    </template>

    <!-- Categories -->
    <template v-else>
      <div
        v-for="category in categories"
        :key="category.id"
        @click="goToCategory(category)"
        class="group flex flex-col items-center
               bg-gray-50/60 backdrop-blur-sm rounded-2xl p-3
               hover:border-gray-200
               hover:shadow-sm
               transition-all duration-200
               cursor-pointer"
      >
        <!-- Image -->
        <div
          class="w-20 h-20 md:w-24 md:h-24
                 rounded-2xl overflow-hidden
                 flex items-center justify-center"
        >
          <img
            :src="category.image"
            :alt="category.name"
            class="w-full h-full object-contain
                   group-hover:scale-105 transition duration-200"
          />
        </div>

        <!-- Title -->
        <span
          class="mt-3 text-xs md:text-sm
                 text-gray-700 text-center
                 font-medium line-clamp-2 min-h-[38px]"
        >
          {{ category.name }}
        </span>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

defineProps<{
  categories: {
    id: number | string
    name: string
    image: string
    slug: string
  }[]
  loading?: boolean
}>()

function goToCategory(category: any) {
  router.push({
    path: "/products",
    query: {
      category: category.slug
    }
  })
}
</script>
