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
              alt=" فروشگاه بازبیا " 
              class="header__logo-img"
              @error="handleImageError"
            >
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

        <!-- آیکون‌های کاربری با وضعیت لاگین -->
        <div class="header__actions">
          <!-- منوی کاربر با وضعیت لاگین -->
          <div class="header__user-menu" :class="{ 'header__user-menu--open': isUserMenuOpen }">
            <button @click="toggleUserMenu" class="header__action-btn header__user-btn">
              <!-- اگه لاگین کرده باشه، عکس پروفایل یا حرف اول نام رو نشون بده -->
              <template v-if="isLoggedIn">
                <div class="header__user-avatar">
                  <img 
                    v-if="userAvatar" 
                    :src="userAvatar" 
                    alt="avatar"
                    class="header__user-avatar-img"
                  >
                  <span v-else class="header__user-avatar-text">
                    {{ userInitial }}
                  </span>
                </div>
              </template>
              <!-- اگه لاگین نکرده باشه، آیکون کاربر رو نشون بده -->
              <UserIcon v-else class="header__action-icon" />
            </button>

            <!-- دراپ‌داون منوی کاربر (فقط وقتی لاگین کرده باشه) -->
            <transition name="fade">
              <div v-if="isUserMenuOpen && isLoggedIn" class="header__dropdown">
                <div class="header__dropdown-header">
                  <div class="header__dropdown-user">
                    <div class="header__dropdown-avatar">
                      <img 
                        v-if="userAvatar" 
                        :src="userAvatar" 
                        alt="avatar"
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
                      <UserIcon class="header__dropdown-icon" />
                      <span>پروفایل من</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/orders" class="header__dropdown-link" @click="closeUserMenu">
                      <ShoppingBagIcon class="header__dropdown-icon" />
                      <span>سفارش‌های من</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/wishlist" class="header__dropdown-link" @click="closeUserMenu">
                      <HeartIcon class="header__dropdown-icon" />
                      <span>علاقه‌مندی‌ها</span>
                      <span v-if="wishlistCount" class="header__dropdown-badge">{{ wishlistCount }}</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/settings" class="header__dropdown-link" @click="closeUserMenu">
                      <SettingsIcon class="header__dropdown-icon" />
                      <span>تنظیمات</span>
                    </router-link>
                  </li>
                  <li class="header__dropdown-divider"></li>
                  <li>
                    <button @click="handleLogout" class="header__dropdown-link header__dropdown-link--logout">
                      <LogOutIcon class="header__dropdown-icon" />
                      <span>خروج از حساب</span>
                    </button>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
          
          <!-- علاقه‌مندی‌ها -->
          <button @click="goToWishlist" class="header__action-btn">
            <HeartIcon class="header__action-icon" />
            <span v-if="wishlistCount" class="header__badge">{{ wishlistCount }}</span>
          </button>
          
          <!-- سبد خرید -->
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
            <img 
              :src="logoUrl" 
              alt="فروشگاه من" 
              class="header__logo-img"
              @error="handleImageError"
            >
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
              <!-- بخش کاربر در موبایل -->
              <div class="header__mobile-user" v-if="isLoggedIn">
                <div class="header__mobile-user-info">
                  <div class="header__mobile-user-avatar">
                    <img 
                      v-if="userAvatar" 
                      :src="userAvatar" 
                      alt="avatar"
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
                <li v-if="!isLoggedIn" class="header__mobile-auth">
                  <router-link to="/login" class="header__mobile-auth-link" @click="closeMobileMenu">
                    <LogInIcon class="header__mobile-auth-icon" />
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

                <!-- لینک‌های کاربری (فقط وقتی لاگین کرده) -->
                <template v-if="isLoggedIn">
                  <li class="header__mobile-divider"></li>
                  <li>
                    <router-link to="/profile" class="header__mobile-nav-link" @click="closeMobileMenu">
                      <UserIcon class="header__mobile-nav-icon" />
                      <span>پروفایل من</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/orders" class="header__mobile-nav-link" @click="closeMobileMenu">
                      <ShoppingBagIcon class="header__mobile-nav-icon" />
                      <span>سفارش‌های من</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/wishlist" class="header__mobile-nav-link" @click="closeMobileMenu">
                      <HeartIcon class="header__mobile-nav-icon" />
                      <span>علاقه‌مندی‌ها</span>
                      <span v-if="wishlistCount" class="header__badge">{{ wishlistCount }}</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/settings" class="header__mobile-nav-link" @click="closeMobileMenu">
                      <SettingsIcon class="header__mobile-nav-icon" />
                      <span>تنظیمات</span>
                    </router-link>
                  </li>
                  <li class="header__mobile-divider"></li>
                  <li>
                    <button @click="handleMobileLogout" class="header__mobile-nav-link header__mobile-nav-link--logout">
                      <LogOutIcon class="header__mobile-nav-icon" />
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

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  SearchIcon, 
  UserIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  MenuIcon, 
  XIcon,
  LogOutIcon,
  LogInIcon,
  SettingsIcon
} from 'lucide-vue-next'
import './Header.css'

const props = defineProps({
  cartCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  isLoggedIn: { type: Boolean, default: false }, // وضعیت لاگین
  userData: { // اطلاعات کاربر
    type: Object,
    default: () => ({
      firstName: '',
      lastName: '',
      email: '',
      avatar: null
    })
  }
})

const emit = defineEmits(['search', 'toggle-wishlist', 'logout', 'login'])

const router = useRouter()
const route = useRoute()

// State
const isSticky = ref(false)
const isMobileMenuOpen = ref(false)
const isMobileSearchOpen = ref(false)
const isUserMenuOpen = ref(false)
const searchQuery = ref('')
const mobileSearchInput = ref(null)
const logoUrl = ref('https://bazbia.ir/media/logo/bazbialogo.gif')

// Computed properties برای اطلاعات کاربر
const userFullName = computed(() => {
  if (props.userData.firstName || props.userData.lastName) {
    return `${props.userData.firstName} ${props.userData.lastName}`.trim()
  }
  return 'کاربر'
})

const userInitial = computed(() => {
  if (props.userData.firstName) {
    return props.userData.firstName.charAt(0).toUpperCase()
  }
  if (props.userData.email) {
    return props.userData.email.charAt(0).toUpperCase()
  }
  return 'U'
})

const userEmail = computed(() => props.userData.email || '')
const userAvatar = computed(() => props.userData.avatar || null)

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
const isActiveRoute = (path) => route.path === path

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value)
    router.push({ path: '/search', query: { q: searchQuery.value } })
    searchQuery.value = ''
    closeMobileSearch()
  }
}

const handleImageError = (e) => {
  console.log('خطا در لود لوگو')
  e.target.src = 'https://via.placeholder.com/150x50?text=فروشگاه'
}

const toggleUserMenu = () => {
  if (!props.isLoggedIn) {
    // اگه لاگین نکرده، برو به صفحه لاگین
    router.push('/login')
  } else {
    // اگه لاگین کرده، منو رو باز کن
    isUserMenuOpen.value = !isUserMenuOpen.value
  }
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const goToWishlist = () => {
  if (!props.isLoggedIn) {
    router.push('/login?redirect=wishlist')
  } else {
    router.push('/wishlist')
    emit('toggle-wishlist')
  }
}

const handleLogout = async () => {
  try {
    emit('logout')
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
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
  // وقتی منوی موبایل باز میشه، منوی کاربر رو ببند
  if (isMobileMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleSearch = () => {
  isMobileSearchOpen.value = !isMobileSearchOpen.value
  if (isMobileSearchOpen.value) {
    setTimeout(() => mobileSearchInput.value?.focus(), 100)
  }
}

const closeMobileSearch = () => isMobileSearchOpen.value = false

const handleScroll = () => isSticky.value = window.scrollY > 50

// Watchers
watch(() => route.path, () => {
  closeMobileMenu()
  closeMobileSearch()
  closeUserMenu()
})

watch(() => props.isLoggedIn, (newVal) => {
  // اگه کاربر از صفحه لاگین برگشت، منو رو ببند
  if (newVal) {
    closeUserMenu()
  }
})

// Lifecycle
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>
