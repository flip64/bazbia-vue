<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'
import { RouterLink } from 'vue-router'

import { useCartStore } from '@/core/store/cartStore'

import type { Product } from '@/types/product.types'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()

const isAdding = ref(false)
const addSuccess = ref(false)
const imageError = ref(false)




const mainVariant = computed(() => {
  const variants = props.product.variants ?? []

  return (
    variants.find((variant) => Number(variant.stock) > 0) ??
    variants[0] ??
    null
  )
})
  

const isInStock = computed(() => {
  return (
    props.product.in_stock > 0 &&
    mainVariant.value !== null &&
    Number(mainVariant.value.stock) > 0
  )
})

const hasDiscount = computed(() => {
  return (
    props.product.discount_price !==
      null &&
    props.product.discount_price > 0 &&
    props.product.discount_price <
      props.product.price
  )
})

const finalPrice = computed(() => {
  if (hasDiscount.value) {
    return props.product
      .discount_price as number
  }

  return props.product.price
})

const discountPercent = computed(() => {
  if (!hasDiscount.value) {
    return 0
  }

  return Math.round(
    ((props.product.price -
      Number(
        props.product.discount_price,
      )) /
      props.product.price) *
      100,
  )
})

const stockLabel = computed(() => {
  if (!isInStock.value) {
    return 'ناموجود'
  }

  if (
    mainVariant.value &&
    mainVariant.value.stock <= 5
  ) {
    return `فقط ${mainVariant.value.stock} عدد`
  }

  return 'موجود'
})

const formatPrice = (
  price: number | string,
) => {
  return Number(price).toLocaleString(
    'fa-IR',
  )
}

const handleAddToCart = async () => {
  if (
    !mainVariant.value ||
    !isInStock.value ||
    isAdding.value
  ) {
    return
  }

  isAdding.value = true
  addSuccess.value = false

  try {
    await cartStore.addItem({
      variant_id:
        mainVariant.value.id,

      quantity: 1,
    })

    addSuccess.value = true

    window.setTimeout(() => {
      addSuccess.value = false
    }, 1800)
  } catch (err) {
    console.error(
      'خطا در افزودن به سبد:',
      err,
    )
  } finally {
    isAdding.value = false
  }
}
</script>

<template>
  <article class="product-card">
    <RouterLink
      :to="`/product/${product.slug}`"
      class="product-image"
    >
      <img
        v-if="
          product.thumb &&
          !imageError
        "
        :src="product.thumb"
        :alt="product.name"
        loading="lazy"
        @error="imageError = true"
      />

      <div
        v-else
        class="product-image__empty"
      >
        تصویر موجود نیست
      </div>

      <span
        v-if="hasDiscount"
        class="discount-badge"
      >
        {{ discountPercent }}٪
      </span>

      <span
        class="stock-badge"
        :class="{
          'stock-badge--empty':
            !isInStock,
        }"
      >
        {{ stockLabel }}
      </span>
    </RouterLink>

    <div class="product-content">
      <RouterLink
        :to="`/product/${product.slug}`"
        class="product-name"
      >
        {{ product.name }}
      </RouterLink>

      <div class="product-price">
        <span
          v-if="hasDiscount"
          class="product-price__old"
        >
          {{
            formatPrice(
              product.price,
            )
          }}
          تومان
        </span>

        <div class="product-price__current">
          <strong>
            {{
              formatPrice(
                finalPrice,
              )
            }}
          </strong>

          <span>تومان</span>
        </div>
      </div>

      <button
        type="button"
        class="add-button"
        :class="{
          'add-button--success':
            addSuccess,
        }"
        :disabled="
          !isInStock || isAdding
        "
        @click="handleAddToCart"
      >
        <template v-if="isAdding">
          در حال افزودن...
        </template>

        <template
          v-else-if="addSuccess"
        >
          به سبد اضافه شد
        </template>

        <template
          v-else-if="!isInStock"
        >
          ناموجود
        </template>

        <template v-else>
          افزودن به سبد
        </template>
      </button>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e6eee9;
  border-radius: 18px;
  background: white;
  box-shadow:
    0 8px 24px
    rgba(15, 23, 42, 0.045);
  transition: 0.25s;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: #a7f3d0;
  box-shadow:
    0 18px 35px
    rgba(4, 120, 87, 0.12);
}

.product-image {
  position: relative;
  display: block;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f8fafc;
}

.product-image img {
  width: 100%;
  height: 100%;
  padding: 12px;
  object-fit: contain;
  transition: 0.35s;
}

.product-card:hover
  .product-image img {
  transform: scale(1.05);
}

.product-image__empty {
  display: grid;
  height: 100%;
  place-items: center;
  color: #94a3b8;
  font-size: 12px;
}

.discount-badge,
.stock-badge {
  position: absolute;
  top: 10px;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
}

.discount-badge {
  right: 10px;
  background: #ef4444;
  color: white;
}

.stock-badge {
  left: 10px;
  background: #ecfdf5;
  color: #047857;
}

.stock-badge--empty {
  background: #334155;
  color: white;
}

.product-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 14px;
}

.product-name {
  display: -webkit-box;
  min-height: 48px;
  overflow: hidden;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.8;
  text-decoration: none;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-name:hover {
  color: #047857;
}

.product-price {
  margin-top: auto;
  padding: 18px 0 13px;
}

.product-price__old {
  display: block;
  margin-bottom: 4px;
  color: #94a3b8;
  font-size: 10px;
  text-decoration: line-through;
}

.product-price__current {
  display: flex;
  align-items: baseline;
  gap: 5px;
  color: #047857;
}

.product-price__current strong {
  font-size: 17px;
}

.product-price__current span {
  font-size: 10px;
}

.add-button {
  width: 100%;
  height: 42px;
  border: 0;
  border-radius: 12px;
  background: #059669;
  color: white;
  font-family: inherit;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s;
}

.add-button:hover:not(:disabled) {
  background: #047857;
}

.add-button:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.add-button--success {
  background: #d1fae5;
  color: #047857;
}

@media (max-width: 520px) {
  .product-content {
    padding: 10px;
  }

  .product-name {
    min-height: 43px;
    font-size: 11px;
  }

  .product-price__current strong {
    font-size: 14px;
  }

  .add-button {
    height: 38px;
    font-size: 11px;
  }

  .stock-badge,
  .discount-badge {
    top: 7px;
    padding: 4px 7px;
    font-size: 9px;
  }

  .discount-badge {
    right: 7px;
  }

  .stock-badge {
    left: 7px;
  }
}
</style>
