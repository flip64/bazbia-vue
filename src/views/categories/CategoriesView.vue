<template>
  <div class="categories-page">
    <div class="categories-header">
      <h1>دسته‌بندی محصولات</h1>
      <p>محصولات را بر اساس دسته‌بندی مورد نظر خود مشاهده کنید</p>
    </div>
    
    <div class="categories-grid">
      <div v-for="category in categories" :key="category.id" class="category-card">
        <div class="category-card__image">
          <img :src="category.image" :alt="category.name">
        </div>
        <div class="category-card__content">
          <h3>{{ category.name }}</h3>
          <p>{{ category.count }} محصول</p>
          <router-link :to="`/category/${category.id}`" class="category-card__link">
            مشاهده محصولات
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const categories = ref([
  { id: 1, name: 'الکترونیک', count: 45, image: 'https://via.placeholder.com/300x200?text=الکترونیک' },
  { id: 2, name: 'پوشاک', count: 32, image: 'https://via.placeholder.com/300x200?text=پوشاک' },
  { id: 3, name: 'کتاب', count: 28, image: 'https://via.placeholder.com/300x200?text=کتاب' },
  { id: 4, name: 'خانه و آشپزخانه', count: 19, image: 'https://via.placeholder.com/300x200?text=خانه' },
  { id: 5, name: 'ورزشی', count: 15, image: 'https://via.placeholder.com/300x200?text=ورزشی' },
  { id: 6, name: 'آرایشی بهداشتی', count: 23, image: 'https://via.placeholder.com/300x200?text=آرایشی' },
  { id: 7, name: 'اسباب‌بازی', count: 12, image: 'https://via.placeholder.com/300x200?text=اسباب‌بازی' },
  { id: 8, name: 'موبایل و تبلت', count: 31, image: 'https://via.placeholder.com/300x200?text=موبایل' },
])
</script>

<style scoped>
.categories-page {
  padding: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  min-height: 70vh;
}

.categories-header {
  text-align: center;
  margin-bottom: 3rem;
}

.categories-header h1 {
  font-size: 2.5rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.categories-header p {
  color: #6b7280;
  font-size: 1.1rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.category-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.category-card__image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.category-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.category-card:hover .category-card__image img {
  transform: scale(1.05);
}

.category-card__content {
  padding: 1.5rem;
  text-align: center;
}

.category-card__content h3 {
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.category-card__content p {
  color: #6b7280;
  margin-bottom: 1rem;
}

.category-card__link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.category-card__link:hover {
  background: #5a67d8;
}

@media (max-width: 768px) {
  .categories-header h1 {
    font-size: 2rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
