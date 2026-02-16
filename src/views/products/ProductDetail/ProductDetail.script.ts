import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/product.service'
import type { ProductDetail, Variant } from '@/types/product.types'

console.log('🔥🔥🔥 PRODUCT DETAIL COMPONENT LOADED 🔥🔥🔥')
console.log('🕐 Time:', new Date().toISOString())
console.log('📦 Imports done')

const route = useRoute()
const router = useRouter()

console.log('🛣️ Route object:', route)
console.log('📍 Route params:', route.params)

// stateها
const loading = ref(false)
const error = ref<string | null>(null)
const product = ref<ProductDetail | null>(null)
const currentImage = ref('')
const selectedVariantId = ref<number | null>(null)

console.log('📊 Initial state:', { 
  loading: loading.value, 
  error: error.value, 
  product: product.value 
})

// computed properties
const currentVariant = computed<Variant | null>(() => {
  if (!product.value || !product.value.variants?.length) return null

  if (selectedVariantId.value) {
    return product.value.variants.find(v => v.id === selectedVariantId.value) 
      || product.value.variants[0]
  }

  return product.value.variants[0]
})

const isInStock = computed(() => currentVariant.value ? currentVariant.value.stock > 0 : false)

const stockClass = computed(() => {
  if (!currentVariant.value) return {}
  return {
    'in-stock': currentVariant.value.stock > 5,
    'low-stock': currentVariant.value.stock > 0 && currentVariant.value.stock <= 5,
    'out-of-stock': currentVariant.value.stock === 0
  }
})

const stockText = computed(() => {
  if (!currentVariant.value) return ''
  if (currentVariant.value.stock > 5) return 'موجود در انبار'
  if (currentVariant.value.stock > 0) return `تنها ${currentVariant.value.stock} عدد باقی‌مانده`
  return 'ناموجود'
})

// توابع
const formatPrice = (price: string | number) => {
  return productService.formatPrice(Number(price))
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/600x600?text=عکس+موجود+نیست'
}

// فقط یک fetchProduct
const fetchProduct = async () => {
  console.log('🎯🎯🎯 fetchProduct STARTED 🎯🎯🎯')
  console.log('📌 Current slug:', route.params.slug)
  
  const slug = route.params.slug as string
  if (!slug) {
    console.log('⚠️ slug پیدا نشد')
    return
  }

  loading.value = true
  error.value = null

  try {
    console.log('📡 در حال دریافت محصول با slug:', slug)
    const res = await productService.getProductBySlug(slug)
    console.log('✅ پاسخ از سرور:', res)
    
    const data = res.data ?? res
    console.log('📦 داده محصول:', data)

    product.value = data

    if (data.images?.length) {
      const main = data.images.find(i => i.is_main) || data.images[0]
      currentImage.value = main.image
    }

    selectedVariantId.value = data.variants?.[0]?.id ?? null
    console.log('✅ محصول با موفقیت بارگذاری شد')

  } catch (err: any) {
    console.error('❌ خطا در دریافت محصول:', err)
    error.value = err?.response?.data?.detail || err?.message || 'خطا در دریافت اطلاعات محصول'
  } finally {
    loading.value = false
    console.log('🏁 fetchProduct تمام شد')
  }
}

const addToCart = () => {
  if (!currentVariant.value || !isInStock.value) return
  console.log('🛒 افزودن به سبد خرید:', {
    productId: product.value?.id,
    variantId: currentVariant.value.id,
    quantity: 1
  })
}

const addToWishlist = () => {
  console.log('❤️ افزودن به علاقه‌مندی‌ها:', product.value?.id)
}

const goBack = () => {
  router.push('/products')
}

// lifecycle hooks
onMounted(() => {
  console.log('✅✅✅ onMounted EXECUTED ✅✅✅')
  console.log('🔍 Slug in onMounted:', route.params.slug)
  fetchProduct()
})

// watch برای تغییر slug
watch(() => route.params.slug, (newSlug) => {
  console.log('🔄 slug تغییر کرد:', newSlug)
  fetchProduct()
})
