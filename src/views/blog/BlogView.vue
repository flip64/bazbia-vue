<template>
  <div class="blog-page">
    <div class="blog-container">
      <h1 class="blog-title">وبلاگ</h1>

      <div class="blog-grid">
        <div v-for="post in posts" :key="post.id" class="blog-card">
          <img :src="post.image" :alt="post.title" class="blog-card__image">
          
          <div class="blog-card__content">
            <h2>{{ post.title }}</h2>
            <p class="blog-card__excerpt">{{ post.excerpt }}</p>
            
            <div class="blog-card__meta">
              <span>{{ post.date }}</span>
              <span>{{ post.author }}</span>
            </div>

            <router-link :to="`/blog/${post.id}`" class="blog-card__link">
              ادامه مطلب
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const posts = ref([
  {
    id: 1,
    title: 'راهنمای خرید محصولات دیجیتال',
    excerpt: 'در این مقاله به بررسی نکات مهم در خرید محصولات دیجیتال می‌پردازیم...',
    date: '۱۴۰۴/۱۱/۱۵',
    author: 'علی رضایی',
    image: 'https://via.placeholder.com/400x250?text=مقاله+1'
  },
  {
    id: 2,
    title: 'ترفندهای کاهش هزینه خرید',
    excerpt: 'با این ترفندها می‌توانید در خریدهای خود صرفه‌جویی کنید...',
    date: '۱۴۰۴/۱۱/۱۰',
    author: 'مریم احمدی',
    image: 'https://via.placeholder.com/400x250?text=مقاله+2'
  },
  {
    id: 3,
    title: 'معرفی جدیدترین محصولات',
    excerpt: 'جدیدترین محصولات اضافه شده به فروشگاه را بشناسید...',
    date: '۱۴۰۴/۱۱/۰۵',
    author: 'سارا محمدی',
    image: 'https://via.placeholder.com/400x250?text=مقاله+3'
  }
])
</script>

<style scoped>
.blog-page {
  padding: 2rem;
  min-height: 70vh;
  background: #f8f9fa;
}

.blog-container {
  max-width: 1280px;
  margin: 0 auto;
}

.blog-title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 2rem;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.blog-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.blog-card__image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.blog-card__content {
  padding: 1.5rem;
}

.blog-card__content h2 {
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.blog-card__excerpt {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.blog-card__meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #9ca3af;
}

.blog-card__link {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.blog-card__link:hover {
  text-decoration: underline;
}
</style>
