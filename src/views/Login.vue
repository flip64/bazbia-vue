<!-- src/views/Login.vue -->
<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- هدر -->
        <div class="auth-header">
          <h1 class="auth-title">ورود به بازبیا</h1>

          <p class="auth-subtitle">
            برای مشاهده سفارش‌ها و مدیریت حساب وارد شوید
          </p>
        </div>

        <!-- انتخاب روش ورود -->
        <div
          v-if="otpStep === 'phone'"
          class="auth-tabs"
        >
          <button
            type="button"
            class="auth-tab"
            :class="{ 'auth-tab--active': loginMode === 'otp' }"
            @click="changeLoginMode('otp')"
          >
            <MessageSquareText :size="18" />
            ورود با کد تأیید
          </button>

          <button
            type="button"
            class="auth-tab"
            :class="{ 'auth-tab--active': loginMode === 'password' }"
            @click="changeLoginMode('password')"
          >
            <LockKeyhole :size="18" />
            ورود با رمز
          </button>
        </div>

        <!-- خطای عمومی -->
        <transition name="fade">
          <div
            v-if="authError"
            class="alert alert--error"
          >
            <AlertCircle :size="18" />

            <span>{{ authError }}</span>

            <button
              type="button"
              class="alert__close"
              aria-label="بستن پیام خطا"
              @click="clearError"
            >
              ×
            </button>
          </div>
        </transition>

        <!-- پیام موفقیت -->
        <transition name="fade">
          <div
            v-if="successMessage"
            class="alert alert--success"
          >
            <CircleCheck :size="18" />
            <span>{{ successMessage }}</span>
          </div>
        </transition>

        <!-- ورود با رمز -->
        <form
          v-if="loginMode === 'password'"
          class="auth-form"
          @submit.prevent="handlePasswordLogin"
        >
          <!-- شماره موبایل -->
          <div class="form-group">
            <label
              for="password-phone"
              class="form-label"
            >
              شماره موبایل
            </label>

            <div
              class="input-wrapper"
              :class="{
                'input-wrapper--error': passwordErrors.phone
              }"
            >
              <span class="input-icon">
                <Phone :size="18" />
              </span>

              <input
                id="password-phone"
                v-model="passwordForm.phone"
                type="tel"
                inputmode="numeric"
                class="form-input"
                :class="{
                  'form-input--error': passwordErrors.phone
                }"
                placeholder="09123456789"
                autocomplete="username"
                dir="ltr"
                maxlength="13"
                @blur="validatePasswordField('phone')"
                @input="handlePasswordPhoneInput"
              />
            </div>

            <transition name="fade">
              <span
                v-if="passwordErrors.phone"
                class="error-message"
              >
                {{ passwordErrors.phone }}
              </span>
            </transition>
          </div>

          <!-- رمز عبور -->
          <div class="form-group">
            <label
              for="password"
              class="form-label"
            >
              رمز عبور
            </label>

            <div
              class="input-wrapper"
              :class="{
                'input-wrapper--error': passwordErrors.password
              }"
            >
              <span class="input-icon">
                <Lock :size="18" />
              </span>

              <input
                id="password"
                v-model="passwordForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input form-input--with-left-icon"
                :class="{
                  'form-input--error': passwordErrors.password
                }"
                placeholder="رمز عبور خود را وارد کنید"
                autocomplete="current-password"
                @blur="validatePasswordField('password')"
                @input="clearPasswordFieldError('password')"
              />

              <button
                type="button"
                class="password-toggle"
                :aria-label="
                  showPassword
                    ? 'مخفی کردن رمز'
                    : 'نمایش رمز'
                "
                @click="showPassword = !showPassword"
              >
                <Eye
                  v-if="!showPassword"
                  :size="18"
                />

                <EyeOff
                  v-else
                  :size="18"
                />
              </button>
            </div>

            <transition name="fade">
              <span
                v-if="passwordErrors.password"
                class="error-message"
              >
                {{ passwordErrors.password }}
              </span>
            </transition>
          </div>

          <!-- گزینه‌ها -->
          <div class="form-options">
            <label class="checkbox-label">
              <input
                v-model="passwordForm.remember"
                type="checkbox"
                class="checkbox-input"
              />

              <span class="checkbox-text">
                شماره من را به خاطر بسپار
              </span>
            </label>

            <button
              type="button"
              class="text-button"
              @click="changeLoginMode('otp')"
            >
              رمز عبور را فراموش کرده‌اید؟
            </button>
          </div>

          <!-- دکمه ورود -->
          <button
            type="submit"
            class="auth-btn"
            :disabled="loading || !isPasswordFormComplete"
          >
            <span v-if="!loading">
              ورود با رمز عبور
            </span>

            <span
              v-else
              class="btn-loading"
            >
              <Loader
                :size="18"
                class="spin"
              />
              در حال ورود...
            </span>
          </button>
        </form>

        <!-- درخواست کد OTP -->
        <form
          v-else-if="otpStep === 'phone'"
          class="auth-form"
          @submit.prevent="handleRequestOtp"
        >
          <div class="otp-description">
            <ShieldCheck :size="28" />

            <p>
              شماره موبایل خود را وارد کنید تا کد ورود برایتان ارسال شود.
            </p>
          </div>

          <div class="form-group">
            <label
              for="otp-phone"
              class="form-label"
            >
              شماره موبایل
            </label>

            <div
              class="input-wrapper"
              :class="{
                'input-wrapper--error': otpErrors.phone
              }"
            >
              <span class="input-icon">
                <Phone :size="18" />
              </span>

              <input
                id="otp-phone"
                v-model="otpForm.phone"
                type="tel"
                inputmode="numeric"
                class="form-input"
                :class="{
                  'form-input--error': otpErrors.phone
                }"
                placeholder="09123456789"
                autocomplete="tel"
                dir="ltr"
                maxlength="13"
                @blur="validateOtpPhone"
                @input="handleOtpPhoneInput"
              />
            </div>

            <transition name="fade">
              <span
                v-if="otpErrors.phone"
                class="error-message"
              >
                {{ otpErrors.phone }}
              </span>
            </transition>
          </div>

          <button
            type="submit"
            class="auth-btn"
            :disabled="loading || !otpForm.phone.trim()"
          >
            <span v-if="!loading">
              دریافت کد تأیید
            </span>

            <span
              v-else
              class="btn-loading"
            >
              <Loader
                :size="18"
                class="spin"
              />
              در حال ارسال...
            </span>
          </button>
        </form>

        <!-- تأیید کد OTP -->
        <form
          v-else
          class="auth-form"
          @submit.prevent="handleVerifyOtp"
        >
          <div class="otp-description">
            <MessageSquareText :size="28" />

            <p>
              کد ارسال‌شده به شماره
              <strong dir="ltr">
                {{ otpForm.phone }}
              </strong>
              را وارد کنید.
            </p>
          </div>

          <div class="form-group">
            <label
              for="otp-code"
              class="form-label"
            >
              کد تأیید
            </label>

            <div
              class="input-wrapper"
              :class="{
                'input-wrapper--error': otpErrors.code
              }"
            >
              <span class="input-icon">
                <KeyRound :size="18" />
              </span>

              <input
                id="otp-code"
                v-model="otpForm.code"
                type="text"
                inputmode="numeric"
                class="form-input otp-code-input"
                :class="{
                  'form-input--error': otpErrors.code
                }"
                placeholder="ــــــ"
                autocomplete="one-time-code"
                dir="ltr"
                maxlength="6"
                @blur="validateOtpCode"
                @input="handleOtpCodeInput"
              />
            </div>

            <transition name="fade">
              <span
                v-if="otpErrors.code"
                class="error-message"
              >
                {{ otpErrors.code }}
              </span>
            </transition>
          </div>

          <button
            type="submit"
            class="auth-btn"
            :disabled="loading || !isOtpCodeComplete"
          >
            <span v-if="!loading">
              تأیید و ورود
            </span>

            <span
              v-else
              class="btn-loading"
            >
              <Loader
                :size="18"
                class="spin"
              />
              در حال بررسی...
            </span>
          </button>

          <div class="otp-actions">
            <button
              type="button"
              class="text-button"
              :disabled="loading"
              @click="editPhoneNumber"
            >
              <Pencil :size="15" />
              ویرایش شماره
            </button>

            <button
              type="button"
              class="text-button"
              :disabled="loading || resendSeconds > 0"
              @click="handleResendOtp"
            >
              <RefreshCw :size="15" />

              <span v-if="resendSeconds > 0">
                ارسال دوباره تا {{ resendSeconds }} ثانیه
              </span>

              <span v-else>
                ارسال دوباره کد
              </span>
            </button>
          </div>
        </form>

        <!-- جداکننده -->
        <div class="auth-divider">
          <span>یا</span>
        </div>

        <!-- توضیح ایجاد حساب -->
        <div class="auth-footer">
          <p class="auth-footer-text">
            حساب کاربری ندارید؟
          </p>

          <button
            type="button"
            class="auth-link auth-link--button"
            @click="changeLoginMode('otp')"
          >
            با شماره موبایل وارد شوید
            <ArrowLeft :size="16" />
          </button>
        </div>

        <!-- خرید مهمان -->
        <router-link
          to="/"
          class="guest-link"
        >
          <ArrowRight :size="16" />
          <span>ادامه خرید به عنوان مهمان</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref
} from 'vue'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Eye,
  EyeOff,
  KeyRound,
  Loader,
  Lock,
  LockKeyhole,
  MessageSquareText,
  Pencil,
  Phone,
  RefreshCw,
  ShieldCheck
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/core/store/authStore'

type LoginMode = 'otp' | 'password'
type OtpStep = 'phone' | 'code'

interface PasswordLoginForm {
  phone: string
  password: string
  remember: boolean
}

interface PasswordFormErrors {
  phone: string
  password: string
}

interface OtpForm {
  phone: string
  code: string
  sessionId: string
}

interface OtpFormErrors {
  phone: string
  code: string
}

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loginMode = ref<LoginMode>('otp')
const otpStep = ref<OtpStep>('phone')
const showPassword = ref(false)
const successMessage = ref<string | null>(null)
const resendSeconds = ref(0)

let resendTimer: ReturnType<typeof setInterval> | null = null

const passwordForm = reactive<PasswordLoginForm>({
  phone: '',
  password: '',
  remember: false
})

const passwordErrors = reactive<PasswordFormErrors>({
  phone: '',
  password: ''
})

const otpForm = reactive<OtpForm>({
  phone: '',
  code: '',
  sessionId: ''
})

const otpErrors = reactive<OtpFormErrors>({
  phone: '',
  code: ''
})

const loading = computed(() => authStore.loading)
const authError = computed(() => authStore.error)

const isPasswordFormComplete = computed(() => {
  return Boolean(
    passwordForm.phone.trim() &&
    passwordForm.password
  )
})

const isOtpCodeComplete = computed(() => {
  return normalizeDigits(otpForm.code).length === 6
})

function normalizeDigits(value: string): string {
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

function normalizePhone(phone: string): string {
  let normalized = normalizeDigits(phone)
    .replace(/\s+/g, '')
    .replace(/-/g, '')

  if (normalized.startsWith('+98')) {
    normalized = `0${normalized.slice(3)}`
  } else if (normalized.startsWith('98')) {
    normalized = `0${normalized.slice(2)}`
  } else if (
    normalized.startsWith('9') &&
    normalized.length === 10
  ) {
    normalized = `0${normalized}`
  }

  return normalized
}

function validatePhone(phone: string): boolean {
  return /^09\d{9}$/.test(normalizePhone(phone))
}

function validatePasswordField(
  field: keyof PasswordFormErrors
): void {
  if (field === 'phone') {
    if (!passwordForm.phone.trim()) {
      passwordErrors.phone = 'شماره موبایل را وارد کنید.'
    } else if (!validatePhone(passwordForm.phone)) {
      passwordErrors.phone = 'شماره موبایل معتبر نیست.'
    } else {
      passwordErrors.phone = ''
    }
  }

  if (field === 'password') {
    if (!passwordForm.password) {
      passwordErrors.password = 'رمز عبور را وارد کنید.'
    } else if (passwordForm.password.length < 6) {
      passwordErrors.password =
        'رمز عبور باید حداقل ۶ کاراکتر باشد.'
    } else {
      passwordErrors.password = ''
    }
  }
}

function validateOtpPhone(): void {
  if (!otpForm.phone.trim()) {
    otpErrors.phone = 'شماره موبایل را وارد کنید.'
  } else if (!validatePhone(otpForm.phone)) {
    otpErrors.phone = 'شماره موبایل معتبر نیست.'
  } else {
    otpErrors.phone = ''
  }
}

function validateOtpCode(): void {
  const code = normalizeDigits(otpForm.code)

  if (!code) {
    otpErrors.code = 'کد تأیید را وارد کنید.'
  } else if (!/^\d{6}$/.test(code)) {
    otpErrors.code = 'کد تأیید باید ۶ رقم باشد.'
  } else {
    otpErrors.code = ''
  }
}

function clearPasswordFieldError(
  field: keyof PasswordFormErrors
): void {
  passwordErrors[field] = ''
  clearMessages()
}

function handlePasswordPhoneInput(): void {
  passwordErrors.phone = ''
  passwordForm.phone = normalizeDigits(passwordForm.phone)
  clearMessages()
}

function handleOtpPhoneInput(): void {
  otpErrors.phone = ''
  otpForm.phone = normalizeDigits(otpForm.phone)
  clearMessages()
}

function handleOtpCodeInput(): void {
  otpErrors.code = ''
  otpForm.code = normalizeDigits(otpForm.code)
    .replace(/\D/g, '')
    .slice(0, 6)

  clearMessages()
}

function clearMessages(): void {
  authStore.clearError()
  successMessage.value = null
}

function clearError(): void {
  authStore.clearError()
}

function changeLoginMode(mode: LoginMode): void {
  loginMode.value = mode
  otpStep.value = 'phone'

  otpForm.code = ''
  otpForm.sessionId = ''

  otpErrors.phone = ''
  otpErrors.code = ''

  passwordErrors.phone = ''
  passwordErrors.password = ''

  stopResendTimer()
  clearMessages()

  if (mode === 'otp' && !otpForm.phone) {
    otpForm.phone = passwordForm.phone
  }

  if (mode === 'password' && !passwordForm.phone) {
    passwordForm.phone = otpForm.phone
  }
}

async function redirectAfterLogin(): Promise<void> {
  const redirectQuery = route.query.redirect

  const redirectPath =
    typeof redirectQuery === 'string' &&
    redirectQuery.startsWith('/')
      ? redirectQuery
      : '/'

  await router.replace(redirectPath)
}

async function handlePasswordLogin(): Promise<void> {
  validatePasswordField('phone')
  validatePasswordField('password')

  if (
    passwordErrors.phone ||
    passwordErrors.password
  ) {
    return
  }

  clearMessages()

  const normalizedPhone = normalizePhone(
    passwordForm.phone
  )

  try {
    await authStore.login({
      phone: normalizedPhone,
      password: passwordForm.password
    })

    saveRememberedPhone(
      normalizedPhone,
      passwordForm.remember
    )

    await redirectAfterLogin()
  } catch {
    // متن خطا توسط authStore مدیریت می‌شود.
  }
}

async function handleRequestOtp(): Promise<void> {
  validateOtpPhone()

  if (otpErrors.phone) {
    return
  }

  clearMessages()

  const normalizedPhone = normalizePhone(otpForm.phone)

  try {
    const response = await authStore.requestOtp({
      phone: normalizedPhone
    })

    otpForm.phone = normalizedPhone
    otpForm.sessionId = response.session_id
    otpForm.code = ''

    otpStep.value = 'code'
    successMessage.value =
      response.message || 'کد تأیید ارسال شد.'

    startResendTimer(response.retry_after ?? 60)
  } catch {
    // متن خطا توسط authStore مدیریت می‌شود.
  }
}

async function handleVerifyOtp(): Promise<void> {
  validateOtpCode()

  if (otpErrors.code) {
    return
  }

  if (!otpForm.sessionId) {
    authStore.clearError()
    otpErrors.code =
      'شناسه درخواست وجود ندارد؛ کد را دوباره دریافت کنید.'
    return
  }

  clearMessages()

  try {
    await authStore.verifyOtp({
      phone: normalizePhone(otpForm.phone),
      session_id: otpForm.sessionId,
      code: normalizeDigits(otpForm.code)
    })

    await redirectAfterLogin()
  } catch {
    // متن خطا توسط authStore مدیریت می‌شود.
  }
}

async function handleResendOtp(): Promise<void> {
  if (resendSeconds.value > 0) {
    return
  }

  await handleRequestOtp()
}

function editPhoneNumber(): void {
  otpStep.value = 'phone'
  otpForm.code = ''
  otpForm.sessionId = ''
  otpErrors.code = ''

  stopResendTimer()
  clearMessages()
}

function startResendTimer(seconds: number): void {
  stopResendTimer()

  resendSeconds.value = Math.max(
    Math.floor(seconds),
    0
  )

  if (resendSeconds.value === 0) {
    return
  }

  resendTimer = setInterval(() => {
    resendSeconds.value -= 1

    if (resendSeconds.value <= 0) {
      stopResendTimer()
    }
  }, 1000)
}

function stopResendTimer(): void {
  if (resendTimer) {
    clearInterval(resendTimer)
    resendTimer = null
  }

  resendSeconds.value = 0
}

function saveRememberedPhone(
  phone: string,
  remember: boolean
): void {
  try {
    if (remember) {
      localStorage.setItem(
        'remember_phone',
        phone
      )
    } else {
      localStorage.removeItem('remember_phone')
    }
  } catch (storageError) {
    console.warn(
      'ذخیره شماره موبایل انجام نشد.',
      storageError
    )
  }
}

onMounted(() => {
  authStore.clearError()

  try {
    const rememberedPhone = localStorage.getItem(
      'remember_phone'
    )

    if (rememberedPhone) {
      passwordForm.phone = rememberedPhone
      otpForm.phone = rememberedPhone
      passwordForm.remember = true
    }
  } catch (storageError) {
    console.warn(
      'خواندن شماره ذخیره‌شده انجام نشد.',
      storageError
    )
  }
})

onBeforeUnmount(() => {
  stopResendTimer()
})
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background:
    linear-gradient(
      135deg,
      #dff8ee 0%,
      #e9f8df 48%,
      #d7f3df 100%
    );
  direction: rtl;
}

.auth-container {
  width: 100%;
  max-width: 460px;
}

.auth-card {
  padding: 2.5rem;
  background: #ffffff;
  border: 1px solid #e5eee8;
  border-radius: 22px;
  box-shadow: 0 20px 60px rgba(20, 83, 45, 0.16);
  animation: slide-up 0.45s ease;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.auth-title {
  margin: 0 0 0.5rem;
  color: #1f3d2c;
  font-size: 1.8rem;
  font-weight: 800;
}

.auth-subtitle {
  margin: 0;
  color: #6b7d72;
  font-size: 0.95rem;
  line-height: 1.8;
}

/* Tabs */
.auth-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.35rem;
  padding: 0.3rem;
  margin-bottom: 1.5rem;
  background: #f1f6f3;
  border-radius: 14px;
}

.auth-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 44px;
  padding: 0.65rem;
  color: #64736a;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  background: transparent;
  border: none;
  border-radius: 11px;
  cursor: pointer;
  transition: 0.2s ease;
}

.auth-tab--active {
  color: #15803d;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(22, 101, 52, 0.1);
}

/* Alert */
.alert {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.8rem 1rem;
  padding-left: 2.5rem;
  margin-bottom: 1.25rem;
  border-radius: 11px;
  font-size: 0.88rem;
  line-height: 1.7;
}

.alert--error {
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.alert--success {
  color: #166534;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.alert__close {
  position: absolute;
  top: 50%;
  left: 0.7rem;
  padding: 0.1rem 0.3rem;
  color: inherit;
  font-size: 1.25rem;
  line-height: 1;
  background: none;
  border: none;
  cursor: pointer;
  transform: translateY(-50%);
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #415448;
  font-size: 0.9rem;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 1rem;
  z-index: 1;
  display: flex;
  color: #90a096;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.8rem 2.7rem 0.8rem 1rem;
  color: #25372c;
  font-family: inherit;
  font-size: 1rem;
  background: #ffffff;
  border: 2px solid #e2e9e5;
  border-radius: 12px;
  transition: 0.2s ease;
}

.form-input--with-left-icon {
  padding-left: 2.7rem;
}

.form-input:focus {
  outline: none;
  border-color: #22a447;
  box-shadow: 0 0 0 3px rgba(34, 164, 71, 0.12);
}

.form-input--error,
.input-wrapper--error .form-input {
  border-color: #dc2626;
}

.otp-code-input {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.5rem;
  text-align: center;
}

.password-toggle {
  position: absolute;
  left: 1rem;
  display: flex;
  padding: 0;
  color: #90a096;
  background: none;
  border: none;
  cursor: pointer;
}

.password-toggle:hover {
  color: #15803d;
}

.error-message {
  color: #dc2626;
  font-size: 0.8rem;
}

/* Options */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #526159;
  font-size: 0.85rem;
  cursor: pointer;
}

.checkbox-input {
  width: 17px;
  height: 17px;
  accent-color: #16a34a;
}

.checkbox-text {
  user-select: none;
}

.text-button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0;
  color: #16823a;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
}

.text-button:hover:not(:disabled) {
  color: #0f642c;
}

.text-button:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

/* OTP */
.otp-description {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem;
  color: #496056;
  background: #f4faf6;
  border: 1px solid #dfece3;
  border-radius: 12px;
}

.otp-description svg {
  flex-shrink: 0;
  color: #16a34a;
}

.otp-description p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.8;
}

.otp-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* Button */
.auth-btn {
  min-height: 50px;
  padding: 0.9rem 1rem;
  margin-top: 0.25rem;
  color: #ffffff;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  background:
    linear-gradient(
      135deg,
      #16a34a 0%,
      #0f8a3a 100%
    );
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s ease;
}

.auth-btn:hover:not(:disabled) {
  box-shadow: 0 10px 24px rgba(22, 163, 74, 0.25);
  transform: translateY(-2px);
}

.auth-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Divider */
.auth-divider {
  position: relative;
  margin: 1.5rem 0;
  text-align: center;
}

.auth-divider::before {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  z-index: 1;
  height: 1px;
  content: '';
  background: #e5ebe7;
}

.auth-divider span {
  position: relative;
  z-index: 2;
  padding: 0 1rem;
  color: #829087;
  font-size: 0.85rem;
  background: #ffffff;
}

/* Footer */
.auth-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  flex-wrap: wrap;
  text-align: center;
}

.auth-footer-text {
  margin: 0;
  color: #69776f;
  font-size: 0.9rem;
}

.auth-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #16823a;
  font-weight: 700;
  text-decoration: none;
}

.auth-link--button {
  padding: 0;
  font-family: inherit;
  font-size: 0.9rem;
  background: none;
  border: none;
  cursor: pointer;
}

.auth-link:hover {
  color: #0f642c;
}

.guest-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.6rem;
  margin-top: 1.4rem;
  color: #849188;
  font-size: 0.88rem;
  text-decoration: none;
  border-radius: 8px;
  transition: 0.2s ease;
}

.guest-link:hover {
  gap: 0.7rem;
  color: #15803d;
  background: #f4faf6;
}

/* Animations */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .auth-page {
    min-height: calc(100vh - 120px);
    padding: 1rem;
  }

  .auth-card {
    padding: 1.5rem;
    border-radius: 17px;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .auth-tab {
    font-size: 0.75rem;
  }

  .form-options,
  .otp-actions {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>