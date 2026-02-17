<!-- views/cart/CartView.vue -->
<template>
  <div class="cart-page" dir="rtl">
    <!-- Header -->
    <div class="cart-header">
      <div class="cart-header__title">
        <h1>سبد خرید</h1>
        <span v-if="!cartStore.isEmpty" class="cart-header__count">
          {{ cartStore.totalItems }} کالا
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
          v-if="cartStore.selectedCount > 0"
          class="remove-selected-btn"
          @click="handleRemoveSelected"
          :disabled="cartStore.loading"
        >
          <Trash2 :size="16" />
          حذف موارد انتخاب شده ({{ cartStore.selectedCount }})
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="cartStore.loading && cartStore.isEmpty" class="loading-state">
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
    <div v-else-if="cartStore.isEmpty" class="empty-cart">
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
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
          :selected="cartStore.selectedItems.includes(item.id)"
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
          <span>{{ cartStore.selectedCount || cartStore.totalItems }}</span>
        </div>
        
        <div class="summary-row">
          <span>مبلغ کل</span>
          <span>{{ formatPrice(cartStore.selectedTotalPrice || cartStore.totalPrice) }}</span>
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
          <p>{{ formatPrice(minPurchaseForFreeShipping - (cartStore.selectedTotalPrice || cartStore.totalPrice)) }} دیگر خرید کنید تا ارسال رایگان شود</p>
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
          :disabled="cartStore.selectedCount === 0 || cartStore.loading"
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

// ========== Computed ==========
const {
  items,
  totalItems,
  totalPrice,
  selectedItems,
  selectedCount,
  selectedTotalPrice,
  isEmpty,
  loading,
  error
} = storeToRefs(cartStore)

const shippingCost = computed(() => {
  // محاسبه هزینه ارسال بر اساس مبلغ
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

// ========== Methods ==========

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const handleItemSelection = (itemId: number, selected: boolean) => {
  if (selected) {
    cartStore.selectedItems.push(itemId)
  } else {
    cartStore.selectedItems = cartStore.selectedItems.filter(id => id !== itemId)
  }
}

const handleUpdateQuantity = async (itemId: number, quantity: number) => {
  updatingItems.value.add(itemId)
  clearItemError(itemId)
  
  try {
    await cartStore.updateQuantity(itemId, quantity)
  } catch (err: any) {
    itemErrors.value[itemId] = err.message || 'خطا در بروزرسانی'
  } finally {
    updatingItems.value.delete(itemId)
  }
}

const handleRemoveItem = async (itemId: number) => {
  removingItems.value.add(itemId)
  clearItemError(itemId)
  
  try {
    await cartStore.removeItem(itemId)
  } catch (err: any) {
    itemErrors.value[itemId] = err.message || 'خطا در حذف آیتم'
  } finally {
    removingItems.value.delete(itemId)
  }
}

const handleRemoveSelected = () => {
  removeModalCount.value = selectedCount.value
  showRemoveModal.value = true
}

const removeModalCount = ref(0)

const closeRemoveModal = () => {
  showRemoveModal.value = false
  removeModalCount.value = 0
}

const confirmRemoveSelected = async () => {
  showRemoveModal.value = false
  
  // حذف یکی یکی
  for (const itemId of selectedItems.value) {
    await handleRemoveItem(itemId)
  }
  
  // پاکسازی انتخاب‌ها
  cartStore.selectedItems = []
}

const clearItemError = (itemId: number) => {
  delete itemErrors.value[itemId]
}

const handleAddSuggested = async (product: Product) => {
  try {
    await cartStore.addItem({
      variant_id: product.variants[0].id,
      quantity: 1
    })
    // می‌تونیم یک نوتیفیکیشن موفقیت نمایش بدیم
  } catch (err) {
    console.error('Error adding suggested product:', err)
  }
}

const goToCheckout = () => {
  if (selectedCount.value === 0) {
    // اگر آیتمی انتخاب نشده، همه رو انتخاب کن
    cartStore.selectAll()
  }
  router.push('/checkout')
}

const retryLoad = async () => {
  await cartStore.fetchCart()
}

// ========== Lifecycle ==========
onMounted(async () => {
  // دریافت سبد خرید
  await cartStore.fetchCart()
  
  // دریافت محصولات پیشنهادی
  await productStore.fetchSuggestedProducts()
})

// ========== Watch ==========
// پاکسازی خطاها بعد از 5 ثانیه
watch(itemErrors, (newErrors) => {
  Object.keys(newErrors).forEach(itemId => {
    setTimeout(() => {
      clearItemError(Number(itemId))
    }, 5000)
  })
}, { deep: true })
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 60vh;
}

/* ===== Header ===== */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.cart-header__title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-header__title h1 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.cart-header__count {
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: #666;
  font-size: 0.9rem;
}

.cart-header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #666;
  user-select: none;
}

.select-all input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4CAF50;
}

.remove-selected-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #ff4444;
  color: #ff4444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.remove-selected-btn:hover:not(:disabled) {
  background: #ff4444;
  color: white;
}

.remove-selected-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== Loading State ===== */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== Error State ===== */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #ffebee;
  border-radius: 12px;
  color: #c62828;
}

.error-icon {
  color: #c62828;
  margin-bottom: 1rem;
}

.error-state h3 {
  margin-bottom: 0.5rem;
}

.error-state p {
  margin-bottom: 2rem;
  color: #b71c1c;
}

.retry-btn {
  padding: 0.8rem 2rem;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #b71c1c;
}

/* ===== Empty Cart ===== */
.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: #f9f9f9;
  border-radius: 12px;
}

.empty-icon {
  color: #999;
  margin-bottom: 1rem;
}

.empty-cart h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: #666;
  margin-bottom: 2rem;
}

.continue-shopping-btn {
  display: inline-block;
  background: #4CAF50;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s;
}

.continue-shopping-btn:hover {
  background: #45a049;
}

/* ===== Cart Content ===== */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.continue-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #4CAF50;
  text-decoration: none;
  border-top: 1px solid #eee;
  transition: background 0.2s;
}

.continue-link:hover {
  background: #f9f9f9;
}

.icon {
  transition: transform 0.2s;
}

.continue-link:hover .icon {
  transform: translateX(-4px);
}

/* ===== Cart Summary ===== */
.cart-summary {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1.5rem;
  height: fit-content;
}

.cart-summary--sticky {
  position: sticky;
  top: 100px;
}

.cart-summary h3 {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4CAF50;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 2px solid #eee;
  border-bottom: 2px solid #eee;
  font-weight: bold;
  color: #333;
}

.total-price {
  color: #4CAF50;
  font-size: 1.2rem;
}

.free-shipping {
  color: #4CAF50;
  font-weight: bold;
}

.shipping-progress {
  margin: 1rem 0;
  padding: 1rem;
  background: #f0f8ff;
  border-radius: 8px;
}

.shipping-progress p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 2rem;
  font-weight: 600;
}

.checkout-btn:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* ===== Suggestions ===== */
.suggestions {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.suggestions h4 {
  color: #333;
  margin-bottom: 1rem;
}

.suggestion-items {
  display: grid;
  gap: 1rem;
}

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  color: #333;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #666;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.modal-btn--cancel {
  background: none;
  border: 1px solid #ddd;
  color: #666;
}

.modal-btn--cancel:hover {
  background: #f5f5f5;
}

.modal-btn--confirm {
  background: #ff4444;
  border: none;
  color: white;
}

.modal-btn--confirm:hover {
  background: #ff3333;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary--sticky {
    position: static;
  }
  
  .cart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .cart-header__actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
  
  .remove-selected-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .cart-page {
    padding: 1rem;
  }
  
  .cart-header__title h1 {
    font-size: 1.5rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
  }
}
</style>
