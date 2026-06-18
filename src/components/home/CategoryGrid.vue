<template>
  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">

    <!-- Skeleton -->
    <template v-if="loading">
      <div
        v-for="n in 12"
        :key="n"
        class="animate-pulse flex flex-col items-center"
      >
        <div class="w-24 h-24 rounded-2xl bg-gray-200"></div>
        <div class="mt-3 w-16 h-3 bg-gray-200 rounded"></div>
      </div>
    </template>

    <!-- Cards -->
    <template v-else>
      <div
        v-for="category in categories"
        :key="category.id"
        class="group relative"
      >
        <a
          href="#"
          class="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100
                 shadow-sm hover:shadow-xl transition-all duration-300
                 hover:-translate-y-2 hover:scale-[1.03]
                 relative overflow-hidden"
        >

          <!-- Gradient glow background -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300
                   bg-gradient-to-br from-blue-50 via-white to-purple-50"
          ></div>

          <!-- Image -->
          <div
            class="relative w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden"
          >
            <img
              :src="category.image"
              :alt="category.name"
              class="w-20 h-20 object-contain transform group-hover:scale-110 transition duration-300"
            />
          </div>

          <!-- Title -->
          <h3
            class="relative mt-3 text-sm font-medium text-gray-700 text-center leading-5 line-clamp-2 group-hover:text-gray-900"
          >
            {{ category.name }}
          </h3>
        </a>
      </div>
    </template>

  </div>
</template>
<script setup lang="ts">
defineProps<{
  categories: {
    id: number | string
    name: string
    image: string
  }[]
  loading?: boolean
}>()
</script>
