<!-- views/CartView.vue -->
<template>
  <div class="cart-page" dir="rtl">
    <!-- Header -->
    <div class="cart-header">
      <h1>سبد خرید</h1>
      <span class="item-count">{{ cartStore.totalItems }} کالا</span>
    </div>

    <!-- Empty Cart -->
    <div v-if="cartStore.isEmpty" class="empty-cart">
      <ShoppingBag class="empty-icon" :size="64" />
      <h2>سبد خرید شما خالی است</h2>
      <p>برای مشاهده محصولات بیشتر به صفحه محصولات بروید</p>
      <router-link to="/products" class="continue-shopping-btn">
        مشاهده محصولات
      </router-link>
    </div>

    <!-- Cart Items -->
    <div v-else class="cart-content">
      <div class="cart-items">
        <CartItemCard
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
          @update-quantity="handleUpdateQuantity"
          @remove="handleRemoveItem"
        />
        
        <!-- Continue Shopping -->
        <router-link to="/products" class="continue-link">
          <ArrowRight class="icon" />
          ادامه خرید
        </router-link>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
        <h3>خلاصه سبد خرید</h3>
        
        <div class="summary-row">
          <span>تعداد کالاها</span>
          <span>{{ cartStore.totalItems }}</span>
        </div>
        
        <div class="summary-row">
          <span>مبلغ کل</span>
          <span>{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        
        <div class="summary-row">
          <span>هزینه ارسال</span>
          <span>
            <span v-if="cartStore.shippingCost === 0" class="free-shipping">رایگان</span>
            <span v-else>{{ formatPrice(cartStore.shippingCost) }}</span>
          </span>
        </div>
        
        <div class="summary-total">
          <span>مبلغ قابل پرداخت</span>
          <span class="total-price">{{ formatPrice(cartStore.finalPrice) }}</span>
        </div>
        
        <!-- Free shipping progress -->
        <div v-if="cartStore.shippingCost > 0" class="shipping-progress">
          <p>{{ formatPrice(500000 - cartStore.totalPrice) }} دیگر خرید کنید تا ارسال رایگان شود</p>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: Math.min((cartStore.totalPrice / 500000) * 100, 100) + '%' }"
            ></div>
          </div>
        </div>
        
        <button 
          class="checkout-btn"
          @click="goToCheckout"
          :disabled="cartStore.isEmpty"
        >
          ادامه فرآیند خرید
        </button>
        
        <!-- Suggestions -->
        <div class="suggestions">
          <h4>پیشنهاد ویژه</h4>
          <div class="suggestion-items">
            <ProductCardMini
              v-for="product in suggestedProducts"
              :key="product.id"
              :product="product"
              @add-to-cart="handleAddSuggested"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingBag, ArrowRight } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import CartItemCard from '@/components/CartItemCard.vue'
import ProductCardMini from '@/components/ProductCardMini.vue'
import { formatPrice } from '@/services/api'

const router = useRouter()
const cartStore = useCartStore()
const suggestedProducts = ref([])

// Load suggestions
onMounted(async () => {
  // Get random products for suggestions
  const response = await fetch('https://api.example.com/products?random=3')
  suggestedProducts.value = await response.json()
})

const handleUpdateQuantity = (itemId: number, quantity: number) => {
  cartStore.updateQuantity(itemId, quantity)
}

const handleRemoveItem = (itemId: number) => {
  if (confirm('آیا از حذف این کالا مطمئن هستید؟')) {
    cartStore.removeItem(itemId)
  }
}

const handleAddSuggested = (product: any) => {
  cartStore.addItem(product, 1)
}

const goToCheckout = () => {
  router.push('/checkout')
}
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.cart-header h1 {
  font-size: 1.8rem;
  color: #333;
}

.item-count {
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: #666;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: #f9f9f9;
  border-radius: 12px;
}

.empty-icon {
  color: #999;
  margin-bottom: 1rem;
}

.empty-cart h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: #666;
  margin-bottom: 2rem;
}

.continue-shopping-btn {
  display: inline-block;
  background: #4CAF50;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s;
}

.continue-shopping-btn:hover {
  background: #45a049;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1rem;
}

.continue-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #4CAF50;
  text-decoration: none;
  border-top: 1px solid #eee;
}

.continue-link:hover {
  background: #f9f9f9;
}

.cart-summary {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.cart-summary h3 {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4CAF50;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 2px solid #eee;
  border-bottom: 2px solid #eee;
  font-weight: bold;
  color: #333;
}

.total-price {
  color: #4CAF50;
  font-size: 1.2rem;
}

.free-shipping {
  color: #4CAF50;
  font-weight: bold;
}

.shipping-progress {
  margin: 1rem 0;
  padding: 1rem;
  background: #f0f8ff;
  border-radius: 8px;
}

.shipping-progress p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-bottom: 2rem;
}

.checkout-btn:hover:not(:disabled) {
  background: #45a049;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.suggestions h4 {
  color: #333;
  margin-bottom: 1rem;
}

.suggestion-items {
  display: grid;
  gap: 1rem;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}
</style>
