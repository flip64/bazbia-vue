<template>
  <header
    class="header"
    :class="{ 'header--sticky': isSticky }"
  >
    <div class="header__container">
      <!-- =========================
           نسخه دسکتاپ
      ========================== -->
      <div class="header__desktop">
        <!-- لوگو -->
        <div class="header__logo">
          <router-link
            to="/"
            class="header__logo-link"
            @click="closeAllMenus"
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
        <nav
          class="header__nav"
          aria-label="منوی اصلی"
        >
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
                @click="closeAllMenus"
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
            role="search"
            @submit.prevent="handleSearch"
          >
            <input
              v-model="searchQuery"
              type="search"
              placeholder="جستجوی محصولات..."
              class="header__search-input"
              aria-label="جستجوی محصولات"
              autocomplete="off"
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

        <!-- عملیات کاربری -->
        <div class="header__actions">
          <!-- حساب کاربری -->
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
              :aria-expanded="isUserMenuOpen"
              aria-controls="desktop-user-dropdown"
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
                :size="22"
                class="header__action-icon"
              />
            </button>

            <transition name="fade">
              <div
                v-if="isUserMenuOpen && isAuthenticated"
                id="desktop-user-dropdown"
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

                      <div
                        v-if="userEmail"
                        class="header__dropdown-email"
                      >
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
                      />

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
            <Heart
              :size="22"
              class="header__action-icon"
            />

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
            @click="closeAllMenus"
          >
            <ShoppingBag
              :size="22"
              class="header__action-icon"
            />

            <span
              v-if="cartTotalItems"
              class="header__badge"
            >
              {{ cartTotalItems }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- =========================
           نسخه موبایل
      ========================== -->
      <div class="header__mobile">
        <div class="header__mobile-top">
          <!-- دکمه منو -->
          <button
            type="button"
            class="header__mobile-menu-btn"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-navigation"
            aria-label="باز و بسته کردن منو"
            @click.stop="toggleMobileMenu"
          >
            <Menu
              v-if="!isMobileMenuOpen"
              :size="24"
            />

            <X
              v-else
              :size="24"
            />
          </button>

          <!-- لوگو -->
          <router-link
            to="/"
            class="header__logo"
            aria-label="صفحه اصلی بازبیا"
            @click="closeAllMenus"
          >
            <img
              :src="logoUrl"
              alt="بازبیا"
              class="header__logo-img"
              @error="handleImageError"
            >
          </router-link>

          <!-- عملیات موبایل -->
          <div class="header__mobile-actions">
            <button
              type="button"
              class="header__mobile-search-btn"
              :aria-expanded="isMobileSearchOpen"
              aria-controls="mobile-search"
              aria-label="جستجو"
              @click.stop="toggleSearch"
            >
              <X
                v-if="isMobileSearchOpen"
                :size="20"
              />

              <Search
                v-else
                :size="20"
              />
            </button>

            <router-link
              to="/cart"
              class="header__mobile-cart"
              aria-label="سبد خرید"
              @click="closeAllMenus"
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

        <!-- جستجوی موبایل -->
        <transition name="fade">
          <div
            v-if="isMobileSearchOpen"
            id="mobile-search"
            class="header__mobile-search"
            @click.stop
          >
            <form
              role="search"
              @submit.prevent="handleSearch"
            >
              <input
                ref="mobileSearchInput"
                v-model="searchQuery"
                type="search"
                placeholder="جستجوی محصولات..."
                class="header__mobile-search-input"
                aria-label="جستجوی محصولات"
                autocomplete="off"
              >
            </form>
          </div>
        </transition>
      </div>
    </div>
  </header>

  <!-- =========================
       منوی کشویی موبایل
       خارج از Header رندر می‌شود
  ========================== -->
  <Teleport to="body">
    <transition name="mobile-menu">
      <div
        v-if="isMobileMenuOpen"
        class="header__mobile-overlay"
        @click="closeMobileMenu"
      >
        <aside
          id="mobile-navigation"
          class="header__mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="منوی موبایل"
          @click.stop
        >
          <!-- سربرگ منو -->
          <div class="header__mobile-menu-header">
            <router-link
              to="/"
              class="header__mobile-menu-logo"
              @click="closeMobileMenu"
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

            <button
              type="button"
              class="header__mobile-menu-close"
              aria-label="بستن منو"
              @click="closeMobileMenu"
            >
              <X :size="24" />
            </button>
          </div>

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

                <div
                  v-if="userEmail"
                  class="header__mobile-user-email"
                >
                  {{ userEmail }}
                </div>
              </div>
            </div>
          </div>

          <!-- ورود و ثبت‌نام -->
          <div
            v-else
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
          </div>

          <!-- لینک‌های منو -->
          <nav
            class="header__mobile-nav"
            aria-label="منوی موبایل"
          >
            <ul class="header__mobile-nav-list">
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
                  <span>{{ item.title }}</span>
                </router-link>
              </li>

              <!-- لینک‌های کاربر -->
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
        </aside>
      </div>
    </transition>
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

// ========== User Computed ==========
const userFullName = computed(() => {
  return userName.value || 'کاربر بازبیا'
})

const userInitial = computed(() => {
  return userInitials.value || 'ک'
})

const userEmail = computed(() => {
  return (
    user.value?.email ||
    user.value?.phone ||
    user.value?.mobile ||
    ''
  )
})

const userAvatar = computed(() => {
  return user.value?.avatar || ''
})

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
  return (
    isMobileMenuOpen.value ||
    isMobileSearchOpen.value
  )
})

// ========== Route Helpers ==========
const isActiveRoute = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}

// ========== Body Scroll ==========
const lockBodyScroll = () => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}

const unlockBodyScroll = () => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}

// ========== Close Methods ==========
const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const closeMobileSearch = () => {
  isMobileSearchOpen.value = false
}

const closeAllMenus = () => {
  closeMobileMenu()
  closeMobileSearch()
  closeUserMenu()
}

// ========== Search ==========
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
  closeAllMenus()
}

// ========== Images ==========
const handleImageError = (event: Event) => {
  const image = event.target as HTMLImageElement

  image.onerror = null
  image.src =
    'https://via.placeholder.com/150x50?text=Bazbia'
}

const handleAvatarError = (event: Event) => {
  const image = event.target as HTMLImageElement

  image.onerror = null
  image.style.display = 'none'
}

// ========== Desktop User Menu ==========
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

  isUserMenuOpen.value = !isUserMenuOpen.value
}

// ========== Wishlist ==========
const goToWishlist = async () => {
  closeAllMenus()

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

// ========== Logout ==========
const handleLogout = async () => {
  try {
    await authStore.logout()

    closeAllMenus()

    await router.push('/')
  } catch (error) {
    console.error('خطا در خروج از حساب:', error)
  }
}

const handleMobileLogout = async () => {
  await handleLogout()
}

// ========== Mobile Menu ==========
const toggleMobileMenu = () => {
  const nextState = !isMobileMenuOpen.value

  closeMobileSearch()
  closeUserMenu()

  isMobileMenuOpen.value = nextState
}

// ========== Mobile Search ==========
const toggleSearch = async () => {
  const nextState = !isMobileSearchOpen.value

  closeMobileMenu()
  closeUserMenu()

  isMobileSearchOpen.value = nextState

  if (nextState) {
    await nextTick()
    mobileSearchInput.value?.focus()
  }
}

// ========== Events ==========
const handleScroll = () => {
  isSticky.value = window.scrollY > 50
}

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null

  if (!target) {
    return
  }

  const clickedInsideMobileMenu = target.closest(
    '.header__mobile-menu'
  )

  const clickedMobileMenuButton = target.closest(
    '.header__mobile-menu-btn'
  )

  const clickedInsideMobileSearch = target.closest(
    '.header__mobile-search'
  )

  const clickedMobileSearchButton = target.closest(
    '.header__mobile-search-btn'
  )

  if (
    isMobileMenuOpen.value &&
    !clickedInsideMobileMenu &&
    !clickedMobileMenuButton
  ) {
    closeMobileMenu()
  }

  if (
    isMobileSearchOpen.value &&
    !clickedInsideMobileSearch &&
    !clickedMobileSearchButton
  ) {
    closeMobileSearch()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') {
    return
  }

  closeAllMenus()
}

const handleResize = () => {
  if (window.innerWidth >= 992) {
    closeMobileMenu()
    closeMobileSearch()
  }
}

// ========== Watchers ==========
watch(
  () => route.fullPath,
  () => {
    closeAllMenus()
  }
)

watch(
  bodyShouldBeLocked,
  (shouldLock) => {
    if (shouldLock) {
      lockBodyScroll()
    } else {
      unlockBodyScroll()
    }
  }
)

// ========== Lifecycle ==========
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
  handleResize()

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

  unlockBodyScroll()
})
</script>
