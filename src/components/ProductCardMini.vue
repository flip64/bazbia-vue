<template>
  <div class="product-mini" :class="{ 'product-mini--out-of-stock': !product.in_stock }">
    <!-- تصویر محصول -->
    <div class="product-mini__image-wrapper">
      <img 
        :src="product.image || '/images/placeholder-product.jpg'" 
        :alt="product.name"
        @error="handleImageError"
        class="product-mini__image"
        loading="lazy"
      />
      
      <!-- برچسب تخفیف -->
      <span 
        v-if="product.discount_percent && product.discount_percent > 0" 
        class="product-mini__discount-badge"
      >
        %{{ product.discount_percent }}
      </span>
    </div>
    
    <!-- اطلاعات محصول -->
    <div class="product-mini__info">
      <h4 class="product-mini__name">{{ product.name }}</h4>
      
      <!-- قیمت -->
      <div class="product-mini__price-wrapper">
        <!-- قیمت با تخفیف -->
        <div v-if="product.price_with_discount" class="product-mini__price product-mini__price--discounted">
          {{ formatPrice(product.price_with_discount) }}
        </div>
        
        <!-- قیمت اصلی (خط خورده) -->
        <div 
          v-if="product.discount_percent && product.discount_percent > 0" 
          class="product-mini__price product-mini__price--original"
        >
          {{ formatPrice(product.price) }}
        </div>
        
        <!-- قیمت معمولی -->
        <div 
          v-else-if="!product.price_with_discount" 
          class="product-mini__price"
        >
          {{ formatPrice(product.price) }}
        </div>
      </div>
      
      <!-- وضعیت موجودی -->
      <span v-if="!product.in_stock" class="product-mini__stock-status">
        ناموجود
      </span>
    </div>
    
    <!-- دکمه افزودن به سبد خرید -->
    <button 
      @click="addToCart" 
      class="product-mini__add-btn"
      :class="{ 'product-mini__add-btn--disabled': !product.in_stock }"
      :disabled="!product.in_stock || addingToCart"
      :aria-label="addButtonAriaLabel"
      :title="addButtonTitle"
    >
      <span v-if="!addingToCart" class="product-mini__add-icon">
        <Plus :size="16" />
      </span>
      <span v-else class="product-mini__add-spinner">
        <Loader :size="16" class="spin" />
      </span>
    </button>
    
    <!-- پیام خطا (اختیاری) -->
    <transition name="fade">
      <div v-if="error" class="product-mini__error">
        {{ error }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Loader } from 'lucide-vue-next'
import type { Product } from '@/types/product.types'

// Props
const props = defineProps<{
  product: Product
  adding?: boolean
  error?: string
}>()

// Emits
const emit = defineEmits<{
  (e: 'add-to-cart', variantId: number): void
  (e: 'clear-error'): void
}>()

// State
const addingToCart = ref(false)
const imageError = ref(false)

// Computed
const addButtonAriaLabel = computed(() => {
  if (!props.product.in_stock) return 'محصول ناموجود است'
  return `افزودن ${props.product.name} به سبد خرید`
})

const addButtonTitle = computed(() => {
  if (!props.product.in_stock) return 'ناموجود'
  return 'افزودن به سبد خرید'
})

const defaultVariantId = computed(() => {
  // اگر محصول واریانت داره، اولین واریانت رو برمی‌گردونیم
  return props.product.variants?.[0]?.id || props.product.id
})

// Methods
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/placeholder-product.jpg'
}

const addToCart = async () => {
  if (!props.product.in_stock || addingToCart.value) return
  
  addingToCart.value = true
  
  try {
    // ارسال variant_id به جای کل محصول
    emit('add-to-cart', defaultVariantId.value)
    
    // می‌تونیم یه تایمر بذاریم تا loading state رو برگردونیم
    setTimeout(() => {
      addingToCart.value = false
    }, 500)
  } catch (error) {
    addingToCart.value = false
    console.error('Error adding to cart:', error)
  }
}

const clearError = () => {
  emit('clear-error')
}
</script>

<style scoped>
.product-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  transition: all 0.2s;
  border: 1px solid #f0f0f0;
  position: relative;
}

.product-mini:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #4CAF50;
}

.product-mini--out-of-stock {
  opacity: 0.7;
  background: #f9f9f9;
}

/* تصویر */
.product-mini__image-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-mini__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-mini:hover .product-mini__image {
  transform: scale(1.1);
}

/* برچسب تخفیف */
.product-mini__discount-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ff4444;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(255, 68, 68, 0.3);
}

/* اطلاعات */
.product-mini__info {
  flex: 1;
  min-width: 0;
}

.product-mini__name {
  font-size: 0.9rem;
  color: #333;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

/* قیمت */
.product-mini__price-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.product-mini__price {
  font-size: 0.95rem;
  font-weight: 600;
  color: #4CAF50;
}

.product-mini__price--discounted {
  color: #ff4444;
}

.product-mini__price--original {
  font-size: 0.8rem;
  color: #999;
  text-decoration: line-through;
  font-weight: normal;
}

/* وضعیت موجودی */
.product-mini__stock-status {
  display: inline-block;
  font-size: 0.7rem;
  color: #ff4444;
  background: #ffebee;
  padding: 2px 8px;
  border-radius: 4px;
  margin-top: 0.25rem;
}

/* دکمه افزودن */
.product-mini__add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4CAF50;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.product-mini__add-btn:hover:not(:disabled) {
  background: #45a049;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
}

.product-mini__add-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.product-mini__add-btn--disabled,
.product-mini__add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.7;
}

.product-mini__add-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* خطا */
.product-mini__error {
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  font-size: 0.7rem;
  color: #ff4444;
  text-align: center;
  background: #ffebee;
  padding: 2px 4px;
  border-radius: 4px;
}

/* انیمیشن */
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* حالت موبایل */
@media (max-width: 480px) {
  .product-mini {
    padding: 0.5rem;
  }
  
  .product-mini__image-wrapper {
    width: 50px;
    height: 50px;
  }
  
  .product-mini__name {
    font-size: 0.8rem;
  }
  
  .product-mini__price {
    font-size: 0.85rem;
  }
  
  .product-mini__add-btn {
    width: 28px;
    height: 28px;
  }
}
</style>
