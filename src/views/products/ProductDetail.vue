<template>
  <div class="product-detail">
    <div class="product-detail__container">
      <!-- صفحه جزئیات محصول (موقت) -->
      <div class="product-detail__placeholder">
        <h1>صفحه جزئیات محصول</h1>
        <p>شناسه محصول: {{ $route.params.id }}</p>
        <p>این صفحه در حال توسعه است</p>
        <router-link to="/products" class="back-btn">
          بازگشت به محصولات
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
console.log('Product ID:', route.params.id)
</script>

<style scoped>
.product-detail {
  min-height: 60vh;
  padding: 2rem;
}

.product-detail__container {
  max-width: 1280px;
  margin: 0 auto;
}

.product-detail__placeholder {
  text-align: center;
  padding: 3rem;
  background: #f3f4f6;
  border-radius: 12px;
}

.product-detail__placeholder h1 {
  color: #374151;
  margin-bottom: 1rem;
}

.product-detail__placeholder p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.back-btn:hover {
  background: #5a67d8;
}
</style>
