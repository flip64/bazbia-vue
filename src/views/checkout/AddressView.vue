<template>
  <section class="checkout-card">
    <header class="checkout-card__header">
      <div>
        <span class="checkout-card__step">
          مرحله ۲
        </span>

        <h2>
          آدرس ارسال
        </h2>

        <p>
          نشانی دقیق محل تحویل سفارش را وارد و بررسی کنید.
        </p>
      </div>
    </header>

    <form
      class="checkout-form"
      novalidate
      @submit.prevent="submitAddress"
    >
      <div class="form-grid">
        <div class="form-group">
          <label for="province">
            استان
            <span class="required">*</span>
          </label>

          <input
            id="province"
            v-model.trim="form.province"
            type="text"
            autocomplete="address-level1"
            placeholder="مثلاً تهران"
            :class="{
              'form-input--error': errors.province
            }"
            @input="clearError('province')"
          >

          <small
            v-if="errors.province"
            class="form-error"
          >
            {{ errors.province }}
          </small>
        </div>

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
            placeholder="مثلاً شهر قدس"
            :class="{
              'form-input--error': errors.city
            }"
            @input="clearError('city')"
          >

          <small
            v-if="errors.city"
            class="form-error"
          >
            {{ errors.city }}
          </small>
        </div>
      </div>

      <div class="form-group">
        <label for="full-address">
          نشانی کامل
          <span class="required">*</span>
        </label>

        <textarea
          id="full-address"
          v-model.trim="form.fullAddress"
          rows="5"
          autocomplete="street-address"
          placeholder="خیابان، کوچه، پلاک، واحد و توضیحات لازم برای تحویل"
          :class="{
            'form-input--error': errors.fullAddress
          }"
          @input="clearError('fullAddress')"
        />

        <small
          v-if="errors.fullAddress"
          class="form-error"
        >
          {{ errors.fullAddress }}
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
          :class="{
            'form-input--error': errors.postalCode
          }"
          @input="handlePostalCodeInput"
        >

        <small
          v-if="errors.postalCode"
          class="form-error"
        >
          {{ errors.postalCode }}
        </small>
      </div>

      <div
        v-if="submitError"
        class="form-alert form-alert--error"
      >
        {{ submitError }}
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
          type="submit"
          class="checkout-button checkout-button--primary"
        >
          ادامه به روش ارسال
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

import { useCheckoutStore } from '@/core/store/checkoutStore'

import type {
  CheckoutAddress
} from '@/types/checkout.types'

type AddressField =
  | 'province'
  | 'city'
  | 'fullAddress'
  | 'postalCode'

interface AddressErrors {
  province: string
  city: string
  fullAddress: string
  postalCode: string
}

const router = useRouter()
const checkoutStore = useCheckoutStore()

const form = reactive<CheckoutAddress>({
  addressId: null,
  province: '',
  city: '',
  fullAddress: '',
  postalCode: ''
})

const errors = reactive<AddressErrors>({
  province: '',
  city: '',
  fullAddress: '',
  postalCode: ''
})

const submitError = ref('')

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
  field: AddressField
): void => {
  errors[field] = ''
  submitError.value = ''
}

const clearErrors = (): void => {
  errors.province = ''
  errors.city = ''
  errors.fullAddress = ''
  errors.postalCode = ''
  submitError.value = ''
}

const handlePostalCodeInput = (): void => {
  form.postalCode = keepOnlyDigits(
    form.postalCode
  ).slice(0, 10)

  clearError('postalCode')
}

const fillFormFromStore = (): void => {
  const savedAddress =
    checkoutStore.address

  form.addressId =
    savedAddress.addressId

  form.province =
    savedAddress.province

  form.city =
    savedAddress.city

  form.fullAddress =
    savedAddress.fullAddress

  form.postalCode =
    savedAddress.postalCode
}

const validateForm = (): boolean => {
  clearErrors()

  let isValid = true

  if (form.province.trim().length < 2) {
    errors.province =
      'نام استان را وارد کنید.'

    isValid = false
  }

  if (form.city.trim().length < 2) {
    errors.city =
      'نام شهر را وارد کنید.'

    isValid = false
  }

  if (form.fullAddress.trim().length < 10) {
    errors.fullAddress =
      'نشانی کامل محل تحویل را وارد کنید.'

    isValid = false
  }

  const postalCode = keepOnlyDigits(
    form.postalCode
  )

  if (!/^\d{10}$/.test(postalCode)) {
    errors.postalCode =
      'کد پستی باید دقیقاً ۱۰ رقم باشد.'

    isValid = false
  }

  return isValid
}

const focusFirstError = (): void => {
  const firstErrorField =
    Object.keys(errors).find(key => {
      return Boolean(
        errors[key as AddressField]
      )
    }) as AddressField | undefined

  if (!firstErrorField) {
    return
  }

  const elementIds:
    Record<AddressField, string> = {
      province: 'province',
      city: 'city',
      fullAddress: 'full-address',
      postalCode: 'postal-code'
    }

  const element = document.getElementById(
    elementIds[firstErrorField]
  )

  element?.focus()

  element?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
}

const goPrevious = async (): Promise<void> => {
  await router.push({
    name: 'checkout-customer'
  })
}

const submitAddress =
  async (): Promise<void> => {
    if (!validateForm()) {
      submitError.value =
        'لطفاً اطلاعات آدرس را کامل و صحیح وارد کنید.'

      focusFirstError()

      return
    }

    checkoutStore.setAddress({
      addressId: form.addressId,
      province: form.province.trim(),
      city: form.city.trim(),
      fullAddress:
        form.fullAddress.trim(),
      postalCode:
        keepOnlyDigits(form.postalCode)
    })

    await router.push({
      name: 'checkout-shipping'
    })
  }

onMounted(() => {
  checkoutStore.initialize()

  if (
    !checkoutStore.hasCustomerInformation
  ) {
    router.replace({
      name: 'checkout-customer'
    })

    return
  }

  fillFormFromStore()
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

.form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 1rem;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.82rem 0.9rem;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  outline: none;
  background: #ffffff;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.7;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
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

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .checkout-actions {
    align-items: stretch;
    flex-direction: column-reverse;
  }

  .checkout-button {
    width: 100%;
  }
}
</style>
