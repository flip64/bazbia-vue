<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">ثبت‌نام در فروشگاه</h1>
          <p class="auth-subtitle">برای استفاده از امکانات فروشگاه ثبت‌نام کنید</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <!-- نام و نام خانوادگی -->
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">نام</label>
              <input 
                type="text" 
                id="firstName"
                v-model="form.firstName"
                placeholder="نام خود را وارد کنید"
                required
              >
            </div>

            <div class="form-group">
              <label for="lastName">نام خانوادگی</label>
              <input 
                type="text" 
                id="lastName"
                v-model="form.lastName"
                placeholder="نام خانوادگی خود را وارد کنید"
                required
              >
            </div>
          </div>

          <!-- ایمیل -->
          <div class="form-group">
            <label for="email">ایمیل</label>
            <input 
              type="email" 
              id="email"
              v-model="form.email"
              placeholder="example@email.com"
              required
            >
          </div>

          <!-- شماره موبایل -->
          <div class="form-group">
            <label for="phone">شماره موبایل</label>
            <input 
              type="tel" 
              id="phone"
              v-model="form.phone"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              required
            >
          </div>

          <!-- رمز عبور -->
          <div class="form-group">
            <label for="password">رمز عبور</label>
            <input 
              type="password" 
              id="password"
              v-model="form.password"
              placeholder="حداقل ۸ کاراکتر"
              required
            >
          </div>

          <!-- تکرار رمز عبور -->
          <div class="form-group">
            <label for="confirmPassword">تکرار رمز عبور</label>
            <input 
              type="password" 
              id="confirmPassword"
              v-model="form.confirmPassword"
              placeholder="رمز عبور را مجدد وارد کنید"
              required
            >
          </div>

          <!-- شرط و قوانین -->
          <div class="form-check">
            <input 
              type="checkbox" 
              id="terms"
              v-model="form.acceptTerms"
              required
            >
            <label for="terms">
              <a href="/terms" target="_blank">قوانین و مقررات</a> را می‌پذیرم
            </label>
          </div>

          <!-- دکمه ثبت‌نام -->
          <button 
            type="submit" 
            class="auth-btn"
            :disabled="loading"
          >
            <span v-if="!loading">ثبت‌نام</span>
            <span v-else>در حال ثبت‌نام...</span>
          </button>
        </form>

        <!-- خط جداکننده -->
        <div class="auth-divider">
          <span>یا</span>
        </div>

        <!-- لینک ورود -->
        <div class="auth-footer">
          <p>قبلاً ثبت‌نام کرده‌اید؟</p>
          <router-link to="/login" class="auth-link">
            وارد شوید
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const handleRegister = async () => {
  // اعتبارسنجی
  if (form.value.password !== form.value.confirmPassword) {
    alert('رمز عبور و تکرار آن یکسان نیستند')
    return
  }

  if (form.value.password.length < 8) {
    alert('رمز عبور باید حداقل ۸ کاراکتر باشد')
    return
  }

  loading.value = true

  try {
    // شبیه‌سازی درخواست به سرور
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('ثبت‌نام با اطلاعات:', form.value)
    
    // هدایت به صفحه ورود
    alert('ثبت‌نام با موفقیت انجام شد')
    router.push('/login')
    
  } catch (error) {
    console.error('خطا در ثبت‌نام:', error)
    alert('خطا در ثبت‌نام. لطفا دوباره تلاش کنید')
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
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 1.8rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  direction: rtl;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder {
  color: #9ca3af;
  font-size: 0.9rem;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.form-check input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-check label {
  color: #4b5563;
  font-size: 0.9rem;
  cursor: pointer;
}

.form-check a {
  color: #667eea;
  text-decoration: none;
}

.form-check a:hover {
  text-decoration: underline;
}

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

.auth-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-footer p {
  color: #6b7280;
  font-size: 0.95rem;
}

.auth-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-card {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .auth-title {
    font-size: 1.5rem;
  }
}
</style>
