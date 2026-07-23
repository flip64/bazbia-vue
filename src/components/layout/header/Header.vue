<!-- src/components/layout/header/Header.vue -->
<template>
  <header class="header" :class="{ 'header--sticky': isSticky }">
    <div class="header__container">
      <!-- دسکتاپ -->
      <div class="header__desktop">
        <!-- لوگو -->
        <div class="header__logo">
          <router-link to="/" class="header__logo-link">
            <img 
              :src="logoUrl" 
              alt="بازبیا" 
              class="header__logo-img"
              @error="handleImageError"
            >
            <span class="header__logo-text">بازبیا</span>
          </router-link>
        </div>

        <!-- منوی اصلی -->
        <nav class="header__nav">
          <ul class="header__nav-list">
            <li class="header__nav-item" v-for="item in menuItems" :key="item.id">
              <router-link 
                :to="item.path"  
                class="header__nav-link"
                :class="{ 'header__nav-link--active': isActiveRoute(item.path) }"
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- جستجو -->
        <div class="header__search">
          <form @submit.prevent="handleSearch" class="header__search-form">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="جستجوی محصولات..."
              class="header__search-input"
            >
            <button type="submit" class="header__search-btn">
              <Search :size="18" />
            </button>
          </form>
        </div>

        <!-- آیکون‌های کاربری -->
        <div class="header__actions">
          <!-- منوی کاربر -->
          <div class="header__user-menu" :class="{ 'header__user-menu--open': isUserMenuOpen }">
            <button @click="toggleUserMenu" class="header__action-btn header__user-btn">
              <template v-if="isAuthenticated">
                <div class="header__user-avatar">
                  <img 
                    v-if="userAvatar" 
                    :src="userAvatar" 
                    alt="avatar"
                    class="header__user-avatar-img"
                    @error="handleAvatarError"
                  >
                  <span v-else class="header__user-avatar-text">
                    {{ userInitial }}
                  </span>
                </div>
              </template>
              <User v-else class="header__action-icon" />
            </button>

            <!-- دراپ‌داون منو (فقط کاربران لاگین کرده) -->
            <transition name="fade">
              <div v-if="isUserMenuOpen && isAuthenticated" class="header__dropdown" v-click-outside="closeUserMenu">
                <div class="header__dropdown-header">
                  <div class="header__dropdown-user">
                    <div class="header__dropdown-avatar">
                      <img 
                        v-if="userAvatar" 
                        :src="userAvatar" 
                        alt="avatar"
                        @error="handleAvatarError"
                      >
                      <span v-else>{{ userInitial }}</span>
                    </div>
                    <div class="header__dropdown-info">
                      <div class="header__dropdown-name">{{ userFullName }}</div>
                      <div class="header__dropdown-email">{{ userEmail }}</div>
                    </div>
                  </div>
                </div>
                <ul class="header__dropdown-menu">
                  <li>
                    <router-link to="/profile" class="header__dropdown-link" @click="closeUserMenu">
                      <User :size="16" class="header__dropdown-icon" />
                      <span>پروفایل من</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/orders" class="header__dropdown-link" @click="closeUserMenu">
                      <ShoppingBag :size="16" class="header__dropdown-icon" />
                      <span>سفارش‌های من</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/wishlist" class="header__dropdown-link" @click="closeUserMenu">
                      <Heart :size="16" class="header__dropdown-icon" />
                      <span>علاقه‌مندی‌ها</span>
                      <span v-if="wishlistCount" class="header__dropdown-badge">{{ wishlistCount }}</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/settings" class="header__dropdown-link" @click="closeUserMenu">
                      <Settings :size="16" class="header__dropdown-icon" />
                      <span>تنظیمات</span>
                    </router-link>
                  </li>
                  <li class="header__dropdown-divider"></li>
                  <li>
                    <button @click="handleLogout" class="header__dropdown-link header__dropdown-link--logout">
                      <LogOut :size="16" class="header__dropdown-icon" />
                      <span>خروج از حساب</span>
                    </button>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
          
          <!-- علاقه‌مندی‌ها -->
          <button @click="goToWishlist" class="header__action-btn">
            <Heart class="header__action-icon" />
            <span v-if="wishlistCount" class="header__badge">{{ wishlistCount }}</span>
          </button>
          
          <!-- سبد خرید (یک بار) -->
          <router-link to="/cart" class="header__action-btn">
            <ShoppingBag class="header__action-icon" />
            <span v-if="cartTotalItems" class="header__badge">{{ cartTotalItems }}</span>
          </router-link>
        </div>
      </div>

      <!-- موبایل -->
      <div class="header__mobile">
        <div class="header__mobile-top">
          <button @click="toggleMobileMenu" class="header__mobile-menu-btn">
            <Menu v-if="!isMobileMenuOpen" />
            <X v-else />
          </button>

          <router-link to="/" class="header__logo">
            <img 
              :src="logoUrl" 
              alt="بازبیا" 
              class="header__logo-img"
              @error="handleImageError"
            >
          </router-link>

          <div class="header__mobile-actions">
            <button @click="toggleSearch" class="header__mobile-search-btn">
              <Search :size="20" />
            </button>
            
            <router-link to="/cart" class="header__mobile-cart">
              <ShoppingBag :size="20" />
              <span v-if="cartTotalItems" class="header__badge">{{ cartTotalItems }}</span>
            </router-link>
          </div>
        </div>

        <!-- منوی موبایل -->
        <transition name="slide">
          <div v-if="isMobileMenuOpen" class="header__mobile-menu" v-click-outside="closeMobileMenu" @click.stop>
            <nav class="header__mobile-nav">
              <!-- بخش کاربر در موبایل -->
              <div class="header__mobile-user" v-if="isAuthenticated">
                <div class="header__mobile-user-info">
                  <div class="header__mobile-user-avatar">
                    <img 
                      v-if="userAvatar" 
                      :src="userAvatar" 
                      alt="avatar"
                      @error="handleAvatarError"
                    >
                    <span v-else>{{ userInitial }}</span>
                  </div>
                  <div class="header__mobile-user-details">
                    <div class="header__mobile-user-name">{{ userFullName }}</div>
                    <div class="header__mobile-user-email">{{ userEmail }}</div>
                  </div>
                </div>
              </div>

              <ul class="header__mobile-nav-list">
                <!-- لینک ورود/ثبت‌نام برای کاربران مهمان -->
                <li v-if="!isAuthenticated" class="header__mobile-auth">
                  <router-link to="/login" class="header__mobile-auth-link" @click="closeMobileMenu">
                    <LogIn :size="20" class="header__mobile-auth-icon" />
                    <span>ورود / ثبت‌نام</span>
                  </router-link>
                </li>

                <!-- منوی اصلی -->
                <li v-for="item in menuItems" :key="item.id">
                  <router-link 
                    :to="item.path"
                    class="header__mobile-nav-link"
                    @click="closeMobileMenu"
                  >
                    {{ item.title }}
                  </router-link>
                </li>

                <!-- لینک‌های کاربری (فقط کاربران لاگین کرده) -->
                <template v-if="isAuthenticated">
                  <li class="header__mobile-divider"></li>
                  <li>
                    <router-link to="/profile" class="header__mobile-nav-link" @click="closeMobileMenu">
                      <User :size="18" class="header__mobile-nav-icon" />
                      <span>پروفایل من</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/orders" class="header__mobile-nav-link" @click="closeMobileMenu">
                      <ShoppingBag :size="18" class="header__mobile-nav-icon" />
                      <span>سفارش‌های من</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/wishlist" class="header__mobile-nav-link" @click="closeMobileMenu">
                      <Heart :size="18" class="header__mobile-nav-icon" />
                      <span>علاقه‌مندی‌ها</span>
                      <span v-if="wishlistCount" class="header__badge">{{ wishlistCount }}</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/settings" class="header__mobile-nav-link" @click="closeMobileMenu">
                      <Settings :size="18" class="header__mobile-nav-icon" />
                      <span>تنظیمات</span>
                    </router-link>
                  </li>
                  <li class="header__mobile-divider"></li>
                  <li>
                    <button @click="handleMobileLogout" class="header__mobile-nav-link header__mobile-nav-link--logout">
                      <LogOut :size="18" class="header__mobile-nav-icon" />
                      <span>خروج از حساب</span>
                    </button>
                  </li>
                </template>
              </ul>
            </nav>
          </div>
        </transition>

        <!-- جستجوی موبایل -->
        <transition name="fade">
          <div v-if="isMobileSearchOpen" class="header__mobile-search">
            <form @submit.prevent="handleSearch">
              <input 
                type="text"
                v-model="searchQuery"
                placeholder="جستجوی محصولات..."
                class="header__mobile-search-input"
                ref="mobileSearchInput"
              >
            </form>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
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

// ========== Router ==========
const router = useRouter()
const route = useRoute()

// ========== Stores ==========
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

// ========== Store Refs ==========
const { 
  isAuthenticated, 
  user, 
  userInitial, 
  userFullName, 
  userEmail,
  userAvatar 
} = storeToRefs(authStore)

const { totalItems: cartTotalItems } = storeToRefs(cartStore)
const { totalItems: wishlistCount } = storeToRefs(wishlistStore)

// ========== State ==========
const isSticky = ref(false)
const isMobileMenuOpen = ref(false)
const isMobileSearchOpen = ref(false)
const isUserMenuOpen = ref(false)
const searchQuery = ref('')
const mobileSearchInput = ref<HTMLInputElement | null>(null)
const logoUrl = ref('https://bazbia.ir/media/logo/bazbialogo.gif')

// ========== Menu Items ==========
const menuItems = ref([
  { id: 1, title: 'خانه', path: '/' },
  { id: 2, title: 'محصولات', path: '/products' },
  { id: 3, title: 'دسته‌بندی‌ها', path: '/categories' },
  { id: 4, title: 'تخفیف‌ها', path: '/offers' },
  { id: 5, title: 'درباره ما', path: '/about' },
  { id: 6, title: 'تماس با ما', path: '/contact' }
])

// ========== Methods ==========
const isActiveRoute = (path: string) => route.path === path

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      path: '/products', 
      query: { search: searchQuery.value } 
    })
    searchQuery.value = ''
    closeMobileSearch()
  }
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/150x50?text=بازبیا'
}

const handleAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

const toggleUserMenu = () => {
  if (!isAuthenticated.value) {
    router.push('/login')
  } else {
    isUserMenuOpen.value = !isUserMenuOpen.value
  }
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const goToWishlist = () => {
  if (!isAuthenticated.value) {
    router.push('/login?redirect=wishlist')
  } else {
    router.push('/wishlist')
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    closeUserMenu()
    closeMobileMenu()
    router.push('/')
  } catch (error) {
    console.error('خطا در خروج:', error)
  }
}

const handleMobileLogout = () => {
  handleLogout()
}

const toggleMobileMenu = () => {
  console.log("Menu Clicked")
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
  if (isMobileMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

const closeMobileMenu = () => {
  console.log('دکمه منو کلیک شد')
  console.log('وضعیت قبل:',
  isMobileMenuOpen.value = false
  console.log('وضعیت بعد:',
  document.body.style.overflow = ''
}

const toggleSearch = () => {
  isMobileSearchOpen.value = !isMobileSearchOpen.value
  if (isMobileSearchOpen.value) {
    setTimeout(() => mobileSearchInput.value?.focus(), 100)
  }
}

const closeMobileSearch = () => {
  isMobileSearchOpen.value = false
}

const handleScroll = () => {
  isSticky.value = window.scrollY > 50
}

// ========== Watchers ==========
watch(() => route.path, () => {
  closeMobileMenu()
  closeMobileSearch()
  closeUserMenu()
})

// ========== Lifecycle ==========
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // مقداردهی اولیه سبد خرید
  cartStore.initializeCart()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>
