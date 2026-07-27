<template>
  <nav class="checkout-steps">
    <button
      v-for="step in steps"
      :key="step.name"
      type="button"
      class="checkout-step"
      :class="{
        'checkout-step--active':
          route.name === step.name,

        'checkout-step--completed':
          step.completed,

        'checkout-step--disabled':
          !step.accessible
      }"
      :disabled="!step.accessible"
      @click="goToStep(step)"
    >
      <span class="checkout-step__number">
        {{ step.number }}
      </span>

      <span class="checkout-step__title">
        {{ step.title }}
      </span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  useRoute,
  useRouter,
  type RouteRecordName
} from 'vue-router'

import {
  useCheckoutStore
} from '@/core/store/checkoutStore'

interface CheckoutStep {
  number: number
  title: string
  name: RouteRecordName
  completed: boolean
  accessible: boolean
}

const route = useRoute()
const router = useRouter()
const checkoutStore = useCheckoutStore()

const steps = computed<CheckoutStep[]>(() => [
  {
    number: 1,
    title: 'اطلاعات مشتری',
    name: 'checkout-customer',
    completed:
      checkoutStore.hasCustomerInformation,
    accessible: true
  },
  {
    number: 2,
    title: 'آدرس',
    name: 'checkout-address',
    completed:
      checkoutStore.hasAddressInformation,
    accessible:
      checkoutStore.hasCustomerInformation
  },
  {
    number: 3,
    title: 'روش ارسال',
    name: 'checkout-shipping',
    completed:
      checkoutStore.hasShippingMethod,
    accessible:
      checkoutStore.hasCustomerInformation &&
      checkoutStore.hasAddressInformation
  },
  {
    number: 4,
    title: 'بررسی سفارش',
    name: 'checkout-review',
    completed: false,
    accessible:
      checkoutStore.hasCustomerInformation &&
      checkoutStore.hasAddressInformation &&
      checkoutStore.hasShippingMethod
  }
])

const goToStep = async (
  step: CheckoutStep
): Promise<void> => {
  if (!step.accessible) {
    return
  }

  await router.push({
    name: step.name
  })
}
</script>

<style scoped>
.checkout-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.checkout-step {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 48px;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  font-family: inherit;
  cursor: pointer;
}

.checkout-step--active {
  border-color: #16a34a;
  background: #f0fdf4;
}

.checkout-step--completed {
  color: #15803d;
}

.checkout-step--disabled {
  color: #9ca3af;
  background: #f9fafb;
  cursor: not-allowed;
  opacity: 0.65;
}

.checkout-step__number {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #f3f4f6;
  font-size: 0.8rem;
  font-weight: 800;
}

.checkout-step--active
.checkout-step__number,
.checkout-step--completed
.checkout-step__number {
  color: #ffffff;
  background: #16a34a;
}

.checkout-step__title {
  font-size: 0.82rem;
  font-weight: 700;
}

@media (max-width: 720px) {
  .checkout-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
