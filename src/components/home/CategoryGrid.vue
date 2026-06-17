<template>
  <div class="overflow-x-auto scrollbar-hide">
    <div class="flex gap-4 w-max px-1">

      <div
        v-for="category in categories"
        :key="category.id"
        class="flex flex-col items-center w-24 shrink-0"
      >
        <!-- Image Box -->
        <div
          class="w-16 h-16 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden"
        >
          <img
            :src="category.image"
            :alt="category.name"
            class="w-full h-full object-contain p-2"
          />
        </div>

        <!-- Name -->
        <div class="text-xs mt-2 text-center text-gray-700 line-clamp-2 h-8">
          {{ category.name }}
        </div>
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

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
