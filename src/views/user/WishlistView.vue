<template>
  <div class="wishlist-page">
    <div class="wishlist-container">
      <h1 class="wishlist-title">علاقه‌مندی‌ها</h1>

      <div v-if="wishlistItems.length === 0" class="wishlist-empty">
        <p>لیست علاقه‌مندی‌های شما خالی است</p>
        <router-link to="/products" class="shop-link">
          مشاهده محصولات
        </router-link>
      </div>

      <div v-else class="wishlist-grid">
        <div v-for="item in wishlistItems" :key="item.id" class="wishlist-card">
          <button class="wishlist-card__remove" @click="removeFromWishlist(item.id)">
            ✕
          </button>
          
          <img :src="item.image" :alt="item.name" class="wishlist-card__image">
          
          <div class="wishlist-card__content">
            <h3>{{ item.name }}</h3>
            <p class="wishlist-card__price">{{ item.price }} تومان</p>
            
            <button class="wishlist-card__add-to-cart" @click="addToCart(item)">
              افزودن به سبد خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface WishlistItem {
  id: number
  name: string
  price: string
  image: string
}

const wishlistItems = ref<WishlistItem[]>([
  {
    id: 1,
    name: 'محصول ۱',
    price: '۲۵۰,۰۰۰',
    image: 'https://via.placeholder.com/300x300?text=محصول+1'
  },
  {
    id: 2,
    name: 'محصول ۲',
    price: '۳۵۰,۰۰۰',
    image: 'https://via.placeholder.com/300x300?text=محصول+2'
  },
  {
    id: 3,
    name: 'محصول ۳',
    price: '۴۵۰,۰۰۰',
    image: 'https://via.placeholder.com/300x300?text=محصول+3'
  }
])

const removeFromWishlist = (id: number) => {
  wishlistItems.value = wishlistItems.value.filter(item => item.id !== id)
}

const addToCart = (item: WishlistItem) => {
  console.log('افزودن به سبد خرید:', item)
}
</script>

<style scoped>
.wishlist-page {
  padding: 2rem;
  min-height: 70vh;
  background: #f8f9fa;
}

.wishlist-container {
  max-width: 1280px;
  margin: 0 auto;
}

.wishlist-title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 2rem;
}

.wishlist-empty {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
}

.wishlist-empty p {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.shop-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.wishlist-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s ease;
}

.wishlist-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.wishlist-card__remove {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.wishlist-card:hover .wishlist-card__remove {
  opacity: 1;
}

.wishlist-card__remove:hover {
  transform: scale(1.1);
}

.wishlist-card__image {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.wishlist-card__content {
  padding: 1.5rem;
  text-align: center;
}

.wishlist-card__content h3 {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.wishlist-card__price {
  color: #667eea;
  font-weight: bold;
  margin-bottom: 1rem;
}

.wishlist-card__add-to-cart {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.wishlist-card__add-to-cart:hover {
  background: #5a67d8;
}
</style>
