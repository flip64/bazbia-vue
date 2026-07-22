<!-- src/components/layout/AppFooter.vue -->
<template>
  <footer class="mt-12 border-t border-gray-200 bg-white" dir="rtl">
    <div
      class="container mx-auto grid gap-8 px-4 py-10
             sm:grid-cols-2 lg:grid-cols-4"
    >
      <!-- برند -->
      <div class="sm:col-span-2 lg:col-span-1">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2"
        >
          <img
            src="/images/bazbin.svg"
            alt="بازبیا"
            class="h-12 w-12 object-contain"
          />

          <span class="text-2xl font-black text-emerald-600">
            بازبیا
          </span>
        </RouterLink>

        <p class="mt-4 max-w-sm text-sm leading-7 text-gray-500">
          بازبیا؛ انتخابی که تکرار می‌کنید. تجربه‌ای سریع،
          مطمئن و ساده برای خرید اینترنتی.
        </p>
      </div>

      <!-- دسترسی سریع -->
      <div>
        <h3 class="mb-4 font-bold text-gray-800">
          دسترسی سریع
        </h3>

        <ul class="space-y-3 text-sm text-gray-600">
          <li>
            <RouterLink
              to="/"
              class="footer-link"
            >
              صفحه اصلی
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/products"
              class="footer-link"
            >
              محصولات
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/categories"
              class="footer-link"
            >
              دسته‌بندی‌ها
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/blog"
              class="footer-link"
            >
              وبلاگ
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- راهنمای مشتریان -->
      <div>
        <h3 class="mb-4 font-bold text-gray-800">
          راهنمای مشتریان
        </h3>

        <ul class="space-y-3 text-sm text-gray-600">
          <li>
            <RouterLink
              to="/about"
              class="footer-link"
            >
              درباره ما
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/contact"
              class="footer-link"
            >
              تماس با ما
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/faq"
              class="footer-link"
            >
              سوالات متداول
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/rules"
              class="footer-link"
            >
              قوانین و مقررات
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- پشتیبانی -->
      <div>
        <h3 class="mb-4 font-bold text-gray-800">
          پشتیبانی
        </h3>

        <div class="space-y-3 text-sm text-gray-600">
          <p class="flex items-center gap-2">
            <span class="text-emerald-600">●</span>
            پاسخ‌گویی ۷ روز هفته
          </p>

          <a
            href="mailto:support@bazbia.ir"
            class="footer-link block direction-ltr"
          >
            support@bazbia.ir
          </a>

          <p class="leading-7">
            سفارش‌ها و درخواست‌های شما از طریق حساب کاربری
            قابل پیگیری هستند.
          </p>
        </div>

        <!-- محل نمادها -->
        <div class="mt-5 flex gap-3">
          <div class="trust-box">
            نماد اعتماد
          </div>

          <div class="trust-box">
            ساماندهی
          </div>
        </div>
      </div>
    </div>

    <!-- پایین فوتر -->
    <div class="border-t border-gray-200 bg-gray-50">
      <div
        class="container mx-auto flex flex-col items-center
               justify-between gap-3 px-4 py-4 text-center
               text-xs text-gray-500 sm:flex-row"
      >
        <p>
          © {{ currentYear }} فروشگاه اینترنتی بازبیا؛
          تمامی حقوق محفوظ است.
        </p>

        <p>
          طراحی و توسعه با
          <span class="text-emerald-600">♥</span>
          برای بازبیا
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer-link {
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.footer-link:hover {
  color: #059669;
}

.trust-box {
  display: flex;
  width: 76px;
  height: 76px;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  padding: 8px;
  text-align: center;
  font-size: 11px;
  color: #6b7280;
}

.direction-ltr {
  direction: ltr;
  text-align: right;
}
</style>
