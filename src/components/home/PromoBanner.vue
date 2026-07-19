<template>
  <section
    class="relative overflow-hidden rounded-3xl bg-gradient-to-l
           from-blue-600 via-blue-500 to-cyan-500"
  >
    <!-- تزئینات پس‌زمینه -->
    <div
      class="absolute -right-16 -top-16 h-48 w-48 rounded-full
             bg-white/10"
    ></div>

    <div
      class="absolute -bottom-20 left-10 h-56 w-56 rounded-full
             bg-white/10"
    ></div>

    <div
      class="relative z-10 flex min-h-56 flex-col items-start
             justify-center gap-6 px-6 py-8
             md:min-h-64 md:flex-row md:items-center
             md:justify-between md:px-10"
    >
      <!-- متن -->
      <div class="max-w-xl text-white">
        <span
          class="mb-4 inline-flex rounded-full bg-white/15
                 px-4 py-2 text-xs font-medium backdrop-blur-sm"
        >
          پیشنهاد ویژه بازبیا
        </span>

        <h2 class="text-2xl font-black leading-relaxed md:text-4xl">
          اولین خریدت را با تخفیف شروع کن
        </h2>

        <p class="mt-3 text-sm leading-7 text-white/85 md:text-base">
          محصولات منتخب را با قیمت ویژه ببین و خریدی ساده و مطمئن را تجربه کن.
        </p>

        <RouterLink
          to="/products"
          class="mt-6 inline-flex items-center gap-2 rounded-xl
                 bg-white px-5 py-3 text-sm font-bold text-blue-600
                 shadow-lg transition duration-300
                 hover:-translate-y-0.5 hover:bg-gray-50"
        >
          مشاهده محصولات

          <span aria-hidden="true">←</span>
        </RouterLink>
      </div>

      <!-- بخش تصویری موقت -->
      <div
        class="flex h-32 w-full items-center justify-center rounded-2xl
               border border-white/20 bg-white/10 text-6xl
               backdrop-blur-sm md:h-40 md:w-56"
      >
        🎁
      </div>
    </div>
  </section>
</template>
