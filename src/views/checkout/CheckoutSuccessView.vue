<template>
  <section class="success-page">
    <!-- حالت بارگذاری -->
    <div
      v-if="isLoading"
      class="success-state"
    >
      <div class="success-state__spinner" />

      <p>در حال دریافت اطلاعات سفارش...</p>
    </div>

    <!-- حالت خطا -->
    <div
      v-else-if="errorMessage"
      class="success-state success-state--error"
    >
      <div class="success-state__icon">
        !
      </div>

      <h1>دریافت اطلاعات سفارش ناموفق بود</h1>

      <p>
        {{ errorMessage }}
      </p>

      <div class="success-state__actions">
        <button
          type="button"
          class="button button--primary"
          @click="loadOrder"
        >
          تلاش دوباره
        </button>

        <router-link
          to="/user/orders"
          class="button button--secondary"
        >
          مشاهده سفارش‌ها
        </router-link>
      </div>
    </div>

    <!-- نمایش سفارش -->
    <template v-else-if="order">
      <header class="success-header">
        <div class="success-header__icon">
          ✓
        </div>

        <div>
          <h1>سفارش شما با موفقیت ثبت شد</h1>

          <p>
            سفارش شماره
            <strong>#{{ order.id }}</strong>
            ثبت شد.
          </p>
        </div>
      </header>

      <div class="success-grid">
        <!-- اطلاعات اصلی سفارش -->
        <section class="success-card">
          <div class="success-card__header">
            <h2>اطلاعات سفارش</h2>

            <span
              class="order-status"
              :class="statusClass"
            >
              {{ order.status_display }}
            </span>
          </div>

          <div class="success-card__content">
            <div class="information-row">
              <span>شماره سفارش</span>

              <strong>
                #{{ order.id }}
              </strong>
            </div>

            <div class="information-row">
              <span>تاریخ ثبت</span>

              <strong>
                {{ formatDate(order.created_at) }}
              </strong>
            </div>

            <div class="information-row">
              <span>روش پرداخت</span>

              <strong>
                {{ order.payment_method_display }}
              </strong>
            </div>

            <div class="information-row">
              <span>روش ارسال</span>

              <strong>
                {{
                  order.shipping_method_title ||
                  'ثبت نشده'
                }}
              </strong>
            </div>
          </div>
        </section>

        <!-- آدرس تحویل -->
        <section class="success-card">
          <div class="success-card__header">
            <h2>آدرس تحویل</h2>
          </div>

          <div class="success-card__content address-content">
            <p v-if="recipientName">
              <strong>گیرنده:</strong>
              {{ recipientName }}
            </p>

            <p v-if="recipientPhone">
              <strong>شماره تماس:</strong>
              {{ recipientPhone }}
            </p>

            <p>
              {{ completeAddress }}
            </p>

            <p v-if="postalCode">
              <strong>کد پستی:</strong>
              {{ postalCode }}
            </p>
          </div>
        </section>

        <!-- اقلام سفارش -->
        <section class="success-card success-card--wide">
          <div class="success-card__header">
            <h2>کالاهای سفارش</h2>

            <span class="items-count">
              {{ totalItems }}
              کالا
            </span>
          </div>

          <div class="order-items">
            <article
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
            >
              <div class="order-item__image">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.product_name || 'محصول'"
                >

                <span v-else>
                  بدون تصویر
                </span>
              </div>

              <div class="order-item__information">
                <h3>
                  {{
                    item.product_name ||
                    `واریانت شماره ${item.variant}`
                  }}
                </h3>

                <p v-if="item.variant_name">
                  {{ item.variant_name }}
                </p>

                <div class="order-item__meta">
                  <span>
                    تعداد:
                    {{ item.quantity }}
                  </span>

                  <span>
                    قیمت واحد:
                    {{ formatPrice(item.price) }}
                    تومان
                  </span>
                </div>
              </div>

              <strong class="order-item__total">
                {{
                  formatPrice(
                    getItemTotal(item),
                  )
                }}
                تومان
              </strong>
            </article>
          </div>
        </section>

        <!-- خلاصه پرداخت -->
        <section class="success-card success-card--summary">
          <div class="success-card__header">
            <h2>خلاصه پرداخت</h2>
          </div>

          <div class="payment-summary">
            <div class="payment-summary__row">
              <span>مجموع کالاها</span>

              <strong>
                {{ formatPrice(order.items_total) }}
                تومان
              </strong>
            </div>

            <div class="payment-summary__row">
              <span>هزینه ارسال</span>

              <strong>
                {{ formatPrice(order.shipping_cost) }}
                تومان
              </strong>
            </div>

            <div
              v-if="Number(order.discount_amount) > 0"
              class="payment-summary__row"
            >
              <span>تخفیف</span>

              <strong>
                -
                {{ formatPrice(order.discount_amount) }}
                تومان
              </strong>
            </div>

            <div
              class="
                payment-summary__row
                payment-summary__row--total
              "
            >
              <span>مبلغ نهایی</span>

              <strong>
                {{ formatPrice(order.total_price) }}
                تومان
              </strong>
            </div>
          </div>
        </section>
      </div>

      <div class="success-actions">
        <router-link
          to="/user/orders"
          class="button button--primary"
        >
          مشاهده سفارش‌های من
        </router-link>

        <router-link
          to="/products"
          class="button button--secondary"
        >
          ادامه خرید
        </router-link>
      </div>

      <div
        v-if="order.payment_method === 'online' &&
              order.status === 'pending'"
        class="payment-notice"
      >
        <strong>
          پرداخت سفارش هنوز انجام نشده است.
        </strong>

        <p>
          در مرحله بعد اتصال سفارش به درگاه پرداخت را
          اضافه می‌کنیم.
        </p>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import {
  useRoute,
  useRouter,
} from 'vue-router'

import {
  OrderServiceError,
  orderService,
} from '@/services/order.service'

import type {
  Order,
  OrderItem,
} from '@/types/order.types'


const route = useRoute()
const router = useRouter()

const order = ref<Order | null>(null)

const isLoading = ref(true)

const errorMessage = ref('')


const orderId = computed<number>(() => {
  const value = Number(
    route.params.orderId,
  )

  return Number.isInteger(value)
    ? value
    : 0
})


const totalItems = computed<number>(() => {
  if (!order.value) {
    return 0
  }

  return order.value.items.reduce(
    (total, item) =>
      total + item.quantity,
    0,
  )
})


const addressSnapshot = computed(() => {
  return (
    order.value
      ?.shipping_address_snapshot || {}
  )
})


const recipientName = computed(() => {
  return (
    addressSnapshot.value
      .recipient_name || ''
  )
})


const recipientPhone = computed(() => {
  return (
    addressSnapshot.value
      .recipient_phone || ''
  )
})


const postalCode = computed(() => {
  return (
    addressSnapshot.value
      .postal_code || ''
  )
})


const completeAddress = computed(() => {
  const province =
    addressSnapshot.value.province

  const city =
    addressSnapshot.value.city

  const address =
    addressSnapshot.value.address

  return [
    province,
    city,
    address,
  ]
    .filter(Boolean)
    .join('، ')
})


const statusClass = computed(() => {
  if (!order.value) {
    return ''
  }

  return `order-status--${order.value.status}`
})


const formatPrice = (
  value: string | number | undefined,
): string => {
  const numberValue = Number(value || 0)

  return new Intl.NumberFormat(
    'fa-IR',
  ).format(
    Math.round(numberValue),
  )
}


const formatDate = (
  value: string,
): string => {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '—'
  }

  return new Intl.DateTimeFormat(
    'fa-IR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date)
}


const getItemTotal = (
  item: OrderItem,
): string | number => {
  if (item.total_price) {
    return item.total_price
  }

  return (
    Number(item.price || 0) *
    item.quantity
  )
}


const loadOrder =
  async (): Promise<void> => {
    errorMessage.value = ''

    if (orderId.value <= 0) {
      errorMessage.value =
        'شناسه سفارش معتبر نیست.'

      isLoading.value = false

      return
    }

    isLoading.value = true

    try {
      order.value =
        await orderService.getOrderById(
          orderId.value,
        )
    } catch (error: unknown) {
      if (
        error instanceof
        OrderServiceError
      ) {
        errorMessage.value =
          error.message

        if (error.status === 404) {
          errorMessage.value =
            'سفارش مورد نظر پیدا نشد.'
        }

        if (
          error.status === 401 ||
          error.status === 403
        ) {
          await router.replace({
            name: 'login',
            query: {
              redirect:
                route.fullPath,
            },
          })
        }

        return
      }

      console.error(
        'Load order error:',
        error,
      )

      errorMessage.value =
        'خطایی در دریافت اطلاعات سفارش رخ داد.'
    } finally {
      isLoading.value = false
    }
  }


onMounted(() => {
  loadOrder()
})
</script>

<style scoped>
.success-page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.success-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
  padding: 22px;
  border: 1px solid #a7f3d0;
  border-radius: 16px;
  background: #ecfdf5;
}

.success-header__icon {
  display: flex;
  flex: 0 0 56px;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #059669;
  color: #ffffff;
  font-size: 30px;
  font-weight: 700;
}

.success-header h1 {
  margin: 0 0 8px;
  color: #065f46;
  font-size: 23px;
}

.success-header p {
  margin: 0;
  color: #047857;
  line-height: 1.8;
}

.success-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.success-card {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
}

.success-card--wide,
.success-card--summary {
  grid-column: 1 / -1;
}

.success-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid #f3f4f6;
}

.success-card__header h2 {
  margin: 0;
  color: #111827;
  font-size: 17px;
}

.success-card__content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}

.information-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #6b7280;
}

.information-row strong {
  color: #111827;
}

.address-content p {
  margin: 0;
  color: #4b5563;
  line-height: 1.9;
}

.address-content strong {
  color: #111827;
}

.order-status {
  padding: 5px 10px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 13px;
}

.order-status--pending {
  background: #fef3c7;
  color: #92400e;
}

.order-status--paid {
  background: #dbeafe;
  color: #1d4ed8;
}

.order-status--shipped {
  background: #ede9fe;
  color: #6d28d9;
}

.order-status--completed {
  background: #d1fae5;
  color: #047857;
}

.order-status--cancelled {
  background: #fee2e2;
  color: #b91c1c;
}

.items-count {
  color: #6b7280;
  font-size: 14px;
}

.order-items {
  display: flex;
  flex-direction: column;
}

.order-item {
  display: grid;
  grid-template-columns:
    72px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border-bottom: 1px solid #f3f4f6;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item__image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  overflow: hidden;
  border-radius: 10px;
  background: #f9fafb;
  color: #9ca3af;
  font-size: 11px;
}

.order-item__image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.order-item__information h3 {
  margin: 0 0 7px;
  color: #111827;
  font-size: 15px;
}

.order-item__information p {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 13px;
}

.order-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: #6b7280;
  font-size: 13px;
}

.order-item__total {
  white-space: nowrap;
  color: #111827;
}

.payment-summary {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}

.payment-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #4b5563;
}

.payment-summary__row strong {
  color: #111827;
}

.payment-summary__row--total {
  margin-top: 4px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 18px;
}

.payment-summary__row--total strong {
  color: #047857;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.button {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  border: none;
  border-radius: 10px;
  font-family: inherit;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.button--primary {
  background: #059669;
  color: #ffffff;
}

.button--secondary {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
}

.payment-notice {
  margin-top: 18px;
  padding: 16px;
  border: 1px solid #fde68a;
  border-radius: 12px;
  background: #fffbeb;
  color: #92400e;
  line-height: 1.8;
}

.payment-notice p {
  margin: 6px 0 0;
}

.success-state {
  display: flex;
  min-height: 320px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
}

.success-state__spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #d1fae5;
  border-top-color: #059669;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.success-state--error {
  padding: 24px;
  border: 1px solid #fecaca;
  border-radius: 16px;
  background: #fef2f2;
}

.success-state__icon {
  display: flex;
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #dc2626;
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
}

.success-state h1 {
  margin: 0;
  color: #991b1b;
  font-size: 21px;
}

.success-state p {
  margin: 0;
  color: #7f1d1d;
}

.success-state__actions {
  display: flex;
  gap: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 720px) {
  .success-grid {
    grid-template-columns: 1fr;
  }

  .success-card--wide,
  .success-card--summary {
    grid-column: auto;
  }

  .success-header {
    align-items: flex-start;
  }

  .order-item {
    grid-template-columns:
      60px minmax(0, 1fr);
  }

  .order-item__image {
    width: 60px;
    height: 60px;
  }

  .order-item__total {
    grid-column: 2;
  }
}

@media (max-width: 520px) {
  .success-header {
    flex-direction: column;
  }

  .information-row,
  .payment-summary__row {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .success-actions,
  .success-state__actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
</style>
