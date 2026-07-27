<template>
  <main class="checkout-page">
    <div class="checkout-container">
      <header class="checkout-header">
        <div>
          <span class="checkout-header__eyebrow">
            تکمیل فرایند خرید
          </span>

          <h1 class="checkout-header__title">
            تسویه حساب
          </h1>

          <p class="checkout-header__description">
            اطلاعات ارسال و پرداخت سفارش را تکمیل کنید.
          </p>
        </div>

        <router-link
          to="/cart"
          class="checkout-header__back"
        >
          بازگشت به سبد خرید
        </router-link>
      </header>

      <CheckoutSteps />

      <div class="checkout-content">
        <section class="checkout-main">
          <router-view />
        </section>

        <OrderSummary />
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

import CheckoutSteps from '@/components/checkout/CheckoutSteps.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'

import { useCartStore } from '@/core/store/cartStore'
import { useCheckoutStore } from '@/core/store/checkoutStore'

const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()

onMounted(async () => {
  checkoutStore.initialize()

  if (!cartStore.items.length) {
    await cartStore.fetchCart()
  }
})
</script>

<style scoped>
.checkout-page {
  min-height: 75vh;
  padding: 2rem 1rem 4rem;
  background: #f6f8f7;
  direction: rtl;
}

.checkout-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.checkout-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.checkout-header__eyebrow {
  display: block;
  margin-bottom: 0.35rem;
  color: #15803d;
  font-size: 0.8rem;
  font-weight: 800;
}

.checkout-header__title {
  margin: 0;
  color: #111827;
  font-size: 2rem;
}

.checkout-header__description {
  margin: 0.45rem 0 0;
  color: #6b7280;
}

.checkout-header__back {
  color: #15803d;
  font-weight: 700;
  text-decoration: none;
}

.checkout-content {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr) 390px;
  align-items: start;
  gap: 1.75rem;
  margin-top: 2rem;
}

.checkout-main {
  min-width: 0;
}

@media (max-width: 960px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .checkout-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
