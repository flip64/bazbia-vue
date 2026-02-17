<!-- src/pages/Register.vue -->
<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- هدر -->
        <div class="auth-header">
          <h1 class="auth-title">ثبت‌نام در فروشگاه</h1>
          <p class="auth-subtitle">برای استفاده از امکانات فروشگاه ثبت‌نام کنید</p>
        </div>

        <!-- خطای عمومی -->
        <transition name="fade">
          <div v-if="authError" class="alert alert--error">
            <AlertCircle :size="18" />
            <span>{{ authError }}</span>
            <button @click="clearError" class="alert__close">×</button>
          </div>
        </transition>

        <!-- خطاهای اعتبارسنجی سرور -->
        <transition name="fade">
          <div v-if="serverErrors.length" class="alert alert--validation">
            <AlertCircle :size="18" />
            <ul class="server-errors">
              <li v-for="(error, index) in serverErrors" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
        </transition>

        <form @submit.prevent="handleRegister" class="auth-form">
          <!-- نام کامل (full_name) -->
          <div class="form-group">
            <label for="fullName" class="form-label">
              نام و نام خانوادگی
            </label>
            <div 
              class="input-wrapper"
              :class="{ 'input-wrapper--error': errors.fullName }"
            >
              <span class="input-icon">
                <User :size="18" />
              </span>
              <input 
                type="text" 
                id="fullName"
                v-model="form.full_name"
                class="form-input"
                :class="{ 'form-input--error': errors.fullName }"
                placeholder="نام و نام خانوادگی خود را وارد کنید"
                @blur="validateField('fullName')"
                @input="clearFieldError('fullName')"
              />
            </div>
            <transition name="fade">
              <span v-if="errors.fullName" class="error-message">
                {{ errors.fullName }}
              </span>
            </transition>
          </div>

          <!-- شماره موبایل (phone) - اجباری -->
          <div class="form-group">
            <label for="phone" class="form-label">
              شماره موبایل <span class="required-star">*</span>
            </label>
            <div 
              class="input-wrapper"
              :class="{ 'input-wrapper--error': errors.phone }"
            >
              <span class="input-icon">
                <Phone :size="18" />
              </span>
              <input 
                type="tel" 
                id="phone"
                v-model="form.phone"
                class="form-input"
                :class="{ 'form-input--error': errors.phone }"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                @blur="validateField('phone')"
                @input="clearFieldError('phone')"
                dir="ltr"
              />
            </div>
            <transition name="fade">
              <span v-if="errors.phone" class="error-message">
                {{ errors.phone }}
              </span>
            </transition>
          </div>

          <!-- ایمیل (email) - اختیاری -->
          <div class="form-group">
            <label for="email" class="form-label">
              ایمیل <span class="optional-text">(اختیاری)</span>
            </label>
            <div 
              class="input-wrapper"
              :class="{ 'input-wrapper--error': errors.email }"
            >
              <span class="input-icon">
                <Mail :size="18" />
              </span>
              <input 
                type="email" 
                id="email"
                v-model="form.email"
                class="form-input"
                :class="{ 'form-input--error': errors.email }"
                placeholder="example@email.com"
                @blur="validateField('email')"
                @input="clearFieldError('email')"
                dir="ltr"
              />
            </div>
            <transition name="fade">
              <span v-if="errors.email" class="error-message">
                {{ errors.email }}
              </span>
            </transition>
          </div>

          <!-- رمز عبور (password) -->
          <div class="form-group">
            <label for="password" class="form-label">
              رمز عبور <span class="required-star">*</span>
            </label>
            <div 
              class="input-wrapper"
              :class="{ 'input-wrapper--error': errors.password }"
            >
              <span class="input-icon">
                <Lock :size="18" />
              </span>
              <input 
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="form.password"
                class="form-input"
                :class="{ 'form-input--error': errors.password }"
                placeholder="حداقل ۸ کاراکتر"
                @blur="validateField('password')"
                @input="clearFieldError('password')"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'"
              >
                <Eye v-if="!showPassword" :size="18" />
                <EyeOff v-else :size="18" />
              </button>
            </div>
            <!-- معیارهای رمز عبور -->
            <div class="password-criteria">
              <div 
                class="criteria-item"
                :class="{ 'criteria-item--valid': passwordValid.length }"
              >
                <CheckCircle :size="14" />
                <span>حداقل ۸ کاراکتر</span>
              </div>
              <div 
                class="criteria-item"
                :class="{ 'criteria-item--valid': passwordValid.hasNumber }"
              >
                <CheckCircle :size="14" />
                <span>حداقل یک عدد</span>
              </div>
              <div 
                class="criteria-item"
                :class="{ 'criteria-item--valid': passwordValid.hasLetter }"
              >
                <CheckCircle :size="14" />
                <span>حداقل یک حرف</span>
              </div>
            </div>
            <transition name="fade">
              <span v-if="errors.password" class="error-message">
                {{ errors.password }}
              </span>
            </transition>
          </div>

          <!-- تکرار رمز عبور (password2) -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">
              تکرار رمز عبور <span class="required-star">*</span>
            </label>
            <div 
              class="input-wrapper"
              :class="{ 'input-wrapper--error': errors.confirmPassword }"
            >
              <span class="input-icon">
                <Lock :size="18" />
              </span>
              <input 
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="form.password2"
                class="form-input"
                :class="{ 'form-input--error': errors.confirmPassword }"
                placeholder="رمز عبور را مجدد وارد کنید"
                @blur="validateField('confirmPassword')"
                @input="clearFieldError('confirmPassword')"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
                :aria-label="showConfirmPassword ? 'مخفی کردن رمز' : 'نمایش رمز'"
              >
                <Eye v-if="!showConfirmPassword" :size="18" />
                <EyeOff v-else :size="18" />
              </button>
            </div>
            <transition name="fade">
              <span v-if="errors.confirmPassword" class="error-message">
                {{ errors.confirmPassword }}
              </span>
            </transition>
          </div>

          <!-- شرط و قوانین -->
          <div class="form-check">
            <input 
              type="checkbox" 
              id="terms"
              v-model="form.acceptTerms"
              class="checkbox-input"
              :class="{ 'checkbox-input--error': errors.terms }"
              @change="clearFieldError('terms')"
            />
            <label for="terms" class="checkbox-label">
              <a href="/terms" target="_blank" class="terms-link">قوانین و مقررات</a> را می‌پذیرم
            </label>
          </div>
          <transition name="fade">
            <span v-if="errors.terms" class="error-message">
              {{ errors.terms }}
            </span>
          </transition>

          <!-- دکمه ثبت‌نام -->
          <button 
            type="submit" 
            class="auth-btn"
            :disabled="loading || !isFormValid"
          >
            <span v-if="!loading">ثبت‌نام</span>
            <span v-else class="btn-loading">
              <Loader :size="18" class="spin" />
              در حال ثبت‌نام...
            </span>
          </button>
        </form>

        <!-- خط جداکننده -->
        <div class="auth-divider">
          <span>یا</span>
        </div>

        <!-- لینک ورود -->
        <div class="auth-footer">
          <p class="auth-footer-text">قبلاً ثبت‌نام کرده‌اید؟</p>
          <router-link to="/login" class="auth-link">
            وارد شوید
            <ArrowLeft :size="16" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowLeft 
} from 'lucide-vue-next'
import { useAuthStore } from '@/core/store/authStore'
import type { RegisterData } from '@/modules/auth/types/user'

// ========== Router ==========
const router = useRouter()

// ========== Store ==========
const authStore = useAuthStore()

// ========== State ==========
const form = reactive({
  full_name: '',
  phone: '',
  email: '',
  password: '',
  password2: '',
  acceptTerms: false
})

const errors = reactive({
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: ''
})

const serverErrors = ref<string[]>([])
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const authError = ref<string | null>(null)

// ========== Computed ==========
const isFormValid = computed(() => {
  return (
    form.full_name.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.password.trim() !== '' &&
    form.password2.trim() !== '' &&
    form.acceptTerms &&
    !errors.fullName &&
    !errors.phone &&
    !errors.password &&
    !errors.confirmPassword
  )
})

const passwordValid = computed(() => ({
  length: form.password.length >= 8,
  hasNumber: /[0-9]/.test(form.password),
  hasLetter: /[a-zA-Z]/.test(form.password)
}))

// ========== Validation ==========
const validatePhone = (phone: string): boolean => {
  // پشتیبانی از فرمت‌های 09123456789، 9123456789، 989123456789
  const phoneRegex = /^(0|98)?9\d{9}$/
  const cleanPhone = phone.replace(/\s/g, '')
  return phoneRegex.test(cleanPhone)
}

const validateEmail = (email: string): boolean => {
  if (!email) return true // ایمیل اختیاریه
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateField = (field: string) => {
  switch (field) {
    case 'fullName':
      if (!form.full_name.trim()) {
        errors.fullName = 'نام و نام خانوادگی نمی‌تواند خالی باشد'
      } else if (form.full_name.trim().length < 3) {
        errors.fullName = 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد'
      } else {
        errors.fullName = ''
      }
      break
      
    case 'phone':
      if (!form.phone.trim()) {
        errors.phone = 'شماره موبایل نمی‌تواند خالی باشد'
      } else if (!validatePhone(form.phone)) {
        errors.phone = 'شماره موبایل وارد شده معتبر نیست'
      } else {
        errors.phone = ''
      }
      break
      
    case 'email':
      if (form.email && !validateEmail(form.email)) {
        errors.email = 'ایمیل وارد شده معتبر نیست'
      } else {
        errors.email = ''
      }
      break
      
    case 'password':
      if (!form.password) {
        errors.password = 'رمز عبور نمی‌تواند خالی باشد'
      } else if (form.password.length < 8) {
        errors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد'
      } else if (!passwordValid.value.hasNumber || !passwordValid.value.hasLetter) {
        errors.password = 'رمز عبور باید شامل حرف و عدد باشد'
      } else {
        errors.password = ''
      }
      
      // بررسی همخوانی با تکرار رمز
      if (form.password2 && form.password !== form.password2) {
        errors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند'
      } else if (form.password2) {
        errors.confirmPassword = ''
      }
      break
      
    case 'confirmPassword':
      if (!form.password2) {
        errors.confirmPassword = 'تکرار رمز عبور نمی‌تواند خالی باشد'
      } else if (form.password !== form.password2) {
        errors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند'
      } else {
        errors.confirmPassword = ''
      }
      break
  }
}

const clearFieldError = (field: string) => {
  switch (field) {
    case 'fullName': errors.fullName = ''; break
    case 'phone': errors.phone = ''; break
    case 'email': errors.email = ''; break
    case 'password': errors.password = ''; break
    case 'confirmPassword': errors.confirmPassword = ''; break
    case 'terms': errors.terms = ''; break
  }
}

const clearError = () => {
  authError.value = null
  serverErrors.value = []
}

// ========== Register Handler ==========
const handleRegister = async () => {
  // اعتبارسنجی نهایی
  validateField('fullName')
  validateField('phone')
  validateField('email')
  validateField('password')
  validateField('confirmPassword')
  
  if (!form.acceptTerms) {
    errors.terms = 'برای ثبت‌نام باید قوانین را بپذیرید'
  }
  
  if (Object.values(errors).some(error => error !== '')) {
    return
  }

  loading.value = true
  authError.value = null
  serverErrors.value = []

  try {
    const registerData: RegisterData = {
      username: form.phone, // یا ایمیل، بسته به بک‌اند
      full_name: form.full_name,
      phone: form.phone,
      email: form.email || undefined,
      password: form.password,
      password2: form.password2
    }

    await authStore.register(registerData)
    
    // هدایت به صفحه ورود با پیام موفقیت
    router.push('/login?registered=true')
    
  } catch (error: any) {
    if (error.response?.data) {
      // نمایش خطاهای اعتبارسنجی سرور
      const serverData = error.response.data
      Object.keys(serverData).forEach(key => {
        if (Array.isArray(serverData[key])) {
          serverErrors.value.push(...serverData[key])
        } else if (typeof serverData[key] === 'string') {
          serverErrors.value.push(serverData[key])
        }
      })
    } else {
      authError.value = error.message || 'خطا در ثبت‌نام. لطفا دوباره تلاش کنید'
    }
    console.error('Register error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  direction: rtl;
}

.auth-container {
  width: 100%;
  max-width: 500px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 1.8rem;
  color: #374151;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.auth-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

/* ===== Alert ===== */
.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  position: relative;
}

.alert--error {
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #dc2626;
}

.alert--validation {
  background: #fff3e0;
  border: 1px solid #ffe0b2;
  color: #f57c00;
}

.alert__close {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: currentColor;
  padding: 0 0.25rem;
}

.server-errors {
  margin: 0;
  padding-right: 1.5rem;
}

/* ===== Form ===== */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required-star {
  color: #dc2626;
  font-size: 1.2rem;
  line-height: 1;
}

.optional-text {
  color: #9ca3af;
  font-size: 0.8rem;
  font-weight: normal;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 1rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input--error {
  border-color: #dc2626;
}

.input-wrapper--error .form-input {
  border-color: #dc2626;
}

.password-toggle {
  position: absolute;
  left: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.password-toggle:hover {
  color: #667eea;
}

.error-message {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* ===== Password Criteria ===== */
.password-criteria {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 8px;
}

.criteria-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.8rem;
}

.criteria-item--valid {
  color: #10b981;
}

/* ===== Checkbox ===== */
.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-input--error {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

.checkbox-label {
  color: #4b5563;
  font-size: 0.9rem;
  cursor: pointer;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
}

/* ===== Button ===== */
.auth-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* ===== Divider ===== */
.auth-divider {
  text-align: center;
  marg
