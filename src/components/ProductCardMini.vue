<template>
  <div class="product-mini">
    <img 
      :src="product.image" 
      :alt="product.name"
      @error="handleImageError"
      class="product-mini__image"
    />
    <div class="product-mini__info">
      <h4 class="product-mini__name">{{ product.name }}</h4>
      <div class="product-mini__price">{{ formatPrice(product.price) }}</div>
    </div>
    <button @click="addToCart" class="product-mini__add-btn" :disabled="!product.inStock">
      <Plus :size="16" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

// تعریف Props
const props = defineProps<{
  product: {
    id: number
    name: string
    price: number
    image: string
    inStock?: boolean
  }
}>()

// تعریف Emits
const emit = defineEmits<{
  (e: 'add-to-cart', product: any): void
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

// افزودن به سبد خرید
const addToCart = () => {
  if (!props.product.inStock) return
  emit('add-to-cart', props.product)
}
</script>

<style scoped>
.product-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.product-mini:hover {
  background: #f0f0f0;
  border-color: #e0e0e0;
}

.product-mini__image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  background: #fff;
}

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

.product-mini__price {
  font-size: 0.85rem;
  color: #4CAF50;
  font-weight: 600;
}

.product-mini__add-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.product-mini__add-btn:hover:not(:disabled) {
  background: #45a049;
  transform: scale(1.05);
}

.product-mini__add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* حالت موبایل */
@media (max-width: 480px) {
  .product-mini {
    padding: 0.5rem;
  }
  
  .product-mini__image {
    width: 50px;
    height: 50px;
  }
  
  .product-mini__name {
    font-size: 0.8rem;
  }
  
  .product-mini__price {
    font-size: 0.75rem;
  }
}
</style>
