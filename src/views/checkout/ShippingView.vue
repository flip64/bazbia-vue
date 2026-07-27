<template>
  <section class="checkout-card">
    <header class="checkout-card__header">
      <div>
        <span class="checkout-card__step">
          مرحله ۳
        </span>

        <h2>روش ارسال</h2>

        <p>
          روش مناسب ارسال سفارش را انتخاب کنید.
        </p>
      </div>
    </header>

    <div class="checkout-card__body">
      <div
        v-if="isLoading"
        class="state-message"
      >
        در حال محاسبه هزینه ارسال...
      </div>

      <div
        v-else-if="loadError"
        class="alert alert--error"
      >
        <p>
          {{ loadError }}
        </p>

        <button
          type="button"
          class="retry-button"
          @click="loadShippingQuote"
        >
          تلاش دوباره
        </button>
      </div>

      <template v-else-if="quote">
        <div class="delivery-address">
          <span class="delivery-address__label">
            مقصد ارسال
          </span>

          <strong>
            {{ quote.address.province }}،
            {{ quote.address.city }}
          </strong>
        </div>

        <div
          v-if="quote.packing.status === 'temporary_fixed_rate'"
          class="temporary-notice"
        >
          هزینه ارسال فعلاً به‌صورت ثابت محاسبه می‌شود.
        </div>

        <div
          v-if="quote.methods.length"
          class="shipping-methods"
        >
          <label
            v-for="method in quote.methods"
            :key="method.code"
            class="shipping-method"
            :class="{
              'shipping-method--selected':
                selectedMethodCode === method.code
            }"
          >
            <input
              v-model="selectedMethodCode"
              type="radio"
              name="shipping-method"
              :value="method.code"
            >

            <div class="shipping-method__content">
              <div class="shipping-method__header">
                <strong>
                  {{ method.title }}
                </strong>

                <span class="shipping-method__cost">
                  {{ formatPrice(method.cost) }}
                </span>
              </div>

              <p>
                {{ method.description }}
              </p>

              <small>
                زمان تقریبی تحویل:
                {{ method.estimated_days.min }}
                تا
                {{ method.estimated_days.max }}
                روز کاری
              </small>
            </div>
          </label>
        </div>

        <div
          v-else
          class="alert alert--error"
        >
          هیچ روش ارسالی برای این سفارش پیدا نشد.
        </div>

        <div class="checkout-actions">
          <button
            type="button"
            class="checkout-button checkout-button--secondary"
            @click="goPrevious"
          >
            مرحله قبل
          </button>

          <button
            type="button"
            class="checkout-button checkout-button--primary"
            :disabled="!selectedMethodCode"
            @click="continueToReview"
          >
            ادامه به بررسی سفارش
          </button>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref
} from 'vue'
import { useRouter } from 'vue-router'

import { useCheckoutStore } from '@/core/store/checkoutStore'
import { shippingService } from '@/services/shipping.service'

import type {
  ShippingQuote
} from '@/types/shipping.types'

const router = useRouter()
const checkoutStore = useCheckoutStore()

const quote = ref<ShippingQuote | null>(null)
const selectedMethodCode = ref('')

const isLoading = ref(false)
const loadError = ref('')

const selectedMethod = computed(() => {
  if (!quote.value) {
    return null
  }

  return quote.value.methods.find(method => {
    return method.code === selectedMethodCode.value
  }) ?? null
})

const formatPrice = (
  toman: number
): string => {
  return `${Math.round(
    Number(toman || 0)
  ).toLocaleString('fa-IR')} تومان`
}

const loadShippingQuote =
  async (): Promise<void> => {
    const addressId =
      checkoutStore.address.addressId

    if (!addressId) {
      await router.replace({
        name: 'checkout-address'
      })

      return
    }

    isLoading.value = true
    loadError.value = ''

    try {
      const response =
        await shippingService.getCartQuote({
          address_id: addressId
        })

      quote.value = response

      const savedMethod =
        response.methods.find(method => {
          return (
            method.code ===
            checkoutStore.shipping.methodCode
          )
        })

      selectedMethodCode.value =
        savedMethod?.code ??
        response.methods[0]?.code ??
        ''
    } catch (error) {
      console.error(
        'Loading shipping quote failed:',
        error
      )

      loadError.value =
        'محاسبه هزینه ارسال انجام نشد.'
    } finally {
      isLoading.value = false
    }
  }

const continueToReview =
  async (): Promise<void> => {
    if (
      !quote.value ||
      !selectedMethod.value
    ) {
      return
    }

    checkoutStore.setShipping({
      quoteId: quote.value.quote_id,
      methodCode:
        selectedMethod.value.code,
      methodTitle:
        selectedMethod.value.title,
      cost:
        selectedMethod.value.cost
    })

    await router.push({
      name: 'checkout-review'
    })
  }

const goPrevious = async (): Promise<void> => {
  await router.push({
    name: 'checkout-address'
  })
}

onMounted(async () => {
  checkoutStore.initialize()

  if (
    !checkoutStore.hasCustomerInformation
  ) {
    await router.replace({
      name: 'checkout-customer'
    })

    return
  }

  if (
    !checkoutStore.hasAddressInformation
  ) {
    await router.replace({
      name: 'checkout-address'
    })

    return
  }

  await loadShippingQuote()
})
</script>

<style scoped>
.checkout-card {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.checkout-card__header {
  padding: 1.35rem;
  border-bottom: 1px solid #edf0ee;
  background: #fcfdfc;
}

.checkout-card__step {
  display: block;
  margin-bottom: 0.35rem;
  color: #15803d;
  font-size: 0.76rem;
  font-weight: 800;
}

.checkout-card__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.15rem;
}

.checkout-card__header p {
  margin: 0.4rem 0 0;
  color: #6b7280;
  font-size: 0.82rem;
  line-height: 1.8;
}

.checkout-card__body {
  padding: 1.35rem;
}

.delivery-address {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
}

.delivery-address__label {
  color: #6b7280;
  font-size: 0.8rem;
}

.temporary-notice {
  margin-bottom: 1rem;
  padding: 0.8rem 1rem;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 10px;
  background: #fffbeb;
  font-size: 0.78rem;
  line-height: 1.8;
}

.shipping-methods {
  display: grid;
  gap: 0.85rem;
}

.shipping-method {
  display: flex;
  gap: 0.9rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.shipping-method:hover {
  border-color: #86efac;
}

.shipping-method--selected {
  border-color: #16a34a;
  background: #f0fdf4;
}

.shipping-method__content {
  flex: 1;
  min-width: 0;
}

.shipping-method__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.shipping-method__cost {
  color: #15803d;
  font-size: 0.9rem;
  font-weight: 900;
  white-space: nowrap;
}

.shipping-method p {
  margin: 0.5rem 0;
  color: #4b5563;
  font-size: 0.82rem;
  line-height: 1.8;
}

.shipping-method small {
  color: #6b7280;
  font-size: 0.74rem;
}

.checkout-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.checkout-button {
  min-height: 44px;
  padding: 0.7rem 1rem;
  border-radius: 9px;
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
}

.checkout-button--primary {
  color: #ffffff;
  border: none;
  background: #16a34a;
}

.checkout-button--secondary {
  color: #374151;
  border: 1px solid #d1d5db;
  background: #ffffff;
}

.checkout-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.alert {
  padding: 0.9rem 1rem;
  border-radius: 10px;
}

.alert p {
  margin: 0 0 0.75rem;
}

.alert--error {
  color: #991b1b;
  border: 1px solid #fecaca;
  background: #fef2f2;
}

.retry-button {
  padding: 0;
  color: #991b1b;
  border: none;
  background: transparent;
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
}

.state-message {
  padding: 2rem;
  color: #6b7280;
  text-align: center;
}

@media (max-width: 640px) {
  .delivery-address,
  .shipping-method__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .checkout-actions {
    flex-direction: column-reverse;
  }

  .checkout-button {
    width: 100%;
  }
}
</style>
