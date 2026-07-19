<template>
  <div
    class="rounded-3xl border border-gray-100
           bg-white p-5 shadow-sm md:p-7"
  >
    <!-- عنوان بخش -->
    <div class="mb-6">
      <h2 class="text-lg font-bold text-gray-900 md:text-xl">
        چرا بازبیا؟
      </h2>

      <p class="mt-2 text-sm leading-7 text-gray-500">
        تجربه‌ای ساده، مطمئن و شفاف برای خریدهای روزمره شما
      </p>
    </div>

    <!-- کارت‌ها -->
    <div
      class="grid grid-cols-1 gap-4
             sm:grid-cols-2 lg:grid-cols-3"
    >
      <!-- خرید هوشمند -->
      <article
        class="group rounded-2xl border border-gray-100
               bg-gray-50 p-4 transition duration-300
               hover:-translate-y-1 hover:bg-white hover:shadow-md"
      >
        <div
          class="mb-4 flex h-12 w-12 items-center
                 justify-center rounded-2xl
                 bg-blue-100 text-2xl"
          aria-hidden="true"
        >
          🐦
        </div>

        <h3 class="mb-2 font-bold text-gray-900">
          خرید هوشمند
        </h3>

        <p class="text-sm leading-7 text-gray-600">
          محصولات موردنیاز خود را بدون پیچیدگی و تبلیغات مزاحم پیدا کنید.
        </p>
      </article>

      <!-- قیمت‌گذاری شفاف -->
      <article
        class="group rounded-2xl border border-gray-100
               bg-gray-50 p-4 transition duration-300
               hover:-translate-y-1 hover:bg-white hover:shadow-md"
      >
        <div
          class="mb-4 flex h-12 w-12 items-center
                 justify-center rounded-2xl
                 bg-emerald-100 text-2xl"
          aria-hidden="true"
        >
          💰
        </div>

        <h3 class="mb-2 font-bold text-gray-900">
          قیمت‌گذاری شفاف
        </h3>

        <p class="text-sm leading-7 text-gray-600">
          قیمت محصولات واضح نمایش داده می‌شود تا با اطمینان انتخاب کنید.
        </p>
      </article>

      <!-- خرید سریع -->
      <article
        class="group rounded-2xl border border-gray-100
               bg-gray-50 p-4 transition duration-300
               hover:-translate-y-1 hover:bg-white hover:shadow-md
               sm:col-span-2 lg:col-span-1"
      >
        <div
          class="mb-4 flex h-12 w-12 items-center
                 justify-center rounded-2xl
                 bg-amber-100 text-2xl"
          aria-hidden="true"
        >
          ⚡
        </div>

        <h3 class="mb-2 font-bold text-gray-900">
          خرید سریع و ساده
        </h3>

        <p class="text-sm leading-7 text-gray-600">
          از انتخاب محصول تا ثبت سفارش، مسیر خرید کوتاه و قابل‌فهم است.
        </p>
      </article>
    </div>
  </div>
</template>
