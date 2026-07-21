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
  display: grid;
  grid-template-columns: auto 132px minmax(0, 1fr);
  gap: 1rem;
  align-items: stretch;
  padding: 1.1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.03),
    0 8px 24px rgba(15, 23, 42, 0.04);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.cart-item::before {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #16a34a, #22c55e);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  border-color: #bbf7d0;
  box-shadow:
    0 4px 10px rgba(15, 23, 42, 0.05),
    0 14px 32px rgba(22, 163, 74, 0.08);
}

.cart-item:hover::before {
  opacity: 1;
}

.cart-item--loading {
  opacity: 0.72;
  pointer-events: none;
}

/* انتخاب */

.cart-item__select {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.3rem;
}

.cart-item__checkbox {
  width: 20px;
  height: 20px;
  margin: 0;
  cursor: pointer;
  accent-color: #16a34a;
}

/* تصویر */

.cart-item__image-wrapper {
  width: 132px;
  height: 132px;
  flex-shrink: 0;
  border-radius: 14px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  position: relative;
}

.cart-item__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.4rem;
  transition: transform 0.3s ease;
}

.cart-item:hover .cart-item__image {
  transform: scale(1.04);
}

.cart-item__overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.76);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

/* اطلاعات محصول */

.cart-item__details {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-item__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.cart-item__name {
  flex: 1;
  min-width: 0;
  margin: 0;
  color: #111827;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item__unit-price {
  flex-shrink: 0;
  padding: 0.35rem 0.7rem;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 999px;
  font-size: 0.78rem;
  white-space: nowrap;
}

/* اطلاعات فرعی */

.cart-item__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cart-item__meta-item {
  padding: 0.28rem 0.65rem;
  color: #64748b;
  background: #f8fafc;
  border-radius: 999px;
  font-size: 0.75rem;
}

.cart-item__meta-item--warning {
  color: #b45309;
  background: #fff7ed;
  border: 1px solid #fed7aa;
}

/* پایین کارت */

.cart-item__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-top: auto;
  padding-top: 0.8rem;
  border-top: 1px dashed #e5e7eb;
}

/* کنترل تعداد */

.cart-item__quantity {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.cart-item__quantity-btn {
  width: 34px;
  height: 34px;
  padding: 0;
  border: none;
  background: #ffffff;
  border-radius: 9px;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.cart-item__quantity-btn:hover:not(:disabled) {
  color: #15803d;
  background: #ecfdf5;
  transform: translateY(-1px);
}

.cart-item__quantity-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
}

.cart-item__quantity-wrapper {
  position: relative;
  width: 54px;
}

.cart-item__quantity-input {
  width: 100%;
  height: 34px;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #111827;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
  appearance: textfield;
  -moz-appearance: textfield;
}

.cart-item__quantity-input::-webkit-inner-spin-button,
.cart-item__quantity-input::-webkit-outer-spin-button {
  margin: 0;
  appearance: none;
}

.cart-item__quantity-input:focus {
  color: #15803d;
}

.cart-item__quantity-updating {
  position: absolute;
  inset: 0;
  background: rgba(248, 250, 252, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

/* قیمت و حذف */

.cart-item__actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.cart-item__total-price {
  min-width: 120px;
  text-align: left;
}

.cart-item__total-label {
  display: block;
  margin-bottom: 0.15rem;
  color: #94a3b8;
  font-size: 0.72rem;
}

.cart-item__total-value {
  color: #15803d;
  font-size: 1.12rem;
  font-weight: 800;
  white-space: nowrap;
}

.cart-item__total-value::after {
  content: " تومان";
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 500;
}

.cart-item__remove-btn {
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid transparent;
  background: #fff1f2;
  border-radius: 11px;
  color: #e11d48;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.cart-item__remove-btn:hover:not(:disabled) {
  background: #ffe4e6;
  border-color: #fecdd3;
  transform: translateY(-1px);
}

.cart-item__remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* خطا */

.cart-item__error {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.75rem;
  padding-inline-end: 2rem;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 0.8rem;
}

.cart-item__error-close {
  position: absolute;
  inset-inline-end: 0.55rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.15rem;
  border: none;
  background: transparent;
  color: #b91c1c;
  font-size: 1.15rem;
  line-height: 1;
  cursor: pointer;
}

/* انیمیشن‌ها */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.spin {
  animation: spin 0.9s linear infinite;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #dcfce7;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* تبلت */

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: auto 105px minmax(0, 1fr);
    padding: 1rem;
  }

  .cart-item__image-wrapper {
    width: 105px;
    height: 105px;
  }

  .cart-item__header {
    flex-direction: column;
    gap: 0.45rem;
  }

  .cart-item__unit-price {
    align-self: flex-start;
  }

  .cart-item__footer {
    align-items: center;
  }
}

/* موبایل */

@media (max-width: 560px) {
  .cart-item {
    grid-template-columns: auto 84px minmax(0, 1fr);
    gap: 0.7rem;
    padding: 0.8rem;
    border-radius: 14px;
  }

  .cart-item__select {
    padding-top: 0.1rem;
  }

  .cart-item__checkbox {
    width: 18px;
    height: 18px;
  }

  .cart-item__image-wrapper {
    width: 84px;
    height: 84px;
    border-radius: 11px;
  }

  .cart-item__name {
    font-size: 0.88rem;
    line-height: 1.65;
  }

  .cart-item__unit-price {
    padding: 0.25rem 0.55rem;
    font-size: 0.68rem;
  }

  .cart-item__meta {
    display: none;
  }

  .cart-item__footer {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    margin-top: 0.25rem;
    padding-top: 0.7rem;
  }

  .cart-item__quantity {
    flex-shrink: 0;
  }

  .cart-item__quantity-btn {
    width: 31px;
    height: 31px;
  }

  .cart-item__quantity-wrapper {
    width: 42px;
  }

  .cart-item__quantity-input {
    height: 31px;
    font-size: 0.85rem;
  }

  .cart-item__actions {
    margin-inline-start: auto;
    gap: 0.45rem;
  }

  .cart-item__total-price {
    min-width: auto;
  }

  .cart-item__total-label {
    display: none;
  }

  .cart-item__total-value {
    font-size: 0.92rem;
  }

  .cart-item__total-value::after {
    font-size: 0.62rem;
  }

  .cart-item__remove-btn {
    width: 34px;
    height: 34px;
    border-radius: 9px;
  }
}

@media (max-width: 390px) {
  .cart-item {
    grid-template-columns: auto 72px minmax(0, 1fr);
  }

  .cart-item__image-wrapper {
    width: 72px;
    height: 72px;
  }

  .cart-item__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .cart-item__quantity {
    width: fit-content;
  }

  .cart-item__actions {
    width: 100%;
    justify-content: space-between;
    margin-inline-start: 0;
  }
}
</style>




    
