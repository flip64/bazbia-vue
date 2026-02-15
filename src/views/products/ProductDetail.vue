<template>
  <div class="product-detail">
    <div class="product-detail__container">
      <!-- مسیریاب -->
      <nav class="product-detail__breadcrumb">
        <router-link to="/">خانه</router-link> /
        <router-link to="/products">محصولات</router-link> /
        <span>محصول {{ productId }}</span>
      </nav>

      <div class="product-detail__content">
        <!-- تصویر محصول -->
        <div class="product-detail__gallery">
          <div class="product-detail__main-image">
            <img :src="`https://via.placeholder.com/500x500?text=محصول+${productId}`" alt="محصول">
          </div>
        </div>

        <!-- اطلاعات محصول -->
        <div class="product-detail__info">
          <h1 class="product-detail__title">محصول شماره {{ productId }}</h1>
          
          <div class="product-detail__rating">
            <span class="product-detail__stars">⭐⭐⭐⭐⭐</span>
            <span class="product-detail__reviews">(15 نظر)</span>
          </div>

          <div class="product-detail__price">
            <span class="product-detail__current-price">۲۵۰,۰۰۰ تومان</span>
            <span class="product-detail__old-price">۳۲۰,۰۰۰ تومان</span>
            <span class="product-detail__discount">۲۲% تخفیف</span>
          </div>

          <div class="product-detail__description">
            <p>توضیحات محصول در اینجا قرار می‌گیرد. این یک توضیح نمونه است.</p>
          </div>

          <div class="product-detail__actions">
            <div class="product-detail__quantity">
              <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <span>{{ quantity }}</span>
              <button @click="increaseQuantity">+</button>
            </div>

            <button class="product-detail__add-to-cart">
              افزودن به سبد خرید
            </button>

            <button class="product-detail__wishlist">
              ♡
            </button>
          </div>

          <div class="product-detail__meta">
            <p><strong>دسته‌بندی:</strong> <router-link to="/category/1">الکترونیک</router-link></p>
            <p><strong>برند:</strong> سامسونگ</p>
            <p><strong>موجودی:</strong> <span class="in-stock">موجود در انبار</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = route.params.id
const quantity = ref(1)

const increaseQuantity = () => quantity.value++
const decreaseQuantity = () => quantity.value > 1 && quantity.value--
</script>

<style scoped>
.product-detail {
  padding: 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

.product-detail__breadcrumb {
  margin-bottom: 2rem;
  color: #6b7280;
}

.product-detail__breadcrumb a {
  color: #667eea;
  text-decoration: none;
}

.product-detail__breadcrumb a:hover {
  text-decoration: underline;
}

.product-detail__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.product-detail__main-image {
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
}

.product-detail__main-image img {
  width: 100%;
  height: auto;
  display: block;
}

.product-detail__title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 1rem;
}

.product-detail__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.product-detail__stars {
  color: #fbbf24;
  font-size: 1.25rem;
}

.product-detail__reviews {
  color: #6b7280;
}

.product-detail__price {
  margin-bottom: 1.5rem;
}

.product-detail__current-price {
  font-size: 2rem;
  font-weight: bold;
  color: #374151;
  margin-left: 1rem;
}

.product-detail__old-price {
  color: #9ca3af;
  text-decoration: line-through;
  margin-left: 1rem;
}

.product-detail__discount {
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.product-detail__description {
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.product-detail__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.product-detail__quantity {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.product-detail__quantity button {
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s ease;
}

.product-detail__quantity button:hover:not(:disabled) {
  background: #f3f4f6;
}

.product-detail__quantity button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-detail__quantity span {
  width: 50px;
  text-align: center;
  font-weight: bold;
}

.product-detail__add-to-cart {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.product-detail__add-to-cart:hover {
  background: #5a67d8;
}

.product-detail__wishlist {
  width: 50px;
  height: 50px;
  background: #fee;
  color: #ef4444;
  border: none;
  border-radius: 8px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-detail__wishlist:hover {
  background: #fdd;
  transform: scale(1.05);
}

.product-detail__meta {
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.product-detail__meta p {
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.product-detail__meta a {
  color: #667eea;
  text-decoration: none;
}

.in-stock {
  color: #10b981;
  font-weight: bold;
}

@media (max-width: 768px) {
  .product-detail__content {
    grid-template-columns: 1fr;
  }
}
</style>
