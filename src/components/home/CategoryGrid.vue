<template>
  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
    بازبیا اینجا
    <div
      v-for="category in categories"
      :key="category.id"
      class="flex flex-col items-center"
    >
      <!-- Image Box -->
      <div
        class="w-20 h-20 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden"
      >
        <img
          :src="category.image"
          :alt="category.name"
          class="w-full h-full object-contain p-2"
        />
      </div>

      <!-- Name -->
      <div class="text-xs mt-2 text-center text-gray-700 h-10 overflow-hidden leading-4">
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
