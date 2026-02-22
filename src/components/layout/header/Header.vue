
<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  nextTick
} from 'vue'

import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  LogIn,
  Settings
} from 'lucide-vue-next'

import { useAuthStore } from '@/core/store/authStore'
import { useCartStore } from '@/core/store/cartStore'
import { useWishlistStore } from '@/core/store/wishlistStore'
import { vClickOutside } from '@/directives/clickOutside'

import './Header.css'

/* ================= ROUTER ================= */
const router = useRouter()
const route = useRoute()

/* ================= STORES ================= */
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const {
  isAuthenticated,
  userInitial,
  userFullName,
  userEmail,
  userAvatar
} = storeToRefs(authStore)

const { totalItems: cartTotalItems } = storeToRefs(cartStore)
const { totalItems: wishlistCount } = storeToRefs(wishlistStore)

/* ================= STATE ================= */
const isSticky = ref(false)
const isMobileMenuOpen = ref(false)
const isMobileSearchOpen = ref(false)
const isUserMenuOpen = ref(false)
const searchQuery = ref('')
const mobileSearchInput = ref<HTMLInputElement | null>(null)

const logoUrl = ref(
  'https://bazbia.ir/media/logo/bazbialogo.gif'
)

/* ================= MENU ================= */
const menuItems = [
  { id: 1, title: 'خانه', path: '/' },
  { id: 2, title: 'محصولات', path: '/products' },
  { id: 3, title: 'دسته‌بندی‌ها', path: '/categories' },
  { id: 4, title: 'تخفیف‌ها', path: '/offers' },
  { id: 5, title: 'وبلاگ', path: '/blog' },
  { id: 6, title: 'تماس با ما', path: '/contact' }
]

/* ================= HELPERS ================= */

const isActiveRoute = (path: string) =>
  route.path === path || route.path.startsWith(path + '/')

const closeAllMenus = () => {
  isMobileMenuOpen.value = false
  isMobileSearchOpen.value = false
  isUserMenuOpen.value = false
  document.body.style.overflow = ''
}

/* ================= ACTIONS ================= */

const handleSearch = () => {
  const q = searchQuery.value.trim()
  if (!q) return

  router.push({
    path: '/products',
    query: { search: q }
  })

  searchQuery.value = ''
  isMobileSearchOpen.value = false
}

const toggleUserMenu = () => {
  if (!isAuthenticated.value)
    return router.push('/login')

  isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    closeAllMenus()
    router.push('/')
  } catch (err) {
    console.error('logout error', err)
  }
}

const goToWishlist = () => {
  router.push(
    isAuthenticated.value
      ? '/wishlist'
      : '/login?redirect=wishlist'
  )
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

const toggleSearch = async () => {
  isMobileSearchOpen.value = !isMobileSearchOpen.value

  if (isMobileSearchOpen.value) {
    await nextTick()
    mobileSearchInput.value?.focus()
  }
}

/* ================= IMAGES ================= */

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/logo-fallback.png'
}

const handleAvatarError = (e: Event) => {
  ;(e.target as HTMLImageElement).style.display = 'none'
}

/* ================= SCROLL ================= */

const handleScroll = () => {
  if (typeof window === 'undefined') return
  isSticky.value = window.scrollY > 50
}

/* ================= WATCHERS ================= */

watch(
  () => route.fullPath,
  closeAllMenus
)

watch(isAuthenticated, () => {
  cartStore.initializeCart()
})

/* ================= LIFECYCLE ================= */

onMounted(() => {
  if (typeof window !== 'undefined')
    window.addEventListener('scroll', handleScroll)

  cartStore.initializeCart()
})

onUnmounted(() => {
  if (typeof window !== 'undefined')
    window.removeEventListener('scroll', handleScroll)

  document.body.style.overflow = ''
})
</script>
