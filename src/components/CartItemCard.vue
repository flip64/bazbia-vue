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
import { ref, watch, computed, onUnmounted } from 'vue'
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

// Emits - اضافه کردن variant_id به امیت
const emit = defineEmits<{
  (e: 'update:selected', value: boolean): void
  (e: 'update-quantity', itemId: number, variantId: number, quantity: number): void  // ✅ تغییر اینجا
  (e: 'remove', itemId: number): void
  (e: 'clear-error'): void
}>()

// State
const localQuantity = ref(props.item.quantity)
let debounceTimer: ReturnType<typeof setTimeout> | null = null  // ✅ اصلاح تایپ

// Computed
const isSelected = computed({
  get: () => props.selected || false,
  set: (value) => emit('update:selected', value)
})

const maxStock = computed(() => props.item.max_stock || 999)
const isMaxStock = computed(() => props.item.quantity >= maxStock.value)
const isMinStock = computed(() => props.item.quantity <= 1)

// Methods
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'  // ✅ اضافه کردن واحد
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/placeholder-product.jpg'
}

const increaseQuantity = () => {
  if (props.updating || isMaxStock.value) return
  updateQuantity(props.item.quantity + 1)
}

const decreaseQuantity = () => {
  if (props.updating || isMinStock.value) return
  updateQuantity(props.item.quantity - 1)
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
  
  if (quantity > maxStock.value) {
    quantity = maxStock.value
  }
  
  if (quantity !== props.item.quantity) {
    localQuantity.value = quantity
  }
}

const updateQuantity = (newQuantity: number) => {
  if (newQuantity === props.item.quantity) return
  if (newQuantity < 1 || newQuantity > maxStock.value) return
  
  localQuantity.value = newQuantity
  
  // Debounce برای جلوگیری از درخواست‌های متوالی
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(() => {
    // ✅ ارسال itemId, variantId, quantity
    emit('update-quantity', props.item.id, props.item.variant_id, newQuantity)
    debounceTimer = null
  }, 500)
}

const debouncedUpdate = () => {
  updateQuantity(localQuantity.value)
}

const removeItem = () => {
  // ✅ حذف confirm پیش‌فرض - بذار parent مدیریت کنه
  emit('remove', props.item.id)
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

// پاکسازی تایمر
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<!-- استایل‌ها مثل قبل باقی می‌مانند -->
