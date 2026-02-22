<template>
  <div class="product-variants" v-if="hasVariants">
    <!-- نمایش واریانت‌های رنگی -->
    <div v-if="hasColorVariants" class="variant-section">
      <span class="variant-label">رنگ:</span>
      <div class="color-variants">
        <button
          v-for="variant in colorVariants"
          :key="variant.id"
          class="color-variant"
          :class="{ 
            'selected': selectedVariant?.id === variant.id,
            'out-of-stock': !variant.in_stock 
          }"
          :style="{ backgroundColor: variant.color_code || '#ccc' }"
          :title="variant.name"
          @click="selectVariant(variant)"
          @mouseenter="previewVariant(variant)"
          @mouseleave="resetPreview"
        >
          <span v-if="variant.color_code" class="color-dot" :style="{ backgroundColor: variant.color_code }"></span>
          <span v-else class="variant-name">{{ variant.name }}</span>
        </button>
      </div>
    </div>

    <!-- نمایش واریانت‌های سایز -->
    <div v-else-if="hasSizeVariants" class="variant-section">
      <span class="variant-label">سایز:</span>
      <div class="size-variants">
        <button
          v-for="variant in sizeVariants"
          :key="variant.id"
          class="size-variant"
          :class="{ 
            'selected': selectedVariant?.id === variant.id,
            'out-of-stock': !variant.in_stock 
          }"
          @click="selectVariant(variant)"
          @mouseenter="previewVariant(variant)"
          @mouseleave="resetPreview"
        >
          {{ variant.name }}
        </button>
      </div>
    </div>

    <!-- نمایش لیست کشویی برای سایر واریانت‌ها -->
    <div v-else class="variant-section">
      <span class="variant-label">نوع:</span>
      <select 
        class="variant-select"
        @change="selectVariantFromSelect"
        :value="selectedVariant?.id"
      >
        <option 
          v-for="variant in product.variants" 
          :key="variant.id"
          :value="variant.id"
          :disabled="!variant.in_stock"
        >
          {{ variant.name }} 
          <span v-if="variant.price !== product.price">({{ formatPrice(variant.price) }})</span>
          <span v-if="!variant.in_stock"> - ناموجود</span>
        </option>
      </select>
    </div>

    <!-- نمایش قیمت واریانت انتخاب شده -->
    <div v-if="selectedVariant" class="selected-variant-price">
      <span class="current-price">
        {{ formatPrice(selectedVariant.discount_price || selectedVariant.price) }} تومان
      </span>
      <span v-if="selectedVariant.discount_price" class="old-price">
        {{ formatPrice(selectedVariant.price) }} تومان
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product, ProductVariant } from '@/types/product.types'

const props = defineProps<{
  product: Product
  selectedVariant?: ProductVariant | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedVariant', variant: ProductVariant): void
  (e: 'preview', variant: ProductVariant): void
  (e: 'reset-preview'): void
}>()

// بررسی وجود واریانت
const hasVariants = computed(() => props.product.variants?.length > 0)

// تشخیص نوع واریانت‌ها
const colorVariants = computed(() => 
  props.product.variants?.filter(v => v.type === 'color' || v.color_code) || []
)

const sizeVariants = computed(() => 
  props.product.variants?.filter(v => v.type === 'size') || []
)

const hasColorVariants = computed(() => colorVariants.value.length > 0)
const hasSizeVariants = computed(() => sizeVariants.value.length > 0)

// انتخاب واریانت
const selectVariant = (variant: ProductVariant) => {
  if (variant.in_stock) {
    emit('update:selectedVariant', variant)
  }
}

const selectVariantFromSelect = (event: Event) => {
  const select = event.target as HTMLSelectElement
  const variantId = Number(select.value)
  const variant = props.product.variants?.find(v => v.id === variantId)
  if (variant) {
    selectVariant(variant)
  }
}

// پیش‌نمایش واریانت (تغییر تصویر با هاور)
const previewVariant = (variant: ProductVariant) => {
  if (variant.image) {
    emit('preview', variant)
  }
}

const resetPreview = () => {
  emit('reset-preview')
}

// فرمت قیمت
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}
</script>

<style scoped>
.product-variants {
  margin: 10px 0;
}

.variant-section {
  margin-bottom: 8px;
}

.variant-label {
  font-size: 0.8rem;
  color: #6b7280;
  display: block;
  margin-bottom: 4px;
}

.color-variants {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-variant {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.color-variant.selected {
  border-color: #667eea;
  transform: scale(1.1);
}

.color-variant.out-of-stock {
  opacity: 0.5;
  cursor: not-allowed;
  position: relative;
}

.color-variant.out-of-stock::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #ef4444;
  transform: rotate(45deg);
}

.color-dot {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.size-variants {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.size-variant {
  min-width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.size-variant.selected {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.size-variant.out-of-stock {
  opacity: 0.5;
  cursor: not-allowed;
  text-decoration: line-through;
}

.variant-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
}

.selected-variant-price {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e5e7eb;
}

.variant-name {
  font-size: 0.8rem;
}
</style>
