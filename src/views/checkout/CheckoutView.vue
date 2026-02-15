<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <h1 class="checkout-title">تسویه حساب</h1>

      <div class="checkout-content">
        <!-- فرم اطلاعات -->
        <div class="checkout-form">
          <div class="form-section">
            <h2>اطلاعات ارسال</h2>
            
            <div class="form-group">
              <label>نام و نام خانوادگی</label>
              <input type="text" v-model="form.fullName" placeholder="نام و نام خانوادگی">
            </div>

            <div class="form-group">
              <label>شماره موبایل</label>
              <input type="tel" v-model="form.phone" placeholder="۰۹xxxxxxxxx">
            </div>

            <div class="form-group">
              <label>آدرس</label>
              <textarea v-model="form.address" rows="3" placeholder="آدرس کامل"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>شهر</label>
                <input type="text" v-model="form.city" placeholder="شهر">
              </div>
              <div class="form-group">
                <label>کد پستی</label>
                <input type="text" v-model="form.postalCode" placeholder="کد پستی">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2>روش ارسال</h2>
            
            <label class="shipping-option">
              <input type="radio" value="express" v-model="form.shipping">
              <div>
                <strong>ارسال اکسپرس</strong>
                <span>۴۸ ساعته - ۵۰,۰۰۰ تومان</span>
              </div>
            </label>

            <label class="shipping-option">
              <input type="radio" value="normal" v-model="form.shipping">
              <div>
                <strong>ارسال عادی</strong>
                <span>۳ تا ۵ روز کاری - رایگان</span>
              </div>
            </label>
          </div>

          <div class="form-section">
            <h2>روش پرداخت</h2>
            
            <label class="payment-option">
              <input type="radio" value="online" v-model="form.payment" checked>
              <div>
                <strong>پرداخت آنلاین</strong>
                <span>با تمام کارت‌های عضو شتاب</span>
              </div>
            </label>

            <label class="payment-option">
              <input type="radio" value="cod" v-model="form.payment">
              <div>
                <strong>پرداخت در محل</strong>
                <span>هنگام تحویل سفارش</span>
              </div>
            </label>
          </div>
        </div>

        <!-- خلاصه سفارش -->
        <div class="order-summary">
          <h2>خلاصه سفارش</h2>
          
          <div class="summary-items">
            <div v-for="item in cartItems" :key="item.id" class="summary-item">
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span>{{ item.price * item.quantity }} تومان</span>
            </div>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row">
            <span>جمع کل:</span>
            <span>{{ subtotal }} تومان</span>
          </div>

          <div class="summary-row">
            <span>هزینه ارسال:</span>
            <span>{{ shippingCost }} تومان</span>
          </div>

          <div class="summary-total">
            <span>قابل پرداخت:</span>
            <span>{{ total }} تومان</span>
          </div>

          <button class="payment-btn" @click="submitOrder">
            ثبت سفارش
          </button>

          <p class="notice">
            با ثبت سفارش، شرایط و قوانین فروشگاه را می‌پذیرم.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

const cartItems = ref<CartItem[]>([
  { id: 1, name: 'محصول ۱', price: 250000, quantity: 2 },
  { id: 2, name: 'محصول ۲', price: 350000, quantity: 1 }
])

const form = ref({
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  shipping: 'normal',
  payment: 'online'
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()
})

const shippingCost = computed(() => {
  return form.value.shipping === 'express' ? '۵۰,۰۰۰' : '۰'
})

const total = computed(() => {
  const subtotalNum = cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingNum = form.value.shipping === 'express' ? 50000 : 0
  return (subtotalNum + shippingNum).toLocaleString()
})

const submitOrder = () => {
  // اینجا به API وصل میشه
  alert('سفارش شما با موفقیت ثبت شد! (نمونه)')
  router.push('/')
}
</script>

<style scoped>
.checkout-page {
  padding: 2rem;
  min-height: 70vh;
  background: #f8f9fa;
}

.checkout-container {
  max-width: 1280px;
  margin: 0 auto;
}

.checkout-title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 2rem;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
}

.checkout-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h2 {
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.shipping-option,
.payment-option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.shipping-option:hover,
.payment-option:hover {
  border-color: #667eea;
  background: #f5f7ff;
}

.shipping-option input,
.payment-option input {
  margin-top: 0.25rem;
}

.shipping-option strong,
.payment-option strong {
  display: block;
  color: #374151;
  margin-bottom: 0.25rem;
}

.shipping-option span,
.payment-option span {
  font-size: 0.9rem;
  color: #6b7280;
}

.order-summary {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.order-summary h2 {
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 1.5rem;
}

.summary-items {
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-size: 0.95rem;
}

.summary-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 1rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #6b7280;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
  font-weight: bold;
  font-size: 1.2rem;
  color: #374151;
}

.payment-btn {
  width: 100%;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-bottom: 1rem;
}

.payment-btn:hover {
  background: #5a67d8;
}

.notice {
  font-size: 0.85rem;
  color: #9ca3af;
  text-align: center;
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
