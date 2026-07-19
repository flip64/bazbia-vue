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
