<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <h1 class="checkout-title">تسویه حساب</h1>

      <div
        v-if="submitError"
        class="checkout-alert checkout-alert--error"
      >
        {{ submitError }}
      </div>

      <div class="checkout-content">
        <!-- فرم اطلاعات -->
        <form
          id="checkout-form"
          class="checkout-form"
          @submit.prevent="submitOrder"
        >
          <!-- اطلاعات ارسال -->
          <section class="form-section">
            <h2>اطلاعات ارسال</h2>

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
                placeholder="نام و نام خانوادگی"
                :class="{ 'input-error': errors.fullName }"
                @input="clearError('fullName')"
              >

              <small
                v-if="errors.fullName"
                class="error-message"
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
                v-model.trim="form.phone"
                type="tel"
                inputmode="numeric"
                autocomplete="tel"
                maxlength="11"
                dir="ltr"
                placeholder="09123456789"
                :class="{ 'input-error': errors.phone }"
                @input="handlePhoneInput"
              >

              <small
                v-if="errors.phone"
                class="error-message"
              >
                {{ errors.phone }}
              </small>
            </div>

            <div class="form-group">
              <label for="address">
                آدرس
                <span class="required">*</span>
              </label>

              <textarea
                id="address"
                v-model.trim="form.address"
                rows="4"
                autocomplete="street-address"
                placeholder="استان، شهر، خیابان، کوچه و پلاک"
                :class="{ 'input-error': errors.address }"
                @input="clearError('address')"
              />
              
              <small
                v-if="errors.address"
                class="error-message"
              >
                {{ errors.address }}
              </small>
            </div>

            <div class="form-row">
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
                  placeholder="شهر"
                  :class="{ 'input-error': errors.city }"
                  @input="clearError('city')"
                >

                <small
                  v-if="errors.city"
                  class="error-message"
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
                  v-model.trim="form.postalCode"
                  type="text"
                  inputmode="numeric"
                  autocomplete="postal-code"
                  maxlength="10"
                  dir="ltr"
                  placeholder="کد پستی ۱۰ رقمی"
                  :class="{ 'input-error': errors.postalCode }"
                  @input="handlePostalCodeInput"
                >

                <small
                  v-if="errors.postalCode"
                  class="error-message"
                >
                  {{ errors.postalCode }}
                </small>
              </div>
            </div>
          </section>

          <!-- روش ارسال -->
          <section class="form-section">
            <h2>روش ارسال</h2>

            <label
              class="select-option"
              :class="{ 'select-option--active': form.shipping === 'express' }"
            >
              <input
                v-model="form.shipping"
                type="radio"
                value="express"
              >

              <span class="option-content">
                <strong>ارسال اکسپرس</strong>
                <small>
                  تحویل تقریبی ۴۸ ساعته ـ
                  {{ formatPrice(EXPRESS_SHIPPING_COST) }} تومان
                </small>
              </span>
            </label>

            <label
              class="select-option"
              :class="{ 'select-option--active': form.shipping === 'normal' }"
            >
              <input
                v-model="form.shipping"
                type="radio"
                value="normal"
              >

              <span class="option-content">
                <strong>ارسال عادی</strong>
                <small>تحویل بین ۳ تا ۵ روز کاری ـ رایگان</small>
              </span>
            </label>
          </section>

          <!-- روش پرداخت -->
          <section class="form-section">
            <h2>روش پرداخت</h2>

            <label
              class="select-option"
              :class="{ 'select-option--active': form.payment === 'online' }"
            >
              <input
                v-model="form.payment"
                type="radio"
                value="online"
              >

              <span class="option-content">
                <strong>پرداخت آنلاین</strong>
                <small>پرداخت با کارت‌های عضو شبکه شتاب</small>
              </span>
            </label>

            <label
              class="select-option"
              :class="{ 'select-option--active': form.payment === 'cod' }"
            >
              <input
                v-model="form.payment"
                type="radio"
                value="cod"
              >

              <span class="option-content">
                <strong>پرداخت در محل</strong>
                <small>پرداخت هنگام تحویل سفارش</small>
              </span>
            </label>
          </section>
        </form>

        <!-- خلاصه سفارش -->
        <aside class="order-summary">
          <h2>خلاصه سفارش</h2>

          <div
            v-if="cartItems.length"
            class="summary-items"
          >
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="summary-item"
            >
              <div class="summary-item__info">
                <strong>{{ item.name }}</strong>
                <small>تعداد: {{ formatNumber(item.quantity) }}</small>
              </div>

              <span class="summary-item__price">
                {{ formatPrice(item.price * item.quantity) }}
                تومان
              </span>
            </div>
          </div>

          <div
            v-else
            class="empty-cart"
          >
            سبد خرید شما خالی است.
          </div>

          <div class="summary-divider" />

          <div class="summary-row">
            <span>جمع کالاها:</span>

            <span>
              {{ formatPrice(subtotal) }}
              تومان
            </span>
          </div>

          <div class="summary-row">
            <span>هزینه ارسال:</span>

            <span v-if="shippingCost">
              {{ formatPrice(shippingCost) }}
              تومان
            </span>

            <span
              v-else
              class="free-shipping"
            >
              رایگان
            </span>
          </div>

          <div class="summary-total">
            <span>مبلغ قابل پرداخت:</span>

            <span>
              {{ formatPrice(total) }}
              تومان
            </span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            class="payment-btn"
            :disabled="isSubmitting || cartItems.length === 0"
          >
            <span v-if="isSubmitting">
              در حال ثبت سفارش...
            </span>

            <span v-else>
              ثبت سفارش
            </span>
          </button>

          <p class="notice">
            با ثبت سفارش، شرایط و قوانین فروشگاه بازبیا را می‌پذیرم.
          </p>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CheckoutForm {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
  shipping: 'normal' | 'express'
  payment: 'online' | 'cod'
}

type FormField =
  | 'fullName'
  | 'phone'
  | 'address'
  | 'city'
  | 'postalCode'

type FormErrors = Record<FormField, string>

const router = useRouter()

/*
 * توجه:
 * قیمت‌ها در این نمونه بر اساس تومان در نظر گرفته شده‌اند.
 * در زمان اتصال به API باید واحد قیمت بک‌اند و فرانت یکسان شود.
 */
const EXPRESS_SHIPPING_COST = 50_000

const cartItems = ref<CartItem[]>([
  {
    id: 1,
    name: 'محصول ۱',
    price: 250_000,
    quantity: 2
  },
  {
    id: 2,
    name: 'محصول ۲',
    price: 350_000,
    quantity: 1
  }
])

const form = reactive<CheckoutForm>({
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  shipping: 'normal',
  payment: 'online'
})

const errors = reactive<FormErrors>({
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: ''
})

const isSubmitting = ref(false)
const submitError = ref('')

const subtotal = computed<number>(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity)
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

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('fa-IR').format(value)
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('fa-IR').format(value)
}

const convertPersianDigitsToEnglish = (value: string): string => {
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
  return convertPersianDigitsToEnglish(value).replace(/\D/g, '')
}

const handlePhoneInput = (): void => {
  form.phone = keepOnlyDigits(form.phone).slice(0, 11)
  clearError('phone')
}

const handlePostalCodeInput = (): void => {
  form.postalCode = keepOnlyDigits(form.postalCode).slice(0, 10)
  clearError('postalCode')
}

const clearError = (field: FormField): void => {
  errors[field] = ''
  submitError.value = ''
}

const resetErrors = (): void => {
  Object.keys(errors).forEach(key => {
    errors[key as FormField] = ''
  })

  submitError.value = ''
}

const validateForm = (): boolean => {
  resetErrors()

  let isValid = true

  if (form.fullName.trim().length < 3) {
    errors.fullName = 'نام و نام خانوادگی را کامل وارد کنید.'
    isValid = false
  }

  const normalizedPhone = keepOnlyDigits(form.phone)

  if (!/^09\d{9}$/.test(normalizedPhone)) {
    errors.phone = 'شماره موبایل باید با 09 شروع شود و ۱۱ رقم باشد.'
    isValid = false
  }

  if (form.address.trim().length < 10) {
    errors.address = 'آدرس کامل محل تحویل را وارد کنید.'
    isValid = false
  }

  if (form.city.trim().length < 2) {
    errors.city = 'نام شهر را وارد کنید.'
    isValid = false
  }

  const normalizedPostalCode = keepOnlyDigits(form.postalCode)

  if (!/^\d{10}$/.test(normalizedPostalCode)) {
    errors.postalCode = 'کد پستی باید ۱۰ رقم باشد.'
    isValid = false
  }

  return isValid
}

const submitOrder = async (): Promise<void> => {
  if (isSubmitting.value) {
    return
  }

  if (cartItems.value.length === 0) {
    submitError.value = 'سبد خرید شما خالی است.'
    return
  }

  if (!validateForm()) {
    submitError.value = 'لطفاً اطلاعات مشخص‌شده را اصلاح کنید.'
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
     * در مرحله بعد:
     *
     * const order = await orderService.createOrder(payload)
     *
     * اگر پرداخت آنلاین بود:
     * await paymentService.createPayment(order.id)
     *
     * اگر پرداخت در محل بود:
     * router.push(`/orders/${order.id}`)
     */

    alert('سفارش به‌صورت آزمایشی ثبت شد.')

    await router.push('/')
  } catch (error) {
    console.error('Submit order error:', error)

    submitError.value =
      'ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.checkout-page {
  min-height: 70vh;
  padding: 2rem;
  background: #f5f7f6;
  direction: rtl;
}

.checkout-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.checkout-title {
  margin: 0 0 2rem;
  color: #1f2937;
  font-size: 2rem;
  font-weight: 800;
}

.checkout-alert {
  margin-bottom: 1.25rem;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
}

.checkout-alert--error {
  color: #991b1b;
  border: 1px solid #fecaca;
  background: #fef2f2;
}

.checkout-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  align-items: start;
  gap: 2rem;
}

.checkout-form,
.order-summary {
  border: 1px solid #eef0ef;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
}

.checkout-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #edf0ee;
}

.form-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.form-section h2,
.order-summary h2 {
  margin: 0 0 1.5rem;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 750;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.92rem;
  font-weight: 600;
}

.required {
  color: #dc2626;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem 0.9rem;
  color: #1f2937;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  background: #ffffff;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.6;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
}

.form-group input.input-error,
.form-group textarea.input-error {
  border-color: #dc2626;
}

.form-group input.input-error:focus,
.form-group textarea.input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.error-message {
  display: block;
  margin-top: 0.4rem;
  color: #dc2626;
  font-size: 0.78rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.select-option {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 0.75rem;
  padding: 1rem;
  border: 1px solid #dfe3e1;
  border-radius: 10px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.select-option:last-child {
  margin-bottom: 0;
}

.select-option:hover {
  border-color: #86d49f;
  background: #f6fdf8;
}

.select-option--active {
  border-color: #16a34a;
  background: #f0fdf4;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.08);
}

.select-option input {
  width: 18px;
  height: 18px;
  margin-top: 0.15rem;
  accent-color: #16a34a;
  flex-shrink: 0;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.option-content strong {
  color: #1f2937;
  font-size: 0.95rem;
}

.option-content small {
  color: #6b7280;
  font-size: 0.84rem;
}

.order-summary {
  position: sticky;
  top: 1rem;
  height: fit-content;
  padding: 1.5rem;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.summary-item__info {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-item__info strong {
  overflow: hidden;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-item__info small {
  color: #6b7280;
  font-size: 0.8rem;
}

.summary-item__price {
  flex-shrink: 0;
  color: #374151;
  font-size: 0.88rem;
  font-weight: 600;
}

.empty-cart {
  padding: 1rem 0;
  color: #6b7280;
  text-align: center;
}

.summary-divider {
  height: 1px;
  margin: 1.25rem 0;
  background: #edf0ee;
}

.summary-row,
.summary-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.summary-row {
  margin-bottom: 0.75rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.free-shipping {
  color: #16a34a;
  font-weight: 700;
}

.summary-total {
  margin: 1.5rem 0;
  padding-top: 1.25rem;
  color: #1f2937;
  border-top: 2px solid #edf0ee;
  font-size: 1.05rem;
  font-weight: 800;
}

.summary-total span:last-child {
  color: #15803d;
}

.payment-btn {
  width: 100%;
  min-height: 50px;
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  background: #16a34a;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 750;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.payment-btn:hover:not(:disabled) {
  background: #15803d;
  transform: translateY(-1px);
}

.payment-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.notice {
  margin: 0;
  color: #9ca3af;
  font-size: 0.8rem;
  line-height: 1.7;
  text-align: center;
}

@media (max-width: 900px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .checkout-page {
    padding: 1rem;
  }

  .checkout-title {
    margin-bottom: 1.25rem;
    font-size: 1.6rem;
  }

  .checkout-form,
  .order-summary {
    padding: 1rem;
    border-radius: 12px;
  }

  .form-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .summary-item {
    gap: 0.5rem;
  }
}
</style>
