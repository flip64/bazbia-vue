<template>
  <div class="blog-post">
    <div class="blog-post__container">
      <article class="post">
        <h1 class="post-title">{{ post.title }}</h1>
        
        <div class="post-meta">
          <span>{{ post.date }}</span>
          <span>{{ post.author }}</span>
        </div>

        <img :src="post.image" :alt="post.title" class="post-image">

        <div class="post-content">
          <p>{{ post.content }}</p>
        </div>

        <div class="post-navigation">
          <router-link to="/blog" class="back-to-blog">
            ← بازگشت به وبلاگ
          </router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const postId = route.params.id

const post = ref({
  id: postId,
  title: 'عنوان مقاله',
  date: '۱۴۰۴/۱۱/۱۵',
  author: 'علی رضایی',
  image: 'https://via.placeholder.com/800x400?text=مقاله',
  content: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد تا با نرم‌افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.'
})
</script>

<style scoped>
.blog-post {
  padding: 2rem;
  min-height: 70vh;
  background: #f8f9fa;
}

.blog-post__container {
  max-width: 800px;
  margin: 0 auto;
}

.post {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.post-title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.post-content {
  line-height: 1.8;
  color: #4b5563;
  margin-bottom: 2rem;
}

.back-to-blog {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
}

.back-to-blog:hover {
  text-decoration: underline;
}
</style>
