<!-- components/ProductCardMini.vue -->
<template>
  <div class="product-mini">
    <img 
      :src="product.images[0]" 
      :alt="product.name"
      @error="handleImageError"
      class="product-image"
    />
    <div class="product-info">
      <h4 class="product-name">{{ product.name }}</h4>
      <div class="product-price">{{ formatPrice(product.price) }}</div>
    </div>
    <button @click="addToCart" class="add-btn">
      <Plus :size="16" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { formatPrice } from '@/services/api'

const props = defineProps<{
  product: any
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', product: any): void
}>()

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/placeholder-product.jpg'
}

const addToCart = () => {
  emit('add-to-cart', props.product)
}
</script>

<style scoped>
.product-mini {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f9f9f9;
  border-radius: 8px;
  transition: background 0.2s;
}

.product-mini:hover {
  background: #f0f0f0;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 0.9rem;
  color: #333;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 0.8rem;
  color: #4CAF50;
  font-weight: bold;
}

.add-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}

.add-btn:hover {
  background: #45a049;
}
</style>
