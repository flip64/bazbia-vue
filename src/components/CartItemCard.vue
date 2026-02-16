<!-- components/CartItemCard.vue -->
<template>
  <div class="cart-item">
    <!-- Product Image -->
    <div class="item-image">
      <img 
        :src="item.image" 
        :alt="item.name"
        @error="handleImageError"
      />
    </div>
    
    <!-- Product Details -->
    <div class="item-details">
      <h3 class="item-name">{{ item.name }}</h3>
      
      <!-- Variants -->
      <div v-if="item.variant" class="item-variants">
        <span v-if="item.variant.color" class="variant-badge">
          <span class="color-dot" :style="{ backgroundColor: getColorCode(item.variant.color) }"></span>
          {{ item.variant.color }}
        </span>
        <span v-if="item.variant.size" class="variant-badge">
          سایز {{ item.variant.size }}
        </span>
      </div>
      
      <!-- Price -->
      <div class="item-price">
        {{ formatPrice(item.price * item.quantity) }}
      </div>
      
      <!-- Actions -->
      <div class="item-actions">
        <!-- Quantity Control -->
        <div class="quantity-control">
          <button 
            @click="decreaseQuantity"
            :disabled="item.quantity <= 1"
            class="quantity-btn"
          >
            -
          </button>
          <input 
            type="number" 
            v-model.number="item.quantity"
            @change="handleQuantityChange"
            min="1"
            :max="item.maxStock"
            class="quantity-input"
          />
          <button 
            @click="increaseQuantity"
            :disabled="item.quantity >= item.maxStock"
            class="quantity-btn"
          >
            +
          </button>
        </div>
        
        <!-- Remove Button -->
        <button @click="removeItem" class="remove-btn">
          <Trash2 :size="18" />
          حذف
        </button>
      </div>
      
      <!-- Stock Warning -->
      <p v-if="item.quantity >= item.maxStock" class="stock-warning">
        حداکثر موجودی
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { formatPrice } from '@/services/api'
import type { CartItem } from '@/stores/cart'

const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits<{
  (e: 'update-quantity', itemId: number, quantity: number): void
  (e: 'remove', itemId: number): void
}>()

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/placeholder-product.jpg'
}

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
    'قهوه‌ای': '#8B4513'
  }
  return colors[color] || '#CCCCCC'
}

const increaseQuantity = () => {
  if (props.item.quantity < props.item.maxStock) {
    emit('update-quantity', props.item.id, props.item.quantity + 1)
  }
}

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.id, props.item.quantity - 1)
  }
}

const handleQuantityChange = () => {
  let quantity = props.item.quantity
  if (quantity < 1) quantity = 1
  if (quantity > props.item.maxStock) quantity = props.item.maxStock
  emit('update-quantity', props.item.id, quantity)
}

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
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-size: 1rem;
  color: #333;
  margin: 0;
}

.item-variants {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.variant-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.item-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #4CAF50;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 50px;
  height: 32px;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  text-align: center;
  -moz-appearance: textfield;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.remove-btn {
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
}

.remove-btn:hover {
  background: #ff4444;
  color: white;
}

.stock-warning {
  color: #ff9800;
  font-size: 0.8rem;
  margin: 0;
}

@media (max-width: 480px) {
  .cart-item {
    flex-direction: column;
  }
  
  .item-image {
    width: 100%;
    height: 200px;
  }
  
  .item-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .quantity-control {
    justify-content: center;
  }
  
  .remove-btn {
    justify-content: center;
  }
}
</style>
