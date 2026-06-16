<template>
  <AppShell>

    <!-- BANNER -->
    <section class="px-4 pt-3">
      <BannerCarousel v-if="banners.length" :banners="banners" />
    </section>

    <!-- CATEGORIES -->
    <section class="mt-6 px-4">

      <h2 class="font-bold mb-3">دسته‌بندی‌ها</h2>

      <div class="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide">

        <div
          v-for="c in categoryStore.categories"
          :key="c.id"
          class="flex-shrink-0 w-20 snap-start text-center"
        >

          <div class="w-16 h-16 mx-auto rounded-full bg-white border flex items-center justify-center overflow-hidden">
            <img
              :src="c.image || '/images/category-placeholder.webp'"
              class="w-full h-full object-contain p-2"
            />
          </div>

          <div class="text-xs mt-2 h-8 flex items-start justify-center">
            {{ c.name }}
          </div>

        </div>

      </div>

    </section>

    <!-- PRODUCTS -->
    <section class="mt-6 px-4">

      <div class="flex justify-between mb-3">
        <h2 class="font-bold">محصولات پیشنهادی</h2>
        <span class="text-blue-500 text-sm">همه</span>
      </div>

      <div class="grid grid-cols-2 gap-3">

        <div
          v-for="p in featuredProducts"
          :key="p.id"
          class="bg-white rounded-2xl border p-2"
        >

          <img
            :src="p.image"
            class="w-full h-32 object-cover rounded-xl"
          />

          <div class="text-sm mt-2 line-clamp-2">
            {{ p.name }}
          </div>

          <div class="text-green-600 font-bold text-sm mt-1">
            {{ formatPrice(p.price) }}
          </div>

          <button class="w-full mt-2 bg-blue-500 text-white rounded-lg py-2 text-sm">
            افزودن
          </button>

        </div>

      </div>

    </section>

  </AppShell>
</template>
