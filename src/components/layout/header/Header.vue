<template>
  <header class="header" :class="{ 'header--sticky': isSticky }">
    <div class="header__container">
      <!-- دسکتاپ -->
      <div class="header__desktop">
        <!-- لوگو -->
        <div class="header__logo">
          <router-link to="/" class="header__logo-link">
            <img src="https://bazbia.ir/media/logo/bazbialogo.jpg" alt="فروشگاه من" class="header__logo-img">
            <span class="header__logo-text">فروشگاه من</span>
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
              <SearchIcon class="header__search-icon" />
            </button>
          </form>
        </div>

        <!-- آیکون‌های کاربری -->
        <div class="header__actions">
          <button @click="toggleUserMenu" class="header__action-btn">
            <UserIcon class="header__action-icon" />
          </button>
          
          <button @click="toggleWishlist" class="header__action-btn">
            <HeartIcon class="header__action-icon" />
            <span v-if="wishlistCount" class="header__badge">{{ wishlistCount }}</span>
          </button>
          
          <router-link to="/cart" class="header__action-btn">
            <ShoppingBagIcon class="header__action-icon" />
            <span v-if="cartCount" class="header__badge">{{ cartCount }}</span>
          </router-link>
        </div>
      </div>

      <!-- موبایل -->
      <div class="header__mobile">
        <div class="header__mobile-top">
          <button @click="toggleMobileMenu" class="header__mobile-menu-btn">
            <MenuIcon v-if="!isMobileMenuOpen" />
            <XIcon v-else />
          </button>

          <router-link to="/" class="header__logo">
            <img src="https://bazbia.ir/media/logo/bazbialogo.jpg" alt="فروشگاه من" class="header__logo-img">
          </router-link>

          <div class="header__mobile-actions">
            <button @click="toggleSearch" class="header__mobile-search-btn">
              <SearchIcon />
            </button>
            
            <router-link to="/cart" class="header__mobile-cart">
              <ShoppingBagIcon />
              <span v-if="cartCount" class="header__badge">{{ cartCount }}</span>
            </router-link>
          </div>
        </div>

        <!-- منوی موبایل -->
        <transition name="slide">
          <div v-if="isMobileMenuOpen" class="header__mobile-menu">
            <nav class="header__mobile-nav">
              <ul class="header__mobile-nav-list">
                <li v-for="item in menuItems" :key="item.id">
                  <router-link 
                    :to="item.path"
                    class="header__mobile-nav-link"
                    @click="closeMobileMenu"
                  >
                    {{ item.title }}
                  </router-link>
                </li>
                <li>
                  <button @click="toggleWishlist" class="header__mobile-nav-link">
                    علاقه‌مندی‌ها
                    <span v-if="wishlistCount" class="header__badge">{{ wishlistCount }}</span>
                  </button>
                </li>
                <li>
                  <button @click="toggleUserMenu" class="header__mobile-nav-link">
                    حساب کاربری
                  </button>
                </li>
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

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { SearchIcon, UserIcon, HeartIcon, ShoppingBagIcon, MenuIcon, XIcon } from 'lucide-vue-next'
import './Header.css'

// Props
const props = defineProps({
  cartCount: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['search', 'toggle-user', 'toggle-wishlist'])

// Router
const router = useRouter()
const route = useRoute()

// State
const isSticky = ref(false)
const isMobileMenuOpen = ref(false)
const isMobileSearchOpen = ref(false)
const searchQuery = ref('')
const mobileSearchInput = ref(null)

// Menu items
const menuItems = ref([
  { id: 1, title: 'خانه', path: '/' },
  { id: 2, title: 'محصولات', path: '/products' },
  { id: 3, title: 'دسته‌بندی‌ها', path: '/categories' },
  { id: 4, title: 'تخفیف‌ها', path: '/offers' },
  { id: 5, title: 'وبلاگ', path: '/blog' },
  { id: 6, title: 'تماس با ما', path: '/contact' }
])

// Methods
const isActiveRoute = (path) => {
  return route.path === path
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value)
    router.push({ path: '/search', query: { q: searchQuery.value } })
    searchQuery.value = ''
    closeMobileSearch()
  }
}

const toggleUserMenu = () => {
  emit('toggle-user')
}

const toggleWishlist = () => {
  emit('toggle-wishlist')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleSearch = () => {
  isMobileSearchOpen.value = !isMobileSearchOpen.value
  if (isMobileSearchOpen.value) {
    setTimeout(() => {
      mobileSearchInput.value?.focus()
    }, 100)
  }
}

const closeMobileSearch = () => {
  isMobileSearchOpen.value = false
}

const handleScroll = () => {
  isSticky.value = window.scrollY > 50
}

// Watchers
watch(() => route.path, () => {
  closeMobileMenu()
  closeMobileSearch()
})

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>
