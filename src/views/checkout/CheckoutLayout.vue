
<template>
  <main class="checkout-page">
    <div class="checkout-container">
      <header class="checkout-header">
        <div>
          <span class="checkout-header__eyebrow">
            تکمیل فرایند خرید
          </span>

          <h1 class="checkout-title">
            تسویه حساب
          </h1>
        </div>

        <router-link
          to="/cart"
          class="back-to-cart"
        >
          بازگشت به سبد خرید
        </router-link>
      </header>

      <CheckoutSteps />

      <div class="checkout-content">
        <router-view />

        <OrderSummary />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import CheckoutSteps from '@/components/checkout/CheckoutSteps.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
</script>