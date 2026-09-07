<template>
  <div class="orders-page">
    <div class="orders-container">

      <!-- =========================================
           Header
      ========================================== -->
      <header class="orders-header">
        <RouterLink
          :to="{ name: 'profile' }"
          class="back-button"
          aria-label="بازگشت به حساب کاربری"
        >
          <ArrowRight :size="20" />
        </RouterLink>

        <div>
          <h1>سفارش‌های من</h1>

          <p>
            مشاهده وضعیت و جزئیات سفارش‌های ثبت‌شده
          </p>
        </div>
      </header>


      <!-- =========================================
           Loading
      ========================================== -->
      <section
        v-if="loading"
        class="state-card"
      >
        <div class="loader"></div>

        <p>
          در حال دریافت سفارش‌ها...
        </p>
      </section>


      <!-- =========================================
           Error
      ========================================== -->
      <section
        v-else-if="errorMessage"
        class="state-card state-card--error"
      >
        <div class="state-icon state-icon--error">
          <CircleAlert
            :size="32"
            :stroke-width="1.7"
          />
        </div>

        <h2>
          دریافت سفارش‌ها انجام نشد
        </h2>

        <p>
          {{ errorMessage }}
        </p>

        <button
          type="button"
          class="primary-button"
          @click="loadOrders"
        >
          تلاش دوباره
        </button>
      </section>


      <!-- =========================================
           Empty
      ========================================== -->
      <section
        v-else-if="orders.length === 0"
        class="state-card"
      >
        <div class="state-icon">
          <PackageOpen
            :size="38"
            :stroke-width="1.6"
          />
        </div>

        <h2>
          هنوز سفارشی ثبت نکرده‌اید
        </h2>

        <p>
          بعد از ثبت اولین سفارش،
          اطلاعات آن در این قسمت نمایش داده می‌شود.
        </p>

        <RouterLink
          :to="{ name: 'products' }"
          class="primary-button"
        >
          مشاهده محصولات
        </RouterLink>
      </section>


      <!-- =========================================
           Orders
      ========================================== -->
      <div
        v-else
        class="orders-list"
      >
        <article
          v-for="order in orders"
          :key="order.id"
          class="order-card"
        >

          <!-- =====================================
               Order Header
          ====================================== -->
          <div class="order-card__header">

            <div class="order-code">
              <span>شماره سفارش</span>

              <strong>
                #{{ persianNumber(order.id) }}
              </strong>
            </div>


            <span
              class="status-badge"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusLabel(order) }}
            </span>

          </div>


          <!-- =====================================
               Summary
          ====================================== -->
          <div class="order-summary">

            <div class="summary-item">
              <div class="summary-icon">
                <CalendarDays
                  :size="19"
                  :stroke-width="1.7"
                />
              </div>

              <div>
                <span>
                  تاریخ سفارش
                </span>

                <strong>
                  {{ formatDate(order.created_at) }}
                </strong>
              </div>
            </div>


            <div class="summary-item">
              <div class="summary-icon">
                <Package
                  :size="19"
                  :stroke-width="1.7"
                />
              </div>

              <div>
                <span>
                  تعداد کالا
                </span>

                <strong>
                  {{ persianNumber(getItemsCount(order)) }}
                  عدد
                </strong>
              </div>
            </div>


            <div class="summary-item">
              <div class="summary-icon">
                <CreditCard
                  :size="19"
                  :stroke-width="1.7"
                />
              </div>

              <div>
                <span>
                  روش پرداخت
                </span>

                <strong>
                  {{ getPaymentLabel(order) }}
                </strong>
              </div>
            </div>

          </div>


          <!-- =====================================
               Total
          ====================================== -->
          <div class="order-total">
            <span>
              مبلغ سفارش
            </span>

            <strong>
              {{ formatPrice(order.total_price) }}

              <small>
                تومان
              </small>
            </strong>
          </div>


          <!-- =====================================
               Actions
          ====================================== -->
          <div class="order-actions">

            <button
              type="button"
              class="details-button"
              @click="toggleDetails(order.id)"
            >
              <span>
                {{
                  expandedOrderId === order.id
                    ? 'بستن جزئیات'
                    : 'مشاهده جزئیات'
                }}
              </span>

              <ChevronDown
                :size="19"
                :class="{
                  'chevron-open':
                    expandedOrderId === order.id
                }"
              />
            </button>


            <button
              v-if="order.status === 'pending'"
              type="button"
              class="cancel-button"
              :disabled="cancellingOrderId === order.id"
              @click="handleCancelOrder(order)"
            >
              <X
                v-if="cancellingOrderId !== order.id"
                :size="17"
              />

              <span>
                {{
                  cancellingOrderId === order.id
                    ? 'در حال لغو...'
                    : 'لغو سفارش'
                }}
              </span>
            </button>

          </div>


          <!-- =====================================
               Expanded Details
          ====================================== -->
          <div
            v-if="expandedOrderId === order.id"
            class="order-details"
          >

            <!-- =================================
                 Items
            ================================== -->
            <section class="details-section">

              <div class="details-title">
                <ShoppingBag :size="18" />

                <h3>
                  کالاهای سفارش
                </h3>
              </div>


              <div
                v-if="order.items?.length"
                class="items-list"
              >
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="order-item"
                >

                  <!-- تصویر -->
                  <div class="item-image">

                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.product_name || 'محصول'"
                    >

                    <Package
                      v-else
                      :size="25"
                      :stroke-width="1.5"
                    />

                  </div>


                  <!-- اطلاعات محصول -->
                  <div class="item-content">

                    <strong class="item-name">
                      {{
                        item.product_name ||
                        'محصول'
                      }}
                    </strong>


                    <span
                      v-if="item.variant_name"
                      class="item-variant"
                    >
                      {{ item.variant_name }}
                    </span>


                    <div class="item-meta">

                      <span>
                        تعداد:
                        {{ persianNumber(item.quantity) }}
                      </span>


                      <span>
                        قیمت واحد:
                        {{ formatPrice(item.price) }}
                        تومان
                      </span>

                    </div>

                  </div>


                  <!-- مبلغ ردیف -->
                  <div class="item-total">
                    <strong>
                      {{
                        formatPrice(
                          getItemTotal(item)
                        )
                      }}
                    </strong>

                    <span>
                      تومان
                    </span>
                  </div>

                </div>
              </div>


              <div
                v-else
                class="empty-items"
              >
                اطلاعات کالاهای این سفارش موجود نیست.
              </div>

            </section>


            <!-- =================================
                 Price Details
            ================================== -->
            <section class="details-section">

              <div class="details-title">
                <ReceiptText :size="18" />

                <h3>
                  جزئیات پرداخت
                </h3>
              </div>


              <div class="price-box">

                <div class="price-row">
                  <span>
                    مجموع کالاها
                  </span>

                  <strong>
                    {{ formatPrice(order.items_total) }}
                    تومان
                  </strong>
                </div>


                <div class="price-row">
                  <span>
                    هزینه ارسال
                  </span>

                  <strong>
                    {{
                      Number(order.shipping_cost) === 0
                        ? 'رایگان'
                        : `${formatPrice(order.shipping_cost)} تومان`
                    }}
                  </strong>
                </div>


                <div
                  v-if="Number(order.discount_amount) > 0"
                  class="price-row price-row--discount"
                >
                  <span>
                    تخفیف
                  </span>

                  <strong>
                    -
                    {{ formatPrice(order.discount_amount) }}
                    تومان
                  </strong>
                </div>


                <div class="price-row price-row--total">
                  <span>
                    مبلغ نهایی
                  </span>

                  <strong>
                    {{ formatPrice(order.total_price) }}
                    تومان
                  </strong>
                </div>

              </div>

            </section>


            <!-- =================================
                 Shipping
            ================================== -->
            <section
              v-if="hasShippingInfo(order)"
              class="details-section"
            >

              <div class="details-title">
                <Truck :size="18" />

                <h3>
                  اطلاعات ارسال
                </h3>
              </div>


              <div class="shipping-box">

                <div
                  v-if="order.shipping_method_title"
                  class="shipping-row"
                >
                  <div class="shipping-icon">
                    <Truck :size="19" />
                  </div>

                  <div>
                    <span>
                      روش ارسال
                    </span>

                    <strong>
                      {{ order.shipping_method_title }}
                    </strong>
                  </div>
                </div>


                <div
                  v-if="hasAddress(order)"
                  class="shipping-row"
                >
                  <div class="shipping-icon">
                    <MapPin :size="19" />
                  </div>

                  <div>
                    <span>
                      آدرس تحویل
                    </span>

                    <strong>
                      {{ formatAddress(order) }}
                    </strong>
                  </div>
                </div>


                <div
                  v-if="order.shipping_address_snapshot?.recipient_name"
                  class="shipping-row"
                >
                  <div class="shipping-icon">
                    <UserRound :size="19" />
                  </div>

                  <div>
                    <span>
                      تحویل گیرنده
                    </span>

                    <strong>
                      {{
                        order.shipping_address_snapshot
                          .recipient_name
                      }}
                    </strong>
                  </div>
                </div>


                <div
                  v-if="order.shipping_address_snapshot?.recipient_phone"
                  class="shipping-row"
                >
                  <div class="shipping-icon">
                    <Phone :size="19" />
                  </div>

                  <div>
                    <span>
                      شماره تماس
                    </span>

                    <strong dir="ltr">
                      {{
                        order.shipping_address_snapshot
                          .recipient_phone
                      }}
                    </strong>
                  </div>
                </div>

              </div>

            </section>

          </div>

        </article>
      </div>

    </div>
  </div>
</template>


<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'

import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  CircleAlert,
  CreditCard,
  MapPin,
  Package,
  PackageOpen,
  Phone,
  ReceiptText,
  ShoppingBag,
  Truck,
  UserRound,
  X,
} from 'lucide-vue-next'

import {
  RouterLink,
} from 'vue-router'

import orderService, {
  OrderServiceError,
} from '@/services/order.service'

import type {
  Order,
  OrderItem,
  OrderStatus,
} from '@/types/order.types'


/* =========================================
   State
========================================= */

const orders = ref<Order[]>([])

const loading = ref(true)

const errorMessage = ref('')

const expandedOrderId =
  ref<number | null>(null)

const cancellingOrderId =
  ref<number | null>(null)


/* =========================================
   دریافت سفارش‌ها
========================================= */

async function loadOrders() {
  loading.value = true
  errorMessage.value = ''

  try {
    const result =
      await orderService.getOrders()

    orders.value =
      Array.isArray(result)
        ? result
        : []
  } catch (error: unknown) {
    console.error(
      'خطا در دریافت سفارش‌ها:',
      error,
    )

    if (
      error instanceof OrderServiceError
    ) {
      errorMessage.value =
        error.message
    } else {
      errorMessage.value =
        'دریافت سفارش‌ها از سرور انجام نشد.'
    }
  } finally {
    loading.value = false
  }
}


/* =========================================
   باز کردن جزئیات
========================================= */

function toggleDetails(
  orderId: number,
) {
  expandedOrderId.value =
    expandedOrderId.value === orderId
      ? null
      : orderId
}


/* =========================================
   لغو سفارش
========================================= */

async function handleCancelOrder(
  order: Order,
) {
  if (
    order.status !== 'pending'
  ) {
    return
  }

  const confirmed =
    window.confirm(
      `آیا از لغو سفارش #${order.id} مطمئن هستید؟`,
    )

  if (!confirmed) {
    return
  }

  cancellingOrderId.value =
    order.id

  try {
    const response =
      await orderService.cancelOrder(
        order.id,
      )

    const index =
      orders.value.findIndex(
        currentOrder =>
          currentOrder.id ===
          order.id,
      )

    if (index !== -1) {
      orders.value[index] =
        response.order
    }
  } catch (error: unknown) {
    console.error(
      'خطا در لغو سفارش:',
      error,
    )

    if (
      error instanceof OrderServiceError
    ) {
      window.alert(
        error.message,
      )
    } else {
      window.alert(
        'لغو سفارش انجام نشد.',
      )
    }
  } finally {
    cancellingOrderId.value = null
  }
}


/* =========================================
   تعداد کالا
========================================= */

function getItemsCount(
  order: Order,
): number {
  if (
    !Array.isArray(order.items)
  ) {
    return 0
  }

  return order.items.reduce(
    (
      total,
      item,
    ) =>
      total +
      Number(item.quantity || 0),
    0,
  )
}


/* =========================================
   قیمت ردیف
========================================= */

function getItemTotal(
  item: OrderItem,
): number {
  if (item.total_price) {
    return Number(
      item.total_price,
    )
  }

  return (
    Number(item.price || 0) *
    Number(item.quantity || 0)
  )
}


/* =========================================
   فرمت قیمت
========================================= */

function formatPrice(
  value:
    | string
    | number
    | null
    | undefined,
): string {
  const numberValue =
    Number(value || 0)

  return new Intl.NumberFormat(
    'fa-IR',
  ).format(numberValue)
}


/* =========================================
   عدد فارسی
========================================= */

function persianNumber(
  value: number,
): string {
  return new Intl.NumberFormat(
    'fa-IR',
  ).format(value)
}


/* =========================================
   تاریخ
========================================= */

function formatDate(
  value: string,
): string {
  if (!value) {
    return '—'
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value
  }

  return new Intl.DateTimeFormat(
    'fa-IR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  ).format(date)
}


/* =========================================
   وضعیت سفارش
========================================= */

function getStatusLabel(
  order: Order,
): string {
  if (
    order.status_display
  ) {
    return order.status_display
  }

  const labels:
    Record<OrderStatus, string> = {
      pending: 'در انتظار پرداخت',
      cancelled: 'لغو شده',
      paid: 'پرداخت شده',
      shipped: 'ارسال شده',
      completed: 'تکمیل شده',
    }

  return labels[order.status]
}


function getStatusClass(
  status: OrderStatus,
): string {
  return `status-badge--${status}`
}


/* =========================================
   روش پرداخت
========================================= */

function getPaymentLabel(
  order: Order,
): string {
  if (
    order.payment_method_display
  ) {
    return order.payment_method_display
  }

  if (
    order.payment_method === 'online'
  ) {
    return 'پرداخت آنلاین'
  }

  if (
    order.payment_method === 'cod'
  ) {
    return 'پرداخت در محل'
  }

  return '—'
}


/* =========================================
   آدرس
========================================= */

function hasAddress(
  order: Order,
): boolean {
  const address =
    order.shipping_address_snapshot

  if (!address) {
    return false
  }

  return Boolean(
    address.province ||
    address.city ||
    address.address,
  )
}


function formatAddress(
  order: Order,
): string {
  const address =
    order.shipping_address_snapshot

  if (!address) {
    return 'آدرس ثبت نشده'
  }

  return [
    address.province,
    address.city,
    address.address,
    address.postal_code
      ? `کدپستی ${address.postal_code}`
      : null,
  ]
    .filter(Boolean)
    .join('، ')
}


function hasShippingInfo(
  order: Order,
): boolean {
  return Boolean(
    order.shipping_method_title ||
    hasAddress(order) ||
    order.shipping_address_snapshot
      ?.recipient_name ||
    order.shipping_address_snapshot
      ?.recipient_phone,
  )
}


/* =========================================
   Mount
========================================= */

onMounted(() => {
  loadOrders()
})
</script>


<style scoped>
/* =========================================
   Page
========================================= */

.orders-page {
  min-height: 70vh;
  padding: 24px 16px 40px;
  background: #f8fafc;
}

.orders-container {
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
}


/* =========================================
   Header
========================================= */

.orders-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.orders-header h1 {
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 800;
}

.orders-header p {
  margin: 5px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.back-button {
  width: 44px;
  height: 44px;

  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #e5e7eb;
  border-radius: 13px;

  background: #ffffff;
  color: #374151;

  text-decoration: none;

  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.back-button:hover {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
}


/* =========================================
   State
========================================= */

.state-card {
  min-height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 32px 20px;

  border: 1px solid #e5e7eb;
  border-radius: 18px;

  background: #ffffff;

  text-align: center;
}

.state-card h2 {
  margin: 15px 0 7px;

  color: #1f2937;

  font-size: 17px;
  font-weight: 800;
}

.state-card p {
  max-width: 420px;

  margin: 0;

  color: #6b7280;

  font-size: 13px;
  line-height: 1.9;
}

.state-icon {
  width: 72px;
  height: 72px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #f0fdf4;
  color: #15803d;
}

.state-icon--error {
  background: #fef2f2;
  color: #b91c1c;
}

.state-card--error h2 {
  color: #991b1b;
}


/* =========================================
   Loader
========================================= */

.loader {
  width: 38px;
  height: 38px;

  margin-bottom: 15px;

  border: 3px solid #dcfce7;
  border-top-color: #15803d;

  border-radius: 50%;

  animation: orders-spin 0.8s linear infinite;
}

@keyframes orders-spin {
  to {
    transform: rotate(360deg);
  }
}


/* =========================================
   Primary button
========================================= */

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 42px;

  margin-top: 18px;
  padding: 0 18px;

  border: 0;
  border-radius: 10px;

  background: #15803d;
  color: #ffffff;

  font-size: 13px;
  font-weight: 700;

  text-decoration: none;
  cursor: pointer;
}


/* =========================================
   Orders list
========================================= */

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  overflow: hidden;

  border: 1px solid #e5e7eb;
  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 1px 2px
    rgba(0, 0, 0, 0.03);
}


/* =========================================
   Order header
========================================= */

.order-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  padding: 18px 20px;

  border-bottom: 1px solid #f3f4f6;
}

.order-code {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.order-code span {
  color: #9ca3af;
  font-size: 11px;
}

.order-code strong {
  color: #1f2937;

  font-size: 16px;
  font-weight: 800;
}


/* =========================================
   Status
========================================= */

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 10px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;

  white-space: nowrap;
}

.status-badge--pending {
  background: #fff7ed;
  color: #c2410c;
}

.status-badge--paid {
  background: #eff6ff;
  color: #1d4ed8;
}

.status-badge--shipped {
  background: #f5f3ff;
  color: #6d28d9;
}

.status-badge--completed {
  background: #f0fdf4;
  color: #15803d;
}

.status-badge--cancelled {
  background: #fef2f2;
  color: #b91c1c;
}


/* =========================================
   Summary
========================================= */

.order-summary {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 14px;

  padding: 18px 20px;
}

.summary-item {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 10px;
}

.summary-icon {
  width: 38px;
  height: 38px;

  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #f0fdf4;
  color: #15803d;
}

.summary-item > div:last-child {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-item span {
  color: #9ca3af;
  font-size: 11px;
}

.summary-item strong {
  overflow: hidden;

  color: #374151;

  font-size: 12px;
  font-weight: 700;

  text-overflow: ellipsis;
  white-space: nowrap;
}


/* =========================================
   Order total
========================================= */

.order-total {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  padding: 15px 20px;

  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;

  background: #f9fafb;
}

.order-total > span {
  color: #6b7280;
  font-size: 13px;
}

.order-total strong {
  color: #15803d;

  font-size: 18px;
  font-weight: 800;
}

.order-total small {
  margin-right: 3px;

  font-size: 11px;
  font-weight: 600;
}


/* =========================================
   Actions
========================================= */

.order-actions {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 14px 20px;
}

.details-button,
.cancel-button {
  min-height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  border-radius: 10px;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
}

.details-button {
  flex: 1;

  border: 1px solid #bbf7d0;

  background: #f0fdf4;
  color: #15803d;
}

.details-button svg {
  transition: transform 0.2s ease;
}

.chevron-open {
  transform: rotate(180deg);
}

.cancel-button {
  padding: 0 16px;

  border: 1px solid #fecaca;

  background: #ffffff;
  color: #b91c1c;
}

.cancel-button:hover {
  background: #fef2f2;
}

.cancel-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}


/* =========================================
   Details
========================================= */

.order-details {
  padding: 0 20px 22px;

  border-top: 1px solid #f3f4f6;

  background: #ffffff;
}

.details-section {
  padding-top: 20px;
}

.details-section + .details-section {
  margin-top: 20px;

  border-top: 1px solid #f3f4f6;
}

.details-title {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-bottom: 14px;

  color: #15803d;
}

.details-title h3 {
  margin: 0;

  color: #1f2937;

  font-size: 14px;
  font-weight: 800;
}


/* =========================================
   Items
========================================= */

.items-list {
  display: flex;
  flex-direction: column;

  gap: 10px;
}

.order-item {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 12px;

  border: 1px solid #e5e7eb;
  border-radius: 12px;

  background: #f9fafb;
}

.item-image {
  width: 58px;
  height: 58px;

  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 10px;

  background: #f0fdf4;
  color: #15803d;
}

.item-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.item-content {
  min-width: 0;
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 4px;
}

.item-name {
  color: #374151;

  font-size: 13px;
  font-weight: 700;

  line-height: 1.7;
}

.item-variant {
  color: #6b7280;
  font-size: 11px;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;

  gap: 12px;

  margin-top: 2px;

  color: #9ca3af;
  font-size: 11px;
}

.item-total {
  flex: 0 0 auto;

  display: flex;
  flex-direction: column;

  align-items: flex-end;

  gap: 2px;
}

.item-total strong {
  color: #15803d;

  font-size: 13px;
  font-weight: 800;
}

.item-total span {
  color: #9ca3af;
  font-size: 10px;
}

.empty-items {
  padding: 16px;

  border-radius: 10px;

  background: #f9fafb;

  color: #6b7280;

  font-size: 12px;
  text-align: center;
}


/* =========================================
   Price
========================================= */

.price-box {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 14px;

  color: #6b7280;
  font-size: 12px;
}

.price-row strong {
  color: #374151;
  font-weight: 700;
}

.price-row--discount strong {
  color: #b91c1c;
}

.price-row--total {
  margin-top: 3px;
  padding-top: 14px;

  border-top: 1px dashed #d1d5db;
}

.price-row--total span,
.price-row--total strong {
  color: #15803d;

  font-size: 14px;
  font-weight: 800;
}


/* =========================================
   Shipping
========================================= */

.shipping-box {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

.shipping-row {
  display: flex;
  align-items: flex-start;

  gap: 11px;
}

.shipping-icon {
  width: 38px;
  height: 38px;

  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #f0fdf4;
  color: #15803d;
}

.shipping-row > div:last-child {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 4px;
}

.shipping-row span {
  color: #9ca3af;
  font-size: 11px;
}

.shipping-row strong {
  color: #374151;

  font-size: 12px;
  font-weight: 600;

  line-height: 1.9;
}


/* =========================================
   Mobile
========================================= */

@media (max-width: 640px) {
  .orders-page {
    padding:
      12px
      10px
      28px;
  }

  .orders-header {
    margin-bottom: 14px;
  }

  .orders-header h1 {
    font-size: 18px;
  }

  .orders-header p {
    font-size: 11px;
  }

  .back-button {
    width: 40px;
    height: 40px;
  }

  .order-card {
    border-radius: 14px;
  }

  .order-card__header {
    padding: 14px;
  }

  .order-summary {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 12px;

    padding: 14px;
  }

  .summary-item:last-child {
    grid-column: 1 / -1;
  }

  .order-total {
    padding: 13px 14px;
  }

  .order-total strong {
    font-size: 15px;
  }

  .order-actions {
    flex-direction: column;

    padding: 12px 14px;
  }

  .details-button,
  .cancel-button {
    width: 100%;
  }

  .order-details {
    padding:
      0
      14px
      16px;
  }

  .order-item {
    align-items: flex-start;
  }

  .item-image {
    width: 52px;
    height: 52px;
  }

  .item-total {
    display: none;
  }

  .item-meta {
    flex-direction: column;
    gap: 3px;
  }

  .state-card {
    min-height: 250px;
  }
}
</style>
