<template>
  <aside class="order-summary">
    <h2>خلاصه سفارش</h2>

    <p>
      تعداد کالا:
      {{ totalItems.toLocaleString('fa-IR') }}
    </p>

    <p>
      جمع سبد:
      {{ totalPrice.toLocaleString('fa-IR') }}
      تومان
    </p>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useCartStore } from '@/core/store/cartStore'

const cartStore = useCartStore()

const totalItems = computed(() => {
  return cartStore.items.reduce(
    (sum, item) => {
      return sum + Number(item.quantity || 0)
    },
    0
  )
})

const totalPrice = computed(() => {
  return Number(
    cartStore.totalPrice || 0
  )
})
</script>

<style scoped>
.order-summary {
  position: sticky;
  top: 1rem;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
}

.order-summary h2 {
  margin-top: 0;
  font-size: 1.05rem;
}

@media (max-width: 960px) {
  .order-summary {
    position: static;
  }
}
</style>
