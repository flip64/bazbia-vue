<!-- views/cart/CartView.vue -->
<template>
  <div class="cart-page" dir="rtl">
    <!-- Header -->
    <div class="cart-header">
      <div class="cart-header__title">
        <h1>سبد خرید</h1>
        <span v-if="!cartStore.isEmpty" class="cart-header__count">
          {{ totalItems }} کالا
        </span>
      </div>
      
      <!-- Select All -->
      <div v-if="!cartStore.isEmpty" class="cart-header__actions">
        <label class="select-all">
          <input 
            type="checkbox" 
            :checked="cartStore.isAllSelected"
            @change="cartStore.selectAll"
          />
          <span>انتخاب همه</span>
        </label>
        
        <button 
          v-if="selectedCount > 0"
          class="remove-selected-btn"
          @click="handleRemoveSelected"
          :disabled="cartStore.loading"
        >
          <Trash2 :size="16" />
          حذف موارد انتخاب شده ({{ selectedCount }})
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="cartStore.loading && isEmpty" class="loading-state">
      <div class="spinner"></div>
      <p>در حال دریافت سبد خرید...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="cartStore.error" class="error-state">
      <AlertCircle class="error-icon" :size="48" />
      <h3>خطا در دریافت اطلاعات</h3>
      <p>{{ cartStore.error }}</p>
      <button @click="retryLoad" class="retry-btn">
        تلاش مجدد
      </button>
    </div>

    <!-- Empty Cart -->
    <div v-else-if="isEmpty" class="empty-cart">
      <ShoppingBag class="empty-icon" :size="64" />
      <h2>سبد خرید شما خالی است</h2>
      <p>برای مشاهده محصولات بیشتر به صفحه محصولات بروید</p>
      <router-link to="/products" class="continue-shopping-btn">
        مشاهده محصولات
      </router-link>
    </div>

    <!-- Cart Items -->
    <div v-else class="cart-content">
      <div class="cart-items">
        <CartItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          :selected="selectedItems.includes(item.id)"
          :updating="updatingItems.has(item.id)"
          :removing="removingItems.has(item.id)"
          :error="itemErrors[item.id]"
          @update:selected="(value) => handleItemSelection(item.id, value)"
          @update-quantity="handleUpdateQuantity"
          @remove="handleRemoveItem"
          @clear-error="clearItemError(item.id)"
        />
        
        <!-- Continue Shopping -->
        <router-link to="/products" class="continue-link">
          <ArrowRight class="icon" />
          ادامه خرید
        </router-link>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary" :class="{ 'cart-summary--sticky': !cartStore.loading }">
        <h3>خلاصه سبد خرید</h3>
        
        <div class="summary-row">
          <span>تعداد کالاها</span>
          <span>{{ selectedCount || totalItems }}</span>
        </div>
        
        <div class="summary-row">
          <span>مبلغ کل</span>
          <span>{{ formatPrice(selectedTotalPrice || totalPrice) }}</span>
        </div>
        
        <div class="summary-row">
          <span>هزینه ارسال</span>
          <span>
            <span v-if="shippingCost === 0" class="free-shipping">رایگان</span>
            <span v-else>{{ formatPrice(shippingCost) }}</span>
          </span>
        </div>
        
        <div class="summary-total">
          <span>مبلغ قابل پرداخت</span>
          <span class="total-price">{{ formatPrice(finalPrice) }}</span>
        </div>
        
        <!-- Free shipping progress -->
        <div v-if="shippingCost > 0" class="shipping-progress">
          <p>{{ formatPrice(minPurchaseForFreeShipping - (selectedTotalPrice || totalPrice)) }} دیگر خرید کنید تا ارسال رایگان شود</p>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: shippingProgress + '%' }"
            ></div>
          </div>
        </div>
        
        <button 
          class="checkout-btn"
          @click="goToCheckout"
          :disabled="selectedCount === 0 || cartStore.loading"
        >
          <span v-if="!cartStore.loading">ادامه فرآیند خرید</span>
          <span v-else class="btn-loading">
            <Loader :size="18" class="spin" />
            در حال پردازش...
          </span>
        </button>
        
        <!-- Suggestions -->
        <div v-if="suggestedProducts.length" class="suggestions">
          <h4>پیشنهاد ویژه</h4>
          <div class="suggestion-items">
            <ProductCardMini
              v-for="product in suggestedProducts"
              :key="product.id"
              :product="product"
              @add-to-cart="handleAddSuggested"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Remove Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showRemoveModal" class="modal-overlay" @click.self="closeRemoveModal">
        <div class="modal-content">
          <h3>حذف آیتم‌ها</h3>
          <p>آیا از حذف {{ removeModalCount }} آیتم انتخاب شده اطمینان دارید؟</p>
          <div class="modal-actions">
            <button @click="closeRemoveModal" class="modal-btn modal-btn--cancel">
              انصراف
            </button>
            <button @click="confirmRemoveSelected" class="modal-btn modal-btn--confirm">
              تایید و حذف
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ShoppingBag, ArrowRight, Trash2, AlertCircle, Loader } from 'lucide-vue-next'
import { useCartStore } from '@/core/store/cartStore'
import { useProductStore } from '@/core/store/productStore'
import CartItemCard from '@/components/CartItemCard.vue'
import ProductCardMini from '@/components/ProductCardMini.vue'
import type { Product } from '@/types/product.types'

// ========== Stores ==========
const router = useRouter()
const cartStore = useCartStore()
const productStore = useProductStore()

// ========== State ==========
const updatingItems = ref<Set<number>>(new Set())
const removingItems = ref<Set<number>>(new Set())
const itemErrors = ref<Record<number, string>>({})
const showRemoveModal = ref(false)
const removeModalCount = ref(0)

// ========== Computed ==========
const items = computed(() => cartStore.items ?? [])
const totalItems = computed(() => (cartStore.items ?? []).length)
const selectedItems = computed(() => cartStore.selectedItems ?? [])
const selectedCount = computed(() => selectedItems.value.length)
const selectedTotalPrice = computed(() => cartStore.selectedTotalPrice ?? 0)
const totalPrice = computed(() => cartStore.totalPrice ?? 0)
const isEmpty = computed(() => !items.value.length)

const shippingCost = computed(() => {
  const baseTotal = selectedCount.value ? selectedTotalPrice.value : totalPrice.value
  return baseTotal > 500000 ? 0 : 30000
})

const finalPrice = computed(() => {
  const baseTotal = selectedCount.value ? selectedTotalPrice.value : totalPrice.value
  return baseTotal + shippingCost.value
})

const shippingProgress = computed(() => {
  const baseTotal = selectedCount.value ? selectedTotalPrice.value : totalPrice.value
  return Math.min((baseTotal / 500000) * 100, 100)
})

const minPurchaseForFreeShipping = 500000

const suggestedProducts = computed(() => productStore.suggestedProducts ?? [])

// ========== Methods ==========
const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price)

const handleItemSelection = (itemId: number, selected: boolean) => {
  if (selected) {
    if (!cartStore.selectedItems.includes(itemId)) cartStore.selectedItems.push(itemId)
  } else {
    cartStore.selectedItems = cartStore.selectedItems.filter(id => id !== itemId)
  }
}

const handleUpdateQuantity = async (itemId: number, quantity: number) => {
  updatingItems.value.add(itemId)
  delete itemErrors.value[itemId]
  try { await cartStore.updateQuantity(itemId, quantity) }
  catch (err: any) { itemErrors.value[itemId] = err.message || 'خطا در بروزرسانی' }
  finally { updatingItems.value.delete(itemId) }
}

const handleRemoveItem = async (itemId: number) => {
  removingItems.value.add(itemId)
  delete itemErrors.value[itemId]
  try { await cartStore.removeItem(itemId) }
  catch (err: any) { itemErrors.value[itemId] = err.message || 'خطا در حذف آیتم' }
  finally { removingItems.value.delete(itemId) }
}

const handleRemoveSelected = () => {
  removeModalCount.value = selectedCount.value
  showRemoveModal.value = true
}

const closeRemoveModal = () => {
  showRemoveModal.value = false
  removeModalCount.value = 0
}

const confirmRemoveSelected = async () => {
  showRemoveModal.value = false
  for (const itemId of selectedItems.value) await handleRemoveItem(itemId)
  cartStore.selectedItems = []
}

const clearItemError = (itemId: number) => { delete itemErrors.value[itemId] }

const handleAddSuggested = async (product: Product) => {
  try {
    await cartStore.addItem({
      variant_id: product.variants[0].id,
      quantity: 1,
      session_key: cartStore.sessionKey // اضافه شد
    })
  } catch (err) {
    console.error('Error adding suggested product:', err)
  }
}

const goToCheckout = () => {
  if (selectedCount.value === 0) cartStore.selectAll()
  router.push('/checkout')
}

const retryLoad = async () => await cartStore.fetchCart()

// ========== Lifecycle ==========
onMounted(async () => {
  await cartStore.fetchCart()
  await productStore.fetchSuggestedProducts()
})

// پاکسازی خطاها بعد از 5 ثانیه
watch(itemErrors, (newErrors) => {
  Object.keys(newErrors).forEach(itemId => {
    setTimeout(() => delete itemErrors.value[Number(itemId)], 5000)
  })
}, { deep: true })
</script>


<style scoped>
.cart-page {
  width: 100%;
  max-width: 1280px;
  min-height: 70vh;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
  color: #111827;
}

/* =========================
   هدر صفحه
========================= */

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  background:
    linear-gradient(
      135deg,
      rgba(240, 253, 244, 0.95),
      rgba(236, 253, 245, 0.75)
    );
  border: 1px solid #dcfce7;
  border-radius: 20px;
}

.cart-header__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cart-header__title h1 {
  margin: 0;
  color: #14532d;
  font-size: 1.65rem;
  font-weight: 900;
}

.cart-header__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0.25rem 0.75rem;
  color: #15803d;
  background: #ffffff;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.cart-header__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.select-all {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 40px;
  padding: 0.45rem 0.75rem;
  color: #334155;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.select-all input {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #16a34a;
  cursor: pointer;
}

.remove-selected-btn {
  min-height: 40px;
  padding: 0.5rem 0.85rem;
  color: #be123c;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 11px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 700;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.remove-selected-btn:hover:not(:disabled) {
  background: #ffe4e6;
  transform: translateY(-1px);
}

.remove-selected-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* =========================
   چیدمان اصلی
========================= */

.cart-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  align-items: start;
  gap: 1.5rem;
}

.cart-items {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.continue-link {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.25rem;
  padding: 0.65rem 0.2rem;
  color: #15803d;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.continue-link:hover {
  color: #166534;
  transform: translateX(3px);
}

.continue-link .icon {
  width: 18px;
  height: 18px;
}

/* =========================
   خلاصه سبد خرید
========================= */

.cart-summary {
  padding: 1.4rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow:
    0 4px 12px rgba(15, 23, 42, 0.04),
    0 18px 40px rgba(15, 23, 42, 0.05);
}

.cart-summary--sticky {
  position: sticky;
  top: 90px;
}

.cart-summary h3 {
  margin: 0 0 1.25rem;
  padding-bottom: 1rem;
  color: #14532d;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1.08rem;
  font-weight: 900;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 0;
  color: #64748b;
  font-size: 0.87rem;
}

.summary-row > span:last-child {
  color: #334155;
  font-weight: 700;
}

.free-shipping {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  color: #15803d;
  background: #ecfdf5;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
}

.summary-total {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.75rem;
  padding: 1rem 0;
  border-top: 1px dashed #cbd5e1;
}

.summary-total > span:first-child {
  color: #334155;
  font-size: 0.9rem;
  font-weight: 800;
}

.total-price {
  color: #15803d;
  font-size: 1.25rem;
  font-weight: 900;
  white-space: nowrap;
}

.total-price::after {
  content: " تومان";
  margin-inline-start: 0.2rem;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 500;
}

/* =========================
   نوار ارسال رایگان
========================= */

.shipping-progress {
  margin: 0.3rem 0 1.1rem;
  padding: 0.8rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.shipping-progress p {
  margin: 0 0 0.65rem;
  color: #64748b;
  font-size: 0.76rem;
  line-height: 1.8;
}

.progress-bar {
  width: 100%;
  height: 8px;
  overflow: hidden;
  background: #e2e8f0;
  border-radius: 999px;
}

.progress-fill {
  height: 100%;
  min-width: 2%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: inherit;
  transition: width 0.4s ease;
}

/* =========================
   دکمه پرداخت
========================= */

.checkout-btn {
  width: 100%;
  min-height: 52px;
  padding: 0.8rem 1rem;
  color: #ffffff;
  background: linear-gradient(135deg, #16a34a, #15803d);
  border: none;
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(22, 163, 74, 0.22);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 900;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(22, 163, 74, 0.28);
}

.checkout-btn:disabled {
  opacity: 0.48;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* =========================
   محصولات پیشنهادی
========================= */

.suggestions {
  margin-top: 1.4rem;
  padding-top: 1.1rem;
  border-top: 1px solid #e5e7eb;
}

.suggestions h4 {
  margin: 0 0 0.9rem;
  color: #334155;
  font-size: 0.9rem;
  font-weight: 800;
}

.suggestion-items {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

/* =========================
   حالت بارگذاری، خطا و خالی
========================= */

.loading-state,
.error-state,
.empty-cart {
  min-height: 420px;
  padding: 3rem 1.5rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-state p,
.error-state p,
.empty-cart p {
  max-width: 420px;
  margin: 0.75rem 0 1.25rem;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.9;
}

.loading-state .spinner {
  width: 38px;
  height: 38px;
  margin-bottom: 0.9rem;
  border: 4px solid #dcfce7;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.error-icon {
  color: #e11d48;
}

.error-state h3,
.empty-cart h2 {
  margin: 1rem 0 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 900;
}

.empty-icon {
  padding: 1rem;
  color: #16a34a;
  background: #ecfdf5;
  border-radius: 50%;
  box-sizing: content-box;
}

.retry-btn,
.continue-shopping-btn {
  min-height: 44px;
  padding: 0.65rem 1.2rem;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 800;
}

.retry-btn {
  color: #ffffff;
  background: #e11d48;
  border: none;
}

.continue-shopping-btn {
  color: #ffffff;
  background: #16a34a;
  border: 1px solid #16a34a;
}

/* =========================
   مودال حذف
========================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 100%;
  max-width: 420px;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.25);
  animation: modal-in 0.2s ease;
}

.modal-content h3 {
  margin: 0 0 0.75rem;
  color: #1e293b;
  font-size: 1.15rem;
  font-weight: 900;
}

.modal-content p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.9;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-top: 1.4rem;
}

.modal-btn {
  min-height: 42px;
  padding: 0.6rem 1rem;
  border-radius: 11px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 800;
}

.modal-btn--cancel {
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.modal-btn--confirm {
  color: #ffffff;
  background: #e11d48;
  border: 1px solid #e11d48;
}

/* =========================
   انیمیشن‌ها
========================= */

.spin {
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* =========================
   تبلت
========================= */

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: minmax(0, 1fr) 320px;
  }
}

/* =========================
   موبایل و تبلت کوچک
========================= */

@media (max-width: 820px) {
  .cart-page {
    padding: 1.25rem 0.8rem 3rem;
  }

  .cart-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 1rem;
    border-radius: 16px;
  }

  .cart-header__actions {
    width: 100%;
    justify-content: space-between;
  }

  .cart-content {
    display: flex;
    flex-direction: column;
  }

  .cart-items,
  .cart-summary {
    width: 100%;
  }

  .cart-summary--sticky {
    position: static;
  }

  .cart-summary {
    order: 2;
  }
}

@media (max-width: 560px) {
  .cart-page {
    padding-inline: 0.65rem;
  }

  .cart-header__title h1 {
    font-size: 1.3rem;
  }

  .cart-header__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .select-all,
  .remove-selected-btn {
    width: 100%;
  }

  .select-all {
    justify-content: center;
  }

  .cart-summary {
    padding: 1.1rem;
    border-radius: 16px;
  }

  .total-price {
    font-size: 1.05rem;
  }

  .loading-state,
  .error-state,
  .empty-cart {
    min-height: 360px;
    padding: 2rem 1rem;
    border-radius: 16px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-btn {
    width: 100%;
  }
}
</style>
