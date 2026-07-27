<template>
  <aside class="order-summary">
    <h2>خلاصه سفارش</h2>

    <div class="order-summary__row">
      <span>تعداد کالا</span>

      <span>
        {{ totalItems.toLocaleString('fa-IR') }}
      </span>
    </div>

    <div class="order-summary__row">
      <span>جمع سبد</span>

      <span>
        {{ formatPrice(itemsTotal) }}
        تومان
      </span>
    </div>

    <div class="order-summary__row">
      <span>هزینه ارسال</span>

      <span v-if="hasShippingMethod">
        {{ formatPrice(shippingCost) }}
        تومان
      </span>

      <span
        v-else
        class="order-summary__pending"
      >
        هنوز انتخاب نشده
      </span>
    </div>

    <div class="order-summary__divider"></div>

    <div
      class="
        order-summary__row
        order-summary__row--total
      "
    >
      <strong>مبلغ قابل پرداخت</strong>

      <strong>
        {{ formatPrice(finalTotal) }}
        تومان
      </strong>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import {
  useCartStore
} from '@/core/store/cartStore'

import {
  useCheckoutStore
} from '@/core/store/checkoutStore'

const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

const totalItems = computed(() => {
  return cartStore.items.reduce(
    (sum, item) => {
      return (
        sum +
        Number(item.quantity || 0)
      )
    },
    0
  )
})

const itemsTotal = computed(() => {
  return Number(
    cartStore.totalPrice || 0
  )
})

const shippingCost = computed(() => {
  return Number(
    checkoutStore.shipping?.cost || 0
  )
})

const hasShippingMethod = computed(() => {
  return Boolean(
    checkoutStore.shipping?.methodCode
  )
})

const finalTotal = computed(() => {
  return (
    itemsTotal.value +
    shippingCost.value
  )
})

const formatPrice = (
  priceInRial: number
): string => {
  const priceInToman =
    Math.round(
      Number(priceInRial || 0) / 10
    )

  return new Intl.NumberFormat(
    'fa-IR'
  ).format(priceInToman)
}
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
  margin: 0 0 1.25rem;
  font-size: 1.05rem;
  color: #111827;
}

.order-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
  color: #4b5563;
}

.order-summary__row span:last-child {
  text-align: left;
  color: #111827;
}

.order-summary__pending {
  font-size: 0.85rem;
  color: #9ca3af !important;
}

.order-summary__divider {
  height: 1px;
  margin: 1rem 0;
  background: #e5e7eb;
}

.order-summary__row--total {
  margin-bottom: 0;
  font-size: 1.05rem;
  color: #111827;
}

.order-summary__row--total strong:last-child {
  color: #059669;
}

@media (max-width: 960px) {
  .order-summary {
    position: static;
  }
}
</style>
