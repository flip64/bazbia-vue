<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- HEADER -->
    <header class="sticky top-0 z-50 bg-white border-b">
      <div class="px-4 py-3 flex items-center gap-2">

        <div class="text-lg font-bold text-blue-600">
          بازبیا
        </div>

        <input
          placeholder="جستجو در بازبیا..."
          class="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
        />

      </div>
    </header>

    <!-- PAGE CONTENT -->
    <main class="flex-1 pb-20">
      <slot />
    </main>

    <!-- BOTTOM NAV -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div class="flex justify-around py-2 text-xs">

        <button class="flex flex-col items-center">
          🏠
          <span>خانه</span>
        </button>

        <button class="flex flex-col items-center">
          🧺
          <span>دسته‌ها</span>
        </button>

        <button class="flex flex-col items-center">
          ❤️
          <span>علاقه‌مندی</span>
        </button>

        <button class="flex flex-col items-center">
          👤
          <span>حساب</span>
        </button>

      </div>
    </nav>

  </div>
</template>
