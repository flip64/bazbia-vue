<!-- src/components/layout/header/Header.vue -->
<template>
  <header
    class="header"
    :class="{ 'header--sticky': isSticky }"
  >
    <div class="header__container">
      <!-- دسکتاپ -->
      <div class="header__desktop">
        <!-- لوگو -->
        <div class="header__logo">
          <router-link
            to="/"
            class="header__logo-link"
          >
            <img
              :src="logoUrl"
              alt="بازبیا"
              class="header__logo-img"
              @error="handleImageError"
            >

            <span class="header__logo-text">
              بازبیا
            </span>
          </router-link>
        </div>

        <!-- منوی اصلی -->
        <nav class="header__nav">
          <ul class="header__nav-list">
            <li
              v-for="item in menuItems"
              :key="item.id"
              class="header__nav-item"
            >
              <router-link
                :to="item.path"
                class="header__nav-link"
                :class="{
                  'header__nav-link--active':
                    isActiveRoute(item.path)
                }"
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- جستجو -->
        <div class="header__search">
          <form
            class="header__search-form"
            @submit.prevent="handleSearch"
          >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجوی محصولات..."
              class="header__search-input"
            >

            <button
              type="submit"
              class="header__search-btn"
              aria-label="جستجو"
            >
              <Search :size="18" />
            </button>
          </form>
        </div>

        <!-- آیکون‌های کاربری -->
        <div class="header__actions">
          <!-- منوی کاربر -->
          <div
            class="header__user-menu"
            :class="{
              'header__user-menu--open': isUserMenuOpen
            }"
          >
            <button
              type="button"
              class="header__action-btn header__user-btn"
              aria-label="حساب کاربری"
              @click.stop="toggleUserMenu"
            >
              <template v-if="isAuthenticated">
                <div class="header__user-avatar">
                  <img
                    v-if="userAvatar"
                    :src="userAvatar"
                    alt="تصویر کاربر"
                    class="header__user-avatar-img"
                    @error="handleAvatarError"
                  >

                  <span
                    v-else
                    class="header__user-avatar-text"
                  >
                    {{ userInitial }}
                  </span>
                </div>
              </template>

              <User
                v-else
                class="header__action-icon"
              />
            </button>

            <transition name="fade">
              <div
                v-if="isUserMenuOpen && isAuthenticated"
                v-click-outside="closeUserMenu"
                class="header__dropdown"
                @click.stop
              >
                <div class="header__dropdown-header">
                  <div class="header__dropdown-user">
                    <div class="header__dropdown-avatar">
                      <img
                        v-if="userAvatar"
                        :src="userAvatar"
                        alt="تصویر کاربر"
                        @error="handleAvatarError"
                      >

                      <span v-else>
                        {{ userInitial }}
                      </span>
                    </div>

                    <div class="header__dropdown-info">
                      <div class="header__dropdown-name">
                        {{ userFullName }}
                      </div>

                      <div class="header__dropdown-email">
                        {{ userEmail }}
                      </div>
                    </div>
                  </div>
                </div>

                <ul class="header__dropdown-menu">
                  <li>
                    <router-link
                      to="/profile"
                      class="header__dropdown-link"
                      @click="closeUserMenu"
                    >
                      <User
                        :size="16"
                        class="header__dropdown-icon"
                      >
                      </User>

                      <span>پروفایل من</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link
                      to="/orders"
                      class="header__dropdown-link"
                      @click="closeUserMenu"
                    >
                      <ShoppingBag
                        :size="16"
                        class="header__dropdown-icon"
                      />

                      <span>سفارش‌های من</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link
                      to="/wishlist"
                      class="header__dropdown-link"
                      @click="closeUserMenu"
                    >
                      <Heart
                        :size="16"
                        class="header__dropdown-icon"
                      />

                      <span>علاقه‌مندی‌ها</span>

                      <span
                        v-if="wishlistCount"
                        class="header__dropdown-badge"
                      >
                        {{ wishlistCount }}
                      </span>
                    </router-link>
                  </li>

                  <li>
                    <router-link
                      to="/settings"
                      class="header__dropdown-link"
                      @click="closeUserMenu"
                    >
                      <Settings
                        :size="16"
                        class="header__dropdown-icon"
                      />

                      <span>تنظیمات</span>
                    </router-link>
                  </li>

                  <li class="header__dropdown-divider"></li>

                  <li>
                    <button
                      type="button"
                      class="
                        header__dropdown-link
                        header__dropdown-link--logout
                      "
                      @click="handleLogout"
                    >
                      <LogOut
                        :size="16"
                        class="header__dropdown-icon"
                      />

                      <span>خروج از حساب</span>
                    </button>
                  </li>
                </ul>
              </div>
            </transition>
          </div>

          <!-- علاقه‌مندی‌ها -->
          <button
            type="button"
            class="header__action-btn"
            aria-label="علاقه‌مندی‌ها"
            @click="goToWishlist"
          >
            <Heart class="header__action-icon" />

            <span
              v-if="wishlistCount"
              class="header__badge"
            >
              {{ wishlistCount }}
            </span>
          </button>

          <!-- سبد خرید -->
          <router-link
            to="/cart"
            class="header__action-btn"
            aria-label="سبد خرید"
          >
            <ShoppingBag class="header__action-icon" />

            <span
              v-if="cartTotalItems"
              class="header__badge"
            >
              {{ cartTotalItems }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- موبایل -->
      <div class="header__mobile">
        <div class="header__mobile-top">
          <button
  type="button"
  class="header__mobile-menu-btn"
  :aria-expanded="isMobileMenuOpen"
  aria-label="باز و بسته کردن منو"
  @click="isMobileMenuOpen = !isMobileMenuOpen"
>
  <Menu v-if="!isMobileMenuOpen" />
  <X v-else />
</button>

          <router-link
            to="/"
            class="header__logo"
            @click="closeMobileMenu"
          >
            <img
              :src="logoUrl"
              alt="بازبیا"
              class="header__logo-img"
              @error="handleImageError"
            >
          </router-link>

          <div class="header__mobile-actions">
            <button
              type="button"
              class="header__mobile-search-btn"
              aria-label="جستجو"
              @click.stop="toggleSearch"
            >
              <Search :size="20" />
            </button>

            <router-link
              to="/cart"
              class="header__mobile-cart"
              aria-label="سبد خرید"
              @click="closeMobileMenu"
            >
              <ShoppingBag :size="20" />

              <span
                v-if="cartTotalItems"
                class="header__badge"
              >
                {{ cartTotalItems }}
              </span>
            </router-link>
          </div>
        </div>

        <!-- منوی موبایل -->
        <transition name="slide">
          <div
            v-if="isMobileMenuOpen"
            class="header__mobile-menu"
            @click.stop
          >
            <nav class="header__mobile-nav">
              <!-- اطلاعات کاربر -->
              <div
                v-if="isAuthenticated"
                class="header__mobile-user"
              >
                <div class="header__mobile-user-info">
                  <div class="header__mobile-user-avatar">
                    <img
                      v-if="userAvatar"
                      :src="userAvatar"
                      alt="تصویر کاربر"
                      @error="handleAvatarError"
                    >

                    <span v-else>
                      {{ userInitial }}
                    </span>
                  </div>

                  <div class="header__mobile-user-details">
                    <div class="header__mobile-user-name">
                      {{ userFullName }}
                    </div>

                    <div class="header__mobile-user-email">
                      {{ userEmail }}
                    </div>
                  </div>
                </div>
              </div>

              <ul class="header__mobile-nav-list">
                <!-- ورود و ثبت‌نام -->
                <li
                  v-if="!isAuthenticated"
                  class="header__mobile-auth"
                >
                  <router-link
                    to="/login"
                    class="header__mobile-auth-link"
                    @click="closeMobileMenu"
                  >
                    <LogIn
                      :size="20"
                      class="header__mobile-auth-icon"
                    />

                    <span>ورود / ثبت‌نام</span>
                  </router-link>
                </li>

                <!-- لینک‌های اصلی -->
                <li
                  v-for="item in menuItems"
                  :key="item.id"
                >
                  <router-link
                    :to="item.path"
                    class="header__mobile-nav-link"
                    :class="{
                      'header__mobile-nav-link--active':
                        isActiveRoute(item.path)
                    }"
                    @click="closeMobileMenu"
                  >
                    {{ item.title }}
                  </router-link>
                </li>

                <!-- لینک‌های کاربری -->
                <template v-if="isAuthenticated">
                  <li class="header__mobile-divider"></li>

                  <li>
                    <router-link
                      to="/profile"
                      class="header__mobile-nav-link"
                      @click="closeMobileMenu"
                    >
                      <User
                        :size="18"
                        class="header__mobile-nav-icon"
                      />

                      <span>پروفایل من</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link
                      to="/orders"
                      class="header__mobile-nav-link"
                      @click="closeMobileMenu"
                    >
                      <ShoppingBag
                        :size="18"
                        class="header__mobile-nav-icon"
                      />

                      <span>سفارش‌های من</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link
                      to="/wishlist"
                      class="header__mobile-nav-link"
                      @click="closeMobileMenu"
                    >
                      <Heart
                        :size="18"
                        class="header__mobile-nav-icon"
                      />

                      <span>علاقه‌مندی‌ها</span>

                      <span
                        v-if="wishlistCount"
                        class="header__badge"
                      >
                        {{ wishlistCount }}
                      </span>
                    </router-link>
                  </li>

                  <li>
                    <router-link
                      to="/settings"
                      class="header__mobile-nav-link"
                      @click="closeMobileMenu"
                    >
                      <Settings
                        :size="18"
                        class="header__mobile-nav-icon"
                      />

                      <span>تنظیمات</span>
                    </router-link>
                  </li>

                  <li class="header__mobile-divider"></li>

                  <li>
                    <button
                      type="button"
                      class="
                        header__mobile-nav-link
                        header__mobile-nav-link--logout
                      "
                      @click="handleMobileLogout"
                    >
                      <LogOut
                        :size="18"
                        class="header__mobile-nav-icon"
                      />

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
          <div
            v-if="isMobileSearchOpen"
            class="header__mobile-search"
            @click.stop
          >
            <form @submit.prevent="handleSearch">
              <input
                ref="mobileSearchInput"
                v-model="searchQuery"
                type="text"
                placeholder="جستجوی محصولات..."
                class="header__mobile-search-input"
              >
            </form>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import { storeToRefs } from 'pinia'

import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingBag,
  User,
  X
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
  userInitial,
  userFullName,
  userEmail,
  userAvatar
} = storeToRefs(authStore)

const {
  totalItems: cartTotalItems
} = storeToRefs(cartStore)

const {
  totalItems: wishlistCount
} = storeToRefs(wishlistStore)

// ========== State ==========
const isSticky = ref(false)
const isMobileMenuOpen = ref(false)
const isMobileSearchOpen = ref(false)
const isUserMenuOpen = ref(false)

const searchQuery = ref('')
const mobileSearchInput = ref<HTMLInputElement | null>(null)

const logoUrl = ref(
  'https://bazbia.ir/media/logo/bazbialogo.gif'
)

// ========== Menu Items ==========
const menuItems = [
  {
    id: 1,
    title: 'خانه',
    path: '/'
  },
  {
    id: 2,
    title: 'محصولات',
    path: '/products'
  },
  {
    id: 3,
    title: 'دسته‌بندی‌ها',
    path: '/categories'
  },
  {
    id: 4,
    title: 'تخفیف‌ها',
    path: '/offers'
  },
  {
    id: 5,
    title: 'درباره ما',
    path: '/about'
  },
  {
    id: 6,
    title: 'تماس با ما',
    path: '/contact'
  }
]

// ========== Computed ==========
const bodyShouldBeLocked = computed(() => {
  return isMobileMenuOpen.value
})

// ========== Methods ==========
const isActiveRoute = (path: string) => {
  return route.path === path
}

const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
}

const handleSearch = async () => {
  const query = searchQuery.value.trim()

  if (!query) {
    return
  }

  await router.push({
    path: '/products',
    query: {
      search: query
    }
  })

  searchQuery.value = ''
  closeMobileSearch()
  closeMobileMenu()
}

const handleImageError = (event: Event) => {
  const image = event.target as HTMLImageElement

  image.onerror = null
  image.src =
    'https://via.placeholder.com/150x50?text=Bazbia'
}

const handleAvatarError = (event: Event) => {
  const image = event.target as HTMLImageElement
  image.style.display = 'none'
}

const toggleUserMenu = () => {
  closeMobileMenu()
  

  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const goToWishlist = () => {
  if (!isAuthenticated.value) {
    router.push('/login?redirect=wishlist')
    return
  }

  router.push('/wishlist')
}

const handleLogout = async () => {
  try {
    await authStore.logout()

    closeUserMenu()
    closeMobileMenu()
    closeMobileSearch()

    await router.push('/')
  } catch (error) {
    console.error('خطا در خروج از حساب:', error)
  }
}

const handleMobileLogout = async () => {
  await handleLogout()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value

  console.log(
    'isMobileMenuOpen =',
    isMobileMenuOpen.value
  )

  closeMobileSearch()
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleSearch = async () => {
  isMobileSearchOpen.value = !isMobileSearchOpen.value

  closeMobileMenu()
  closeUserMenu()

  if (isMobileSearchOpen.value) {
    await nextTick()
    mobileSearchInput.value?.focus()
  }
}

const closeMobileSearch = () => {
  isMobileSearchOpen.value = false
}

const handleScroll = () => {
  isSticky.value = window.scrollY > 50
}

const handleDocumentClick = () => {
  
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') {
    return
  }

  closeMobileMenu()
  closeMobileSearch()
  closeUserMenu()
}

// ========== Watchers ==========
watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()
    closeMobileSearch()
    closeUserMenu()
  }
)

watch(
  bodyShouldBeLocked,
  (shouldLock) => {
    if (shouldLock) {
      lockBodyScroll()
      return
    }

    unlockBodyScroll()
  }
)

// ========== Lifecycle ==========
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleEscape)
  document.addEventListener('click', handleDocumentClick)

  handleScroll()

  if (!cartStore.initialized) {
    cartStore.initializeCart()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleEscape)
  document.removeEventListener('click', handleDocumentClick)

  unlockBodyScroll()
})
</script>
