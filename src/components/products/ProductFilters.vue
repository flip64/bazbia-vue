<template>
  <div class="product-filters">
    <div class="product-filters__header">
      <h3 class="product-filters__title">فیلترها</h3>
      <button class="product-filters__close" @click="$emit('close')">✕</button>
    </div>

    <!-- دسته‌بندی‌ها -->
    <div class="product-filters__section">
      <h4 class="product-filters__section-title">دسته‌بندی</h4>
      <div class="product-filters__options">
        <label v-for="category in categories" :key="category.id" class="product-filters__option">
          <input 
            type="checkbox" 
            v-model="selectedCategories"
            :value="category.name"
            @change="emitFilters"
          >
          <span>{{ category.name }} ({{ category.count }})</span>
        </label>
      </div>
    </div>

    <!-- برندها -->
    <div class="product-filters__section">
      <h4 class="product-filters__section-title">برند</h4>
      <div class="product-filters__options">
        <label v-for="brand in brands" :key="brand.id" class="product-filters__option">
          <input 
            type="checkbox" 
            v-model="selectedBrands"
            :value="brand.name"
            @change="emitFilters"
          >
          <span>{{ brand.name }} ({{ brand.count }})</span>
        </label>
      </div>
    </div>

    <!-- محدوده قیمت -->
    <div class="product-filters__section">
      <h4 class="product-filters__section-title">محدوده قیمت</h4>
      <div class="product-filters__price-range">
        <div class="product-filters__price-inputs">
          <input 
            type="number" 
            v-model.number="minPrice" 
            placeholder="از"
            @change="emitFilters"
          >
          <span>تا</span>
          <input 
            type="number" 
            v-model.number="maxPrice" 
            placeholder="تا"
            @change="emitFilters"
          >
        </div>
      </div>
    </div>

    <!-- وضعیت موجودی -->
    <div class="product-filters__section">
      <h4 class="product-filters__section-title">وضعیت</h4>
      <label class="product-filters__option">
        <input 
          type="checkbox" 
          v-model="inStockOnly"
          @change="emitFilters"
        >
        <span>فقط محصولات موجود</span>
      </label>
      <label class="product-filters__option">
        <input 
          type="checkbox" 
          v-model="discountOnly"
          @change="emitFilters"
        >
        <span>فقط محصولات تخفیف‌دار</span>
      </label>
    </div>

    <!-- دکمه حذف فیلترها -->
    <button class="product-filters__reset" @click="resetFilters">
      حذف همه فیلترها
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  categories: any[]
  brands: any[]
  priceRange: { min: number; max: number }
}>()

const emit = defineEmits(['filter-change', 'close'])

const selectedCategories = ref<string[]>([])
const selectedBrands = ref<string[]>([])
const minPrice = ref(props.priceRange.min)
const maxPrice = ref(props.priceRange.max)
const inStockOnly = ref(false)
const discountOnly = ref(false)

const emitFilters = () => {
  emit('filter-change', {
    categories: selectedCategories.value,
    brands: selectedBrands.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    inStock: inStockOnly.value,
    hasDiscount: discountOnly.value,
  })
}

const resetFilters = () => {
  selectedCategories.value = []
  selectedBrands.value = []
  minPrice.value = props.priceRange.min
  maxPrice.value = props.priceRange.max
  inStockOnly.value = false
  discountOnly.value = false
  emitFilters()
}
</script>

<style scoped>
.product-filters {
  padding: 1.5rem;
}

.product-filters__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.product-filters__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}

.product-filters__close {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

@media (max-width: 768px) {
  .product-filters__close {
    display: block;
  }
}

.product-filters__section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.product-filters__section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.product-filters__options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-filters__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #4b5563;
  font-size: 0.95rem;
}

.product-filters__option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.product-filters__price-range {
  padding: 0.5rem 0;
}

.product-filters__price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-filters__price-inputs input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
}

.product-filters__price-inputs span {
  color: #6b7280;
}

.product-filters__reset {
  width: 100%;
  padding: 0.75rem;
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-filters__reset:hover {
  background: #e5e7eb;
}
</style>
