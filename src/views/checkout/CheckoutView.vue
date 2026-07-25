<template>
  <main class="checkout-page">
    <div class="checkout-container">
      <!-- عنوان صفحه -->
      <header class="checkout-header">
        <div>
          <span class="checkout-header__eyebrow">
            تکمیل فرایند خرید
          </span>

          <h1 class="checkout-title">
            تسویه حساب
          </h1>

          <p class="checkout-description">
            اطلاعات دریافت‌کننده و روش ارسال سفارش را بررسی و تکمیل کنید.
          </p>
        </div>

        <router-link
          to="/cart"
          class="back-to-cart"
        >
          بازگشت به سبد خرید
        </router-link>
      </header>

      <!-- مراحل خرید -->
      <div class="checkout-steps">
        <div class="checkout-step checkout-step--completed">
          <span class="checkout-step__number">۱</span>

          <div>
            <strong>سبد خرید</strong>
            <small>انتخاب محصولات</small>
          </div>
        </div>

        <span class="checkout-step__line" />

        <div class="checkout-step checkout-step--active">
          <span class="checkout-step__number">۲</span>

          <div>
            <strong>اطلاعات ارسال</strong>
            <small>آدرس و روش ارسال</small>
          </div>
        </div>

        <span class="checkout-step__line" />

        <div class="checkout-step">
          <span class="checkout-step__number">۳</span>

          <div>
            <strong>پرداخت</strong>
            <small>ثبت نهایی سفارش</small>
          </div>
        </div>
      </div>

      <!-- وضعیت دریافت سبد -->
      <section
        v-if="cartLoading"
        class="checkout-state"
      >
        <div class="checkout-loader" />

        <h2>در حال دریافت سبد خرید</h2>

        <p>
          لطفاً چند لحظه صبر کنید.
        </p>
      </section>

      <!-- خطای دریافت سبد -->
      <section
        v-else-if="cartError"
        class="checkout-state checkout-state--error"
      >
        <div class="checkout-state__icon">
          !
        </div>

        <h2>دریافت سبد خرید انجام نشد</h2>

        <p>
          {{ cartError }}
        </p>

        <button
          type="button"
          class="retry-button"
          @click="loadCart"
        >
          تلاش دوباره
        </button>
      </section>

      <!-- سبد خالی -->
      <section
        v-else-if="isCartEmpty"
        class="checkout-state"
      >
        <div class="checkout-state__icon checkout-state__icon--empty">
          س
        </div>

        <h2>سبد خرید شما خالی است</h2>

        <p>
          برای ادامه خرید ابتدا یک محصول به سبد خرید اضافه کنید.
        </p>

        <router-link
          to="/products"
          class="products-button"
        >
          مشاهده محصولات
        </router-link>
      </section>

      <!-- محتوای اصلی -->
      <div
        v-else
        class="checkout-content"
      >
        <!-- فرم Checkout -->
        <form
          id="checkout-form"
          class="checkout-form"
          novalidate
          @submit.prevent="submitOrder"
        >
          <!-- خطای عمومی فرم -->
          <div
            v-if="submitError"
            class="form-alert form-alert--error"
          >
            {{ submitError }}
          </div>

          <!-- اطلاعات گیرنده -->
          <section class="checkout-card">
            <header class="checkout-card__header">
              <span class="checkout-card__number">۱</span>

              <div>
                <h2>اطلاعات گیرنده</h2>

                <p>
                  مشخصات فردی که سفارش را تحویل می‌گیرد.
                </p>
              </div>
            </header>

            <div class="checkout-card__body">
              <div class="form-grid">
                <div class="form-group">
                  <label for="full-name">
                    نام و نام خانوادگی
                    <span class="required">*</span>
                  </label>

                  <input
                    id="full-name"
                    v-model.trim="form.fullName"
                    type="text"
                    autocomplete="name"
                    placeholder="مثلاً جعفر محمدی"
                    :class="{ 'form-input--error': errors.fullName }"
                    @input="clearError('fullName')"
                  >

                  <small
                    v-if="errors.fullName"
                    class="form-error"
                  >
                    {{ errors.fullName }}
                  </small>
                </div>

                <div class="form-group">
                  <label for="phone">
                    شماره موبایل
                    <span class="required">*</span>
                  </label>

                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    inputmode="numeric"
                    autocomplete="tel"
                    maxlength="11"
                    dir="ltr"
                    placeholder="09123456789"
                    :class="{ 'form-input--error': errors.phone }"
                    @input="handlePhoneInput"
                  >

                  <small
                    v-if="errors.phone"
                    class="form-error"
                  >
                    {{ errors.phone }}
                  </small>
                </div>
              </div>
            </div>
          </section>

          <!-- آدرس ارسال -->
          <section class="checkout-card">
            <header class="checkout-card__header">
              <span class="checkout-card__number">۲</span>

              <div>
                <h2>آدرس ارسال</h2>

                <p>
                  نشانی دقیق محل تحویل سفارش را وارد کنید.
                </p>
              </div>
            </header>

            <div class="checkout-card__body">
              <div class="form-group">
                <label for="address">
                  آدرس کامل
                  <span class="required">*</span>
                </label>

                <textarea
                  id="address"
                  v-model.trim="form.address"
                  rows="4"
                  autocomplete="street-address"
                  placeholder="استان، شهر، خیابان، کوچه، پلاک و واحد"
                  :class="{ 'form-input--error': errors.address }"
                  @input="clearError('address')"
                />

                <small
                  v-if="errors.address"
                  class="form-error"
                >
                  {{ errors.address }}
                </small>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="city">
                    شهر
                    <span class="required">*</span>
                  </label>

                  <input
                    id="city"
                    v-model.trim="form.city"
                    type="text"
                    autocomplete="address-level2"
                    placeholder="نام شهر"
                    :class="{ 'form-input--error': errors.city }"
                    @input="clearError('city')"
                  >

                  <small
                    v-if="errors.city"
                    class="form-error"
                  >
                    {{ errors.city }}
                  </small>
                </div>

                <div class="form-group">
                  <label for="postal-code">
                    کد پستی
                    <span class="required">*</span>
                  </label>

                  <input
                    id="postal-code"
                    v-model="form.postalCode"
                    type="text"
                    inputmode="numeric"
                    autocomplete="postal-code"
                    maxlength="10"
                    dir="ltr"
                    placeholder="کد پستی ۱۰ رقمی"
                    :class="{ 'form-input--error': errors.postalCode }"
                    @input="handlePostalCodeInput"
                  >

                  <small
                    v-if="errors.postalCode"
                    class="form-error"
                  >
                    {{ errors.postalCode }}
                  </small>
                </div>
              </div>
            </div>
          </section>

          <!-- روش ارسال -->
          <section class="checkout-card">
            <header class="checkout-card__header">
              <span class="checkout-card__number">۳</span>

              <div>
                <h2>روش ارسال</h2>

                <p>
                  روش مناسب برای دریافت سفارش را انتخاب کنید.
                </p>
              </div>
            </header>

            <div class="checkout-card__body">
              <div class="options-list">
                <label
                  class="select-option"
                  :class="{
                    'select-option--active':
                      form.shipping === 'normal'
                  }"
                >
                  <input
                    v-model="form.shipping"
                    type="radio"
                    value="normal"
                  >

                  <span class="select-option__indicator" />

                  <span class="select-option__content">
                    <span class="select-option__title">
                      ارسال عادی
                    </span>

                    <span class="select-option__description">
                      تحویل تقریبی بین ۳ تا ۵ روز کاری
                    </span>
                  </span>

                  <span class="select-option__price">
                    رایگان
                  </span>
                </label>

                <label
                  class="select-option"
                  :class="{
                    'select-option--active':
                      form.shipping === 'express'
                  }"
                >
                  <input
                    v-model="form.shipping"
                    type="radio"
                    value="express"
                  >

                  <span class="select-option__indicator" />

                  <span class="select-option__content">
                    <span class="select-option__title">
                      ارسال اکسپرس
                    </span>

                    <span class="select-option__description">
                      تحویل تقریبی تا ۴۸ ساعت
                    </span>
                  </span>

                  <span class="select-option__price">
                    {{ formatPrice(EXPRESS_SHIPPING_COST) }}
                    تومان
                  </span>
                </label>
              </div>

              <p class="shipping-notice">
                هزینه و زمان نهایی ارسال پس از بررسی نشانی سفارش
                توسط فروشگاه تأیید می‌شود.
              </p>
            </div>
          </section>

          <!-- روش پرداخت -->
          <section class="checkout-card">
            <header class="checkout-card__header">
              <span class="checkout-card__number">۴</span>

              <div>
                <h2>روش پرداخت</h2>

                <p>
                  روش موردنظر برای پرداخت سفارش را انتخاب کنید.
                </p>
              </div>
            </header>

            <div class="checkout-card__body">
              <div class="options-list">
                <label
                  class="select-option"
                  :class="{
                    'select-option--active':
                      form.payment === 'online'
                  }"
                >
                  <input
                    v-model="form.payment"
                    type="radio"
                    value="online"
                  >

                  <span class="select-option__indicator" />

                  <span class="select-option__content">
                    <span class="select-option__title">
                      پرداخت آنلاین
                    </span>

                    <span class="select-option__description">
                      پرداخت امن با کارت‌های عضو شبکه شتاب
                    </span>
                  </span>

                  <span class="select-option__badge">
                    پیشنهادی
                  </span>
                </label>

                <label
                  class="select-option"
                  :class="{
                    'select-option--active':
                      form.payment === 'cod'
                  }"
                >
                  <input
                    v-model="form.payment"
                    type="radio"
                    value="cod"
                  >

                  <span class="select-option__indicator" />

                  <span class="select-option__content">
                    <span class="select-option__title">
                      پرداخت در محل
                    </span>

                    <span class="select-option__description">
                      پرداخت مبلغ سفارش هنگام تحویل
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </section>
        </form>

        <!-- خلاصه سفارش -->
        <aside class="order-summary">
          <header class="order-summary__header">
            <div>
              <h2>خلاصه سفارش</h2>

              <p>
                {{ formatNumber(totalItems) }}
                کالا در سبد خرید
              </p>
            </div>

            <router-link to="/cart">
              ویرایش
            </router-link>
          </header>

          <div class="order-summary__items">
            <article
              v-for="item in cartItems"
              :key="item.id"
              class="summary-item"
            >
              <div class="summary-item__image">
                <img
                  v-if="getItemImage(item)"
                  :src="getItemImage(item)"
                  :alt="getItemName(item)"
                  loading="lazy"
                  @error="handleImageError"
                >

                <span v-else>
                  بازبیا
                </span>

                <span class="summary-item__quantity-badge">
                  {{ formatNumber(item.quantity) }}
                </span>
              </div>

              <div class="summary-item__content">
                <h3>
                  {{ getItemName(item) }}
                </h3>

                <p v-if="getItemVariant(item)">
                  {{ getItemVariant(item) }}
                </p>

                <span>
                  {{ formatPrice(getItemTotal(item)) }}
                  تومان
                </span>
              </div>
            </article>
          </div>

          <div class="order-summary__divider" />

          <div class="price-row">
            <span>جمع کالاها</span>

            <strong>
              {{ formatPrice(subtotal) }}
              تومان
            </strong>
          </div>

          <div class="price-row">
            <span>هزینه ارسال</span>

            <strong
              v-if="shippingCost > 0"
            >
              {{ formatPrice(shippingCost) }}
              تومان
            </strong>

            <strong
              v-else
              class="price-row__free"
            >
              رایگان
            </strong>
          </div>

          <div class="order-summary__divider" />

          <div class="final-price">
            <div>
              <span>مبلغ قابل پرداخت</span>

              <small>
                شامل هزینه ارسال
              </small>
            </div>

            <strong>
              {{ formatPrice(total) }}
              <span>تومان</span>
            </strong>
          </div>

          <button
            type="submit"
            form="checkout-form"
            class="submit-order-button"
            :disabled="isSubmitting || isCartEmpty"
          >
            <span
              v-if="isSubmitting"
              class="submit-order-button__loading"
            >
              <span class="button-loader" />
              در حال ثبت سفارش
            </span>

            <span v-else>
              ثبت سفارش و ادامه
            </span>
          </button>

          <p class="order-summary__notice">
            با ثبت سفارش، قوانین و شرایط استفاده از فروشگاه
            اینترنتی بازبیا را می‌پذیرم.
          </p>

          <div class="order-summary__trust">
            <span>
              خرید امن
            </span>

            <span>
              تضمین اصالت
            </span>

            <span>
              پشتیبانی بازبیا
            </span>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'
import { useRouter } from 'vue-router'

import { useCartStore } from '@/core/store/cartStore'

type ShippingMethod = 'normal' | 'express'
type PaymentMethod = 'online' | 'cod'

type FormField =
  | 'fullName'
  | 'phone'
  | 'address'
  | 'city'
  | 'postalCode'

interface CheckoutForm {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
  shipping: ShippingMethod
  payment: PaymentMethod
}

interface CheckoutErrors {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
}

interface CheckoutCartItem {
  id: number
  quantity: number
  price?: number | string
  total_price?: number | string
  product_name?: string
  variant_name?: string
  name?: string
  image?: string | null
  product_image?: string | null
  variant_image?: string | null
}

const EXPRESS_SHIPPING_COST = 50_000

const router = useRouter()
const cartStore = useCartStore()

const form = reactive<CheckoutForm>({
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  shipping: 'normal',
  payment: 'online'
})

const errors = reactive<CheckoutErrors>({
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: ''
})

const isSubmitting = ref(false)
const submitError = ref('')

const cartItems = computed<CheckoutCartItem[]>(() => {
  return (cartStore.items || []) as CheckoutCartItem[]
})

const cartLoading = computed<boolean>(() => {
  return Boolean(cartStore.loading)
})

const cartError = computed<string>(() => {
  return cartStore.error || ''
})

const isCartEmpty = computed<boolean>(() => {
  return cartItems.value.length === 0
})

const totalItems = computed<number>(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + Number(item.quantity || 0)
  }, 0)
})

const subtotal = computed<number>(() => {
  const storeTotal = Number(cartStore.totalPrice)

  if (Number.isFinite(storeTotal) && storeTotal > 0) {
    return storeTotal
  }

  return cartItems.value.reduce((sum, item) => {
    return sum + getItemTotal(item)
  }, 0)
})

const shippingCost = computed<number>(() => {
  return form.shipping === 'express'
    ? EXPRESS_SHIPPING_COST
    : 0
})

const total = computed<number>(() => {
  return subtotal.value + shippingCost.value
})

const toNumber = (
  value: number | string | null | undefined
): number => {
  const parsedValue = Number(value)

  return Number.isFinite(parsedValue)
    ? parsedValue
    : 0
}

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('fa-IR').format(
    toNumber(value)
  )
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('fa-IR').format(
    toNumber(value)
  )
}

const convertDigitsToEnglish = (value: string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩'

  return value
    .replace(/[۰-۹]/g, digit => {
      return String(persianDigits.indexOf(digit))
    })
    .replace(/[٠-٩]/g, digit => {
      return String(arabicDigits.indexOf(digit))
    })
}

const keepOnlyDigits = (value: string): string => {
  return convertDigitsToEnglish(value).replace(/\D/g, '')
}

const getItemName = (item: CheckoutCartItem): string => {
  return (
    item.product_name ||
    item.name ||
    item.variant_name ||
    'محصول بازبیا'
  )
}

const getItemVariant = (item: CheckoutCartItem): string => {
  if (
    item.variant_name &&
    item.variant_name !== item.product_name
  ) {
    return item.variant_name
  }

  return ''
}

const getItemImage = (
  item: CheckoutCartItem
): string | null => {
  return (
    item.image ||
    item.variant_image ||
    item.product_image ||
    null
  )
}

const getItemTotal = (item: CheckoutCartItem): number => {
  const totalPrice = toNumber(item.total_price)

  if (totalPrice > 0) {
    return totalPrice
  }

  return toNumber(item.price) * toNumber(item.quantity)
}

const handleImageError = (event: Event): void => {
  const image = event.target as HTMLImageElement
  image.style.display = 'none'
}

const clearError = (field: FormField): void => {
  errors[field] = ''
  submitError.value = ''
}

const clearErrors = (): void => {
  errors.fullName = ''
  errors.phone = ''
  errors.address = ''
  errors.city = ''
  errors.postalCode = ''
  submitError.value = ''
}

const handlePhoneInput = (): void => {
  form.phone = keepOnlyDigits(form.phone).slice(0, 11)
  clearError('phone')
}

const handlePostalCodeInput = (): void => {
  form.postalCode = keepOnlyDigits(
    form.postalCode
  ).slice(0, 10)

  clearError('postalCode')
}

const validateForm = (): boolean => {
  clearErrors()

  let isValid = true

  if (form.fullName.trim().length < 3) {
    errors.fullName =
      'نام و نام خانوادگی را کامل وارد کنید.'

    isValid = false
  }

  const phone = keepOnlyDigits(form.phone)

  if (!/^09\d{9}$/.test(phone)) {
    errors.phone =
      'شماره موبایل باید با 09 شروع شود و ۱۱ رقم باشد.'

    isValid = false
  }

  if (form.address.trim().length < 10) {
    errors.address =
      'آدرس کامل محل تحویل سفارش را وارد کنید.'

    isValid = false
  }

  if (form.city.trim().length < 2) {
    errors.city = 'نام شهر را وارد کنید.'
    isValid = false
  }

  const postalCode = keepOnlyDigits(form.postalCode)

  if (!/^\d{10}$/.test(postalCode)) {
    errors.postalCode =
      'کد پستی باید دقیقاً ۱۰ رقم باشد.'

    isValid = false
  }

  return isValid
}

const focusFirstError = (): void => {
  const firstErrorField = Object.keys(errors).find(key => {
    return Boolean(errors[key as FormField])
  })

  if (!firstErrorField) {
    return
  }

  const elementIds: Record<FormField, string> = {
    fullName: 'full-name',
    phone: 'phone',
    address: 'address',
    city: 'city',
    postalCode: 'postal-code'
  }

  const element = document.getElementById(
    elementIds[firstErrorField as FormField]
  )

  element?.focus()
  element?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
}

const loadCart = async (): Promise<void> => {
  try {
    await cartStore.fetchCart()
  } catch (error) {
    console.error(
      'Checkout cart loading error:',
      error
    )
  }
}

const submitOrder = async (): Promise<void> => {
  if (isSubmitting.value) {
    return
  }

  if (isCartEmpty.value) {
    submitError.value = 'سبد خرید شما خالی است.'
    return
  }

  if (!validateForm()) {
    submitError.value =
      'لطفاً اطلاعات مشخص‌شده را اصلاح کنید.'

    focusFirstError()
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  try {
    const payload = {
      full_name: form.fullName.trim(),
      phone: keepOnlyDigits(form.phone),
      address: form.address.trim(),
      city: form.city.trim(),
      postal_code: keepOnlyDigits(form.postalCode),
      shipping_method: form.shipping,
      payment_method: form.payment
    }

    console.log('Checkout payload:', payload)

    /*
     * مرحله بعد:
     *
     * const order = await orderService.createOrder(payload)
     *
     * if (form.payment === 'online') {
     *   window.location.href = order.payment_url
     *   return
     * }
     *
     * await cartStore.fetchCart()
     *
     * await router.push({
     *   name: 'order-detail',
     *   params: {
     *     id: order.id
     *   }
     * })
     */

    window.alert(
      'اطلاعات Checkout با موفقیت بررسی شد. اتصال ثبت سفارش به API در مرحله بعد انجام می‌شود.'
    )
  } catch (error) {
    console.error('Submit order error:', error)

    submitError.value =
      'ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await loadCart()
})
</script>

<style scoped>
.checkout-page {
  --checkout-primary: #16a34a;
  --checkout-primary-dark: #15803d;
  --checkout-primary-soft: #f0fdf4;
  --checkout-primary-border: #bbf7d0;
  --checkout-text: #1f2937;
  --checkout-text-soft: #6b7280;
  --checkout-border: #e5e7eb;
  --checkout-background: #f6f8f7;
  --checkout-card: #ffffff;
  --checkout-danger: #dc2626;

  min-height: 75vh;
  padding: 2rem 1rem 4rem;
  color: var(--checkout-text);
  background:
    radial-gradient(
      circle at top right,
      rgba(22, 163, 74, 0.07),
      transparent 28rem
    ),
    var(--checkout-background);
  direction: rtl;
}

.checkout-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

/* Header */

.checkout-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.75rem;
}

.checkout-header__eyebrow {
  display: block;
  margin-bottom: 0.4rem;
  color: var(--checkout-primary-dark);
  font-size: 0.82rem;
  font-weight: 800;
}

.checkout-title {
  margin: 0;
  color: #111827;
  font-size: clamp(1.7rem, 4vw, 2.35rem);
  font-weight: 900;
  line-height: 1.3;
}

.checkout-description {
  margin: 0.5rem 0 0;
  color: var(--checkout-text-soft);
  font-size: 0.93rem;
  line-height: 1.8;
}

.back-to-cart {
  flex-shrink: 0;
  padding: 0.72rem 1rem;
  color: var(--checkout-primary-dark);
  border: 1px solid var(--checkout-primary-border);
  border-radius: 10px;
  background: var(--checkout-primary-soft);
  font-size: 0.88rem;
  font-weight: 750;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.back-to-cart:hover {
  border-color: #86efac;
  background: #dcfce7;
}

/* Steps */

.checkout-steps {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.1rem 1.25rem;
  border: 1px solid #edf0ee;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 5px 20px rgba(15, 23, 42, 0.04);
}

.checkout-step {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
  color: #9ca3af;
}

.checkout-step__number {
  display: grid;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  background: #ffffff;
  font-size: 0.82rem;
  font-weight: 800;
}

.checkout-step strong,
.checkout-step small {
  display: block;
}

.checkout-step strong {
  color: inherit;
  font-size: 0.86rem;
}

.checkout-step small {
  margin-top: 0.15rem;
  color: #9ca3af;
  font-size: 0.7rem;
}

.checkout-step--completed,
.checkout-step--active {
  color: var(--checkout-primary-dark);
}

.checkout-step--completed .checkout-step__number,
.checkout-step--active .checkout-step__number {
  color: #ffffff;
  border-color: var(--checkout-primary);
  background: var(--checkout-primary);
}

.checkout-step--active strong {
  color: #111827;
}

.checkout-step__line {
  height: 1px;
  min-width: 2rem;
  flex: 1;
  margin: 0 1rem;
  background: #e5e7eb;
}

/* Main content */

.checkout-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  align-items: start;
  gap: 1.75rem;
}

.checkout-form {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1.25rem;
}

.checkout-card,
.order-summary {
  border: 1px solid #e9ecea;
  border-radius: 16px;
  background: var(--checkout-card);
  box-shadow: 0 5px 22px rgba(15, 23, 42, 0.045);
}

.checkout-card {
  overflow: hidden;
}

.checkout-card__header {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1.25rem 1.35rem;
  border-bottom: 1px solid #eff1f0;
  background: #fcfdfc;
}

.checkout-card__number {
  display: grid;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  place-items: center;
  color: var(--checkout-primary-dark);
  border: 1px solid var(--checkout-primary-border);
  border-radius: 10px;
  background: var(--checkout-primary-soft);
  font-size: 0.85rem;
  font-weight: 900;
}

.checkout-card__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.05rem;
  font-weight: 850;
}

.checkout-card__header p {
  margin: 0.25rem 0 0;
  color: var(--checkout-text-soft);
  font-size: 0.79rem;
  line-height: 1.7;
}

.checkout-card__body {
  padding: 1.35rem;
}

/* Forms */

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-group {
  min-width: 0;
  margin-bottom: 1.15rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.84rem;
  font-weight: 750;
}

.required {
  color: var(--checkout-danger);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.82rem 0.9rem;
  color: #111827;
  border: 1px solid #d8ddda;
  border-radius: 10px;
  outline: none;
  background: #ffffff;
  font-family: inherit;
  font-size: 0.91rem;
  line-height: 1.65;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.form-group textarea {
  min-height: 110px;
  resize: vertical;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #a3aaa6;
}

.form-group input:hover,
.form-group textarea:hover {
  border-color: #b8c0bb;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--checkout-primary);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.11);
}

.form-group .form-input--error {
  border-color: var(--checkout-danger);
}

.form-group .form-input--error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.09);
}

.form-error {
  display: block;
  margin-top: 0.4rem;
  color: var(--checkout-danger);
  font-size: 0.74rem;
  line-height: 1.6;
}

.form-alert {
  padding: 0.9rem 1rem;
  border-radius: 11px;
  font-size: 0.85rem;
  line-height: 1.8;
}

.form-alert--error {
  color: #991b1b;
  border: 1px solid #fecaca;
  background: #fef2f2;
}

/* Options */

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.select-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-height: 74px;
  padding: 0.9rem 1rem;
  border: 1px solid #dfe3e1;
  border-radius: 12px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.select-option:hover {
  border-color: #86d49f;
  background: #fbfefc;
}

.select-option--active {
  border-color: var(--checkout-primary);
  background: var(--checkout-primary-soft);
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.07);
}

.select-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.select-option__indicator {
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: 2px solid #c7ceca;
  border-radius: 50%;
  background: #ffffff;
}

.select-option--active .select-option__indicator {
  border-color: var(--checkout-primary);
}

.select-option--active .select-option__indicator::after {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: var(--checkout-primary);
  content: "";
}

.select-option__content {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
}

.select-option__title {
  color: #1f2937;
  font-size: 0.9rem;
  font-weight: 800;
}

.select-option__description {
  color: var(--checkout-text-soft);
  font-size: 0.76rem;
  line-height: 1.6;
}

.select-option__price {
  flex-shrink: 0;
  color: var(--checkout-primary-dark);
  font-size: 0.81rem;
  font-weight: 850;
}

.select-option__badge {
  flex-shrink: 0;
  padding: 0.25rem 0.5rem;
  color: var(--checkout-primary-dark);
  border-radius: 999px;
  background: #dcfce7;
  font-size: 0.68rem;
  font-weight: 800;
}

.shipping-notice {
  margin: 0.9rem 0 0;
  padding: 0.75rem 0.85rem;
  color: #647067;
  border-radius: 9px;
  background: #f8faf9;
  font-size: 0.74rem;
  line-height: 1.8;
}

/* Order summary */

.order-summary {
  position: sticky;
  top: 1rem;
  overflow: hidden;
  padding: 1.25rem;
}

.order-summary__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.order-summary__header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.08rem;
  font-weight: 900;
}

.order-summary__header p {
  margin: 0.25rem 0 0;
  color: var(--checkout-text-soft);
  font-size: 0.76rem;
}

.order-summary__header a {
  color: var(--checkout-primary-dark);
  font-size: 0.76rem;
  font-weight: 800;
  text-decoration: none;
}

.order-summary__items {
  display: flex;
  max-height: 320px;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  scrollbar-width: thin;
}

.summary-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.summary-item__image {
  position: relative;
  display: grid;
  width: 62px;
  height: 62px;
  flex-shrink: 0;
  place-items: center;
  overflow: visible;
  color: var(--checkout-primary-dark);
  border: 1px solid #e5e9e6;
  border-radius: 11px;
  background: #f7faf8;
  font-size: 0.65rem;
  font-weight: 900;
}

.summary-item__image img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: contain;
}

.summary-item__quantity-badge {
  position: absolute;
  top: -7px;
  left: -7px;
  display: grid;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  place-items: center;
  color: #ffffff;
  border: 2px solid #ffffff;
  border-radius: 999px;
  background: #4b5563;
  font-size: 0.67rem;
  font-weight: 850;
}

.summary-item__content {
  min-width: 0;
  flex: 1;
}

.summary-item__content h3 {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: #374151;
  font-size: 0.82rem;
  font-weight: 750;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.summary-item__content p {
  margin: 0.12rem 0 0;
  overflow: hidden;
  color: #8a938e;
  font-size: 0.7rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-item__content > span {
  display: block;
  margin-top: 0.3rem;
  color: #374151;
  font-size: 0.77rem;
  font-weight: 800;
}

.order-summary__divider {
  height: 1px;
  margin: 1.2rem 0;
  background: #ecefed;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
  color: var(--checkout-text-soft);
  font-size: 0.82rem;
}

.price-row:last-of-type {
  margin-bottom: 0;
}

.price-row strong {
  color: #374151;
  font-size: 0.82rem;
}

.price-row .price-row__free {
  color: var(--checkout-primary-dark);
}

.final-price {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.final-price > div {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
}

.final-price > div span {
  color: #1f2937;
  font-size: 0.91rem;
  font-weight: 850;
}

.final-price small {
  color: #9ca3af;
  font-size: 0.66rem;
}

.final-price > strong {
  color: var(--checkout-primary-dark);
  font-size: 1.22rem;
  font-weight: 950;
  white-space: nowrap;
}

.final-price > strong span {
  font-size: 0.72rem;
  font-weight: 750;
}

.submit-order-button {
  width: 100%;
  min-height: 51px;
  padding: 0.85rem 1rem;
  color: #ffffff;
  border: none;
  border-radius: 11px;
  background:
    linear-gradient(
      135deg,
      var(--checkout-primary),
      #059669
    );
  box-shadow: 0 8px 18px rgba(22, 163, 74, 0.2);
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 850;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.submit-order-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(22, 163, 74, 0.26);
}

.submit-order-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.submit-order-button__loading {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.button-loader {
  width: 17px;
  height: 17px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: checkout-spin 0.8s linear infinite;
}

.order-summary__notice {
  margin: 0.85rem 0 0;
  color: #8a938e;
  font-size: 0.7rem;
  line-height: 1.8;
  text-align: center;
}

.order-summary__trust {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.45rem 0.75rem;
  margin-top: 1rem;
  padding-top: 0.9rem;
  color: #718078;
  border-top: 1px dashed #dfe4e1;
  font-size: 0.67rem;
}

.order-summary__trust span::before {
  margin-left: 0.3rem;
  color: var(--checkout-primary);
  content: "✓";
  font-weight: 900;
}

/* States */

.checkout-state {
  display: flex;
  min-height: 320px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 2rem;
  border: 1px solid #e6ebe8;
  border-radius: 16px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 5px 22px rgba(15, 23, 42, 0.04);
}

.checkout-state h2 {
  margin: 1rem 0 0.35rem;
  color: #1f2937;
  font-size: 1.15rem;
}

.checkout-state p {
  max-width: 420px;
  margin: 0;
  color: var(--checkout-text-soft);
  font-size: 0.84rem;
  line-height: 1.8;
}

.checkout-state__icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  color: #b91c1c;
  border-radius: 16px;
  background: #fee2e2;
  font-size: 1.4rem;
  font-weight: 900;
}

.checkout-state__icon--empty {
  color: var(--checkout-primary-dark);
  background: var(--checkout-primary-soft);
}

.checkout-loader {
  width: 42px;
  height: 42px;
  border: 4px solid #dcfce7;
  border-top-color: var(--checkout-primary);
  border-radius: 50%;
  animation: checkout-spin 0.8s linear infinite;
}

.retry-button,
.products-button {
  margin-top: 1.2rem;
  padding: 0.72rem 1.1rem;
  color: #ffffff;
  border: none;
  border-radius: 9px;
  background: var(--checkout-primary);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
}

.checkout-state--error .retry-button {
  background: #dc2626;
}

@keyframes checkout-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Tablet */

@media (max-width: 960px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
    order: 2;
  }
}

/* Mobile */

@media (max-width: 640px) {
  .checkout-page {
    padding: 1.25rem 0.75rem 3rem;
  }

  .checkout-header {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 1.25rem;
  }

  .back-to-cart {
    padding: 0;
    border: none;
    background: transparent;
  }

  .checkout-description {
    font-size: 0.82rem;
  }

  .checkout-steps {
    overflow-x: auto;
    padding: 0.9rem;
  }

  .checkout-step {
    min-width: max-content;
  }

  .checkout-step small {
    display: none;
  }

  .checkout-step__line {
    min-width: 1.5rem;
    margin: 0 0.65rem;
  }

  .checkout-content,
  .checkout-form {
    gap: 1rem;
  }

  .checkout-card,
  .order-summary {
    border-radius: 13px;
  }

  .checkout-card__header,
  .checkout-card__body {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .select-option {
    align-items: flex-start;
    min-height: auto;
    padding: 0.85rem;
  }

  .select-option__price,
  .select-option__badge {
    margin-right: auto;
  }

  .order-summary {
    padding: 1rem;
  }

  .final-price > strong {
    font-size: 1.05rem;
  }
}
</style>
