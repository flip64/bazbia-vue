<template>
  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">

    <!-- Skeleton -->
    <template v-if="loading">
      <div
        v-for="n in 12"
        :key="n"
        class="animate-pulse flex flex-col items-center"
      >
        <div class="w-24 h-24 rounded-3xl bg-gray-200"></div>
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

          <!-- Gradient hover background -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300
                   bg-gradient-to-br from-blue-50 via-white to-purple-50"
          ></div>

          <!-- Image container -->
          <div
            class="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100
                   flex items-center justify-center shadow-sm overflow-hidden"
          >
            <div
              class="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-inner"
            >
              <img
                :src="category.image"
                :alt="category.name"
                class="w-14 h-14 object-contain transform group-hover:scale-110 transition duration-300"
              />
            </div>
          </div>

          <!-- Title -->
          <h3
            class="relative mt-3 text-sm font-medium text-gray-700 text-center leading-5 line-clamp-2
                   group-hover:text-gray-900 transition"
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
