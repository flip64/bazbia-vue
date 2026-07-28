<template>
  <section class="review-page">
    <header class="review-page__header">
      <h1>بررسی نهایی سفارش</h1>

      <p>
        اطلاعات سفارش را بررسی کنید و روش پرداخت را
        انتخاب کنید.
      </p>
    </header>

    <div class="review-page__sections">
      <!-- اطلاعات گیرنده -->
      <section class="review-card">
        <div class="review-card__header">
          <h2>اطلاعات گیرنده</h2>

          <router-link
            :to="{ name: 'checkout-customer' }"
            class="review-card__edit"
          >
            ویرایش
          </router-link>
        </div>

        <div class="review-card__content">
          <p>
            <strong>نام:</strong>
            {{ checkoutStore.customer.fullName }}
          </p>

          <p>
            <strong>شماره موبایل:</strong>
            {{ checkoutStore.customer.phone }}
          </p>
        </div>
      </section>

      <!-- آدرس تحویل -->
      <section class="review-card">
        <div class="review-card__header">
          <h2>آدرس تحویل</h2>

          <router-link
            :to="{ name: 'checkout-address' }"
            class="review-card__edit"
          >
            ویرایش
          </router-link>
        </div>

        <div class="review-card__content">
          <p>
            {{ checkoutStore.address.province }}
            -
            {{ checkoutStore.address.city }}
          </p>

          <p>
            {{ checkoutStore.address.fullAddress }}
          </p>

          <p>
            <strong>کد پستی:</strong>
            {{ checkoutStore.address.postalCode }}
          </p>
        </div>
      </section>

      <!-- روش ارسال -->
      <section class="review-card">
        <div class="review-card__header">
          <h2>روش ارسال</h2>

          <router-link
            :to="{ name: 'checkout-shipping' }"
            class="review-card__edit"
          >
            ویرایش
          </router-link>
        </div>

        <div class="review-card__content">
          <p>
            <strong>روش:</strong>
            {{ checkoutStore.shipping.methodTitle }}
          </p>

          <p>
            <strong>هزینه ارسال:</strong>
            {{ formatPrice(checkoutStore.shipping.cost) }}
            تومان
          </p>
        </div>
      </section>

      <!-- خلاصه مبلغ -->
      <section class="review-card">
        <div class="review-card__header">
          <h2>خلاصه پرداخت</h2>
        </div>

        <div class="order-summary">
          <div class="order-summary__row">
            <span>مجموع کالاها</span>

            <strong>
              {{ formatPrice(cartStore.totalPrice) }}
              تومان
            </strong>
          </div>

          <div class="order-summary__row">
            <span>هزینه ارسال</span>

            <strong>
              {{ formatPrice(checkoutStore.shipping.cost) }}
              تومان
            </strong>
          </div>

          <div
            class="
              order-summary__row
              order-summary__row--total
            "
          >
            <span>مبلغ قابل پرداخت</span>

            <strong>
              {{ formatPrice(finalPrice) }}
              تومان
            </strong>
          </div>
        </div>
      </section>

      <!-- روش پرداخت -->
      <section class="review-card">
        <div class="review-card__header">
          <h2>روش پرداخت</h2>
        </div>

        <div class="payment-methods">
          <label
            class="payment-method"
            :class="{
              'payment-method--selected':
                paymentMethod === 'online',
            }"
          >
            <input
              v-model="paymentMethod"
              type="radio"
              value="online"
            >

            <span class="payment-method__content">
              <strong>پرداخت آنلاین</strong>

              <small>
                پرداخت امن از طریق درگاه بانکی
              </small>
            </span>
          </label>

          <label
            class="
              payment-method
              payment-method--disabled
            "
          >
            <input
              v-model="paymentMethod"
              type="radio"
              value="cod"
              disabled
            >

            <span class="payment-method__content">
              <strong>پرداخت در محل</strong>

              <small>
                فعلاً این روش غیرفعال است
              </small>
            </span>
          </label>
        </div>
      </section>

      <!-- خطا -->
      <div
        v-if="errorMessage"
        class="review-page__error"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <!-- عملیات -->
      <div class="review-page__actions">
        <button
          type="button"
          class="review-page__back"
          :disabled="isSubmitting"
          @click="goBack"
        >
          بازگشت
        </button>

        <button
          type="button"
          class="review-page__submit"
          :disabled="
            isSubmitting ||
            cartStore.isEmpty
          "
          @click="submitOrder"
        >
          {{
            isSubmitting
              ? submitButtonText
              : 'ثبت سفارش و پرداخت'
          }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue'

import { useRouter } from 'vue-router'

import {
  useCartStore,
} from '@/core/store/cartStore'

import {
  useCheckoutStore,
} from '@/core/store/checkoutStore'

import {
  OrderServiceError,
  orderService,
} from '@/services/order.service'

import {
  PaymentServiceError,
  paymentService,
} from '@/services/payment.service'

import type {
  CheckoutPaymentMethod,
} from '@/types/checkout.types'

import type {
  CreateOrderPayload,
} from '@/types/order.types'


const router = useRouter()

const checkoutStore =
  useCheckoutStore()

const cartStore =
  useCartStore()


const paymentMethod =
  ref<CheckoutPaymentMethod>(
    checkoutStore.paymentMethod,
  )

const isSubmitting = ref(false)

const isCreatingPayment = ref(false)

const errorMessage = ref('')


const finalPrice = computed<number>(() => {
  return (
    Number(cartStore.totalPrice || 0) +
    Number(
      checkoutStore.shipping.cost || 0,
    )
  )
})


const submitButtonText = computed<string>(() => {
  if (isCreatingPayment.value) {
    return 'در حال انتقال به درگاه...'
  }

  return 'در حال ثبت سفارش...'
})


const formatPrice = (
  priceInToman: string | number | null | undefined,
): string => {
  const value = Number(
    priceInToman || 0,
  )

  return new Intl.NumberFormat(
    'fa-IR',
  ).format(
    Math.round(value),
  )
}


const validateCheckout = (): boolean => {
  if (
    !checkoutStore.hasCustomerInformation
  ) {
    router.replace({
      name: 'checkout-customer',
    })

    return false
  }

  if (
    !checkoutStore.hasAddressInformation
  ) {
    router.replace({
      name: 'checkout-address',
    })

    return false
  }

  if (
    !checkoutStore.hasShippingMethod
  ) {
    router.replace({
      name: 'checkout-shipping',
    })

    return false
  }

  if (cartStore.isEmpty) {
    errorMessage.value =
      'سبد خرید شما خالی است.'

    return false
  }

  return true
}


const goBack = (): void => {
  if (isSubmitting.value) {
    return
  }

  router.push({
    name: 'checkout-shipping',
  })
}


const buildCreateOrderPayload =
  (): CreateOrderPayload | null => {
    const addressId =
      checkoutStore.address.addressId

    const shippingQuoteId =
      checkoutStore.shipping.quoteId

    const shippingMethodCode =
      checkoutStore.shipping.methodCode

    if (
      !Number.isInteger(addressId) ||
      Number(addressId) <= 0
    ) {
      errorMessage.value =
        'آدرس تحویل معتبر نیست.'

      return null
    }

    if (!shippingQuoteId?.trim()) {
      errorMessage.value =
        'اطلاعات محاسبه ارسال موجود نیست.'

      return null
    }

    if (!shippingMethodCode?.trim()) {
      errorMessage.value =
        'روش ارسال انتخاب نشده است.'

      return null
    }

    return {
      address_id: Number(addressId),

      shipping_quote_id:
        shippingQuoteId.trim(),

      shipping_method_code:
        shippingMethodCode.trim(),

      payment_method:
        paymentMethod.value,
    }
  }


const resetCheckoutState = (): void => {
  /*
   * بعد از ساخت موفق سفارش، بک‌اند سبد را خالی می‌کند.
   * این بخش فقط وضعیت محلی Pinia را پاک می‌کند.
   */
  cartStore.$reset()
  checkoutStore.reset()
}


const goToOrderSuccess = async (
  orderId: number,
  paymentStatus?: string,
): Promise<void> => {
  await router.replace({
    name: 'checkout-success',

    params: {
      orderId: String(orderId),
    },

    query: paymentStatus
      ? {
          payment: paymentStatus,
        }
      : undefined,
  })
}


const submitOrder =
  async (): Promise<void> => {
    if (isSubmitting.value) {
      return
    }

    errorMessage.value = ''

    if (!validateCheckout()) {
      return
    }

    if (
      paymentMethod.value !== 'online'
    ) {
      errorMessage.value =
        'در حال حاضر فقط پرداخت آنلاین فعال است.'

      return
    }

    const payload =
      buildCreateOrderPayload()

    if (!payload) {
      return
    }

    checkoutStore.setPaymentMethod(
      paymentMethod.value,
    )

    isSubmitting.value = true

    /*
     * اگر سفارش ساخته شود ولی ایجاد پرداخت شکست بخورد،
     * شناسه سفارش را نگه می‌داریم تا سفارش دوباره ساخته
     * نشود.
     */
    let createdOrderId: number | null =
      null

    try {
      // ---------------------------------------------
      // ۱. ثبت سفارش
      // ---------------------------------------------
      const orderResponse =
        await orderService.createOrder(
          payload,
        )

      createdOrderId =
        orderResponse.order.id

      // ---------------------------------------------
      // ۲. ایجاد درخواست پرداخت
      // ---------------------------------------------
      isCreatingPayment.value = true

      const paymentResponse =
        await paymentService.createPayment({
          order_id: createdOrderId,
        })

      /*
       * سفارش ساخته شده و سبد بک‌اند خالی شده است.
       */
      resetCheckoutState()

      // ---------------------------------------------
      // ۳. بررسی آدرس درگاه
      // ---------------------------------------------
      const paymentUrl =
        paymentResponse.payment_url?.trim()

      if (!paymentUrl) {
        await goToOrderSuccess(
          createdOrderId,
          'not-created',
        )

        return
      }

      /*
       * انتقال کامل مرورگر به آدرس درگاه.
       *
       * در حالت mock این URL به صفحه verify فرانت می‌رود
       * و در حالت واقعی به سایت درگاه بانکی منتقل می‌شود.
       */
      window.location.assign(
        paymentUrl,
      )
    } catch (error: unknown) {
      // ---------------------------------------------
      // خطای ثبت سفارش
      // ---------------------------------------------
      if (
        error instanceof
        OrderServiceError
      ) {
        errorMessage.value =
          error.message

        if (
          error.status === 400 ||
          error.status === 409
        ) {
          await cartStore.fetchCart()
        }

        return
      }

      // ---------------------------------------------
      // خطای ساخت پرداخت بعد از ثبت سفارش
      // ---------------------------------------------
      if (
        error instanceof
        PaymentServiceError
      ) {
        /*
         * سفارش قبلاً ثبت شده است؛ بنابراین نباید کاربر
         * با زدن مجدد دکمه، سفارش دیگری ایجاد کند.
         */
        if (createdOrderId) {
          resetCheckoutState()

          await goToOrderSuccess(
            createdOrderId,
            'create-failed',
          )

          return
        }

        errorMessage.value =
          error.message

        return
      }

      console.error(
        'Checkout submit error:',
        error,
      )

      /*
       * اگر سفارش ساخته شده باشد، حتی در خطای ناشناخته
       * نیز کاربر را به صفحه همان سفارش می‌بریم.
       */
      if (createdOrderId) {
        resetCheckoutState()

        await goToOrderSuccess(
          createdOrderId,
          'unknown-error',
        )

        return
      }

      errorMessage.value =
        'خطای پیش‌بینی‌نشده‌ای در ثبت سفارش رخ داد.'
    } finally {
      isCreatingPayment.value = false
      isSubmitting.value = false
    }
  }


watch(
  paymentMethod,
  value => {
    checkoutStore.setPaymentMethod(
      value,
    )
  },
)


onMounted(async () => {
  checkoutStore.initialize()

  if (!cartStore.initialized) {
    await cartStore.initializeCart()
  }

  validateCheckout()
})
</script>

<style scoped>
.review-page {
  width: 100%;
}

.review-page__header {
  margin-bottom: 24px;
}

.review-page__header h1 {
  margin-bottom: 8px;
  font-size: 24px;
  color: #111827;
}

.review-page__header p {
  color: #6b7280;
  line-height: 1.8;
}

.review-page__sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
}

.review-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #f3f4f6;
}

.review-card__header h2 {
  margin: 0;
  font-size: 17px;
  color: #111827;
}

.review-card__edit {
  font-size: 14px;
  color: #059669;
  text-decoration: none;
}

.review-card__edit:hover {
  color: #047857;
}

.review-card__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  color: #4b5563;
  line-height: 1.8;
}

.review-card__content p {
  margin: 0;
}

.review-card__content strong {
  color: #111827;
}

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}

.order-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #4b5563;
}

.order-summary__row strong {
  color: #111827;
}

.order-summary__row--total {
  margin-top: 4px;
  padding-top: 14px;
  border-top: 1px solid #e5e7eb;
  font-size: 17px;
}

.order-summary__row--total strong {
  color: #047857;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
}

.payment-method {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.payment-method--selected {
  border-color: #059669;
  background: #ecfdf5;
}

.payment-method--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.payment-method input {
  margin-top: 4px;
}

.payment-method__content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.payment-method__content strong {
  color: #111827;
}

.payment-method__content small {
  color: #6b7280;
}

.review-page__error {
  padding: 14px 16px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  line-height: 1.8;
}

.review-page__actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
}

.review-page__back,
.review-page__submit {
  min-height: 46px;
  padding: 0 22px;
  border-radius: 10px;
  font-family: inherit;
  cursor: pointer;
}

.review-page__back {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
}

.review-page__submit {
  border: none;
  background: #059669;
  color: #ffffff;
  font-weight: 700;
}

.review-page__back:disabled,
.review-page__submit:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 640px) {
  .review-page__actions {
    flex-direction: column-reverse;
  }

  .review-page__back,
  .review-page__submit {
    width: 100%;
  }

  .order-summary__row {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
}
</style>
