
<template>
  <article
    class="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
  >
    <!-- تصویر محصول -->
    <RouterLink
      :to="`/product/${product.slug}`"
      class="relative block aspect-square overflow-hidden bg-gray-50"
    >
      <img
        v-if="product.thumb && !imageHasError"
        :src="product.thumb"
        :alt="product.name"
        loading="lazy"
        class="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
        @error="handleImageError"
      />

      <div
        v-else
        class="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400"
      >
        <svg
          class="h-12 w-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5A1.5 1.5 0 0 0 21.75 18V6A1.5 1.5 0 0 0 20.25 4.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"
          />
        </svg>

        <span class="text-xs">
          تصویر موجود نیست
        </span>
      </div>

      <!-- درصد تخفیف -->
      <span
        v-if="hasDiscount"
        class="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm"
      >
        {{ discountPercent }}٪
      </span>

      <!-- وضعیت موجودی -->
      <span
        class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm"
        :class="
          isInStock
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-gray-800 text-white'
        "
      >
        {{ stockLabel }}
      </span>
    </RouterLink>

    <!-- اطلاعات محصول -->
    <div class="flex flex-1 flex-col p-4">
      <RouterLink
        :to="`/product/${product.slug}`"
        class="mb-4 line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-gray-800 transition hover:text-emerald-700"
      >
        {{ product.name }}
      </RouterLink>

      <!-- قیمت -->
      <div class="mb-4 mt-auto">
        <div
          v-if="hasDiscount"
          class="mb-1 text-xs text-gray-400 line-through"
        >
          {{ formatPrice(product.price) }}
          تومان
        </div>

        <div class="flex items-end gap-1 text-emerald-700">
          <span class="text-lg font-black">
            {{ formatPrice(finalPrice) }}
          </span>

          <span class="pb-0.5 text-xs font-medium">
            تومان
          </span>
        </div>
      </div>

      <!-- دکمه افزودن -->
      <button
        type="button"
        class="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100"
        :class="[
          !isInStock
            ? 'bg-gray-100 text-gray-400'
            : addSuccess
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-emerald-600 text-white hover:bg-emerald-700',
        ]"
        :disabled="!isInStock || isAdding"
        @click="handleAddToCart"
      >
        <!-- در حال افزودن -->
        <template v-if="isAdding">
          <svg
            class="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />

            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
            />
          </svg>

          در حال افزودن
        </template>

        <!-- موفقیت -->
        <template v-else-if="addSuccess">
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>

          به سبد اضافه شد
        </template>

        <!-- ناموجود -->
        <template v-else-if="!isInStock">
          ناموجود
        </template>

        <!-- حالت عادی -->
        <template v-else>
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386a1.5 1.5 0 0 1 1.455 1.136l.383 1.534m0 0L6.75 10.5h10.878a1.5 1.5 0 0 0 1.455-1.136l.75-3A1.5 1.5 0 0 0 18.378 4.5H5.182M5.474 5.67 7.5 13.5h9.75m-9.75 0a2.25 2.25 0 1 0 0 4.5m9.75-4.5a2.25 2.25 0 1 1 0 4.5M7.5 18h9.75"
            />
          </svg>

          افزودن به سبد
        </template>
      </button>

      <!-- خطای سبد -->
      <p
        v-if="cartStore.error"
        class="mt-2 line-clamp-1 text-center text-xs text-red-500"
      >
        {{ cartStore.error }}
      </p>
    </div>
  </article>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/core/store/cartStore'

interface ProductVariant {
  id: number
  sku: string
  price: string
  discount_price: string | null
  stock: number
  low_stock_threshold: number
  expiration_date: string | null
  attributes: unknown[]
}

interface Product {
  id: number
  name: string
  slug: string
  price: number
  discount_price: number | null
  category: unknown | null
  thumb: string | null
  variants: ProductVariant[]
  created_at: string
  in_stock: number
}

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()

const isAdding = ref(false)
const addSuccess = ref(false)
const imageHasError = ref(false)

const mainVariant = computed(() => {
  return props.product.variants[0] ?? null
})

const isInStock = computed(() => {
  return (
    props.product.in_stock > 0 &&
    mainVariant.value !== null &&
    mainVariant.value.stock > 0
  )
})

const hasDiscount = computed(() => {
  return (
    props.product.discount_price !== null &&
    props.product.discount_price > 0 &&
    props.product.discount_price < props.product.price
  )
})

const finalPrice = computed(() => {
  return hasDiscount.value
    ? props.product.discount_price!
    : props.product.price
})

const discountPercent = computed(() => {
  if (!hasDiscount.value) {
    return 0
  }

  return Math.round(
    ((props.product.price - props.product.discount_price!) /
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
    mainVariant.value.stock <= mainVariant.value.low_stock_threshold
  ) {
    return `تنها ${mainVariant.value.stock} عدد`
  }

  return 'موجود'
})

const formatPrice = (price: number | string) => {
  const numericPrice = Number(price)

  if (!Number.isFinite(numericPrice)) {
    return '۰'
  }

  return new Intl.NumberFormat('fa-IR').format(numericPrice)
}

const handleImageError = () => {
  imageHasError.value = true
}

const handleAddToCart = async () => {
  if (!mainVariant.value || !isInStock.value || isAdding.value) {
    return
  }

  isAdding.value = true
  addSuccess.value = false

  try {
    await cartStore.addItem({
      variant_id: mainVariant.value.id,
      quantity: 1,
    })

    addSuccess.value = true

    window.setTimeout(() => {
      addSuccess.value = false
    }, 1800)
  } catch (error) {
    console.error('خطا در افزودن محصول به سبد خرید:', error)
  } finally {
    isAdding.value = false
  }
}
</script>

