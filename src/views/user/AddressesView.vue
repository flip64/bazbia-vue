<template>
  <div class="addresses-page">
    <div class="addresses-container">

      <!-- =========================================
           Header
      ========================================== -->
      <header class="addresses-header">
        <div class="addresses-header__main">
          <RouterLink
            :to="{ name: 'profile' }"
            class="back-button"
            aria-label="بازگشت به حساب کاربری"
          >
            <ArrowRight :size="20" />
          </RouterLink>

          <div>
            <h1>آدرس‌های من</h1>
            <p>
              آدرس‌های تحویل سفارش‌های خود را مدیریت کنید.
            </p>
          </div>
        </div>

        <button
          type="button"
          class="add-button"
          @click="openCreateForm"
        >
          <Plus :size="18" />
          <span>افزودن آدرس جدید</span>
        </button>
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
          در حال دریافت آدرس‌ها...
        </p>
      </section>

      <!-- =========================================
           Error
      ========================================== -->
      <section
        v-else-if="loadError"
        class="state-card state-card--error"
      >
        <div class="state-icon state-icon--error">
          <CircleAlert
            :size="32"
            :stroke-width="1.7"
          />
        </div>

        <h2>
          دریافت آدرس‌ها انجام نشد
        </h2>

        <p>
          {{ loadError }}
        </p>

        <button
          type="button"
          class="primary-button"
          @click="loadAddresses"
        >
          تلاش دوباره
        </button>
      </section>

      <!-- =========================================
           Empty
      ========================================== -->
      <section
        v-else-if="addresses.length === 0"
        class="state-card"
      >
        <div class="state-icon">
          <MapPin
            :size="38"
            :stroke-width="1.6"
          />
        </div>

        <h2>
          هنوز آدرسی ثبت نکرده‌اید
        </h2>

        <p>
          برای ثبت سفارش سریع‌تر، اولین آدرس تحویل خود را اضافه کنید.
        </p>

        <button
          type="button"
          class="primary-button"
          @click="openCreateForm"
        >
          <Plus :size="17" />
          ثبت اولین آدرس
        </button>
      </section>

      <!-- =========================================
           Addresses
      ========================================== -->
      <div
        v-else
        class="addresses-grid"
      >
        <article
          v-for="addressItem in addresses"
          :key="addressItem.id"
          class="address-card"
          :class="{
            'address-card--default':
              addressItem.is_default
          }"
        >
          <div class="address-card__top">
            <div class="address-title">
              <span class="address-icon">
                <House
                  :size="21"
                  :stroke-width="1.8"
                />
              </span>

              <div>
                <h2>
                  {{ addressItem.title || 'آدرس' }}
                </h2>

                <span
                  v-if="addressItem.is_default"
                  class="default-badge"
                >
                  <Check :size="14" />
                  آدرس پیش‌فرض
                </span>
              </div>
            </div>

            <div class="address-card__menu">
              <button
                type="button"
                class="icon-button"
                aria-label="ویرایش آدرس"
                title="ویرایش آدرس"
                @click="openEditForm(addressItem)"
              >
                <Pencil :size="18" />
              </button>

              <button
                type="button"
                class="icon-button icon-button--danger"
                :disabled="deletingAddressId === addressItem.id"
                aria-label="حذف آدرس"
                title="حذف آدرس"
                @click="deleteAddress(addressItem)"
              >
                <Trash2
                  v-if="deletingAddressId !== addressItem.id"
                  :size="18"
                />

                <span
                  v-else
                  class="mini-loader"
                ></span>
              </button>
            </div>
          </div>

          <div class="address-location">
            <MapPin
              :size="18"
              :stroke-width="1.7"
            />

            <p>
              <strong>
                {{ addressItem.province }}،
                {{ addressItem.city }}
              </strong>

              <span>
                {{ addressItem.address }}
              </span>
            </p>
          </div>

          <div class="address-details">
            <div class="detail-row">
              <UserRound
                :size="17"
                :stroke-width="1.7"
              />

              <span>
                تحویل‌گیرنده:
              </span>

              <strong>
                {{ addressItem.recipient_name }}
              </strong>
            </div>

            <div class="detail-row">
              <Phone
                :size="17"
                :stroke-width="1.7"
              />

              <span>
                شماره تماس:
              </span>

              <strong
                dir="ltr"
                class="ltr-value"
              >
                {{ addressItem.recipient_phone }}
              </strong>
            </div>

            <div class="detail-row">
              <Hash
                :size="17"
                :stroke-width="1.7"
              />

              <span>
                کد پستی:
              </span>

              <strong
                dir="ltr"
                class="ltr-value"
              >
                {{ addressItem.postal_code }}
              </strong>
            </div>
          </div>

          <div class="address-card__footer">
            <button
              v-if="!addressItem.is_default"
              type="button"
              class="default-button"
              :disabled="settingDefaultId === addressItem.id"
              @click="setAsDefault(addressItem)"
            >
              <template
                v-if="settingDefaultId === addressItem.id"
              >
                <span class="mini-loader"></span>
                در حال ثبت...
              </template>

              <template v-else>
                <CheckCircle2 :size="17" />
                انتخاب به‌عنوان آدرس پیش‌فرض
              </template>
            </button>

            <span
              v-else
              class="default-hint"
            >
              این آدرس برای سفارش‌های جدید در اولویت است.
            </span>
          </div>
        </article>
      </div>
    </div>

    <!-- =========================================
         Create / Edit Modal
    ========================================== -->
    <div
      v-if="showForm"
      class="modal-backdrop"
      role="presentation"
      @click.self="closeForm"
    >
      <section
        class="address-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="
          editingAddressId
            ? 'ویرایش آدرس'
            : 'افزودن آدرس جدید'
        "
      >
        <header class="modal-header">
          <div>
            <span class="modal-eyebrow">
              {{
                editingAddressId
                  ? 'ویرایش اطلاعات تحویل'
                  : 'ثبت آدرس تحویل'
              }}
            </span>

            <h2>
              {{
                editingAddressId
                  ? 'ویرایش آدرس'
                  : 'آدرس جدید'
              }}
            </h2>
          </div>

          <button
            type="button"
            class="close-button"
            aria-label="بستن فرم"
            @click="closeForm"
          >
            <X :size="21" />
          </button>
        </header>

        <form
          class="address-form"
          novalidate
          @submit.prevent="saveAddress"
        >
          <div class="form-group">
            <label for="address-title">
              عنوان آدرس
            </label>

            <input
              id="address-title"
              v-model.trim="form.title"
              type="text"
              maxlength="80"
              placeholder="مثلاً منزل، محل کار یا شرکت"
            >
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="recipient-name">
                نام تحویل‌گیرنده
                <span>*</span>
              </label>

              <input
                id="recipient-name"
                v-model.trim="form.recipient_name"
                type="text"
                autocomplete="name"
                :class="{
                  'form-control--error':
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
                <span>*</span>
              </label>

              <input
                id="recipient-phone"
                v-model="form.recipient_phone"
                type="tel"
                inputmode="numeric"
                autocomplete="tel"
                maxlength="11"
                dir="ltr"
                placeholder="09xxxxxxxxx"
                :class="{
                  'form-control--error':
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
              <label for="province">
                استان
                <span>*</span>
              </label>

              <input
                id="province"
                v-model.trim="form.province"
                type="text"
                autocomplete="address-level1"
                :class="{
                  'form-control--error':
                    errors.province
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
                <span>*</span>
              </label>

              <input
                id="city"
                v-model.trim="form.city"
                type="text"
                autocomplete="address-level2"
                :class="{
                  'form-control--error':
                    errors.city
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
              <span>*</span>
            </label>

            <textarea
              id="full-address"
              v-model.trim="form.address"
              rows="4"
              autocomplete="street-address"
              placeholder="خیابان، کوچه، پلاک، واحد و توضیحات لازم"
              :class="{
                'form-control--error':
                  errors.address
              }"
              @input="clearError('address')"
            ></textarea>

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
              <span>*</span>
            </label>

            <input
              id="postal-code"
              v-model="form.postal_code"
              type="text"
              inputmode="numeric"
              autocomplete="postal-code"
              maxlength="10"
              dir="ltr"
              placeholder="۱۰ رقم بدون خط تیره"
              :class="{
                'form-control--error':
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

            <span class="checkbox-ui">
              <Check :size="14" />
            </span>

            <span>
              این آدرس به‌عنوان آدرس پیش‌فرض انتخاب شود
            </span>
          </label>

          <div
            v-if="submitError"
            class="form-alert"
          >
            <CircleAlert :size="18" />

            <span>
              {{ submitError }}
            </span>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="secondary-button"
              :disabled="submitting"
              @click="closeForm"
            >
              انصراف
            </button>

            <button
              type="submit"
              class="save-button"
              :disabled="submitting"
            >
              <span
                v-if="submitting"
                class="button-loader"
              ></span>

              <Save
                v-else
                :size="18"
              />

              <span>
                {{
                  submitting
                    ? 'در حال ذخیره...'
                    : editingAddressId
                      ? 'ذخیره تغییرات'
                      : 'ثبت آدرس'
                }}
              </span>
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  reactive,
  ref,
} from 'vue'

import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  Hash,
  House,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from 'lucide-vue-next'

import {
  RouterLink,
} from 'vue-router'

import {
  addressService,
} from '@/services/address.service'

import {
  useAuthStore,
} from '@/core/store/authStore'

import type {
  CreateCustomerAddressPayload,
  CustomerAddress,
} from '@/types/address.types'

type AddressErrorField =
  | 'recipient_name'
  | 'recipient_phone'
  | 'province'
  | 'city'
  | 'address'
  | 'postal_code'

interface HttpError {
  response?: {
    status?: number
    data?: {
      detail?: string
      message?: string
      non_field_errors?: string | string[]
      [key: string]:
        | string
        | string[]
        | undefined
    }
  }
}

/* =========================================
   State
========================================= */

const authStore =
  useAuthStore()

const addresses =
  ref<CustomerAddress[]>([])

const loading =
  ref(true)

const loadError =
  ref('')

const showForm =
  ref(false)

const editingAddressId =
  ref<number | null>(null)

const deletingAddressId =
  ref<number | null>(null)

const settingDefaultId =
  ref<number | null>(null)

const submitting =
  ref(false)

const submitError =
  ref('')

const form =
  reactive<CreateCustomerAddressPayload>({
    title: '',
    recipient_name: '',
    recipient_phone: '',
    province: '',
    city: '',
    address: '',
    postal_code: '',
    is_default: false,
  })

const errors =
  reactive<Record<AddressErrorField, string>>({
    recipient_name: '',
    recipient_phone: '',
    province: '',
    city: '',
    address: '',
    postal_code: '',
  })

/* =========================================
   Helpers
========================================= */

function normalizeDigits(
  value: string,
): string {
  const persian =
    '۰۱۲۳۴۵۶۷۸۹'

  const arabic =
    '٠١٢٣٤٥٦٧٨٩'

  return value
    .replace(
      /[۰-۹]/g,
      digit =>
        String(
          persian.indexOf(digit),
        ),
    )
    .replace(
      /[٠-٩]/g,
      digit =>
        String(
          arabic.indexOf(digit),
        ),
    )
    .replace(/\D/g, '')
}

function getCurrentUserName(): string {
  const user =
    authStore.user

  if (!user) {
    return ''
  }

  if (
    user.full_name?.trim()
  ) {
    return user.full_name.trim()
  }

  return [
    user.first_name,
    user.last_name,
  ]
    .filter(Boolean)
    .join(' ')
    .trim()
}

function getCurrentUserPhone(): string {
  return (
    authStore.user?.phone?.trim() ||
    ''
  )
}

function sortAddresses(
  items: CustomerAddress[],
): CustomerAddress[] {
  return [...items].sort(
    (first, second) => {
      if (
        first.is_default ===
        second.is_default
      ) {
        return second.id - first.id
      }

      return first.is_default
        ? -1
        : 1
    },
  )
}

function getApiErrorMessage(
  caughtError: unknown,
  fallback: string,
): string {
  const error =
    caughtError as HttpError

  const data =
    error.response?.data

  const nonField =
    data?.non_field_errors

  if (
    typeof nonField === 'string'
  ) {
    return nonField
  }

  if (
    Array.isArray(nonField) &&
    nonField.length > 0
  ) {
    return nonField[0]
  }

  if (
    typeof data?.detail === 'string'
  ) {
    return data.detail
  }

  if (
    typeof data?.message === 'string'
  ) {
    return data.message
  }

  if (
    error.response?.status === 401
  ) {
    return 'نشست شما منقضی شده است. دوباره وارد حساب شوید.'
  }

  if (
    error.response?.status &&
    error.response.status >= 500
  ) {
    return 'خطایی در سرور رخ داده است.'
  }

  if (
    !error.response
  ) {
    return 'ارتباط با سرور برقرار نشد.'
  }

  return fallback
}

function clearError(
  field: AddressErrorField,
): void {
  errors[field] = ''
  submitError.value = ''
}

function resetErrors(): void {
  errors.recipient_name = ''
  errors.recipient_phone = ''
  errors.province = ''
  errors.city = ''
  errors.address = ''
  errors.postal_code = ''

  submitError.value = ''
}

function resetForm(): void {
  form.title = ''
  form.recipient_name =
    getCurrentUserName()

  form.recipient_phone =
    getCurrentUserPhone()

  form.province = ''
  form.city = ''
  form.address = ''
  form.postal_code = ''

  form.is_default =
    addresses.value.length === 0
}

/* =========================================
   Normalizers
========================================= */

function normalizePhone(): void {
  form.recipient_phone =
    normalizeDigits(
      form.recipient_phone,
    ).slice(0, 11)

  clearError(
    'recipient_phone',
  )
}

function normalizePostalCode(): void {
  form.postal_code =
    normalizeDigits(
      form.postal_code,
    ).slice(0, 10)

  clearError(
    'postal_code',
  )
}

/* =========================================
   Validation
========================================= */

function validateForm(): boolean {
  resetErrors()

  let valid = true

  if (
    form.recipient_name
      .trim()
      .length < 3
  ) {
    errors.recipient_name =
      'نام تحویل‌گیرنده را کامل وارد کنید.'

    valid = false
  }

  if (
    !/^09\d{9}$/.test(
      form.recipient_phone,
    )
  ) {
    errors.recipient_phone =
      'شماره موبایل معتبر نیست.'

    valid = false
  }

  if (
    form.province
      .trim()
      .length < 2
  ) {
    errors.province =
      'نام استان را وارد کنید.'

    valid = false
  }

  if (
    form.city
      .trim()
      .length < 2
  ) {
    errors.city =
      'نام شهر را وارد کنید.'

    valid = false
  }

  if (
    form.address
      .trim()
      .length < 10
  ) {
    errors.address =
      'نشانی کامل را وارد کنید.'

    valid = false
  }

  if (
    !/^\d{10}$/.test(
      form.postal_code,
    )
  ) {
    errors.postal_code =
      'کد پستی باید ۱۰ رقم باشد.'

    valid = false
  }

  return valid
}

/* =========================================
   Load
========================================= */

async function loadAddresses(): Promise<void> {
  loading.value = true
  loadError.value = ''

  try {
    const result =
      await addressService.getAddresses()

    addresses.value =
      sortAddresses(
        Array.isArray(result)
          ? result
          : [],
      )
  } catch (
    caughtError: unknown
  ) {
    console.error(
      'خطا در دریافت آدرس‌ها:',
      caughtError,
    )

    loadError.value =
      getApiErrorMessage(
        caughtError,
        'دریافت آدرس‌ها از سرور انجام نشد.',
      )
  } finally {
    loading.value = false
  }
}

/* =========================================
   Form
========================================= */

function openCreateForm(): void {
  editingAddressId.value = null

  resetErrors()
  resetForm()

  showForm.value = true
}

function openEditForm(
  addressItem: CustomerAddress,
): void {
  resetErrors()

  editingAddressId.value =
    addressItem.id

  form.title =
    addressItem.title || ''

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

  showForm.value = true
}

function closeForm(): void {
  if (
    submitting.value
  ) {
    return
  }

  editingAddressId.value = null
  showForm.value = false

  resetErrors()
  resetForm()
}

/* =========================================
   Save
========================================= */

async function saveAddress(): Promise<void> {
  if (
    !validateForm()
  ) {
    return
  }

  submitting.value = true
  submitError.value = ''

  const payload:
    CreateCustomerAddressPayload = {
      title:
        form.title?.trim() || '',
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
        Boolean(
          form.is_default,
        ),
    }

  try {
    if (
      editingAddressId.value !== null
    ) {
      await addressService.updateAddress(
        editingAddressId.value,
        payload,
      )
    } else {
      await addressService.createAddress(
        payload,
      )
    }

    showForm.value = false
    editingAddressId.value = null

    await loadAddresses()

    resetForm()
  } catch (
    caughtError: unknown
  ) {
    console.error(
      'خطا در ذخیره آدرس:',
      caughtError,
    )

    submitError.value =
      getApiErrorMessage(
        caughtError,
        'ذخیره آدرس انجام نشد. اطلاعات را بررسی کنید.',
      )
  } finally {
    submitting.value = false
  }
}

/* =========================================
   Default
========================================= */

async function setAsDefault(
  addressItem: CustomerAddress,
): Promise<void> {
  if (
    addressItem.is_default ||
    settingDefaultId.value !== null
  ) {
    return
  }

  settingDefaultId.value =
    addressItem.id

  try {
    await addressService.updateAddress(
      addressItem.id,
      {
        is_default: true,
      },
    )

    await loadAddresses()
  } catch (
    caughtError: unknown
  ) {
    console.error(
      'خطا در انتخاب آدرس پیش‌فرض:',
      caughtError,
    )

    window.alert(
      getApiErrorMessage(
        caughtError,
        'انتخاب آدرس پیش‌فرض انجام نشد.',
      ),
    )
  } finally {
    settingDefaultId.value = null
  }
}

/* =========================================
   Delete
========================================= */

async function deleteAddress(
  addressItem: CustomerAddress,
): Promise<void> {
  if (
    deletingAddressId.value !== null
  ) {
    return
  }

  const label =
    addressItem.title ||
    'این آدرس'

  const confirmed =
    window.confirm(
      `آیا از حذف «${label}» مطمئن هستید؟`,
    )

  if (
    !confirmed
  ) {
    return
  }

  deletingAddressId.value =
    addressItem.id

  try {
    await addressService.deleteAddress(
      addressItem.id,
    )

    if (
      editingAddressId.value ===
      addressItem.id
    ) {
      showForm.value = false
      editingAddressId.value = null
    }

    await loadAddresses()
  } catch (
    caughtError: unknown
  ) {
    console.error(
      'خطا در حذف آدرس:',
      caughtError,
    )

    window.alert(
      getApiErrorMessage(
        caughtError,
        'حذف آدرس انجام نشد.',
      ),
    )
  } finally {
    deletingAddressId.value = null
  }
}

/* =========================================
   Mount
========================================= */

onMounted(
  async () => {
    if (
      !authStore.user
    ) {
      await authStore.fetchUserProfile()
    }

    await loadAddresses()
  },
)
</script>

<style scoped>
/* =========================================
   Page
========================================= */

.addresses-page {
  min-height: 70vh;
  padding: 24px 16px 48px;
  background: #f8fafc;
}

.addresses-container {
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
}

/* =========================================
   Header
========================================= */

.addresses-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
}

.addresses-header__main {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.addresses-header h1 {
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 800;
}

.addresses-header p {
  margin: 5px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.8;
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

.add-button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 16px;
  border: 0;
  border-radius: 12px;
  background: #15803d;
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.add-button:hover {
  background: #166534;
  transform: translateY(-1px);
}

/* =========================================
   States
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
  max-width: 430px;
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.9;
}

.state-card--error {
  border-color: #fecaca;
}

.state-icon {
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: #f0fdf4;
  color: #15803d;
}

.state-icon--error {
  background: #fef2f2;
  color: #dc2626;
}

.loader {
  width: 32px;
  height: 32px;
  margin-bottom: 14px;
  border: 3px solid #dcfce7;
  border-top-color: #15803d;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.primary-button {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 18px;
  padding: 0 16px;
  border: 0;
  border-radius: 11px;
  background: #15803d;
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

/* =========================================
   Address grid
========================================= */

.addresses-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.address-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #ffffff;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.02);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.address-card:hover {
  border-color: #d1d5db;
  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.05);
  transform: translateY(-1px);
}

.address-card--default {
  border-color: #86efac;
}

.address-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 17px 18px 14px;
}

.address-title {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  min-width: 0;
}

.address-icon {
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #f3f4f6;
  color: #374151;
}

.address-card--default
.address-icon {
  background: #f0fdf4;
  color: #15803d;
}

.address-title h2 {
  margin: 1px 0 0;
  color: #111827;
  font-size: 15px;
  font-weight: 800;
}

.default-badge {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  font-size: 10px;
  font-weight: 800;
}

.address-card__menu {
  display: flex;
  gap: 5px;
  flex: 0 0 auto;
}

.icon-button {
  width: 35px;
  height: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.icon-button:hover {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
}

.icon-button--danger:hover {
  border-color: #fecaca;
  background: #fef2f2;
  color: #dc2626;
}

.icon-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.address-location {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 0 18px;
  padding: 15px 0;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  color: #6b7280;
}

.address-location > svg {
  flex: 0 0 auto;
  margin-top: 3px;
}

.address-location p {
  min-width: 0;
  margin: 0;
}

.address-location strong,
.address-location span {
  display: block;
}

.address-location strong {
  margin-bottom: 5px;
  color: #374151;
  font-size: 13px;
  font-weight: 800;
}

.address-location span {
  color: #6b7280;
  font-size: 12px;
  line-height: 2;
  overflow-wrap: anywhere;
}

.address-details {
  display: grid;
  gap: 10px;
  padding: 15px 18px;
}

.detail-row {
  display: grid;
  grid-template-columns:
    18px auto minmax(0, 1fr);
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: #9ca3af;
  font-size: 11px;
}

.detail-row span {
  color: #6b7280;
}

.detail-row strong {
  min-width: 0;
  color: #374151;
  font-size: 12px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.ltr-value {
  text-align: right;
}

.address-card__footer {
  min-height: 53px;
  display: flex;
  align-items: center;
  padding: 10px 18px;
  border-top: 1px solid #f3f4f6;
  background: #fcfdfc;
}

.default-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #15803d;
  font-family: inherit;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.default-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.default-hint {
  color: #6b7280;
  font-size: 10px;
  line-height: 1.8;
}

/* =========================================
   Modal
========================================= */

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background:
    rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(3px);
}

.address-modal {
  width: 100%;
  max-width: 650px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #ffffff;
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.18);
}

.modal-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 20px;
  border-bottom: 1px solid #eef0f2;
  background: #ffffff;
}

.modal-eyebrow {
  display: block;
  margin-bottom: 4px;
  color: #15803d;
  font-size: 10px;
  font-weight: 800;
}

.modal-header h2 {
  margin: 0;
  color: #111827;
  font-size: 18px;
  font-weight: 800;
}

.close-button {
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 11px;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
}

.close-button:hover {
  background: #f9fafb;
  color: #111827;
}

/* =========================================
   Form
========================================= */

.address-form {
  padding: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  color: #374151;
  font-size: 12px;
  font-weight: 800;
}

.form-group label span {
  color: #dc2626;
}

.form-group input,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 11px;
  background: #ffffff;
  color: #111827;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-group input {
  height: 44px;
  padding: 0 12px;
}

.form-group textarea {
  min-height: 104px;
  resize: vertical;
  padding: 11px 12px;
  line-height: 1.9;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #4ade80;
  box-shadow:
    0 0 0 3px rgba(34, 197, 94, 0.1);
}

.form-control--error {
  border-color: #fca5a5 !important;
  background: #fffafa !important;
}

.form-error {
  display: block;
  margin-top: 6px;
  color: #dc2626;
  font-size: 10px;
  line-height: 1.7;
}

.checkbox-field {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 3px 0 17px;
  color: #374151;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.checkbox-field > input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkbox-ui {
  width: 19px;
  height: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: transparent;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.checkbox-field
input:checked +
.checkbox-ui {
  border-color: #15803d;
  background: #15803d;
  color: #ffffff;
}

.form-alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
  padding: 11px 12px;
  border: 1px solid #fecaca;
  border-radius: 11px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 11px;
  line-height: 1.8;
}

.form-alert svg {
  flex: 0 0 auto;
  margin-top: 1px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  padding-top: 4px;
}

.secondary-button,
.save-button {
  min-height: 43px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 17px;
  border-radius: 11px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.secondary-button {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #4b5563;
}

.secondary-button:hover {
  background: #f9fafb;
}

.save-button {
  border: 1px solid #15803d;
  background: #15803d;
  color: #ffffff;
}

.save-button:hover {
  background: #166534;
}

.secondary-button:disabled,
.save-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

/* =========================================
   Loaders
========================================= */

.mini-loader,
.button-loader {
  display: inline-block;
  border-style: solid;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.mini-loader {
  width: 14px;
  height: 14px;
  border-width: 2px;
  border-color: #bbf7d0;
  border-top-color: #15803d;
}

.button-loader {
  width: 15px;
  height: 15px;
  border-width: 2px;
  border-color:
    rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================
   Responsive
========================================= */

@media (max-width: 760px) {
  .addresses-page {
    padding:
      18px 12px 36px;
  }

  .addresses-header {
    align-items: flex-start;
  }

  .addresses-header h1 {
    font-size: 19px;
  }

  .addresses-header p {
    max-width: 260px;
    font-size: 11px;
  }

  .add-button {
    min-width: 44px;
    width: 44px;
    padding: 0;
  }

  .add-button span {
    display: none;
  }

  .addresses-grid {
    grid-template-columns: 1fr;
  }

  .modal-backdrop {
    align-items: flex-end;
    padding: 0;
  }

  .address-modal {
    max-width: none;
    max-height: 92vh;
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius:
      20px 20px 0 0;
  }
}

@media (max-width: 520px) {
  .addresses-header__main {
    gap: 10px;
  }

  .back-button {
    width: 40px;
    height: 40px;
    border-radius: 11px;
  }

  .address-card__top,
  .address-details,
  .address-card__footer {
    padding-right: 14px;
    padding-left: 14px;
  }

  .address-location {
    margin-right: 14px;
    margin-left: 14px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .address-form {
    padding: 16px;
  }

  .modal-header {
    padding:
      16px;
  }

  .form-actions {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
  }

  .secondary-button,
  .save-button {
    width: 100%;
    padding:
      0 10px;
  }
}
</style>
