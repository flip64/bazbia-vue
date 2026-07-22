<!-- src/views/categories/CategoriesView.vue -->
<template>
  <section class="categories-page" dir="rtl">
    <!-- Header -->
    <header class="categories-header">
      <div class="categories-header__icon">
        🛍️
      </div>

      <h1>دسته‌بندی محصولات</h1>

      <p>
        هر چیزی که نیاز دارید، در دسته‌بندی مناسب پیدا کنید
      </p>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="categories-state">
      <div class="loading-spinner"></div>
      <p>در حال دریافت دسته‌بندی‌ها...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="categories-state categories-state--error">
      <span>⚠️</span>
      <p>{{ error }}</p>

      <button type="button" @click="fetchCategories">
        تلاش دوباره
      </button>
    </div>

    <!-- Empty -->
    <div v-else-if="categories.length === 0" class="categories-state">
      <span>📂</span>
      <p>هنوز دسته‌بندی‌ای ثبت نشده است.</p>
    </div>

    <!-- Categories -->
    <div v-else class="categories-grid">
      <RouterLink
        v-for="category in categories"
        :key="category.id"
        :to="{
          path: '/products',
          query: { category: category.slug },
        }"
        class="category-card"
      >
        <div class="category-card__image">
          <img
            :src="getCategoryImage(category.image)"
            :alt="category.name"
            loading="lazy"
            @error="handleImageError"
          />
        </div>

        <div class="category-card__content">
          <h2>{{ category.name }}</h2>

          <span class="category-card__count">
            {{ formatCount(category.product_count) }} محصول
          </span>

          <span class="category-card__link">
            مشاهده محصولات
            <span aria-hidden="true">←</span>
          </span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { categoryService } from '@/services/category.service'
  
interface Category {
  id: number
  name: string
  slug: string
  image: string | null
  product_count?: number
  count?: number
}

const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref('')

const fallbackImage = '/images/category-placeholder.webp'

const fetchCategories = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await categoryService.getCategories()

    const data = response?.data ?? response

    if (Array.isArray(data)) {
      categories.value = data
    } else if (Array.isArray(data?.results)) {
      categories.value = data.results
    } else if (Array.isArray(data?.data)) {
      categories.value = data.data
    } else {
      categories.value = []
    }
  } catch (err) {
    console.error('خطا در دریافت دسته‌بندی‌ها:', err)
    error.value = 'دریافت دسته‌بندی‌ها با مشکل مواجه شد.'
  } finally {
    loading.value = false
  }
}

const getCategoryImage = (image: string | null) => {
  return image || fallbackImage
}

const getCategoryCount = (category: Category) => {
  return category.products_count ?? category.count ?? 0
}

const formatCount = (count?: number) => {
  return Number(count ?? 0).toLocaleString('fa-IR')
}

const handleImageError = (event: Event) => {
  const image = event.target as HTMLImageElement

  if (!image.src.endsWith(fallbackImage)) {
    image.src = fallbackImage
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.categories-page {
  width: 100%;
  max-width: 1280px;
  min-height: 70vh;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}

/* Header */
.categories-header {
  position: relative;
  max-width: 720px;
  margin: 0 auto 2.5rem;
  padding: 2rem 1rem;
  text-align: center;
}

.categories-header::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  border-radius: 2rem;
  background:
    radial-gradient(
      circle at top right,
      rgba(34, 197, 94, 0.15),
      transparent 45%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(250, 204, 21, 0.12),
      transparent 40%
    );
}

.categories-header__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border: 1px solid #bbf7d0;
  border-radius: 50%;
  background: #f0fdf4;
  font-size: 2rem;
}

.categories-header h1 {
  margin: 0 0 0.75rem;
  color: #166534;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 900;
}

.categories-header p {
  margin: 0;
  color: #64748b;
  font-size: 1rem;
  line-height: 1.9;
}

/* Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
}

/* Card */
.category-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dcfce7;
  border-radius: 1.5rem;
  background: #ffffff;
  color: inherit;
  text-decoration: none;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.category-card:hover {
  transform: translateY(-6px);
  border-color: #86efac;
  box-shadow: 0 18px 40px rgba(22, 101, 52, 0.12);
}

/* Image */
.category-card__image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 190px;
  padding: 1.5rem;
  overflow: hidden;
  background:
    linear-gradient(
      145deg,
      #f0fdf4 0%,
      #ffffff 60%,
      #fefce8 100%
    );
}

.category-card__image img {
  width: 135px;
  height: 135px;
  object-fit: contain;
  transition: transform 0.35s ease;
}

.category-card:hover .category-card__image img {
  transform: scale(1.08);
}

/* Content */
.category-card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;
  text-align: center;
}

.category-card__content h2 {
  margin: 0 0 0.75rem;
  color: #1f2937;
  font-size: 1.15rem;
  font-weight: 800;
}

.category-card__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: #f0fdf4;
  color: #15803d;
  font-size: 0.82rem;
  font-weight: 700;
}

.category-card__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  margin-top: auto;
  padding: 0.75rem 1rem;
  border-radius: 0.8rem;
  background: #16a34a;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 800;
  transition:
    background 0.25s ease,
    gap 0.25s ease;
}

.category-card:hover .category-card__link {
  gap: 0.7rem;
  background: #15803d;
}

/* States */
.categories-state {
  display: flex;
  min-height: 280px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: 1px dashed #bbf7d0;
  border-radius: 1.5rem;
  background: #f8fffa;
  color: #64748b;
  text-align: center;
}

.categories-state > span {
  font-size: 2.5rem;
}

.categories-state p {
  margin: 0;
}

.categories-state--error {
  border-color: #fecaca;
  background: #fffafa;
}

.categories-state button {
  padding: 0.65rem 1.2rem;
  border: none;
  border-radius: 0.75rem;
  background: #16a34a;
  color: white;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
}

.loading-spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #dcfce7;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .categories-page {
    padding: 1rem 0.75rem 3rem;
  }

  .categories-header {
    margin-bottom: 1.5rem;
    padding: 1.5rem 0.75rem;
  }

  .categories-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
  }

  .category-card {
    border-radius: 1.1rem;
  }

  .category-card__image {
    height: 140px;
    padding: 1rem;
  }

  .category-card__image img {
    width: 100px;
    height: 100px;
  }

  .category-card__content {
    padding: 1rem 0.75rem;
  }

  .category-card__content h2 {
    font-size: 0.95rem;
  }

  .category-card__count {
    margin-bottom: 0.9rem;
    font-size: 0.72rem;
  }

  .category-card__link {
    padding: 0.65rem 0.5rem;
    font-size: 0.78rem;
  }
}

@media (max-width: 380px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .category-card__image {
    height: 170px;
  }
}
</style>
