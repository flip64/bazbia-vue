<template>
  <section class="checkout-card">
    <header class="checkout-card__header">
      <div>
        <span class="checkout-card__step">
          مرحله ۱
        </span>

        <h2>
          اطلاعات گیرنده
        </h2>

        <p>
          نام و شماره موبایل فرد دریافت‌کننده سفارش را بررسی کنید.
        </p>
      </div>
    </header>

    <form
      class="checkout-form"
      novalidate
      @submit.prevent="submitCustomerInformation"
    >
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
          :class="{
            'form-input--error': errors.fullName
          }"
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
          :class="{
            'form-input--error': errors.phone
          }"
          @input="handlePhoneInput"
        >

        <small
          v-if="errors.phone"
          class="form-error"
        >
          {{ errors.phone }}
        </small>
      </div>

      <div
        v-if="loadError"
        class="form-alert form-alert--error"
      >
        {{ loadError }}
      </div>

      <div class="checkout-actions">
        <router-link
          to="/cart"
          class="checkout-button checkout-button--secondary"
        >
          بازگشت به سبد خرید
        </router-link>

        <button
          type="submit"
          class="checkout-button checkout-button--primary"
          :disabled="isLoading"
        >
          <span v-if="isLoading">
            در حال دریافت اطلاعات
          </span>

          <span v-else>
            ادامه به آدرس
          </span>
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import {
  onMounted,
  reactive,
  ref
} from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/core/store/authStore'
import { useCheckoutStore } from '@/core/store/checkoutStore'

import type {
  CheckoutCustomer
} from '@/types/checkout.types'

type CustomerField =
  | 'fullName'
  | 'phone'

interface CustomerFormErrors {
  fullName: string
  phone: string
}

interface CheckoutAuthUser {
  username?: string
  first_name?: string
  last_name?: string
  full_name?: string
  name?: string
  phone?: string

  user?: {
    username?: string
    first_name?: string
    last_name?: string
  }

  customer?: {
    phone?: string
  }
}

const router = useRouter()
const authStore = useAuthStore()
const checkoutStore = useCheckoutStore()

const form = reactive<CheckoutCustomer>({
  fullName: '',
  phone: ''
})

const errors = reactive<CustomerFormErrors>({
  fullName: '',
  phone: ''
})

const isLoading = ref(false)
const loadError = ref('')

const convertDigitsToEnglish = (
  value: string
): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩'

  return value
    .replace(/[۰-۹]/g, digit => {
      return String(
        persianDigits.indexOf(digit)
      )
    })
    .replace(/[٠-٩]/g, digit => {
      return String(
        arabicDigits.indexOf(digit)
      )
    })
}

const keepOnlyDigits = (
  value: string | null | undefined
): string => {
  if (!value) {
    return ''
  }

  return convertDigitsToEnglish(
    String(value)
  ).replace(/\D/g, '')
}

const clearError = (
  field: CustomerField
): void => {
  errors[field] = ''
}

const handlePhoneInput = (): void => {
  form.phone = keepOnlyDigits(
    form.phone
  ).slice(0, 11)

  clearError('phone')
}

const fillFormFromCheckoutStore = (): void => {
  if (checkoutStore.customer.fullName) {
    form.fullName =
      checkoutStore.customer.fullName
  }

  if (checkoutStore.customer.phone) {
    form.phone =
      checkoutStore.customer.phone
  }
}

const fillFormFromAuthStore = (): void => {
  const user =
    authStore.user as CheckoutAuthUser | null

  if (!user) {
    return
  }

  const firstName =
    user.first_name ||
    user.user?.first_name ||
    ''

  const lastName =
    user.last_name ||
    user.user?.last_name ||
    ''

  const combinedName = [
    firstName,
    lastName
  ]
    .filter(Boolean)
    .join(' ')
    .trim()

  const fullName =
    user.full_name?.trim() ||
    user.name?.trim() ||
    combinedName

  const phone =
    user.phone ||
    user.customer?.phone ||
    user.user?.username ||
    user.username ||
    ''

  if (!form.fullName && fullName) {
    form.fullName = fullName
  }

  if (!form.phone && phone) {
    form.phone = keepOnlyDigits(
      phone
    ).slice(0, 11)
  }
}

const loadCustomerInformation =
  async (): Promise<void> => {
    isLoading.value = true
    loadError.value = ''

    try {
      checkoutStore.initialize()

      fillFormFromCheckoutStore()

      if (!authStore.user) {
        await authStore.checkAuth()
      }

      fillFormFromAuthStore()
    } catch (error) {
      console.error(
        'Customer information loading error:',
        error
      )

      loadError.value =
        'دریافت اطلاعات حساب کاربری انجام نشد. می‌توانید اطلاعات را دستی وارد کنید.'
    } finally {
      isLoading.value = false
    }
  }

const validateForm = (): boolean => {
  errors.fullName = ''
  errors.phone = ''

  let isValid = true

  if (form.fullName.trim().length < 3) {
    errors.fullName =
      'نام و نام خانوادگی را کامل وارد کنید.'

    isValid = false
  }

  const phone = keepOnlyDigits(
    form.phone
  )

  if (!/^09\d{9}$/.test(phone)) {
    errors.phone =
      'شماره موبایل باید با 09 شروع شود و ۱۱ رقم باشد.'

    isValid = false
  }

  return isValid
}

const submitCustomerInformation =
  async (): Promise<void> => {
    if (!validateForm()) {
      return
    }

    checkoutStore.setCustomer({
      fullName: form.fullName.trim(),
      phone: keepOnlyDigits(form.phone)
    })

    await router.push({
      name: 'checkout-address'
    })
  }

onMounted(async () => {
  await loadCustomerInformation()
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

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.35rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.45rem;
  color: #374151;
  font-size: 0.84rem;
  font-weight: 750;
}

.required {
  color: #dc2626;
}

.form-group input {
  width: 100%;
  padding: 0.82rem 0.9rem;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  outline: none;
  font-family: inherit;
  font-size: 0.9rem;
}

.form-group input:focus {
  border-color: #16a34a;
  box-shadow:
    0 0 0 3px rgba(22, 163, 74, 0.1);
}

.form-input--error {
  border-color: #dc2626 !important;
}

.form-error {
  display: block;
  margin-top: 0.4rem;
  color: #dc2626;
  font-size: 0.74rem;
}

.form-alert {
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-size: 0.8rem;
  line-height: 1.8;
}

.form-alert--error {
  color: #991b1b;
  border: 1px solid #fecaca;
  background: #fef2f2;
}

.checkout-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.checkout-button {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.checkout-button--primary {
  color: #ffffff;
  border: none;
  background: #16a34a;
}

.checkout-button--primary:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.checkout-button--secondary {
  color: #374151;
  border: 1px solid #d1d5db;
  background: #ffffff;
}

@media (max-width: 640px) {
  .checkout-actions {
    align-items: stretch;
    flex-direction: column-reverse;
  }

  .checkout-button {
    width: 100%;
  }
}
</style>
