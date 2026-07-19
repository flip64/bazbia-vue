
<!-- src/pages/Register.vue -->

<template>
  <div class="register-page">
    <div class="register-card">
      <h1>ثبت نام</h1>

      <form @submit.prevent="handleRegister">

        <div class="form-group">
          <label>نام و نام خانوادگی</label>
          <input
            v-model="form.full_name"
            type="text"
            placeholder="نام کامل"
          />
        </div>

        <div class="form-group">
          <label>شماره موبایل</label>
          <input
            v-model="form.phone"
            type="text"
            placeholder="09123456789"
          />
        </div>

        <div class="form-group">
          <label>ایمیل</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@gmail.com"
          />
        </div>

        <div class="form-group">
          <label>رمز عبور</label>
          <input
            v-model="form.password"
            type="password"
          />
        </div>

        <div class="form-group">
          <label>تکرار رمز عبور</label>
          <input
            v-model="form.password2"
            type="password"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'در حال ثبت نام...' : 'ثبت نام' }}
        </button>

      </form>

      <p v-if="error" class="error">
        {{ error }}
      </p>

      <router-link to="/login">
        ورود به حساب
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/store/authStore'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  full_name: '',
  phone: '',
  email: '',
  password: '',
  password2: ''
})

const handleRegister = async () => {
  error.value = ''

  if (!form.full_name) {
    error.value = 'نام را وارد کنید'
    return
  }

  if (!form.phone) {
    error.value = 'شماره موبایل را وارد کنید'
    return
  }

  if (form.password.length < 8) {
    error.value = 'رمز عبور حداقل 8 کاراکتر باشد'
    return
  }

  if (form.password !== form.password2) {
    error.value = 'رمز عبور یکسان نیست'
    return
  }

  loading.value = true

  try {
    await authStore.register({
      username: form.phone,
      full_name: form.full_name,
      phone: form.phone,
      email: form.email,
      password: form.password,
      password2: form.password2
    })

    router.push('/login')

  } catch (err: any) {
    error.value =
      err?.response?.data?.detail ||
      err?.message ||
      'خطا در ثبت نام'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
}

.register-card {
  width: 100%;
  max-width: 450px;
  background: white;
  padding: 24px;
  border-radius: 12px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 12px;
}
</style>
