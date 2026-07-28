<template>
  <main class="payment-result-page">
    <!-- در حال بررسی -->
    <section
      v-if="isLoading"
      class="payment-result-card"
    >
      <div
        class="payment-result-card__spinner"
        aria-hidden="true"
      />

      <h1>در حال بررسی پرداخت</h1>

      <p>
        لطفاً چند لحظه صبر کنید. نتیجه پرداخت در حال
        دریافت و تأیید است.
      </p>
    </section>

    <!-- پرداخت موفق -->
    <section
      v-else-if="isSuccessful"
      class="
        payment-result-card
        payment-result-card--success
      "
    >
      <div class="payment-result-card__icon">
        ✓
      </div>

      <h1>پرداخت با موفقیت انجام شد</h1>

      <p>
        سفارش شما با موفقیت پرداخت و تأیید شد.
      </p>

      <div
        v-if="payment"
        class="payment-information"
      >
        <div class="payment-information__row">
          <span>شماره پرداخت</span>

          <strong>
            #{{ payment.id }}
          </strong>
        </div>

        <div class="payment-information__row">
          <span>شماره سفارش</span>

          <strong>
            #{{ payment.order }}
          </strong>
        </div>

        <div class="payment-information__row">
          <span>مبلغ پرداخت</span>

          <strong>
            {{ formatPrice(payment.amount) }}
            تومان
          </strong>
        </div>

        <div class="payment-information__row">
          <span>کد رهگیری</span>

          <strong>
            {{
              payment.tracking_code ||
              'ثبت نشده'
            }}
          </strong>
        </div>

        <div class="payment-information__row">
          <span>شماره مرجع</span>

          <strong>
            {{
              payment.reference_id ||
              'ثبت نشده'
            }}
          </strong>
        </div>
      </div>

      <div class="payment-result-card__actions">
        <router-link
          v-if="payment"
          :to="{
            name: 'checkout-success',
            params: {
              orderId: String(payment.order),
            },
            query: {
              payment: 'successful',
            },
          }"
          class="
            payment-button
            payment-button--primary
          "
        >
          مشاهده سفارش
        </router-link>

        <router-link
          :to="{ name: 'products' }"
          class="
            payment-button
            payment-button--secondary
          "
        >
          ادامه خرید
        </router-link>
      </div>
    </section>

    <!-- پرداخت لغوشده -->
    <section
      v-else-if="isCancelled"
      class="
        payment-result-card
        payment-result-card--warning
      "
    >
      <div class="payment-result-card__icon">
        !
      </div>

      <h1>پرداخت لغو شد</h1>

      <p>
        پرداخت توسط شما لغو شد و مبلغی از حساب شما کسر
        نشده است.
      </p>

      <div class="payment-result-card__actions">
        <button
          v-if="payment"
          type="button"
          class="
            payment-button
            payment-button--primary
          "
          :disabled="isRetrying"
          @click="retryPayment"
        >
          {{
            isRetrying
              ? 'در حال ساخت پرداخت...'
              : 'تلاش مجدد برای پرداخت'
          }}
        </button>

        <router-link
          v-if="payment"
          :to="{
            name: 'checkout-success',
            params: {
              orderId: String(payment.order),
            },
            query: {
              payment: 'cancelled',
            },
          }"
          class="
            payment-button
            payment-button--secondary
          "
        >
          مشاهده سفارش
        </router-link>

        <router-link
          v-else
          :to="{ name: 'orders' }"
          class="
            payment-button
            payment-button--secondary
          "
        >
          سفارش‌های من
        </router-link>
      </div>
    </section>

    <!-- پرداخت ناموفق -->
    <section
      v-else
      class="
        payment-result-card
        payment-result-card--error
      "
    >
      <div class="payment-result-card__icon">
        ×
      </div>

      <h1>پرداخت ناموفق بود</h1>

      <p>
        {{
          errorMessage ||
          'پرداخت تأیید نشد. دوباره تلاش کنید.'
        }}
      </p>

      <div class="payment-result-card__actions">
        <button
          v-if="payment"
          type="button"
          class="
            payment-button
            payment-button--primary
          "
          :disabled="isRetrying"
          @click="retryPayment"
        >
          {{
            isRetrying
              ? 'در حال ساخت پرداخت...'
              : 'پرداخت مجدد'
          }}
        </button>

        <router-link
          v-if="payment"
          :to="{
            name: 'checkout-success',
            params: {
              orderId: String(payment.order),
            },
            query: {
              payment: 'failed',
            },
          }"
          class="
            payment-button
            payment-button--secondary
          "
        >
          مشاهده سفارش
        </router-link>

        <router-link
          v-else
          :to="{ name: 'orders' }"
          class="
            payment-button
            payment-button--secondary
          "
        >
          سفارش‌های من
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import {
  useRoute,
} from 'vue-router'

import {
  PaymentServiceError,
  paymentService,
} from '@/services/payment.service'

import type {
  MockPaymentStatus,
  Payment,
} from '@/types/payment.types'


const route = useRoute()


const payment = ref<Payment | null>(
  null,
)

const isLoading = ref(true)

const isRetrying = ref(false)

const errorMessage = ref('')

const verificationStatus =
  ref<MockPaymentStatus | null>(
    null,
  )


const paymentId = computed<number>(() => {
  const value = Number(
    route.query.payment_id,
  )

  return Number.isInteger(value)
    ? value
    : 0
})


const authority = computed<string>(() => {
  return String(
    route.query.authority || '',
  ).trim()
})


const mockStatus =
  computed<MockPaymentStatus>(() => {
    const value = String(
      route.query.mock_status ||
      'success',
    )
      .trim()
      .toLowerCase()

    if (value === 'failed') {
      return 'failed'
    }

    if (value === 'cancelled') {
      return 'cancelled'
    }

    return 'success'
  })


const isSuccessful =
  computed<boolean>(() => {
    return (
      payment.value?.is_successful === true ||
      payment.value?.status === 'successful'
    )
  })


const isCancelled =
  computed<boolean>(() => {
    return (
      verificationStatus.value ===
        'cancelled' ||
      payment.value?.status ===
        'cancelled'
    )
  })


const formatPrice = (
  value: string | number,
): string => {
  const amount = Number(value || 0)

  return new Intl.NumberFormat(
    'fa-IR',
  ).format(
    Math.round(amount),
  )
}


const validateQueryParameters =
  (): boolean => {
    if (paymentId.value <= 0) {
      errorMessage.value =
        'شناسه پرداخت معتبر نیست.'

      return false
    }

    if (!authority.value) {
      errorMessage.value =
        'شناسه تراکنش در آدرس بازگشتی وجود ندارد.'

      return false
    }

    return true
  }


const verifyPayment =
  async (): Promise<void> => {
    errorMessage.value = ''
    isLoading.value = true

    if (!validateQueryParameters()) {
      isLoading.value = false

      return
    }

    verificationStatus.value =
      mockStatus.value

    try {
      const response =
        await paymentService.verifyPayment({
          payment_id:
            paymentId.value,

          authority:
            authority.value,

          mock_status:
            mockStatus.value,
        })

      payment.value =
        response.payment
    } catch (error: unknown) {
      if (
        error instanceof
        PaymentServiceError
      ) {
        errorMessage.value =
          error.message

        if (error.data?.payment) {
          payment.value =
            error.data.payment
        }

        return
      }

      console.error(
        'Verify payment error:',
        error,
      )

      errorMessage.value =
        'خطای پیش‌بینی‌نشده‌ای در بررسی پرداخت رخ داد.'
    } finally {
      isLoading.value = false
    }
  }


const retryPayment =
  async (): Promise<void> => {
    if (
      isRetrying.value ||
      !payment.value
    ) {
      return
    }

    isRetrying.value = true
    errorMessage.value = ''

    try {
      const response =
        await paymentService.createPayment({
          order_id:
            payment.value.order,
        })

      const paymentUrl =
        response.payment_url?.trim()

      if (!paymentUrl) {
        errorMessage.value =
          'آدرس پرداخت جدید دریافت نشد.'

        return
      }

      window.location.assign(
        paymentUrl,
      )
    } catch (error: unknown) {
      if (
        error instanceof
        PaymentServiceError
      ) {
        errorMessage.value =
          error.message

        return
      }

      console.error(
        'Retry payment error:',
        error,
      )

      errorMessage.value =
        'خطایی در ساخت پرداخت مجدد رخ داد.'
    } finally {
      isRetrying.value = false
    }
  }


onMounted(() => {
  void verifyPayment()
})
</script>

<style scoped>
.payment-result-page {
  display: flex;
  width: 100%;
  min-height: 70vh;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.payment-result-card {
  display: flex;
  width: 100%;
  max-width: 600px;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #ffffff;
  text-align: center;
}

.payment-result-card--success {
  border-color: #a7f3d0;
  background: #ecfdf5;
}

.payment-result-card--warning {
  border-color: #fde68a;
  background: #fffbeb;
}

.payment-result-card--error {
  border-color: #fecaca;
  background: #fef2f2;
}

.payment-result-card__icon {
  display: flex;
  width: 64px;
  height: 64px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #059669;
  color: #ffffff;
  font-size: 34px;
  font-weight: 700;
}

.payment-result-card--warning
.payment-result-card__icon {
  background: #d97706;
}

.payment-result-card--error
.payment-result-card__icon {
  background: #dc2626;
}

.payment-result-card h1 {
  margin: 0;
  color: #111827;
  font-size: 24px;
}

.payment-result-card p {
  margin: 0;
  color: #4b5563;
  line-height: 1.9;
}

.payment-result-card__spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #d1fae5;
  border-top-color: #059669;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.payment-information {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border: 1px solid #d1fae5;
  border-radius: 12px;
  background: #ffffff;
}

.payment-information__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #6b7280;
}

.payment-information__row strong {
  color: #111827;
  overflow-wrap: anywhere;
}

.payment-result-card__actions {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 12px;
  margin-top: 6px;
}

.payment-button {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.payment-button--primary {
  border: none;
  background: #059669;
  color: #ffffff;
}

.payment-button--primary:hover {
  background: #047857;
}

.payment-button--secondary {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
}

.payment-button--secondary:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.payment-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 520px) {
  .payment-result-card {
    padding: 24px 18px;
  }

  .payment-information__row {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
    text-align: right;
  }

  .payment-result-card__actions {
    flex-direction: column;
  }

  .payment-button {
    width: 100%;
  }
}
</style>
