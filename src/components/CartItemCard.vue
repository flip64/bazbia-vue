<template>
  <div class="cart-item" :class="{ 'cart-item--loading': updating }">
    <!-- چک‌باکس انتخاب -->
    <div class="cart-item__select">
      <input 
        type="checkbox" 
        :checked="isSelected"
        @change="toggleSelection"
        class="cart-item__checkbox"
      />
    </div>
    
    <!-- تصویر محصول -->
    <div class="cart-item__image-wrapper">
      <img 
        :src="item.image" 
        :alt="item.variant_name"
        @error="handleImageError"
        class="cart-item__image"
        loading="lazy"
      />
      
      <!-- اوورلی هنگام آپدیت -->
      <div v-if="updating" class="cart-item__overlay">
        <div class="spinner"></div>
      </div>
    </div>
    
    <!-- جزئیات محصول -->
    <div class="cart-item__details">
      <div class="cart-item__header">
        <h3 class="cart-item__name">{{ item.variant_name }}</h3>
        
        <!-- قیمت واحد -->
        <span class="cart-item__unit-price">
          {{ formatPrice(item.price) }}/عدد
        </span>
      </div>
      
      <!-- اطلاعات اضافی (در صورت نیاز) -->
      <div class="cart-item__meta">
        <span class="cart-item__meta-item">
          کد: {{ item.variant_id }}
        </span>
        <span 
          v-if="item.max_stock && item.max_stock < 10" 
          class="cart-item__meta-item cart-item__meta-item--warning"
        >
          تنها {{ item.max_stock }} عدد باقی‌مانده
        </span>
      </div>
      
      <!-- کنترل مقدار و قیمت کل -->
      <div class="cart-item__footer">
        <!-- کنترل تعداد -->
        <div class="cart-item__quantity">
          <button 
            @click="decreaseQuantity"
            :disabled="item.quantity <= 1 || updating"
            class="cart-item__quantity-btn"
            aria-label="کاهش تعداد"
          >
            <Minus :size="16" />
          </button>
          
          <div class="cart-item__quantity-wrapper">
            <input 
              type="number" 
              v-model.number="localQuantity"
              @change="handleQuantityChange"
              @blur="validateQuantity"
              min="1"
              :max="item.max_stock || 999"
              :disabled="updating"
              class="cart-item__quantity-input"
            />
            <span v-if="updating" class="cart-item__quantity-updating">
              <Loader :size="14" class="spin" />
            </span>
          </div>
          
          <button 
            @click="increaseQuantity"
            :disabled="(item.max_stock && item.quantity >= item.max_stock) || updating"
            class="cart-item__quantity-btn"
            aria-label="افزایش تعداد"
          >
            <Plus :size="16" />
          </button>
        </div>
        
        <!-- قیمت کل و دکمه حذف -->
        <div class="cart-item__actions">
          <div class="cart-item__total-price">
            <span class="cart-item__total-label">جمع:</span>
            <span class="cart-item__total-value">{{ formatPrice(item.total_price) }}</span>
          </div>
          
          <button 
            @click="removeItem" 
            class="cart-item__remove-btn"
            :disabled="removing"
            aria-label="حذف محصول"
          >
            <Trash2 v-if="!removing" :size="18" />
            <Loader v-else :size="18" class="spin" />
          </button>
        </div>
      </div>
      
      <!-- خطا -->
      <transition name="fade">
        <div v-if="error" class="cart-item__error">
          <AlertCircle :size="14" />
          <span>{{ error }}</span>
          <button @click="clearError" class="cart-item__error-close">×</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Trash2, Minus, Plus, Loader, AlertCircle } from 'lucide-vue-next'
import type { CartItem } from '@/types/cart.types'

// Props
const props = defineProps<{
  item: CartItem
  selected?: boolean
  updating?: boolean
  removing?: boolean
  error?: string
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:selected', value: boolean): void
  (e: 'update-quantity', itemId: number, quantity: number): void
  (e: 'remove', itemId: number): void
  (e: 'clear-error'): void
}>()

// State
const localQuantity = ref(props.item.quantity)
const debounceTimer = ref<number>()

// Computed
const isSelected = computed({
  get: () => props.selected || false,
  set: (value) => emit('update:selected', value)
})

// Methods
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/placeholder-product.jpg'
}

const increaseQuantity = () => {
  if (props.updating) return
  
  const maxStock = props.item.max_stock || 999
  if (props.item.quantity < maxStock) {
    updateQuantity(props.item.quantity + 1)
  }
}

const decreaseQuantity = () => {
  if (props.updating) return
  if (props.item.quantity > 1) {
    updateQuantity(props.item.quantity - 1)
  }
}

const handleQuantityChange = () => {
  validateQuantity()
  debouncedUpdate()
}

const validateQuantity = () => {
  let quantity = localQuantity.value
  
  // اعتبارسنجی
  if (isNaN(quantity) || quantity < 1) {
    quantity = 1
  }
  
  const maxStock = props.item.max_stock || 999
  if (quantity > maxStock) {
    quantity = maxStock
  }
  
  if (quantity !== props.item.quantity) {
    localQuantity.value = quantity
  }
}

const updateQuantity = (newQuantity: number) => {
  if (newQuantity === props.item.quantity) return
  
  localQuantity.value = newQuantity
  
  // Debounce برای جلوگیری از درخواست‌های متوالی
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  console.log(newQuantity,props.item.id)
  debounceTimer.value = setTimeout(() => {
    emit('update-quantity', props.item.id, newQuantity)
    debounceTimer.value = undefined
  }, 500) as unknown as number
}

const debouncedUpdate = () => {
  updateQuantity(localQuantity.value)
}

const removeItem = () => {
  if (confirm('آیا از حذف این محصول از سبد خرید اطمینان دارید؟')) {
    emit('remove', props.item.id)
  }
}

const toggleSelection = (e: Event) => {
  const checkbox = e.target as HTMLInputElement
  emit('update:selected', checkbox.checked)
}

const clearError = () => {
  emit('clear-error')
}

// Watch for external quantity changes
watch(() => props.item.quantity, (newQuantity) => {
  if (newQuantity !== localQuantity.value) {
    localQuantity.value = newQuantity
  }
})
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  position: relative;
  border: 1px solid #f0f0f0;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}

.cart-item--loading {
  opacity: 0.7;
  pointer-events: none;
}

/* چک‌باکس */
.cart-item__select {
  display: flex;
  align-items: flex-start;
  padding-top: 0.25rem;
}

.cart-item__checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4CAF50;
}

/* تصویر */
.cart-item__image-wrapper {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #f0f0f0;
  position: relative;
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

.cart-item__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

/* جزئیات */
.cart-item__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.cart-item__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.cart-item__name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.cart-item__unit-price {
  font-size: 0.9rem;
  color: #666;
  background: #f5f5f5;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  white-space: nowrap;
}

/* متا اطلاعات */
.cart-item__meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cart-item__meta-item {
  font-size: 0.8rem;
  color: #999;
  background: #f9f9f9;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
}

.cart-item__meta-item--warning {
  color: #ff9800;
  background: #fff3e0;
}

/* فوتر */
.cart-item__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

/* کنترل تعداد */
.cart-item__quantity {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.cart-item__quantity-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #333;
}

.cart-item__quantity-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #4CAF50;
  color: #4CAF50;
}

.cart-item__quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f9f9f9;
}

.cart-item__quantity-wrapper {
  position: relative;
  width: 70px;
}

.cart-item__quantity-input {
  width: 100%;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  font-size: 1rem;
  -moz-appearance: textfield;
  padding: 0 0.5rem;
}

.cart-item__quantity-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.cart-item__quantity-input:disabled {
  background: #f9f9f9;
  color: #999;
}

.cart-item__quantity-updating {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* اکشن‌ها */
.cart-item__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-item__total-price {
  text-align: left;
}

.cart-item__total-label {
  font-size: 0.8rem;
  color: #999;
  display: block;
}

.cart-item__total-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4CAF50;
}

.cart-item__remove-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #ff4444;
}

.cart-item__remove-btn:hover:not(:disabled) {
  background: #ffebee;
  transform: scale(1.1);
}

.cart-item__remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* خطا */
.cart-item__error {
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  color: #c62828;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.cart-item__error-close {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #c62828;
  padding: 0 0.25rem;
}

/* انیمیشن */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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

/* موبایل */
@media (max-width: 640px) {
  .cart-item {
    padding: 1rem;
  }
  
  .cart-item__image-wrapper {
    width: 90px;
    height: 90px;
  }
  
  .cart-item__footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .cart-item__actions {
    justify-content: space-between;
  }
  
  .cart-item__quantity {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .cart-item__header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .cart-item__unit-price {
    align-self: flex-start;
  }
}
</style>
