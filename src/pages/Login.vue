<!-- src/pages/Login.vue -->
<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- هدر -->
        <div class="auth-header">
          <h1 class="auth-title">ورود به فروشگاه</h1>
          <p class="auth-subtitle">برای استفاده از امکانات فروشگاه وارد شوید</p>
        </div>

        <!-- خطای عمومی -->
        <transition name="fade">
          <div v-if="authError" class="alert alert--error">
            <AlertCircle :size="18" />
            <span>{{ authError }}</span>
            <button @click="clearError" class="alert__close">×</button>
          </div>
        </transition>

        <!-- فرم ورود -->
        <form @submit.prevent="handleLogin" class="auth-form">
          <!-- ایمیل یا موبایل -->
          <div class="form-group">
            <label for="username" class="form-label">
              ایمیل یا شماره موبایل
            </label>
            <div 
              class="input-wrapper"
              :class="{ 'input-wrapper--error': errors.username }"
            >
              <span class="input-icon">
                <Mail v-if="isEmailMode" :size="18" />
                <Phone v-else :size="18" />
              </span>
              <input 
                type="text" 
                id="username"
                v-model="form.username"
                class="form-input"
                :class="{ 'form-input--error': errors.username }"
                :placeholder="inputPlaceholder"
                @blur="validateField('username')"
                @input="handleUsernameInput"
                autocomplete="username"
                dir="ltr"
              />
            </div>
            <transition name="fade">
              <span v-if="errors.username" class="error-message">
                {{ errors.username }}
              </span>
            </transition>
          </div>

          <!-- رمز عبور -->
          <div class="form-group">
            <label for="password" class="form-label">
              رمز عبور
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
                placeholder="رمز عبور خود را وارد کنید"
                @blur="validateField('password')"
                @input="clearFieldError('password')"
                autocomplete="current-password"
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
            <transition name="fade">
              <span v-if="errors.password" class="error-message">
                {{ errors.password }}
              </span>
            </transition>
          </div>

          <!-- گزینه‌های اضافی -->
          <div class="form-options">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="form.remember"
                class="checkbox-input"
              />
              <span class="checkbox-text">مرا به خاطر بسپار</span>
            </label>
            
            <router-link to="/forgot-password" class="forgot-link">
              رمز عبور را فراموش کرده‌اید؟
            </router-link>
          </div>

          <!-- دکمه ورود -->
          <button 
            type="submit" 
            class="auth-btn"
            :disabled="loading || !isFormValid"
          >
            <span v-if="!loading">ورود</span>
            <span v-else class="btn-loading">
              <Loader :size="18" class="spin" />
              در حال ورود...
            </span>
          </button>
        </form>

        <!-- خط جداکننده -->
        <div class="auth-divider">
          <span>یا</span>
        </div>

        <!-- لینک ثبت‌نام -->
        <div class="auth-footer">
          <p class="auth-footer-text">حساب کاربری ندارید؟</p>
          <router-link to="/register" class="auth-link">
            ثبت‌نام کنید
            <ArrowLeft :size="16" />
          </router-link>
        </div>

        <!-- خرید به عنوان مهمان -->
        <router-link to="/" class="guest-link">
          <ArrowRight :size="16" />
          <span>ادامه خرید به عنوان مهمان</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Loader,
  ArrowLeft,
  ArrowRight 
} from 'lucide-vue-next'
import { useAuthStore } from '@/core/store/authStore'

// ========== Types ==========
interface LoginForm {
  username: string
  password: string
  remember: boolean
}

interface FormErrors {
  username: string
  password: string
}

interface LoginCredentials {
  username: string
  password: string
}

// ========== Router ==========
const router = useRouter()
const route = useRoute()

// ========== Store ==========
const authStore = useAuthStore()

// ========== State ==========
const form = reactive<LoginForm>({
  username: '',
  password: '',
  remember: false
})

const errors = reactive<FormErrors>({
  username: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const authError = ref<string | null>(null)

// ========== Computed ==========
const isEmailMode = computed(() => {
  return form.username.includes('@')
})

const inputPlaceholder = computed(() => {
  return isEmailMode.value 
    ? 'example@email.com' 
    : '۰۹۱۲۳۴۵۶۷۸۹'
})

const isFormValid = computed(() => {
  return form.username.trim() !== '' && form.password.trim() !== ''
})

// ========== Validation ==========
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  // پشتیبانی از فرمت‌های مختلف: 09123456789, 9123456789, +989123456789
  const phoneRegex = /^(0|98|\+98)?9\d{9}$/
  const cleanPhone = phone.replace(/\s/g, '')
  return phoneRegex.test(cleanPhone)
}

const validateField = (field: keyof FormErrors): void => {
  if (field === 'username') {
    const value = form.username.trim()
    
    if (!value) {
      errors.username = 'این فیلد نمی‌تواند خالی باشد'
    } else if (value.includes('@')) {
      if (!validateEmail(value)) {
        errors.username = 'ایمیل وارد شده معتبر نیست'
      } else {
        errors.username = ''
      }
    } else {
      if (!validatePhone(value)) {
        errors.username = 'شماره موبایل وارد شده معتبر نیست'
      } else {
        errors.username = ''
      }
    }
  }
  
  if (field === 'password') {
    if (!form.password) {
      errors.password = 'رمز عبور نمی‌تواند خالی باشد'
    } else if (form.password.length < 6) {
      errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
    } else {
      errors.password = ''
    }
  }
}

const clearFieldError = (field: keyof FormErrors): void => {
  errors[field] = ''
}

const handleUsernameInput = (): void => {
  errors.username = ''
}

const clearError = (): void => {
  authError.value = null
}

// ========== Login Handler ==========
const handleLogin = async (): Promise<void> => {
  // اعتبارسنجی نهایی
  validateField('username')
  validateField('password')
  
  if (errors.username || errors.password) {
    return
  }
  
  loading.value = true
  authError.value = null

  try {
    const credentials: LoginCredentials = {
      username: form.username,
      password: form.password
    }
    
    await authStore.login(credentials)
    
    // ذخیره وضعیت "مرا به خاطر بسپار"
    try {
      if (form.remember) {
        localStorage.setItem('remember_username', form.username)
      } else {
        localStorage.removeItem('remember_username')
      }
    } catch (e) {
      console.error('خطا در دسترسی به localStorage:', e)
    }
    
    // هدایت به صفحه قبلی یا خانه
    const redirectPath = route.query.redirect?.toString() || '/'
    await router.push(redirectPath)
    
  } catch (error: any) {
    authError.value = error.response?.data?.message || 'نام کاربری یا رمز عبور اشتباه است'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

// ========== Lifecycle ==========
onMounted(() => {
  // بارگذاری نام کاربری ذخیره شده
  try {
    const remembered = localStorage.getItem('remember_username')
    if (remembered) {
      form.username = remembered
      form.remember = true
    }
  } catch (e) {
    console.error('خطا در خواندن از localStorage:', e)
  }
})
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
  max-width: 450px;
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

.alert__close {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #dc2626;
  padding: 0 0.25rem;
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

/* ===== Form Options ===== */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #4b5563;
  font-size: 0.9rem;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-text {
  user-select: none;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #764ba2;
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
  margin: 1.5rem 0;
  position: relative;
}

.auth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
  z-index: 1;
}

.auth-divider span {
  background: white;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.9rem;
  position: relative;
  z-index: 2;
}

/* ===== Footer ===== */
.auth-footer {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.auth-footer-text {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}

.auth-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;
}

.auth-link:hover {
  color: #764ba2;
  gap: 0.5rem;
}

/* ===== Guest Link ===== */
.guest-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  padding: 0.5rem;
  border-radius: 8px;
}

.guest-link:hover {
  color: #667eea;
  background: #f9fafb;
  gap: 0.75rem;
}

/* ===== Animations ===== */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .auth-page {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 1.5rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
