<template>
  <div
    class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
  >
    <div
      v-for="category in categories"
      :key="category.id"
      class="group"
    >
      <a
        href="#"
        class="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <!-- Image -->
        <div
          class="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center"
        >
          <img
            :src="category.image"
            :alt="category.name"
            class="w-full h-full object-contain p-2 group-hover:scale-110 transition duration-300"
          />
        </div>

        <!-- Title -->
        <h3
          class="mt-3 text-sm font-medium text-gray-700 text-center leading-5 line-clamp-2"
        >
          {{ category.name }}
        </h3>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: {
    id: number | string
    name: string
    image: string
  }[]
}>()
</script>
