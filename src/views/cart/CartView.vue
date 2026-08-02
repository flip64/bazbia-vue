<!-- views/cart/CartView.vue -->
<template>
  <div class="cart-page" dir="rtl">
    <header class="cart-header">
      <h1>سبد خرید</h1>
      <span v-if="!isEmpty">{{ totalItems }} کالا</span>
    </header>

    <section v-if="cartStore.loading && isEmpty" class="page-state">
      <div class="spinner"></div>
      <p>در حال دریافت سبد خرید...</p>
    </section>

    <section v-else-if="cartStore.error" class="page-state">
      <AlertCircle class="error-icon" :size="48" />
      <h2>خطا در دریافت اطلاعات</h2>
      <p>{{ cartStore.error }}</p>
      <button class="retry-btn" @click="cartStore.fetchCart()">تلاش مجدد</button>
    </section>

    <section v-else-if="isEmpty" class="page-state">
      <ShoppingBag class="empty-icon" :size="64" />
      <h2>سبد خرید شما خالی است</h2>
      <p>برای مشاهده محصولات به صفحه محصولات بروید.</p>
      <RouterLink to="/products" class="products-btn">مشاهده محصولات</RouterLink>
    </section>

    <main v-else class="cart-content">
      <div class="cart-items">
        <CartItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          :updating="updatingItems.has(item.id)"
          :removing="removingItems.has(item.id)"
          :error="itemErrors[item.id]"
          @update-quantity="updateQuantity"
          @remove="removeItem"
          @clear-error="delete itemErrors[item.id]"
        />

        <RouterLink to="/products" class="continue-link">
          <ArrowRight :size="18" />
          ادامه خرید
        </RouterLink>
      </div>

      <aside class="cart-summary">
        <h3>خلاصه سبد خرید</h3>

        <div class="summary-row">
          <span>تعداد کالاها</span>
          <strong>{{ totalItems }}</strong>
        </div>

        <div class="summary-row">
          <span>مبلغ کالاها</span>
          <strong>{{ formatPrice(totalPrice) }} تومان</strong>
        </div>

        <div class="summary-total">
          <span>مبلغ قابل پرداخت</span>
          <strong>{{ formatPrice(totalPrice) }} تومان</strong>
        </div>
        <!--
        <BazbinPurchaseProgress
          :current-amount="totalPrice"
          :target-amount="BAZBIN_LIMIT"
         />
         -->
        
        <button
          class="checkout-btn"
          :disabled="cartStore.loading"
          @click="router.push('/checkout')"
        >
          <Loader v-if="cartStore.loading" :size="18" class="spin" />
          {{ cartStore.loading ? 'در حال پردازش...' : 'ادامه تسویه حساب' }}
        </button>

        <div v-if="suggestedProducts.length" class="suggestions">
          <h4>پیشنهاد ویژه</h4>

          <ProductCardMini
            v-for="product in suggestedProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="addSuggestedProduct"
          />
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  AlertCircle,
  ArrowRight,
  Loader,
  ShoppingBag,
} from 'lucide-vue-next'

import { useCartStore } from '@/core/store/cartStore'
import { useProductStore } from '@/core/store/productStore'
import CartItemCard from '@/components/CartItemCard.vue'
import ProductCardMini from '@/components/ProductCardMini.vue'
import type { Product } from '@/types/product.types'

import BazbinPurchaseProgress from '@/components/bazbin/BazbinPurchaseProgress.vue'

const router = useRouter()
const cartStore = useCartStore()
const productStore = useProductStore()

const BAZBIN_LIMIT = 2_000_000

const updatingItems = ref(new Set<number>())
const removingItems = ref(new Set<number>())
const itemErrors = reactive<Record<number, string>>({})

const items = computed(() => cartStore.items ?? [])
const totalPrice = computed(() => cartStore.totalPrice ?? 0)
const totalItems = computed(() => items.value.length)
const isEmpty = computed(() => totalItems.value === 0)
const suggestedProducts = computed(
  () => productStore.suggestedProducts ?? [],
)



const formatPrice = (value: number) =>
  new Intl.NumberFormat('fa-IR').format(value)

const runItemAction = async (
  itemId: number,
  state: Set<number>,
  action: () => Promise<unknown>,
  message: string,
) => {
  state.add(itemId)
  delete itemErrors[itemId]

  try {
    await action()
  } catch (error) {
    itemErrors[itemId] =
      error instanceof Error ? error.message : message
  } finally {
    state.delete(itemId)
  }
}

const updateQuantity = (itemId: number, quantity: number) =>
  runItemAction(
    itemId,
    updatingItems.value,
    () => cartStore.updateQuantity(itemId, quantity),
    'خطا در به‌روزرسانی تعداد کالا',
  )

const removeItem = (itemId: number) =>
  runItemAction(
    itemId,
    removingItems.value,
    () => cartStore.removeItem(itemId),
    'خطا در حذف کالا',
  )

const addSuggestedProduct = async (product: Product) => {
  const variant = product.variants?.[0]
  if (!variant) return

  await cartStore.addItem({
    variant_id: variant.id,
    quantity: 1,
    session_key: cartStore.sessionKey,
  })
}

onMounted(() => {
  cartStore.fetchCart()
  productStore.fetchSuggestedProducts()
})
</script>

<style scoped>
.cart-page {
  width: min(1280px, 100%);
  min-height: 70vh;
  margin: auto;
  padding: 2rem 1rem 4rem;
  color: #1e293b;
}

.cart-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  border: 1px solid #dcfce7;
  border-radius: 20px;
}

.cart-header h1 {
  margin: 0;
  color: #14532d;
  font-size: 1.65rem;
}

.cart-header span {
  padding: 0.3rem 0.75rem;
  color: #15803d;
  background: white;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.cart-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 1.5rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.continue-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: fit-content;
  color: #15803d;
  text-decoration: none;
  font-weight: 700;
}

.cart-summary {
  position: sticky;
  top: 90px;
  padding: 1.4rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgb(15 23 42 / 7%);
}

.cart-summary h3 {
  margin: 0 0 1rem;
  padding-bottom: 1rem;
  color: #14532d;
  border-bottom: 1px solid #e5e7eb;
}

.summary-row,
.summary-total {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.summary-row {
  padding: 0.65rem 0;
  color: #64748b;
  font-size: 0.87rem;
}

.summary-row strong {
  color: #334155;
}

.summary-total {
  margin-top: 0.6rem;
  padding: 1rem 0;
  border-top: 1px dashed #cbd5e1;
  font-weight: 900;
}

.summary-total strong {
  color: #15803d;
  font-size: 1.05rem;
}







.checkout-btn {
  width: 100%;
  min-height: 50px;
  color: white;
  background: linear-gradient(135deg, #16a34a, #15803d);
  border: 0;
  border-radius: 14px;
  box-shadow: 0 10px 24px rgb(22 163 74 / 22%);
  cursor: pointer;
  font-weight: 900;
}

.checkout-btn:disabled {
  opacity: 0.55;
  cursor: wait;
}

.suggestions {
  display: grid;
  gap: 0.7rem;
  margin-top: 1.3rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.suggestions h4 {
  margin: 0;
}

.page-state {
  min-height: 400px;
  padding: 2rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.page-state p {
  color: #64748b;
}

.page-state h2 {
  font-size: 1.2rem;
}

.empty-icon {
  padding: 1rem;
  color: #16a34a;
  background: #ecfdf5;
  border-radius: 50%;
  box-sizing: content-box;
}

.error-icon {
  color: #e11d48;
}

.products-btn,
.retry-btn {
  padding: 0.7rem 1.2rem;
  color: white;
  background: #16a34a;
  border: 0;
  border-radius: 11px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 800;
}

.retry-btn {
  background: #e11d48;
}

.spinner {
  width: 38px;
  height: 38px;
  border: 4px solid #dcfce7;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spin {
  margin-inline-end: 0.4rem;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 820px) {
  .cart-content {
    display: flex;
    flex-direction: column;
  }

  .cart-summary {
    position: static;
    width: 100%;
    box-sizing: border-box;
  }
}

@media (max-width: 560px) {
  .cart-page {
    padding: 1rem 0.65rem 3rem;
  }

  .cart-header,
  .cart-summary {
    border-radius: 16px;
  }

  .cart-header h1 {
    font-size: 1.3rem;
  }

  .bazbin-egg {
    width: 54px;
    height: 54px;
  }
}
</style>
