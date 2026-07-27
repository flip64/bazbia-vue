<template>
  <section class="checkout-card">
    <header class="checkout-card__header">
      <div>
        <span class="checkout-card__step">
          مرحله ۲
        </span>

        <h2>انتخاب آدرس ارسال</h2>

        <p>
          یکی از آدرس‌های ذخیره‌شده را انتخاب کنید یا آدرس جدید بسازید.
        </p>
      </div>

      <button
        type="button"
        class="add-address-button"
        @click="openCreateForm"
      >
        افزودن آدرس جدید
      </button>
    </header>

    <div class="checkout-card__body">
      <div
        v-if="isLoading"
        class="state-message"
      >
        در حال دریافت آدرس‌ها...
      </div>

      <div
        v-else-if="loadError"
        class="alert alert--error"
      >
        <p>{{ loadError }}</p>

        <button
          type="button"
          @click="loadAddresses"
        >
          تلاش دوباره
        </button>
      </div>

      <template v-else>
        <div
          v-if="addresses.length"
          class="address-list"
        >
          <label
            v-for="addressItem in addresses"
            :key="addressItem.id"
            class="address-card"
            :class="{
              'address-card--selected':
                selectedAddressId === addressItem.id
            }"
          >
            <input
              v-model="selectedAddressId"
              type="radio"
              name="selected-address"
              :value="addressItem.id"
            >

            <div class="address-card__content">
              <div class="address-card__header">
                <strong>
                  {{ addressItem.title || 'آدرس' }}
                </strong>

                <span
                  v-if="addressItem.is_default"
                  class="default-badge"
                >
                  پیش‌فرض
                </span>
              </div>

              <p>
                {{ addressItem.province }}،
                {{ addressItem.city }}
              </p>

              <p>
                {{ addressItem.address }}
              </p>

              <div class="address-card__details">
                <span>
                  گیرنده:
                  {{ addressItem.recipient_name }}
                </span>

                <span dir="ltr">
                  {{ addressItem.recipient_phone }}
                </span>

                <span>
                  کد پستی:
                  {{ addressItem.postal_code }}
                </span>
              </div>

              <div class="address-card__actions">
                <button
                  type="button"
                  class="address-action-button"
                  @click.prevent.stop="openEditForm(addressItem)"
                >
                  ویرایش
                </button>

                <button
                  type="button"
                  class="address-action-button address-action-button--danger"
                  :disabled="deletingAddressId === addressItem.id"
                  @click.prevent.stop="deleteAddress(addressItem)"
                >
                  {{
                    deletingAddressId === addressItem.id
                      ? 'در حال حذف...'
                      : 'حذف'
                  }}
                </button>
              </div>
            </div>
          </label>
        </div>

        <div
          v-else-if="!showAddressForm"
          class="empty-addresses"
        >
          <h3>هنوز آدرسی ثبت نشده است</h3>

          <p>
            برای ادامه فرایند خرید، یک آدرس جدید ثبت کنید.
          </p>

          <button
            type="button"
            class="checkout-button checkout-button--primary"
            @click="openCreateForm"
          >
            ثبت اولین آدرس
          </button>
        </div>

        <form
          v-if="showAddressForm"
          class="address-form"
          novalidate
          @submit.prevent="saveAddress"
        >
          <div class="address-form__header">
            <h3>
              {{
                editingAddressId
                  ? 'ویرایش آدرس'
                  : 'آدرس جدید'
              }}
            </h3>

            <button
              type="button"
              class="close-button"
              @click="closeAddressForm"
            >
              بستن
            </button>
          </div>

          <div class="form-group">
            <label for="address-title">
              عنوان آدرس
            </label>

            <input
              id="address-title"
              v-model.trim="form.title"
              type="text"
              placeholder="مثلاً منزل یا محل کار"
            >
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="recipient-name">
                نام تحویل‌گیرنده
              </label>

              <input
                id="recipient-name"
                v-model.trim="form.recipient_name"
                type="text"
                :class="{
                  'form-input--error':
                    errors.recipient_name
                }"
                @input="clearError('recipient_name')"
              >

              <small
                v-if="errors.recipient_name"
                class="form-error"
              >
                {{ errors.recipient_name }}
              </small>
            </div>

            <div class="form-group">
              <label for="recipient-phone">
                شماره موبایل
              </label>

              <input
                id="recipient-phone"
                v-model="form.recipient_phone"
                type="tel"
                inputmode="numeric"
                maxlength="11"
                dir="ltr"
                :class="{
                  'form-input--error':
                    errors.recipient_phone
                }"
                @input="normalizePhone"
              >

              <small
                v-if="errors.recipient_phone"
                class="form-error"
              >
                {{ errors.recipient_phone }}
              </small>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="province">استان</label>

              <input
                id="province"
                v-model.trim="form.province"
                type="text"
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
              <label for="city">شهر</label>

              <input
                id="city"
                v-model.trim="form.city"
                type="text"
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
            </label>

            <textarea
              id="full-address"
              v-model.trim="form.address"
              rows="4"
              :class="{
                'form-input--error': errors.address
              }"
              @input="clearError('address')"
            />

            <small
              v-if="errors.address"
              class="form-error"
            >
              {{ errors.address }}
            </small>
          </div>

          <div class="form-group">
            <label for="postal-code">
              کد پستی
            </label>

            <input
              id="postal-code"
              v-model="form.postal_code"
              type="text"
              inputmode="numeric"
              maxlength="10"
              dir="ltr"
              :class="{
                'form-input--error':
                  errors.postal_code
              }"
              @input="normalizePostalCode"
            >

            <small
              v-if="errors.postal_code"
              class="form-error"
            >
              {{ errors.postal_code }}
            </small>
          </div>

          <label class="checkbox-field">
            <input
              v-model="form.is_default"
              type="checkbox"
            >

            این آدرس پیش‌فرض باشد
          </label>

          <div
            v-if="submitError"
            class="alert alert--error"
          >
            {{ submitError }}
          </div>

          <button
            type="submit"
            class="checkout-button checkout-button--primary"
            :disabled="isSubmitting"
          >
            <template v-if="isSubmitting">
              در حال ذخیره...
            </template>

            <template v-else>
              {{
                editingAddressId
                  ? 'ذخیره تغییرات'
                  : 'ثبت آدرس'
              }}
            </template>
          </button>
        </form>

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
            :disabled="!selectedAddressId"
            @click="continueToShipping"
          >
            ادامه به روش ارسال
          </button>
        </div>
      </template>
    </div>
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
import { addressService } from '@/services/address.service'

import type {
  CreateCustomerAddressPayload,
  CustomerAddress
} from '@/types/address.types'

type AddressErrorField =
  | 'recipient_name'
  | 'recipient_phone'
  | 'province'
  | 'city'
  | 'address'
  | 'postal_code'

const router = useRouter()
const checkoutStore = useCheckoutStore()

const addresses = ref<CustomerAddress[]>([])
const selectedAddressId = ref<number | null>(null)

const editingAddressId = ref<number | null>(null)
const deletingAddressId = ref<number | null>(null)

const isLoading = ref(false)
const isSubmitting = ref(false)
const showAddressForm = ref(false)

const loadError = ref('')
const submitError = ref('')

const form = reactive<CreateCustomerAddressPayload>({
  title: '',
  recipient_name: '',
  recipient_phone: '',
  province: '',
  city: '',
  address: '',
  postal_code: '',
  is_default: false
})

const errors = reactive<Record<AddressErrorField, string>>({
  recipient_name: '',
  recipient_phone: '',
  province: '',
  city: '',
  address: '',
  postal_code: ''
})

const normalizeDigits = (
  value: string
): string => {
  const persian = '۰۱۲۳۴۵۶۷۸۹'
  const arabic = '٠١٢٣٤٥٦٧٨٩'

  return value
    .replace(/[۰-۹]/g, digit => {
      return String(
        persian.indexOf(digit)
      )
    })
    .replace(/[٠-٩]/g, digit => {
      return String(
        arabic.indexOf(digit)
      )
    })
    .replace(/\D/g, '')
}

const clearError = (
  field: AddressErrorField
): void => {
  errors[field] = ''
  submitError.value = ''
}

const normalizePhone = (): void => {
  form.recipient_phone = normalizeDigits(
    form.recipient_phone
  ).slice(0, 11)

  clearError('recipient_phone')
}

const normalizePostalCode = (): void => {
  form.postal_code = normalizeDigits(
    form.postal_code
  ).slice(0, 10)

  clearError('postal_code')
}

const resetErrors = (): void => {
  errors.recipient_name = ''
  errors.recipient_phone = ''
  errors.province = ''
  errors.city = ''
  errors.address = ''
  errors.postal_code = ''

  submitError.value = ''
}

const resetForm = (): void => {
  form.title = ''
  form.recipient_name =
    checkoutStore.customer.fullName
  form.recipient_phone =
    checkoutStore.customer.phone
  form.province = ''
  form.city = ''
  form.address = ''
  form.postal_code = ''
  form.is_default =
    addresses.value.length === 0
}

const validateForm = (): boolean => {
  resetErrors()

  let valid = true

  if (form.recipient_name.trim().length < 3) {
    errors.recipient_name =
      'نام تحویل‌گیرنده را کامل وارد کنید.'

    valid = false
  }

  if (!/^09\d{9}$/.test(form.recipient_phone)) {
    errors.recipient_phone =
      'شماره موبایل معتبر نیست.'

    valid = false
  }

  if (form.province.trim().length < 2) {
    errors.province =
      'نام استان را وارد کنید.'

    valid = false
  }

  if (form.city.trim().length < 2) {
    errors.city =
      'نام شهر را وارد کنید.'

    valid = false
  }

  if (form.address.trim().length < 10) {
    errors.address =
      'نشانی کامل را وارد کنید.'

    valid = false
  }

  if (!/^\d{10}$/.test(form.postal_code)) {
    errors.postal_code =
      'کد پستی باید ۱۰ رقم باشد.'

    valid = false
  }

  return valid
}

const loadAddresses = async (): Promise<void> => {
  isLoading.value = true
  loadError.value = ''

  try {
    addresses.value =
      await addressService.getAddresses()

    const savedAddressId =
      checkoutStore.address.addressId

    const savedAddress =
      addresses.value.find(item => {
        return item.id === savedAddressId
      })

    const defaultAddress =
      addresses.value.find(item => {
        return item.is_default
      })

    selectedAddressId.value =
      savedAddress?.id ??
      defaultAddress?.id ??
      addresses.value[0]?.id ??
      null

    if (!addresses.value.length) {
      openCreateForm()
    }
  } catch (error) {
    console.error(
      'Loading addresses failed:',
      error
    )

    loadError.value =
      'دریافت آدرس‌ها انجام نشد.'
  } finally {
    isLoading.value = false
  }
}

const openCreateForm = (): void => {
  editingAddressId.value = null

  resetErrors()
  resetForm()

  showAddressForm.value = true
}

const openEditForm = (
  addressItem: CustomerAddress
): void => {
  resetErrors()

  editingAddressId.value =
    addressItem.id

  form.title =
    addressItem.title
  form.recipient_name =
    addressItem.recipient_name
  form.recipient_phone =
    addressItem.recipient_phone
  form.province =
    addressItem.province
  form.city =
    addressItem.city
  form.address =
    addressItem.address
  form.postal_code =
    addressItem.postal_code
  form.is_default =
    addressItem.is_default

  showAddressForm.value = true

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const closeAddressForm = (): void => {
  editingAddressId.value = null
  showAddressForm.value = false

  resetErrors()
  resetForm()
}

const normalizeDefaultAddresses = (
  selectedDefaultId: number
): void => {
  addresses.value =
    addresses.value.map(item => ({
      ...item,
      is_default:
        item.id === selectedDefaultId
    }))
}

const saveAddress = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  const payload: CreateCustomerAddressPayload = {
    title: form.title?.trim() || '',
    recipient_name:
      form.recipient_name.trim(),
    recipient_phone:
      form.recipient_phone.trim(),
    province:
      form.province.trim(),
    city:
      form.city.trim(),
    address:
      form.address.trim(),
    postal_code:
      form.postal_code.trim(),
    is_default:
      Boolean(form.is_default)
  }

  try {
    if (editingAddressId.value !== null) {
      const updatedAddress =
        await addressService.updateAddress(
          editingAddressId.value,
          payload
        )

      addresses.value =
        addresses.value.map(item => {
          if (
            item.id === updatedAddress.id
          ) {
            return updatedAddress
          }

          return item
        })

      if (updatedAddress.is_default) {
        normalizeDefaultAddresses(
          updatedAddress.id
        )
      }

      selectedAddressId.value =
        updatedAddress.id
    } else {
      const createdAddress =
        await addressService.createAddress(
          payload
        )

      addresses.value.unshift(
        createdAddress
      )

      if (createdAddress.is_default) {
        normalizeDefaultAddresses(
          createdAddress.id
        )
      }

      selectedAddressId.value =
        createdAddress.id
    }

    editingAddressId.value = null
    showAddressForm.value = false

    resetForm()
  } catch (error) {
    console.error(
      'Saving address failed:',
      error
    )

    submitError.value =
      'ذخیره آدرس انجام نشد. اطلاعات را بررسی کنید.'
  } finally {
    isSubmitting.value = false
  }
}

const deleteAddress = async (
  addressItem: CustomerAddress
): Promise<void> => {
  const confirmed = window.confirm(
    `آدرس «${addressItem.title || 'بدون عنوان'}» حذف شود؟`
  )

  if (!confirmed) {
    return
  }

  deletingAddressId.value =
    addressItem.id

  try {
    await addressService.deleteAddress(
      addressItem.id
    )

    addresses.value =
      addresses.value.filter(item => {
        return item.id !== addressItem.id
      })

    if (
      editingAddressId.value ===
      addressItem.id
    ) {
      closeAddressForm()
    }

    if (
      selectedAddressId.value ===
      addressItem.id
    ) {
      const defaultAddress =
        addresses.value.find(item => {
          return item.is_default
        })

      selectedAddressId.value =
        defaultAddress?.id ??
        addresses.value[0]?.id ??
        null
    }

    if (
      checkoutStore.address.addressId ===
      addressItem.id
    ) {
      checkoutStore.setAddress({
        addressId: null,
        province: '',
        city: '',
        fullAddress: '',
        postalCode: ''
      })
    }

    if (!addresses.value.length) {
      openCreateForm()
    }
  } catch (error) {
    console.error(
      'Deleting address failed:',
      error
    )

    window.alert(
      'حذف آدرس انجام نشد.'
    )
  } finally {
    deletingAddressId.value = null
  }
}

const continueToShipping =
  async (): Promise<void> => {
    const selectedAddress =
      addresses.value.find(item => {
        return (
          item.id ===
          selectedAddressId.value
        )
      })

    if (!selectedAddress) {
      return
    }

    checkoutStore.setAddress({
      addressId:
        selectedAddress.id,
      province:
        selectedAddress.province,
      city:
        selectedAddress.city,
      fullAddress:
        selectedAddress.address,
      postalCode:
        selectedAddress.postal_code
    })

    await router.push({
      name: 'checkout-shipping'
    })
  }

const goPrevious = async (): Promise<void> => {
  await router.push({
    name: 'checkout-customer'
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

  await loadAddresses()
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
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

.add-address-button,
.close-button {
  color: #15803d;
  border: none;
  background: transparent;
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
}

.address-list {
  display: grid;
  gap: 0.85rem;
}

.address-card {
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

.address-card:hover {
  border-color: #86efac;
}

.address-card--selected {
  border-color: #16a34a;
  background: #f0fdf4;
}

.address-card__content {
  flex: 1;
  min-width: 0;
}

.address-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.address-card p {
  margin: 0.45rem 0;
  color: #4b5563;
  line-height: 1.8;
}

.address-card__details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: #6b7280;
  font-size: 0.76rem;
}

.address-card__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.8rem;
}

.address-action-button {
  padding: 0;
  color: #15803d;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.76rem;
  font-weight: 800;
  cursor: pointer;
}

.address-action-button--danger {
  color: #dc2626;
}

.address-action-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.default-badge {
  padding: 0.2rem 0.45rem;
  color: #166534;
  border-radius: 20px;
  background: #dcfce7;
  font-size: 0.7rem;
}

.address-form {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.address-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.address-form__header h3 {
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.82rem;
  font-weight: 700;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  outline: none;
  background: #ffffff;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #16a34a;
  box-shadow:
    0 0 0 3px rgba(22, 163, 74, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.form-input--error {
  border-color: #dc2626 !important;
}

.form-error {
  display: block;
  margin-top: 0.3rem;
  color: #dc2626;
  font-size: 0.72rem;
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkout-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.25rem;
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
  padding: 0.85rem;
  border-radius: 9px;
}

.alert--error {
  color: #991b1b;
  border: 1px solid #fecaca;
  background: #fef2f2;
}

.state-message,
.empty-addresses {
  padding: 2rem;
  text-align: center;
}

@media (max-width: 640px) {
  .checkout-card__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .checkout-actions {
    flex-direction: column-reverse;
  }

  .checkout-button {
    width: 100%;
  }
}
</style>
