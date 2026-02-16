<template>
  <div class="cart-item">
    <!-- تصویر محصول -->
    <div class="cart-item__image-wrapper">
      <img 
        :src="item.image" 
        :alt="item.name"
        @error="handleImageError"
        class="cart-item__image"
      />
    </div>
    
    <!-- جزئیات محصول -->
    <div class="cart-item__details">
      <h3 class="cart-item__name">{{ item.name }}</h3>
      
      <!-- تنوع محصول (رنگ، سایز و ...) -->
      <div v-if="item.variant" class="cart-item__variants">
        <span v-if="item.variant.color" class="cart-item__variant">
          <span 
            class="cart-item__color-dot" 
            :style="{ backgroundColor: getColorCode(item.variant.color) }"
          ></span>
          {{ item.variant.color }}
        </span>
        <span v-if="item.variant.size" class="cart-item__variant">
          سایز {{ item.variant.size }}
        </span>
      </div>
      
      <!-- قیمت -->
      <div class="cart-item__price">
        {{ formatPrice(item.price * item.quantity) }}
      </div>
      
      <!-- کنترل مقدار و دکمه حذف -->
      <div class="cart-item__actions">
        <!-- کنترل تعداد -->
        <div class="cart-item__quantity">
          <button 
            @click="decreaseQuantity"
            :disabled="item.quantity <= 1"
            class="cart-item__quantity-btn"
          >
            -
          </button>
          <input 
            type="number" 
            v-model.number="item.quantity"
            @change="handleQuantityChange"
            min="1"
            :max="item.maxStock"
            class="cart-item__quantity-input"
          />
          <button 
            @click="increaseQuantity"
            :disabled="item.quantity >= item.maxStock"
            class="cart-item__quantity-btn"
          >
            +
          </button>
        </div>
        
        <!-- دکمه حذف -->
        <button @click="removeItem" class="cart-item__remove-btn">
          <Trash2 :size="18" />
          حذف
        </button>
      </div>
      
      <!-- هشدار موجودی -->
      <p v-if="item.quantity >= item.maxStock" class="cart-item__stock-warning">
        حداکثر موجودی: {{ item.maxStock }} عدد
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'

// تعریف نوع برای آیتم سبد خرید
interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  image: string
  variant?: {
    color?: string
    size?: string
  }
  maxStock: number
}

// Props
const props = defineProps<{
  item: CartItem
}>()

// Emits
const emit = defineEmits<{
  (e: 'update-quantity', itemId: number, quantity: number): void
  (e: 'remove', itemId: number): void
}>()

// تابع formatPrice - تعریف شده در همین فایل
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

// مدیریت خطای تصویر
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/placeholder-product.jpg'
}

// تبدیل نام رنگ به کد رنگ
const getColorCode = (color: string): string => {
  const colors: Record<string, string> = {
    'مشکی': '#000000',
    'سفید': '#FFFFFF',
    'قرمز': '#FF0000',
    'آبی': '#0000FF',
    'سبز': '#00FF00',
    'زرد': '#FFFF00',
    'بنفش': '#800080',
    'نارنجی': '#FFA500',
    'صورتی': '#FFC0CB',
    'قهوه‌ای': '#8B4513',
    'طلایی': '#FFD700',
    'نقره‌ای': '#C0C0C0'
  }
  return colors[color] || '#CCCCCC'
}

// افزایش تعداد
const increaseQuantity = () => {
  if (props.item.quantity < props.item.maxStock) {
    emit('update-quantity', props.item.id, props.item.quantity + 1)
  }
}

// کاهش تعداد
const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.id, props.item.quantity - 1)
  }
}

// تغییر دستی تعداد
const handleQuantityChange = () => {
  let quantity = props.item.quantity
  
  // اعتبارسنجی
  if (isNaN(quantity) || quantity < 1) {
    quantity = 1
  }
  if (quantity > props.item.maxStock) {
    quantity = props.item.maxStock
  }
  
  emit('update-quantity', props.item.id, quantity)
}

// حذف آیتم
const removeItem = () => {
  emit('remove', props.item.id)
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.cart-item:hover {
  background-color: #fafafa;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item__image-wrapper {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #f0f0f0;
}

.cart-item__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.cart-item:hover .cart-item__image {
  transform: scale(1.05);
}

.cart-item__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cart-item__name {
  font-size: 1rem;
  color: #333;
  margin: 0;
  font-weight: 500;
}

.cart-item__variants {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cart-item__variant {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}

.cart-item__color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.cart-item__price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #4CAF50;
}

.cart-item__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  background: white;
}

.cart-item__quantity-btn {
  width: 32px;
  height: 32px;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #333;
}

.cart-item__quantity-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.cart-item__quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f9f9f9;
}

.cart-item__quantity-input {
  width: 50px;
  height: 32px;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  text-align: center;
  -moz-appearance: textfield;
  font-size: 0.9rem;
}

.cart-item__quantity-input::-webkit-outer-spin-button,
.cart-item__quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.cart-item__remove-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #ff4444;
  color: #ff4444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.cart-item__remove-btn:hover {
  background: #ff4444;
  color: white;
}

.cart-item__stock-warning {
  color: #ff9800;
  font-size: 0.8rem;
  margin: 0;
}

/* حالت موبایل */
@media (max-width: 480px) {
  .cart-item {
    flex-direction: column;
    padding: 0.75rem;
  }
  
  .cart-item__image-wrapper {
    width: 100%;
    height: 200px;
  }
  
  .cart-item__actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .cart-item__quantity {
    justify-content: center;
  }
  
  .cart-item__remove-btn {
    justify-content: center;
  }
}
</style>
