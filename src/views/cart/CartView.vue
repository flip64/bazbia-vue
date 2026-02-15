<template>
  <div class="cart-page">
    <div class="cart-container">
      <h1 class="cart-title">سبد خرید</h1>

      <div v-if="cartItems.length === 0" class="cart-empty">
        <p>سبد خرید شما خالی است</p>
        <router-link to="/products" class="continue-shopping">
          ادامه خرید
        </router-link>
      </div>

      <div v-else class="cart-content">
        <!-- لیست محصولات -->
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <img :src="item.image" :alt="item.name" class="cart-item__image">
            
            <div class="cart-item__info">
              <h3>{{ item.name }}</h3>
              <p class="cart-item__price">{{ item.price }} تومان</p>
            </div>

            <div class="cart-item__quantity">
              <button @click="decreaseQuantity(item.id)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQuantity(item.id)">+</button>
            </div>

            <div class="cart-item__total">
              {{ item.price * item.quantity }} تومان
            </div>

            <button @click="removeItem(item.id)" class="cart-item__remove">
              🗑️
            </button>
          </div>
        </div>

        <!-- خلاصه سبد خرید -->
        <div class="cart-summary">
          <h2>خلاصه سفارش</h2>
          
          <div class="summary-row">
            <span>تعداد کالاها:</span>
            <span>{{ totalItems }}</span>
          </div>
          
          <div class="summary-row">
            <span>مبلغ کل:</span>
            <span>{{ totalPrice }} تومان</span>
          </div>
          
          <div class="summary-row">
            <span>هزینه ارسال:</span>
            <span>رایگان</span>
          </div>
          
          <div class="summary-total">
            <span>مبلغ قابل پرداخت:</span>
            <span>{{ totalPrice }} تومان</span>
          </div>

          <router-link to="/checkout" class="checkout-btn">
            ادامه فرآیند خرید
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

const cartItems = ref<CartItem[]>([
  {
    id: 1,
    name: 'محصول ۱',
    price: 250000,
    quantity: 2,
    image: 'https://via.placeholder.com/100x100?text=محصول+1'
  },
  {
    id: 2,
    name: 'محصول ۲',
    price: 350000,
    quantity: 1,
    image: 'https://via.placeholder.com/100x100?text=محصول+2'
  }
])

const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()
})

const increaseQuantity = (id: number) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item) item.quantity++
}

const decreaseQuantity = (id: number) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item && item.quantity > 1) item.quantity--
}

const removeItem = (id: number) => {
  cartItems.value = cartItems.value.filter(i => i.id !== id)
}
</script>

<style scoped>
.cart-page {
  padding: 2rem;
  min-height: 70vh;
}

.cart-container {
  max-width: 1280px;
  margin: 0 auto;
}

.cart-title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 2rem;
}

.cart-empty {
  text-align: center;
  padding: 4rem;
  background: #f9fafb;
  border-radius: 12px;
}

.cart-empty p {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.continue-shopping {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item__image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.cart-item__info h3 {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 0.25rem;
}

.cart-item__price {
  color: #6b7280;
  font-size: 0.9rem;
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.cart-item__quantity button {
  width: 30px;
  height: 30px;
  background: white;
  border: none;
  cursor: pointer;
}

.cart-item__quantity span {
  width: 40px;
  text-align: center;
}

.cart-item__total {
  font-weight: bold;
  color: #374151;
}

.cart-item__remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.cart-item__remove:hover {
  opacity: 1;
}

.cart-summary {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  height: fit-content;
}

.cart-summary h2 {
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
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

.checkout-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  background: #667eea;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.checkout-btn:hover {
  background: #5a67d8;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      "image info remove"
      "image quantity total";
    gap: 0.5rem;
  }

  .cart-item__image {
    grid-area: image;
  }

  .cart-item__info {
    grid-area: info;
  }

  .cart-item__quantity {
    grid-area: quantity;
  }

  .cart-item__total {
    grid-area: total;
    text-align: left;
  }

  .cart-item__remove {
    grid-area: remove;
  }
}
</style>
