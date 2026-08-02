<!-- src/components/layout/header/Header.vue -->

<template>
  <header
    class="site-header"
    :class="{ 'site-header--sticky': isSticky }"
  >
    <div class="site-header__container">
      <!-- =========================
           نسخه دسکتاپ
      ========================== -->
      <div class="desktop-header">
        <!-- لوگو -->
        <router-link
          to="/"
          class="desktop-header__logo"
          aria-label="صفحه اصلی بازبیا"
          @click="closeAll"
        >
          <img
            :src="logoUrl"
            alt="بازبیا"
            class="desktop-header__logo-image"
            @error="handleLogoError"
          >

          <span class="desktop-header__logo-text">
            بازبیا
          </span>
        </router-link>

        <!-- منوی اصلی -->
        <nav
          class="desktop-header__nav"
          aria-label="منوی اصلی"
        >
          <ul class="desktop-header__nav-list">
            <li
              v-for="item in menuItems"
              :key="item.id"
            >
              <router-link
                :to="item.path"
                class="desktop-header__nav-link"
                :class="{
                  'desktop-header__nav-link--active':
                    isActiveRoute(item.path)
                }"
                @click="closeAll"
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- جستجو -->
        <form
          class="desktop-header__search"
          role="search"
          @submit.prevent="handleSearch"
        >
          <input
            v-model="searchQuery"
            type="search"
            class="desktop-header__search-input"
            placeholder="جستجوی محصولات..."
            aria-label="جستجوی محصولات"
            autocomplete="off"
          >

          <button
            type="submit"
            class="desktop-header__search-button"
            aria-label="جستجو"
          >
            <Search :size="19" />
          </button>
        </form>

        <!-- عملیات کاربری -->
        <div class="desktop-header__actions">
          <!-- حساب کاربری -->
          <div
            ref="desktopUserMenuRef"
            class="desktop-user"
          >
            <button
              type="button"
              class="desktop-header__action"
              aria-label="حساب کاربری"
              :aria-expanded="isUserMenuOpen"
              @click.stop="toggleUserMenu"
            >
              <span
                v-if="isAuthenticated"
                class="desktop-user__avatar"
              >
                <img
                  v-if="userAvatar"
                  :src="userAvatar"
                  alt="تصویر کاربر"
                  @error="handleAvatarError"
                >

                <span v-else>
                  {{ userInitial }}
                </span>
              </span>

              <User
                v-else
                :size="23"
              />
            </button>

            <div
              v-if="isUserMenuOpen && isAuthenticated"
              class="desktop-user__dropdown"
              @click.stop
            >
              <div class="desktop-user__summary">
                <div class="desktop-user__large-avatar">
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

                <div class="desktop-user__identity">
                  <strong>
                    {{ userFullName }}
                  </strong>

                  <span v-if="userContact">
                    {{ userContact }}
                  </span>
                </div>
              </div>

              <nav aria-label="منوی کاربری">
                <router-link
                  to="/profile"
                  class="desktop-user__link"
                  @click="closeUserMenu"
                >
                  <User :size="18" />
                  <span>پروفایل من</span>
                </router-link>

                <router-link
                  to="/orders"
                  class="desktop-user__link"
                  @click="closeUserMenu"
                >
                  <ShoppingBag :size="18" />
                  <span>سفارش‌های من</span>
                </router-link>

                <router-link
                  to="/wishlist"
                  class="desktop-user__link"
                  @click="closeUserMenu"
                >
                  <Heart :size="18" />
                  <span>علاقه‌مندی‌ها</span>

                  <span
                    v-if="wishlistCount"
                    class="desktop-user__count"
                  >
                    {{ wishlistCount }}
                  </span>
                </router-link>

                <div class="desktop-user__divider"></div>

                <button
                  type="button"
                  class="
                    desktop-user__link
                    desktop-user__link--logout
                  "
                  @click="handleLogout"
                >
                  <LogOut :size="18" />
                  <span>خروج از حساب</span>
                </button>
              </nav>
            </div>
          </div>

          <!-- علاقه‌مندی‌ها -->
          <button
            type="button"
            class="desktop-header__action"
            aria-label="علاقه‌مندی‌ها"
            @click="goToWishlist"
          >
            <Heart :size="23" />

            <span
              v-if="wishlistCount"
              class="header-counter"
            >
              {{ wishlistCount }}
            </span>
          </button>

          <!-- سبد خرید -->
          <router-link
            to="/cart"
            class="desktop-header__action"
            aria-label="سبد خرید"
            @click="closeAll"
          >
            <ShoppingBag :size="23" />

            <span
              v-if="cartTotalItems"
              class="header-counter"
            >
              {{ cartTotalItems }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- =========================
           نسخه موبایل
      ========================== -->
      <div class="mobile-header">
        <!-- دکمه منو -->
        <button
          type="button"
          class="mobile-header__button"
          aria-label="باز کردن منو"
          :aria-expanded="isMobileMenuOpen"
          @click="openMobileMenu"
        >
          <Menu :size="25" />
        </button>

        <!-- لوگو -->
        <router-link
          to="/"
          class="mobile-header__logo"
          aria-label="صفحه اصلی بازبیا"
          @click="closeAll"
        >
          <img
            :src="logoUrl"
            alt="بازبیا"
            class="mobile-header__logo-image"
            @error="handleLogoError"
          >
        </router-link>

        <!-- عملیات -->
        <div class="mobile-header__actions">
          <button
            type="button"
            class="mobile-header__button"
            aria-label="جستجو"
            :aria-expanded="isMobileSearchOpen"
            @click="toggleMobileSearch"
          >
            <X
              v-if="isMobileSearchOpen"
              :size="22"
            />

            <Search
              v-else
              :size="22"
            />
          </button>

          <router-link
            to="/cart"
            class="mobile-header__button"
            aria-label="سبد خرید"
            @click="closeAll"
          >
            <ShoppingBag :size="22" />

            <span
              v-if="cartTotalItems"
              class="header-counter"
            >
              {{ cartTotalItems }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- جستجوی موبایل -->
      <div
        v-if="isMobileSearchOpen"
        class="mobile-search"
      >
        <form
          role="search"
          @submit.prevent="handleSearch"
        >
          <input
            ref="mobileSearchInput"
            v-model="searchQuery"
            type="search"
            class="mobile-search__input"
            placeholder="جستجوی محصولات..."
            aria-label="جستجوی محصولات"
            autocomplete="off"
          >

          <button
            type="submit"
            class="mobile-search__button"
            aria-label="جستجو"
          >
            <Search :size="20" />
          </button>
        </form>
      </div>
    </div>
  </header>

  <!-- =========================
       منوی موبایل
  ========================== -->
  <Teleport to="body">
    <div
      v-if="isMobileMenuOpen"
      class="mobile-drawer-overlay"
      @click="closeMobileMenu"
    >
      <aside
        class="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="منوی موبایل"
        @click.stop
      >
        <!-- سربرگ -->
        <div class="mobile-drawer__header">
          <router-link
            to="/"
            class="mobile-drawer__brand"
            @click="closeMobileMenu"
          >
            <img
              :src="logoUrl"
              alt="بازبیا"
              @error="handleLogoError"
            >

            <span>بازبیا</span>
          </router-link>

          <button
            type="button"
            class="mobile-drawer__close"
            aria-label="بستن منو"
            @click="closeMobileMenu"
          >
            <X :size="25" />
          </button>
        </div>

        <!-- کاربر مهمان -->
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="mobile-drawer__login"
          @click="closeMobileMenu"
        >
          <span class="mobile-drawer__login-icon">
            <LogIn :size="22" />
          </span>

          <span class="mobile-drawer__login-text">
            <strong>ورود / ثبت‌نام</strong>
            <small>برای مشاهده سفارش‌ها وارد شوید</small>
          </span>

          <ChevronLeft :size="20" />
        </router-link>

        <!-- کاربر واردشده -->
        <div
          v-else
          class="mobile-drawer__user"
        >
          <div class="mobile-drawer__avatar">
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

          <div class="mobile-drawer__user-info">
            <strong>
              {{ userFullName }}
            </strong>

            <span v-if="userContact">
              {{ userContact }}
            </span>
          </div>
        </div>

        <!-- منوی اصلی -->
        <nav
          class="mobile-drawer__navigation"
          aria-label="منوی اصلی موبایل"
        >
          <p class="mobile-drawer__section-title">
            منوی اصلی
          </p>

          <ul class="mobile-drawer__list">
            <li
              v-for="item in menuItems"
              :key="item.id"
            >
              <router-link
                :to="item.path"
                class="mobile-drawer__link"
                :class="{
                  'mobile-drawer__link--active':
                    isActiveRoute(item.path)
                }"
                @click="closeMobileMenu"
              >
                <span>{{ item.title }}</span>
                <ChevronLeft :size="18" />
              </router-link>
            </li>
          </ul>

          <!-- منوی حساب -->
          <template v-if="isAuthenticated">
            <p class="mobile-drawer__section-title">
              حساب کاربری
            </p>

            <ul class="mobile-drawer__list">
              <li>
                <router-link
                  to="/profile"
                  class="mobile-drawer__link"
                  @click="closeMobileMenu"
                >
                  <span class="mobile-drawer__link-content">
                    <User :size="20" />
                    <span>پروفایل من</span>
                  </span>

                  <ChevronLeft :size="18" />
                </router-link>
              </li>

              <li>
                <router-link
                  to="/orders"
                  class="mobile-drawer__link"
                  @click="closeMobileMenu"
                >
                  <span class="mobile-drawer__link-content">
                    <ShoppingBag :size="20" />
                    <span>سفارش‌های من</span>
                  </span>

                  <ChevronLeft :size="18" />
                </router-link>
              </li>

              <li>
                <router-link
                  to="/wishlist"
                  class="mobile-drawer__link"
                  @click="closeMobileMenu"
                >
                  <span class="mobile-drawer__link-content">
                    <Heart :size="20" />
                    <span>علاقه‌مندی‌ها</span>
                  </span>

                  <span
                    v-if="wishlistCount"
                    class="mobile-drawer__count"
                  >
                    {{ wishlistCount }}
                  </span>
                </router-link>
              </li>

              <li>
                <button
                  type="button"
                  class="
                    mobile-drawer__link
                    mobile-drawer__link--logout
                  "
                  @click="handleLogout"
                >
                  <span class="mobile-drawer__link-content">
                    <LogOut :size="20" />
                    <span>خروج از حساب</span>
                  </span>
                </button>
              </li>
            </ul>
          </template>
        </nav>
      </aside>
    </div>
  </Teleport>
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
  ChevronLeft,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  X
} from 'lucide-vue-next'

import { useAuthStore } from '@/core/store/authStore'
import { useCartStore } from '@/core/store/cartStore'
import { useWishlistStore } from '@/core/store/wishlistStore'

import './Header.css'

// =========================
// Router
// =========================

const router = useRouter()
const route = useRoute()

// =========================
// Stores
// =========================

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const {
  isAuthenticated,
  user,
  userName,
  userInitials
} = storeToRefs(authStore)

const {
  totalItems: cartTotalItems
} = storeToRefs(cartStore)

const {
  totalItems: wishlistCount
} = storeToRefs(wishlistStore)

// =========================
// State
// =========================

const isSticky = ref(false)
const isMobileMenuOpen = ref(false)
const isMobileSearchOpen = ref(false)
const isUserMenuOpen = ref(false)

const searchQuery = ref('')

const mobileSearchInput =
  ref<HTMLInputElement | null>(null)

const desktopUserMenuRef =
  ref<HTMLElement | null>(null)

const logoUrl = ref(
  'https://bazbia.ir/media/logo/bazbialogo.gif'
)

// =========================
// Menu
// =========================

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

// =========================
// User
// =========================

const currentUser = computed<Record<string, any>>(() => {
  return (user.value || {}) as Record<string, any>
})

const userFullName = computed(() => {
  return (
    userName.value ||
    currentUser.value.full_name ||
    currentUser.value.name ||
    'کاربر بازبیا'
  )
})

const userInitial = computed(() => {
  return (
    userInitials.value ||
    userFullName.value.trim().charAt(0) ||
    'ک'
  )
})

const userContact = computed(() => {
  return (
    currentUser.value.email ||
    currentUser.value.phone ||
    currentUser.value.mobile ||
    ''
  )
})

const userAvatar = computed(() => {
  return currentUser.value.avatar || ''
})

// =========================
// Helpers
// =========================

const isActiveRoute = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const closeMobileSearch = () => {
  isMobileSearchOpen.value = false
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const closeAll = () => {
  closeMobileMenu()
  closeMobileSearch()
  closeUserMenu()
}

// =========================
// Mobile menu
// =========================

const openMobileMenu = () => {
  closeMobileSearch()
  closeUserMenu()

  isMobileMenuOpen.value = true
  
}

const toggleMobileSearch = async () => {
 
  const openMobileMenu = () => {
  isMobileMenuOpen.value = true
  console.log('mobile menu:', isMobileMenuOpen.value)
  }
  
  closeMobileMenu()
  closeUserMenu()

  isMobileSearchOpen.value =
    !isMobileSearchOpen.value

  if (isMobileSearchOpen.value) {
    await nextTick()
    mobileSearchInput.value?.focus()
  }
}

// =========================
// Desktop user menu
// =========================

const toggleUserMenu = async () => {
  closeMobileMenu()
  closeMobileSearch()

  if (!isAuthenticated.value) {
    await router.push({
      path: '/login',
      query: {
        redirect: route.fullPath
      }
    })

    return
  }

  isUserMenuOpen.value =
    !isUserMenuOpen.value
}

// =========================
// Search
// =========================

const handleSearch = async () => {
  const query = searchQuery.value.trim()

  if (!query) {
    return
  }

  closeAll()

  await router.push({
    path: '/products',
    query: {
      search: query
    }
  })

  searchQuery.value = ''
}

// =========================
// Navigation
// =========================

const goToWishlist = async () => {
  closeAll()

  if (!isAuthenticated.value) {
    await router.push({
      path: '/login',
      query: {
        redirect: '/wishlist'
      }
    })

    return
  }

  await router.push('/wishlist')
}

// =========================
// Logout
// =========================

const handleLogout = async () => {
  try {
    await authStore.logout()

    closeAll()

    await router.push('/')
  } catch (error) {
    console.error(
      'خطا در خروج از حساب:',
      error
    )
  }
}

// =========================
// Images
// =========================

const handleLogoError = (event: Event) => {
  const image =
    event.target as HTMLImageElement

  image.onerror = null
  image.src =
    'https://via.placeholder.com/150x50?text=Bazbia'
}

const handleAvatarError = (event: Event) => {
  const image =
    event.target as HTMLImageElement

  image.onerror = null
  image.style.display = 'none'
}

// =========================
// Browser events
// =========================

const handleScroll = () => {
  isSticky.value =
    window.scrollY > 50
}

const handleResize = () => {
  if (window.innerWidth > 768) {
    closeMobileMenu()
    closeMobileSearch()
  }
}

const handleEscape = (
  event: KeyboardEvent
) => {
  if (event.key === 'Escape') {
    closeAll()
  }
}

const handleDocumentClick = (
  event: MouseEvent
) => {
  if (!isUserMenuOpen.value) {
    return
  }

  const target =
    event.target as Node | null

  if (
    target &&
    desktopUserMenuRef.value &&
    !desktopUserMenuRef.value.contains(target)
  ) {
    closeUserMenu()
  }
}

// =========================
// Watchers
// =========================

watch(
  () => route.fullPath,
  () => {
    closeAll()
  }
)

watch(
  isMobileMenuOpen,
  (isOpen) => {
    document.body.style.overflow =
      isOpen ? 'hidden' : ''
  }
)

// =========================
// Lifecycle
// =========================

onMounted(() => {
  window.addEventListener(
    'scroll',
    handleScroll,
    { passive: true }
  )

  window.addEventListener(
    'resize',
    handleResize
  )

  window.addEventListener(
    'keydown',
    handleEscape
  )

  document.addEventListener(
    'click',
    handleDocumentClick
  )

  handleScroll()

  if (!cartStore.initialized) {
    cartStore.initializeCart()
  }
})

onUnmounted(() => {
  window.removeEventListener(
    'scroll',
    handleScroll
  )

  window.removeEventListener(
    'resize',
    handleResize
  )

  window.removeEventListener(
    'keydown',
    handleEscape
  )

  document.removeEventListener(
    'click',
    handleDocumentClick
  )

  document.body.style.overflow = ''
})
</script>
