<template>
  <main class="contact-page">
    <!-- Hero -->
    <section class="contact-hero">
      <div class="contact-hero__shape contact-hero__shape--one"></div>
      <div class="contact-hero__shape contact-hero__shape--two"></div>

      <div class="contact-container contact-hero__content">
        <div class="contact-hero__badge">
          همراه شما هستیم
        </div>

        <h1 class="contact-hero__title">
          ارتباط با
          <span>بازبیا</span>
        </h1>

        <p class="contact-hero__description">
          سوال، پیشنهاد یا مشکلی دارید؟ تیم پشتیبانی بازبیا آماده است
          تا در سریع‌ترین زمان ممکن پاسخ‌گوی شما باشد.
        </p>

        <div class="contact-hero__actions">
          <a
            href="tel:02100000000"
            class="hero-action hero-action--primary"
          >
            <span class="hero-action__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2
                  19.79 19.79 0 0 1-8.63-3.07
                  19.5 19.5 0 0 1-6-6
                  19.79 19.79 0 0 1-3.07-8.67
                  A2 2 0 0 1 4.11 2h3
                  a2 2 0 0 1 2 1.72
                  c.12.9.33 1.78.62 2.63
                  a2 2 0 0 1-.45 2.11L8 9.73
                  a16 16 0 0 0 6 6l1.27-1.27
                  a2 2 0 0 1 2.11-.45
                  c.85.29 1.73.5 2.63.62
                  A2 2 0 0 1 22 16.92z"
                />
              </svg>
            </span>

            تماس با پشتیبانی
          </a>

          <a
            href="#contact-form"
            class="hero-action hero-action--secondary"
          >
            ارسال پیام
          </a>
        </div>
      </div>
    </section>

    <div class="contact-container">
      <!-- Contact cards -->
      <section class="contact-info-section">
        <div class="section-heading">
          <span class="section-heading__eyebrow">
            راه‌های ارتباطی
          </span>

          <h2 class="section-heading__title">
            از هر روشی که راحت‌ترید با ما در تماس باشید
          </h2>

          <p class="section-heading__description">
            تیم بازبیا در روزهای کاری آماده پاسخ‌گویی به سوالات شماست.
          </p>
        </div>

        <div class="contact-info-grid">
          <article class="contact-card">
            <div class="contact-card__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M21 10c0 7-9 12-9 12S3 17 3 10
                  a9 9 0 1 1 18 0z"
                />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>

            <div class="contact-card__content">
              <h3 class="contact-card__title">
                آدرس فروشگاه
              </h3>

              <p class="contact-card__text">
                تهران، شهر قدس، آدرس کامل فروشگاه بازبیا
              </p>
            </div>
          </article>

          <article class="contact-card">
            <div class="contact-card__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2
                  19.79 19.79 0 0 1-8.63-3.07
                  19.5 19.5 0 0 1-6-6
                  19.79 19.79 0 0 1-3.07-8.67
                  A2 2 0 0 1 4.11 2h3
                  a2 2 0 0 1 2 1.72
                  c.12.9.33 1.78.62 2.63
                  a2 2 0 0 1-.45 2.11L8 9.73
                  a16 16 0 0 0 6 6l1.27-1.27
                  a2 2 0 0 1 2.11-.45
                  c.85.29 1.73.5 2.63.62
                  A2 2 0 0 1 22 16.92z"
                />
              </svg>
            </div>

            <div class="contact-card__content">
              <h3 class="contact-card__title">
                تلفن پشتیبانی
              </h3>

              <a
                class="contact-card__link"
                href="tel:02100000000"
                dir="ltr"
              >
                021-00000000
              </a>

              <span class="contact-card__hint">
                پاسخ‌گویی در ساعات کاری
              </span>
            </div>
          </article>

          <article class="contact-card">
            <div class="contact-card__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12
                  c0 1.1-.9 2-2 2H4
                  c-1.1 0-2-.9-2-2V6
                  c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <div class="contact-card__content">
              <h3 class="contact-card__title">
                ایمیل
              </h3>

              <a
                class="contact-card__link"
                href="mailto:support@bazbia.ir"
              >
                support@bazbia.ir
              </a>

              <span class="contact-card__hint">
                برای امور پشتیبانی و همکاری
              </span>
            </div>
          </article>

          <article class="contact-card">
            <div class="contact-card__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12,7 12,12 15,14" />
              </svg>
            </div>

            <div class="contact-card__content">
              <h3 class="contact-card__title">
                ساعات کاری
              </h3>

              <p class="contact-card__text">
                شنبه تا چهارشنبه: ۹ تا ۱۸
              </p>

              <span class="contact-card__hint">
                پنجشنبه: ۹ تا ۱۴
              </span>
            </div>
          </article>
        </div>
      </section>

      <!-- Form and side panel -->
      <section
        id="contact-form"
        class="contact-main-section"
      >
        <div class="contact-form-card">
          <div class="contact-form-card__header">
            <span class="contact-form-card__badge">
              ارسال پیام
            </span>

            <h2 class="contact-form-card__title">
              پیام خود را برای ما بنویسید
            </h2>

            <p class="contact-form-card__description">
              اطلاعات فرم را تکمیل کنید. همکاران ما پس از بررسی
              با شما تماس خواهند گرفت.
            </p>
          </div>

          <form
            class="contact-form"
            @submit.prevent="handleSubmit"
          >
            <div class="form-grid">
              <div class="form-group">
                <label for="contact-name">
                  نام و نام خانوادگی
                  <span>*</span>
                </label>

                <div class="form-control-wrapper">
                  <span class="form-control-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8
                        a4 4 0 0 0-4 4v2"
                      />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>

                  <input
                    id="contact-name"
                    v-model.trim="form.name"
                    type="text"
                    autocomplete="name"
                    placeholder="نام و نام خانوادگی"
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="contact-phone">
                  شماره تماس
                  <span>*</span>
                </label>

                <div class="form-control-wrapper">
                  <span class="form-control-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2
                        19.79 19.79 0 0 1-8.63-3.07
                        19.5 19.5 0 0 1-6-6
                        19.79 19.79 0 0 1-3.07-8.67
                        A2 2 0 0 1 4.11 2h3
                        a2 2 0 0 1 2 1.72"
                      />
                    </svg>
                  </span>

                  <input
                    id="contact-phone"
                    v-model.trim="form.phone"
                    type="tel"
                    inputmode="numeric"
                    autocomplete="tel"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    dir="rtl"
                    required
                  >
                </div>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="contact-email">
                  ایمیل
                </label>

                <div class="form-control-wrapper">
                  <span class="form-control-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12
                        c0 1.1-.9 2-2 2H4
                        c-1.1 0-2-.9-2-2V6
                        c0-1.1.9-2 2-2z"
                      />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>

                  <input
                    id="contact-email"
                    v-model.trim="form.email"
                    type="email"
                    autocomplete="email"
                    placeholder="example@email.com"
                    dir="ltr"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="contact-subject">
                  موضوع پیام
                  <span>*</span>
                </label>

                <select
                  id="contact-subject"
                  v-model="form.subject"
                  required
                >
                  <option value="" disabled>
                    موضوع را انتخاب کنید
                  </option>

                  <option value="order">
                    پیگیری سفارش
                  </option>

                  <option value="payment">
                    مشکل پرداخت
                  </option>

                  <option value="product">
                    سوال درباره محصول
                  </option>

                  <option value="return">
                    مرجوعی و بازگشت کالا
                  </option>

                  <option value="cooperation">
                    همکاری با بازبیا
                  </option>

                  <option value="suggestion">
                    پیشنهاد یا انتقاد
                  </option>

                  <option value="other">
                    سایر موارد
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="contact-order-number">
                شماره سفارش
              </label>

              <input
                id="contact-order-number"
                v-model.trim="form.orderNumber"
                type="text"
                inputmode="numeric"
                placeholder="در صورت ارتباط پیام با سفارش وارد کنید"
              >
            </div>

            <div class="form-group">
              <label for="contact-message">
                متن پیام
                <span>*</span>
              </label>

              <textarea
                id="contact-message"
                v-model.trim="form.message"
                rows="6"
                maxlength="1000"
                placeholder="پیام خود را با جزئیات بنویسید..."
                required
              ></textarea>

              <div class="message-counter">
                {{ form.message.length }} / ۱۰۰۰
              </div>
            </div>

            <div
              v-if="feedback.message"
              class="form-feedback"
              :class="{
                'form-feedback--success':
                  feedback.type === 'success',
                'form-feedback--error':
                  feedback.type === 'error'
              }"
            >
              {{ feedback.message }}
            </div>

            <button
              type="submit"
              class="submit-button"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="submit-button__spinner"
              ></span>

              <span>
                {{ loading ? 'در حال ارسال پیام...' : 'ارسال پیام' }}
              </span>

              <svg
                v-if="!loading"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>

        <aside class="contact-side-panel">
          <div class="contact-side-panel__content">
            <span class="contact-side-panel__badge">
              پشتیبانی بازبیا
            </span>

            <h2 class="contact-side-panel__title">
              قبل از ارسال پیام این موارد را بررسی کنید
            </h2>

            <ul class="support-checklist">
              <li>
                <span class="support-checklist__icon">✓</span>

                <span>
                  برای پیگیری خرید، شماره سفارش را همراه پیام ارسال کنید.
                </span>
              </li>

              <li>
                <span class="support-checklist__icon">✓</span>

                <span>
                  برای مشکلات پرداخت، تاریخ و مبلغ تراکنش را بنویسید.
                </span>
              </li>

              <li>
                <span class="support-checklist__icon">✓</span>

                <span>
                  شماره تماس خود را درست وارد کنید تا بتوانیم با شما ارتباط بگیریم.
                </span>
              </li>
            </ul>

            <div class="response-time">
              <div class="response-time__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12,7 12,12 16,14" />
                </svg>
              </div>

              <div>
                <strong>
                  زمان معمول پاسخ‌گویی
                </strong>

                <span>
                  کمتر از یک روز کاری
                </span>
              </div>
            </div>
          </div>

          <div class="contact-side-panel__footer">
            <span>
              بازبیا
            </span>

            <small>
              انتخابی که تکرار می‌کنید
            </small>
          </div>
        </aside>
      </section>

      <!-- Map -->
      <section class="contact-map-section">
        <div class="contact-map-section__header">
          <div>
            <span class="section-heading__eyebrow">
              موقعیت فروشگاه
            </span>

            <h2 class="contact-map-section__title">
              بازبیا روی نقشه
            </h2>
          </div>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            class="map-link"
          >
            مشاهده در نقشه
          </a>
        </div>

        <div class="contact-map">
          <iframe
            src="https://www.google.com/maps?q=Shahr-e%20Qods%20Tehran&output=embed"
            width="100%"
            height="420"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="موقعیت فروشگاه بازبیا"
          ></iframe>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { contactService } from '@/services/contact.service'

type FeedbackType = 'success' | 'error' | ''

interface ContactForm {
  name: string
  phone: string
  email: string
  subject: string
  orderNumber: string
  message: string
}

interface FeedbackState {
  type: FeedbackType
  message: string
}

interface ApiValidationErrors {
  [field: string]: string[] | string | undefined
}

interface ApiRequestError extends Error {
  responseData?: ApiValidationErrors
}

const loading = ref(false)

const form = reactive<ContactForm>({
  name: '',
  phone: '',
  email: '',
  subject: '',
  orderNumber: '',
  message: ''
})

const feedback = reactive<FeedbackState>({
  type: '',
  message: ''
})

const resetForm = (): void => {
  form.name = ''
  form.phone = ''
  form.email = ''
  form.subject = ''
  form.orderNumber = ''
  form.message = ''
}

const toEnglishDigits = (value: string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩'

  return value
    .replace(/[۰-۹]/g, digit =>
      String(persianDigits.indexOf(digit))
    )
    .replace(/[٠-٩]/g, digit =>
      String(arabicDigits.indexOf(digit))
    )
}

const normalizePhone = (value: string): string => {
  return toEnglishDigits(value)
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .trim()
}

const normalizeOrderNumber = (
  value: string
): number | null => {
  const normalizedValue = toEnglishDigits(value).trim()

  if (!normalizedValue) {
    return null
  }

  const orderNumber = Number(normalizedValue)

  if (
    !Number.isInteger(orderNumber) ||
    orderNumber <= 0
  ) {
    throw new Error('شماره سفارش معتبر نیست.')
  }

  return orderNumber
}

const getValidationErrorMessage = (
  responseData?: ApiValidationErrors
): string | null => {
  if (!responseData) {
    return null
  }

  const fieldLabels: Record<string, string> = {
    name: 'نام و نام خانوادگی',
    phone: 'شماره تماس',
    email: 'ایمیل',
    subject: 'موضوع',
    order_number: 'شماره سفارش',
    message: 'متن پیام',
    detail: 'خطا'
  }

  for (const [field, errors] of Object.entries(responseData)) {
    if (!errors) {
      continue
    }

    const label = fieldLabels[field] ?? field

    if (Array.isArray(errors) && errors.length > 0) {
      return `${label}: ${errors[0]}`
    }

    if (typeof errors === 'string') {
      return `${label}: ${errors}`
    }
  }

  return null
}

const validateForm = (): void => {
  if (form.name.trim().length < 3) {
    throw new Error(
      'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد.'
    )
  }

  const normalizedPhone = normalizePhone(form.phone)

  if (!/^09\d{9}$/.test(normalizedPhone)) {
    throw new Error(
      'شماره موبایل را به‌صورت صحیح وارد کنید.'
    )
  }

  if (!form.subject) {
    throw new Error('موضوع پیام را انتخاب کنید.')
  }

  if (form.message.trim().length < 10) {
    throw new Error(
      'متن پیام باید حداقل ۱۰ کاراکتر باشد.'
    )
  }

  if (form.message.trim().length > 1000) {
    throw new Error(
      'متن پیام نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد.'
    )
  }
}

const handleSubmit = async (): Promise<void> => {
  if (loading.value) {
    return
  }

  feedback.type = ''
  feedback.message = ''

  try {
    validateForm()

    loading.value = true

    const orderNumber = normalizeOrderNumber(
      form.orderNumber
    )

    const response = await contactService.sendMessage({
      name: form.name.trim(),
      phone: normalizePhone(form.phone),
      email: form.email.trim() || undefined,
      subject: form.subject,
      order_number: orderNumber,
      message: form.message.trim()
    })

    feedback.type = 'success'
    feedback.message =
      response.message ||
      'پیام شما با موفقیت ثبت شد.'

    resetForm()
  } catch (error: unknown) {
    console.error(
      'Contact form submit error:',
      error
    )

    feedback.type = 'error'

    if (error instanceof Error) {
      const requestError = error as ApiRequestError

      const validationMessage =
        getValidationErrorMessage(
          requestError.responseData
        )

      feedback.message =
        validationMessage ||
        error.message ||
        'ارسال پیام با خطا مواجه شد.'
    } else {
      feedback.message =
        'ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.'
    }
  } finally {
    loading.value = false
  }
}
</script><script setup lang="ts">
import { reactive, ref } from 'vue'
import { contactService } from '@/services/contact.service'

type FeedbackType = 'success' | 'error' | ''

interface ContactForm {
  name: string
  phone: string
  email: string
  subject: string
  orderNumber: string
  message: string
}

interface FeedbackState {
  type: FeedbackType
  message: string
}

interface ApiValidationErrors {
  [field: string]: string[] | string | undefined
}

interface ApiRequestError extends Error {
  responseData?: ApiValidationErrors
}

const loading = ref(false)

const form = reactive<ContactForm>({
  name: '',
  phone: '',
  email: '',
  subject: '',
  orderNumber: '',
  message: ''
})

const feedback = reactive<FeedbackState>({
  type: '',
  message: ''
})

const resetForm = (): void => {
  form.name = ''
  form.phone = ''
  form.email = ''
  form.subject = ''
  form.orderNumber = ''
  form.message = ''
}

const toEnglishDigits = (value: string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩'

  return value
    .replace(/[۰-۹]/g, digit =>
      String(persianDigits.indexOf(digit))
    )
    .replace(/[٠-٩]/g, digit =>
      String(arabicDigits.indexOf(digit))
    )
}

const normalizePhone = (value: string): string => {
  return toEnglishDigits(value)
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .trim()
}

const normalizeOrderNumber = (
  value: string
): number | null => {
  const normalizedValue = toEnglishDigits(value).trim()

  if (!normalizedValue) {
    return null
  }

  const orderNumber = Number(normalizedValue)

  if (
    !Number.isInteger(orderNumber) ||
    orderNumber <= 0
  ) {
    throw new Error('شماره سفارش معتبر نیست.')
  }

  return orderNumber
}

const getValidationErrorMessage = (
  responseData?: ApiValidationErrors
): string | null => {
  if (!responseData) {
    return null
  }

  const fieldLabels: Record<string, string> = {
    name: 'نام و نام خانوادگی',
    phone: 'شماره تماس',
    email: 'ایمیل',
    subject: 'موضوع',
    order_number: 'شماره سفارش',
    message: 'متن پیام',
    detail: 'خطا'
  }

  for (const [field, errors] of Object.entries(responseData)) {
    if (!errors) {
      continue
    }

    const label = fieldLabels[field] ?? field

    if (Array.isArray(errors) && errors.length > 0) {
      return `${label}: ${errors[0]}`
    }

    if (typeof errors === 'string') {
      return `${label}: ${errors}`
    }
  }

  return null
}

const validateForm = (): void => {
  if (form.name.trim().length < 3) {
    throw new Error(
      'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد.'
    )
  }

  const normalizedPhone = normalizePhone(form.phone)

  if (!/^09\d{9}$/.test(normalizedPhone)) {
    throw new Error(
      'شماره موبایل را به‌صورت صحیح وارد کنید.'
    )
  }

  if (!form.subject) {
    throw new Error('موضوع پیام را انتخاب کنید.')
  }

  if (form.message.trim().length < 10) {
    throw new Error(
      'متن پیام باید حداقل ۱۰ کاراکتر باشد.'
    )
  }

  if (form.message.trim().length > 1000) {
    throw new Error(
      'متن پیام نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد.'
    )
  }
}

const handleSubmit = async (): Promise<void> => {
  if (loading.value) {
    return
  }

  feedback.type = ''
  feedback.message = ''

  try {
    validateForm()

    loading.value = true

    const orderNumber = normalizeOrderNumber(
      form.orderNumber
    )

    const response = await contactService.sendMessage({
      name: form.name.trim(),
      phone: normalizePhone(form.phone),
      email: form.email.trim() || undefined,
      subject: form.subject,
      order_number: orderNumber,
      message: form.message.trim()
    })

    feedback.type = 'success'
    feedback.message =
      response.message ||
      'پیام شما با موفقیت ثبت شد.'

    resetForm()
  } catch (error: unknown) {
    console.error(
      'Contact form submit error:',
      error
    )

    feedback.type = 'error'

    if (error instanceof Error) {
      const requestError = error as ApiRequestError

      const validationMessage =
        getValidationErrorMessage(
          requestError.responseData
        )

      feedback.message =
        validationMessage ||
        error.message ||
        'ارسال پیام با خطا مواجه شد.'
    } else {
      feedback.message =
        'ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-page {
  --contact-primary: #059669;
  --contact-primary-dark: #047857;
  --contact-primary-light: #ecfdf5;
  --contact-accent: #f59e0b;
  --contact-text: #1f2937;
  --contact-muted: #6b7280;
  --contact-border: #e5e7eb;
  --contact-surface: #ffffff;
  --contact-background: #f8fafc;

  min-height: 100vh;
  overflow: hidden;
  direction: rtl;
  background:
    radial-gradient(
      circle at top right,
      rgba(5, 150, 105, 0.07),
      transparent 28rem
    ),
    var(--contact-background);
  color: var(--contact-text);
}

.contact-container {
  width: min(1280px, calc(100% - 32px));
  margin: 0 auto;
}

/* Hero */
.contact-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 440px;
  display: flex;
  align-items: center;
  background:
    linear-gradient(
      135deg,
      #064e3b 0%,
      #047857 52%,
      #059669 100%
    );
}

.contact-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image:
    linear-gradient(
      rgba(255, 255, 255, 0.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.035) 1px,
      transparent 1px
    );
  background-size: 42px 42px;
}

.contact-hero__shape {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  filter: blur(2px);
}

.contact-hero__shape--one {
  width: 360px;
  height: 360px;
  top: -160px;
  left: -80px;
  background: rgba(255, 255, 255, 0.08);
}

.contact-hero__shape--two {
  width: 260px;
  height: 260px;
  right: 8%;
  bottom: -160px;
  background: rgba(245, 158, 11, 0.15);
}

.contact-hero__content {
  padding-top: 70px;
  padding-bottom: 70px;
  text-align: center;
  color: #ffffff;
}

.contact-hero__badge {
  display: inline-flex;
  margin-bottom: 20px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.88rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.contact-hero__title {
  margin: 0;
  font-size: clamp(2.3rem, 7vw, 4.3rem);
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.04em;
}

.contact-hero__title span {
  color: #fbbf24;
}

.contact-hero__description {
  max-width: 690px;
  margin: 22px auto 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 1.08rem;
  line-height: 2;
}

.contact-hero__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.hero-action {
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 13px;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.hero-action:hover {
  transform: translateY(-2px);
}

.hero-action--primary {
  background: #ffffff;
  color: var(--contact-primary-dark);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.16);
}

.hero-action--secondary {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.09);
  color: #ffffff;
}

.hero-action__icon,
.submit-button svg {
  width: 20px;
  height: 20px;
}

.hero-action__icon svg,
.submit-button svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Shared heading */
.section-heading {
  max-width: 700px;
  margin: 0 auto 38px;
  text-align: center;
}

.section-heading__eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--contact-primary);
  font-size: 0.88rem;
  font-weight: 800;
}

.section-heading__title,
.contact-map-section__title {
  margin: 0;
  color: var(--contact-text);
  font-size: clamp(1.65rem, 4vw, 2.25rem);
  font-weight: 900;
  line-height: 1.55;
}

.section-heading__description {
  margin: 12px 0 0;
  color: var(--contact-muted);
  line-height: 1.9;
}

/* Contact cards */
.contact-info-section {
  padding: 78px 0 40px;
}

.contact-info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.contact-card {
  min-height: 205px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  padding: 24px;
  border: 1px solid var(--contact-border);
  border-radius: 20px;
  background: var(--contact-surface);
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.045);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
  border-color: rgba(5, 150, 105, 0.28);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.contact-card__icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: var(--contact-primary-light);
  color: var(--contact-primary);
}

.contact-card__icon svg {
  width: 25px;
  height: 25px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.contact-card__title {
  margin: 0 0 9px;
  color: var(--contact-text);
  font-size: 1.05rem;
  font-weight: 900;
}

.contact-card__text {
  margin: 0;
  color: var(--contact-muted);
  line-height: 1.85;
}

.contact-card__link {
  display: inline-block;
  color: var(--contact-primary-dark);
  font-weight: 800;
  text-decoration: none;
}

.contact-card__link:hover {
  text-decoration: underline;
}

.contact-card__hint {
  display: block;
  margin-top: 7px;
  color: #9ca3af;
  font-size: 0.79rem;
}

/* Main content */
.contact-main-section {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 0.8fr);
  align-items: stretch;
  gap: 22px;
  padding: 46px 0;
}

.contact-form-card,
.contact-side-panel {
  border-radius: 24px;
}

.contact-form-card {
  padding: clamp(24px, 5vw, 42px);
  border: 1px solid var(--contact-border);
  background: var(--contact-surface);
  box-shadow: 0 18px 55px rgba(15, 23, 42, 0.06);
}

.contact-form-card__header {
  margin-bottom: 30px;
}

.contact-form-card__badge,
.contact-side-panel__badge {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
}

.contact-form-card__badge {
  background: var(--contact-primary-light);
  color: var(--contact-primary-dark);
}

.contact-form-card__title {
  margin: 0;
  color: var(--contact-text);
  font-size: clamp(1.55rem, 4vw, 2.05rem);
  font-weight: 900;
}

.contact-form-card__description {
  margin: 12px 0 0;
  color: var(--contact-muted);
  line-height: 1.9;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.form-group {
  min-width: 0;
}

.form-group label {
  display: block;
  margin-bottom: 9px;
  color: #374151;
  font-size: 0.88rem;
  font-weight: 800;
}

.form-group label span {
  color: #dc2626;
}

.form-control-wrapper {
  position: relative;
}

.form-control-icon {
  position: absolute;
  top: 50%;
  right: 15px;
  width: 19px;
  height: 19px;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.form-control-icon svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dbe2ea;
  border-radius: 13px;
  background: #ffffff;
  color: var(--contact-text);
  font: inherit;
  font-size: 0.94rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-group input,
.form-group select {
  min-height: 52px;
  padding: 0 15px;
}

.form-control-wrapper input {
  padding-right: 46px;
}

.form-group textarea {
  min-height: 150px;
  padding: 15px;
  resize: vertical;
  line-height: 1.9;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #a1a8b3;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--contact-primary);
  box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.09);
}

.message-counter {
  margin-top: 7px;
  color: #9ca3af;
  font-size: 0.75rem;
  text-align: left;
  direction: ltr;
}

.form-feedback {
  padding: 13px 15px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.8;
}

.form-feedback--success {
  border: 1px solid #a7f3d0;
  background: #ecfdf5;
  color: #047857;
}

.form-feedback--error {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.submit-button {
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 14px;
  background:
    linear-gradient(
      135deg,
      var(--contact-primary-dark),
      var(--contact-primary)
    );
  color: #ffffff;
  font: inherit;
  font-size: 0.98rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(5, 150, 105, 0.2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 17px 34px rgba(5, 150, 105, 0.28);
}

.submit-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.submit-button__spinner {
  width: 19px;
  height: 19px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: contact-spin 0.7s linear infinite;
}

@keyframes contact-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Side panel */
.contact-side-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    linear-gradient(
      145deg,
      #064e3b,
      #047857
    );
  color: #ffffff;
  box-shadow: 0 20px 50px rgba(6, 78, 59, 0.16);
}

.contact-side-panel__content {
  flex: 1;
  padding: 34px 30px;
}

.contact-side-panel__badge {
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.09);
  color: #ffffff;
}

.contact-side-panel__title {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 900;
  line-height: 1.7;
}

.support-checklist {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 30px 0;
  padding: 0;
  list-style: none;
}

.support-checklist li {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.88rem;
  line-height: 1.9;
}

.support-checklist__icon {
  flex: 0 0 auto;
  width: 23px;
  height: 23px;
  display: grid;
  place-items: center;
  margin-top: 2px;
  border-radius: 50%;
  background: rgba(251, 191, 36, 0.16);
  color: #fbbf24;
  font-size: 0.78rem;
  font-weight: 900;
}

.response-time {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.07);
}

.response-time__icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.response-time__icon svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: #fbbf24;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.response-time strong,
.response-time span {
  display: block;
}

.response-time strong {
  font-size: 0.88rem;
}

.response-time span {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.78rem;
}

.contact-side-panel__footer {
  padding: 22px 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.08);
}

.contact-side-panel__footer span,
.contact-side-panel__footer small {
  display: block;
}

.contact-side-panel__footer span {
  font-size: 1.3rem;
  font-weight: 900;
}

.contact-side-panel__footer small {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.65);
}

/* Map */
.contact-map-section {
  padding: 35px 0 80px;
}

.contact-map-section__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.map-link {
  flex: 0 0 auto;
  color: var(--contact-primary-dark);
  font-size: 0.88rem;
  font-weight: 800;
  text-decoration: none;
}

.map-link:hover {
  text-decoration: underline;
}

.contact-map {
  overflow: hidden;
  border: 1px solid var(--contact-border);
  border-radius: 24px;
  background: #e5e7eb;
  box-shadow: 0 16px 45px rgba(15, 23, 42, 0.07);
}

.contact-map iframe {
  display: block;
  border: 0;
}

/* Responsive */
@media (max-width: 1100px) {
  .contact-info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .contact-main-section {
    grid-template-columns: 1fr;
  }

  .contact-side-panel {
    min-height: 430px;
  }
}

@media (max-width: 700px) {
  .contact-container {
    width: min(100% - 24px, 1280px);
  }

  .contact-hero {
    min-height: 400px;
  }

  .contact-hero__content {
    padding-top: 55px;
    padding-bottom: 55px;
  }

  .contact-hero__description {
    font-size: 0.95rem;
  }

  .contact-info-section {
    padding-top: 55px;
  }

  .contact-info-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .contact-main-section {
    padding-top: 28px;
  }

  .contact-map-section__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .contact-map iframe {
    height: 330px;
  }
}

@media (max-width: 480px) {
  .contact-hero__actions,
  .hero-action {
    width: 100%;
  }

  .contact-card {
    padding: 20px;
  }

  .contact-form-card {
    padding: 22px 17px;
    border-radius: 18px;
  }

  .contact-side-panel {
    border-radius: 18px;
  }

  .contact-side-panel__content {
    padding: 26px 20px;
  }
}
</style>
