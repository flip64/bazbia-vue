<template>
  <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
    
    <div
      v-for="category in categories"
      :key="category.id"
      class="flex flex-col items-center justify-start w-full"
    >
      <!-- Image Box -->
      <div
        class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden"
      >
        <img
          :src="category.image"
          :alt="category.name"
          class="w-full h-full object-contain p-2"
        />
      </div>

      <!-- Name -->
      <div
        class="text-[11px] sm:text-xs mt-2 text-center text-gray-700 leading-4 line-clamp-2 w-full px-1"
      >
        {{ category.name }}
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: Array<{
    id: number | string
    name: string
    image: string
  }>
}>()
</script>
