<template>
  <nav class="checkout-steps">
    <router-link
      to="/checkout/customer"
      class="checkout-step"
    >
      ۱. گیرنده
    </router-link>

    <router-link
      to="/checkout/address"
      class="checkout-step"
    >
      ۲. آدرس
    </router-link>

    <router-link
      to="/checkout/shipping"
      class="checkout-step"
    >
      ۳. ارسال
    </router-link>

    <router-link
      to="/checkout/review"
      class="checkout-step"
    >
      ۴. بررسی نهایی
    </router-link>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
.checkout-steps {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
}

.checkout-step {
  flex-shrink: 0;
  padding: 0.65rem 0.85rem;
  color: #6b7280;
  border-radius: 9px;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
}

.checkout-step.router-link-active {
  color: #15803d;
  background: #f0fdf4;
}
</style>
