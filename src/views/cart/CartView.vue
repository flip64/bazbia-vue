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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ShoppingBag, ArrowRight, Trash2, AlertCircle, Loader } from 'lucide-vue-next'
import { useCartStore } from '@/core/store/cartStore'
import { useProductStore } from '@/core/store/productStore'
import { useToast } from '@/composables/useToast'
import CartItemCard from '@/components/CartItemCard.vue'
import ProductCardMini from '@/components/ProductCardMini.vue'
import type { Product } from '@/types/product.types'

// ========== Stores ==========
const router = useRouter()
const cartStore = useCartStore()
const productStore = useProductStore()
const toast = useToast()

// ========== State ==========
const updatingItems = ref<Set<number>>(new Set())
const removingItems = ref<Set<number>>(new Set())
const itemErrors = ref<Record<number, string>>({})
const showRemoveModal = ref(false)
const removeModalCount = ref(0)
const errorTimeouts = ref<Record<number, ReturnType<typeof setTimeout>>>({})

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
  if (baseTotal >= 500000) return 0
  if (baseTotal === 0) return 0
  return 30000
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
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

const handleItemSelection = (itemId: number, selected: boolean) => {
  if (selected) {
    if (!cartStore.selectedItems.includes(itemId)) {
      cartStore.selectedItems.push(itemId)
    }
  } else {
    cartStore.selectedItems = cartStore.selectedItems.filter(id => id !== itemId)
  }
}

const handleUpdateQuantity = async (itemId: number, quantity: number) => {
  // بررسی موجودی قبل از آپدیت
  const item = items.value.find(i => i.id === itemId)
  if (item?.max_stock && quantity > item.max_stock) {
    toast.show(`حداکثر تعداد مجاز ${item.max_stock} عدد است`, 'warning')
    return
  }

  updatingItems.value.add(itemId)
  clearItemError(itemId)
  
  try {
    await cartStore.updateQuantity(itemId, quantity)
    toast.show('تعداد با موفقیت بروزرسانی شد', 'success')
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'خطا در بروزرسانی تعداد'
    itemErrors.value[itemId] = errorMessage
    toast.show(errorMessage, 'error')
    
    // تنظیم تایمر برای پاکسازی خودکار خطا
    setErrorTimeout(itemId)
  } finally {
    updatingItems.value.delete(itemId)
  }
}

const handleRemoveItem = async (itemId: number) => {
  removingItems.value.add(itemId)
  clearItemError(itemId)
  
  try {
    await cartStore.removeItem(itemId)
    toast.show('محصول با موفقیت از سبد خرید حذف شد', 'success')
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'خطا در حذف آیتم'
    itemErrors.value[itemId] = errorMessage
    toast.show(errorMessage, 'error')
    
    // تنظیم تایمر برای پاکسازی خودکار خطا
    setErrorTimeout(itemId)
  } finally {
    removingItems.value.delete(itemId)
  }
}

const handleRemoveSelected = () => {
  if (selectedCount.value === 0) {
    toast.show('هیچ آیتمی انتخاب نشده است', 'warning')
    return
  }
  removeModalCount.value = selectedCount.value
  showRemoveModal.value = true
}

const closeRemoveModal = () => {
  showRemoveModal.value = false
  removeModalCount.value = 0
}

const confirmRemoveSelected = async () => {
  showRemoveModal.value = false
  
  const itemsToRemove = [...selectedItems.value]
  let successCount = 0
  let failCount = 0
  
  // نمایش لودینگ برای همه آیتم‌ها
  itemsToRemove.forEach(id => removingItems.value.add(id))
  
  for (const itemId of itemsToRemove) {
    try {
      await cartStore.removeItem(itemId)
      successCount++
    } catch (err) {
      failCount++
      console.error(`Failed to remove item ${itemId}:`, err)
    } finally {
      removingItems.value.delete(itemId)
    }
  }
  
  // پاکسازی آیتم‌های انتخاب شده
  cartStore.selectedItems = cartStore.selectedItems.filter(
    id => !itemsToRemove.includes(id)
  )
  
  // نمایش نتیجه
  if (successCount > 0) {
    toast.show(`${successCount} آیتم با موفقیت حذف شد`, 'success')
  }
  if (failCount > 0) {
    toast.show(`حذف ${failCount} آیتم با خطا مواجه شد`, 'error')
  }
}

const clearItemError = (itemId: number) => {
  delete itemErrors.value[itemId]
  
  // پاکسازی تایمر اگر وجود دارد
  if (errorTimeouts.value[itemId]) {
    clearTimeout(errorTimeouts.value[itemId])
    delete errorTimeouts.value[itemId]
  }
}

const setErrorTimeout = (itemId: number) => {
  // پاکسازی تایمر قبلی اگر وجود دارد
  if (errorTimeouts.value[itemId]) {
    clearTimeout(errorTimeouts.value[itemId])
  }
  
  // تنظیم تایمر جدید
  errorTimeouts.value[itemId] = setTimeout(() => {
    clearItemError(itemId)
  }, 5000)
}

const handleAddSuggested = async (product: Product) => {
  if (!product.variants?.length) {
    toast.show('این محصول قابل افزودن به سبد خرید نیست', 'error')
    return
  }
  
  try {
    await cartStore.addItem({
      variant_id: product.variants[0].id,
      quantity: 1
    })
    toast.show('محصول به سبد خرید اضافه شد', 'success')
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'خطا در افزودن به سبد خرید'
    toast.show(errorMessage, 'error')
  }
}

const goToCheckout = () => {
  if (selectedCount.value === 0 && items.value.length > 0) {
    // اگر هیچ آیتمی انتخاب نشده، همه را انتخاب کن
    cartStore.selectAll()
  }
  
  if (cartStore.selectedItems.length === 0) {
    toast.show('لطفا حداقل یک محصول برای ادامه انتخاب کنید', 'warning')
    return
  }
  
  router.push('/checkout')
}

const retryLoad = async () => {
  cartStore.error = null
  try {
    await cartStore.fetchCart()
    toast.show('سبد خرید با موفقیت بروزرسانی شد', 'success')
  } catch (err) {
    toast.show('خطا در ارتباط با سرور. لطفا دوباره تلاش کنید', 'error')
  }
}

// پاکسازی تایمرها در هنگام unmount
onUnmounted(() => {
  Object.values(errorTimeouts.value).forEach(timeout => {
    clearTimeout(timeout)
  })
})

// ========== Lifecycle ==========
onMounted(async () => {
  await cartStore.initializeCart()
  await productStore.fetchSuggestedProducts()
})

// Watch برای خطاها (پشتیبانی از پاکسازی خودکار)
watch(itemErrors, (newErrors) => {
  Object.keys(newErrors).forEach(itemId => {
    setErrorTimeout(Number(itemId))
  })
}, { deep: true })
</script>

<style scoped>
/* استایل‌های موجود را نگه دار و این موارد را اضافه کن */

/* بهبود حالت loading برای دکمه‌ها */
.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* استایل برای دکمه غیرفعال */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* انیمیشن برای آیتم‌ها */
.cart-items {
  transition: all 0.3s ease;
}

/* بهبود مودال */
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.modal-btn--cancel {
  background: #f3f4f6;
  color: #374151;
}

.modal-btn--cancel:hover {
  background: #e5e7eb;
}

.modal-btn--confirm {
  background: #ef4444;
  color: white;
}

.modal-btn--confirm:hover {
  background: #dc2626;
}

/* بهبود نمایش در موبایل */
@media (max-width: 768px) {
  .cart-content {
    flex-direction: column;
  }
  
  .cart-summary {
    position: static !important;
    margin-top: 1rem;
  }
}
</style>
