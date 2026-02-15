<template>
  <div class="product-sort">
    <select 
      :value="modelValue" 
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="product-sort__select"
    >
      <option value="newest">جدیدترین</option>
      <option value="popular">محبوب‌ترین</option>
      <option value="cheapest">ارزان‌ترین</option>
      <option value="expensive">گران‌ترین</option>
      <option value="bestseller">پرفروش‌ترین</option>
      <option value="discount">بیشترین تخفیف</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue', 'change'])
</script>

<style scoped>
.product-sort__select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  color: #374151;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 0.5rem center;
}

.product-sort__select:focus {
  outline: none;
  border-color: #667eea;
}
</style>
