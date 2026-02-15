<template>
  <div class="profile-page">
    <div class="profile-container">
      <h1 class="profile-title">پروفایل من</h1>

      <div class="profile-content">
        <!-- سایدبار -->
        <div class="profile-sidebar">
          <div class="profile-avatar">
            <div class="avatar">
              {{ userInitial }}
            </div>
            <h3>{{ user.fullName }}</h3>
            <p>{{ user.email }}</p>
          </div>

          <nav class="profile-nav">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="profile-nav__item"
              :class="{ 'profile-nav__item--active': activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- محتوای اصلی -->
        <div class="profile-main">
          <!-- اطلاعات شخصی -->
          <div v-if="activeTab === 'info'" class="profile-section">
            <h2>اطلاعات شخصی</h2>
            
            <div class="form-group">
              <label>نام</label>
              <input type="text" v-model="user.firstName">
            </div>

            <div class="form-group">
              <label>نام خانوادگی</label>
              <input type="text" v-model="user.lastName">
            </div>

            <div class="form-group">
              <label>ایمیل</label>
              <input type="email" v-model="user.email" disabled>
            </div>

            <div class="form-group">
              <label>شماره موبایل</label>
              <input type="tel" v-model="user.phone">
            </div>

            <button class="save-btn" @click="saveProfile">ذخیره تغییرات</button>
          </div>

          <!-- آدرس‌ها -->
          <div v-else-if="activeTab === 'addresses'" class="profile-section">
            <h2>آدرس‌های من</h2>
            
            <div v-for="address in addresses" :key="address.id" class="address-card">
              <p>{{ address.fullAddress }}</p>
              <p>{{ address.city }}، {{ address.postalCode }}</p>
              <div class="address-actions">
                <button @click="editAddress(address)">ویرایش</button>
                <button @click="deleteAddress(address.id)">حذف</button>
              </div>
            </div>

            <button class="add-btn" @click="showAddressForm = true">
              + افزودن آدرس جدید
            </button>
          </div>

          <!-- تغییر رمز -->
          <div v-else-if="activeTab === 'security'" class="profile-section">
            <h2>تغییر رمز عبور</h2>
            
            <div class="form-group">
              <label>رمز فعلی</label>
              <input type="password" v-model="passwords.current">
            </div>

            <div class="form-group">
              <label>رمز جدید</label>
              <input type="password" v-model="passwords.new">
            </div>

            <div class="form-group">
              <label>تکرار رمز جدید</label>
              <input type="password" v-model="passwords.confirm">
            </div>

            <button class="save-btn" @click="changePassword">تغییر رمز</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('info')

const tabs = [
  { id: 'info', name: 'اطلاعات شخصی' },
  { id: 'addresses', name: 'آدرس‌ها' },
  { id: 'orders', name: 'سفارش‌ها' },
  { id: 'security', name: 'امنیت' }
]

const user = ref({
  firstName: 'علی',
  lastName: 'رضایی',
  email: 'ali@example.com',
  phone: '۰۹۱۲۳۴۵۶۷۸۹'
})

const userInitial = computed(() => {
  return (user.value.firstName[0] || '').toUpperCase()
})

const addresses = ref([
  {
    id: 1,
    fullAddress: 'تهران، خیابان ولیعصر، کوچه ۱۲، پلاک ۳۴',
    city: 'تهران',
    postalCode: '۱۲۳۴۵۶۷۸۹۰'
  }
])

const passwords = ref({
  current: '',
  new: '',
  confirm: ''
})

const saveProfile = () => {
  alert('اطلاعات با موفقیت ذخیره شد (نمونه)')
}

const changePassword = () => {
  if (passwords.value.new !== passwords.value.confirm) {
    alert('رمز جدید و تکرار آن یکسان نیستند')
    return
  }
  alert('رمز عبور با موفقیت تغییر کرد (نمونه)')
}

const editAddress = (address: any) => {
  console.log('ویرایش آدرس:', address)
}

const deleteAddress = (id: number) => {
  addresses.value = addresses.value.filter(a => a.id !== id)
}
</script>

<style scoped>
.profile-page {
  padding: 2rem;
  min-height: 70vh;
  background: #f8f9fa;
}

.profile-container {
  max-width: 1280px;
  margin: 0 auto;
}

.profile-title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 2rem;
}

.profile-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.profile-sidebar {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.profile-avatar {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.profile-avatar h3 {
  color: #374151;
  margin-bottom: 0.25rem;
}

.profile-avatar p {
  color: #6b7280;
  font-size: 0.9rem;
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-nav__item {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 8px;
  text-align: right;
  font-size: 1rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-nav__item:hover {
  background: #f3f4f6;
}

.profile-nav__item--active {
  background: #667eea;
  color: white;
}

.profile-main {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.profile-section h2 {
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.save-btn {
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-btn:hover {
  background: #5a67d8;
}

.address-card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.address-card p {
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.address-actions {
  display: flex;
  gap: 1rem;
}

.address-actions button {
  padding: 0.25rem 1rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.address-actions button:hover {
  background: #f3f4f6;
}

.add-btn {
  width: 100%;
  padding: 1rem;
  background: #f3f4f6;
  color: #4b5563;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #e5e7eb;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}
</style>
