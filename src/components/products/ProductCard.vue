<template>
  <div class="product-card" :class="{ 'product-card--out-of-stock': !product.inStock }">
    <div class="product-card__image-wrapper">
      <router-link :to="`/product/${product.id}`">
        <img 
          :src="product.image" 
          :alt="product.name"
          class="product-card__image"
          loading="lazy"
        >
      </router-link>
      
      <!-- برچسب‌ها -->
      <div class="product-card__badges">
        <span v-if="product.discount" class="product-card__badge product-card__badge--discount">
          {{ product.discount }}% تخفیف
        </span>
        <span v-if="!product.inStock" class="product-card__badge product-card__badge--out">
          ناموجود
        </span>
      </div>

      <!-- دکمه‌های سریع -->
      <div class="product-card__quick-actions">
        <button 
          class="product-card__quick-action" 
          @click="$emit('add-to-wishlist', product.id)"
          title="افزودن به علاقه‌مندی‌ها"
        >
          <HeartIcon />
        </button>
        <button 
          class="product-card__quick-action" 
          @click="$emit('quick-view', product.id)"
          title="مشاهده سریع"
        >
          <EyeIcon />
        </button>
      </div>
    </div>

    <div class="product-card__content">
      <!-- دسته‌بندی و برند -->
      <div class="product-card__meta">
        <span class="product-card__category">{{ product.category }}</span>
        <span class="product-card__brand">{{ product.brand }}</span>
      </div>

      <!-- نام محصول -->
      <router-link :to="`/product/${product.id}`" class="product-card__title">
        {{ product.name }}
      </router-link>

      <!-- امتیاز -->
      <div class="product-card__rating">
        <div class="product-card__stars">
          <StarIcon 
            v-for="star in 5" 
            :key="star"
            class="product-card__star"
            :class="{ 'product-card__star--filled': star <= product.rating }"
          />
        </div>
        <span class="product-card__reviews">({{ product.reviewCount }} نظر)</span>
      </div>

      <!-- قیمت -->
      <div class="product-card__prices">
        <span class="product-card__price">{{ formatPrice(product.price) }} تومان</span>
        <span v-if="product.oldPrice" class="product-card__old-price">
          {{ formatPrice(product.oldPrice) }} تومان
        </span>
      </div>

      <!-- دکمه افزودن به سبد خرید -->
      <button 
        class="product-card__add-to-cart"
        :disabled="!product.inStock"
        @click="$emit('add-to-cart', product.id)"
      >
        <ShoppingBagIcon class="product-card__cart-icon" />
        {{ product.inStock ? 'افزودن به سبد خرید' : 'ناموجود' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartIcon, EyeIcon, StarIcon, ShoppingBagIcon } from 'lucide-vue-next'

interface Product {
  id: number
  name: string
  price: number
  oldPrice?: number
  image: string
  category: string
  brand: string
  rating: number
  reviewCount: number
  inStock: boolean
  discount?: number
}

defineProps<{
  product: Product
}>()

defineEmits(['add-to-cart', 'add-to-wishlist', 'quick-view'])

const formatPrice = (price: number) => {
  return price.toLocaleString('fa-IR')
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: transparent;
}

.product-card--out-of-stock {
  opacity: 0.7;
}

.product-card__image-wrapper {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.product-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

.product-card__badges {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-card__badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
}

.product-card__badge--discount {
  background: #ef4444;
}

.product-card__badge--out {
  background: #6b7280;
}

.product-card__quick-actions {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.product-card:hover .product-card__quick-actions {
  opacity: 1;
  transform: translateX(0);
}

.product-card__quick-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  transition: all 0.3s ease;
}

.product-card__quick-action:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.product-card__content {
  padding: 1.5rem;
}

.product-card__meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.product-card__title {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.product-card__title:hover {
  color: #667eea;
}

.product-card__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.product-card__stars {
  display: flex;
  gap: 2px;
}

.product-card__star {
  width: 16px;
  height: 16px;
  color: #d1d5db;
}

.product-card__star--filled {
  color: #fbbf24;
  fill: currentColor;
}

.product-card__reviews {
  font-size: 0.85rem;
  color: #6b7280;
}

.product-card__prices {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.product-card__price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #374151;
}

.product-card__old-price {
  font-size: 0.95rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.product-card__add-to-cart {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
}

.product-card__add-to-cart:hover:not(:disabled) {
  background: #5a67d8;
}

.product-card__add-to-cart:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}
</style>
