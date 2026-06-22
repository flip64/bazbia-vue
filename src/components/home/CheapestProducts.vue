<div
  class="bg-gradient-to-l
         from-yellow-50
         via-amber-50
         to-orange-100
         border border-amber-300
         rounded-2xl p-4"
>

  <div class="flex justify-between items-center mb-4">

    <div class="flex items-center gap-2">

      <img
        src="/images/bazbin-money.svg"
        alt="بازبین اقتصادی"
        class="w-8 h-8"
      />

      <h2 class="font-bold text-lg text-amber-800">
        ارزان‌ترین محصولات
      </h2>

      <span
        class="bg-amber-500
               text-white
               text-xs
               px-2
               py-1
               rounded-full"
      >
        🪙 کمترین قیمت
      </span>

    </div>

    <span
      class="text-amber-700 text-sm cursor-pointer"
      @click="goToAll"
    >
      مشاهده همه
    </span>

  </div>
