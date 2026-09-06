<template>
  <nav
    class="mobile-bottom-nav"
    aria-label="ناوبری اصلی موبایل"
  >
    <!-- خانه -->
    <RouterLink
      :to="{ name: 'home' }"
      class="mobile-bottom-nav__item"
      :class="{
        'mobile-bottom-nav__item--active': isHomeActive
      }"
      aria-label="خانه"
    >
      <Home
        :size="23"
        :stroke-width="1.8"
      />

      <span>خانه</span>
    </RouterLink>

    <!-- دسته‌بندی‌ها -->
    <RouterLink
      :to="{ name: 'categories' }"
      class="mobile-bottom-nav__item"
      :class="{
        'mobile-bottom-nav__item--active':
          isCategoriesActive
      }"
      aria-label="دسته‌بندی‌ها"
    >
      <LayoutGrid
        :size="23"
        :stroke-width="1.8"
      />

      <span>دسته‌بندی</span>
    </RouterLink>

    <!-- سبد خرید -->
    <RouterLink
      :to="{ name: 'cart' }"
      class="mobile-bottom-nav__item"
      :class="{
        'mobile-bottom-nav__item--active': isCartActive
      }"
      aria-label="سبد خرید"
    >
      <span class="mobile-bottom-nav__icon-wrapper">
        <ShoppingCart
          :size="23"
          :stroke-width="1.8"
        />

        <span
          v-if="cartTotalItems > 0"
          class="mobile-bottom-nav__badge"
        >
          {{ cartBadge }}
        </span>
      </span>

      <span>سبد خرید</span>
    </RouterLink>

    <!-- حساب کاربری -->
    <RouterLink
      :to="accountRoute"
      class="mobile-bottom-nav__item"
      :class="{
        'mobile-bottom-nav__item--active': isAccountActive
      }"
      :aria-label="
        isAuthenticated
          ? 'حساب کاربری'
          : 'ورود به حساب'
      "
    >
      <UserRound
        :size="23"
        :stroke-width="1.8"
      />

      <span>
        {{ isAuthenticated ? 'حساب من' : 'ورود' }}
      </span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import {
  Home,
  LayoutGrid,
  ShoppingCart,
  UserRound
} from 'lucide-vue-next'

import { useAuthStore } from '@/core/store/authStore'
import { useCartStore } from '@/core/store/cartStore'


const route = useRoute()

const authStore = useAuthStore()
const cartStore = useCartStore()

const {
  isAuthenticated
} = storeToRefs(authStore)

const {
  totalItems: cartTotalItems
} = storeToRefs(cartStore)


/* =========================================
   Account destination
========================================= */

const accountRoute = computed(() => {
  if (isAuthenticated.value) {
    return {
      name: 'profile'
    }
  }

  return {
    name: 'login'
  }
})


/* =========================================
   Cart badge
========================================= */

const cartBadge = computed(() => {
  if (cartTotalItems.value > 99) {
    return '۹۹+'
  }

  return cartTotalItems.value
})


/* =========================================
   Active routes
========================================= */

const isHomeActive = computed(() => {
  return route.name === 'home'
})


const isCategoriesActive = computed(() => {
  return (
    route.name === 'categories' ||
    route.name === 'category-products'
  )
})


const isCartActive = computed(() => {
  return (
    route.name === 'cart' ||
    String(route.name || '').startsWith('checkout')
  )
})


const isAccountActive = computed(() => {
  return [
    'profile',
    'orders',
    'wishlist',
    'login',
    'register'
  ].includes(String(route.name || ''))
})
</script>

<style scoped>
.mobile-bottom-nav {
  display: none;
}


/* =========================================
   Mobile
========================================= */

@media (max-width: 767px) {
  .mobile-bottom-nav {
    position: fixed;

    right: 0;
    bottom: 0;
    left: 0;

    z-index: 45;

    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));

    min-height: 64px;

    padding-top: 5px;
    padding-right: max(
      6px,
      env(safe-area-inset-right)
    );
    padding-bottom: max(
      6px,
      env(safe-area-inset-bottom)
    );
    padding-left: max(
      6px,
      env(safe-area-inset-left)
    );

    background: rgba(255, 255, 255, 0.97);

    border-top: 1px solid #e5e7eb;

    box-shadow:
      0 -4px 18px rgba(15, 23, 42, 0.07);

    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }


  /* =====================================
     Item
  ===================================== */

  .mobile-bottom-nav__item {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    min-width: 0;
    min-height: 52px;

    padding: 4px 2px;

    gap: 3px;

    color: #6b7280;

    text-decoration: none;

    font-size: 11px;
    font-weight: 500;

    line-height: 1.2;

    transition:
      color 0.18s ease,
      transform 0.18s ease;
  }


  .mobile-bottom-nav__item:active {
    transform: scale(0.94);
  }


  /* =====================================
     Active item
  ===================================== */

  .mobile-bottom-nav__item--active {
    color: #dc2626;

    font-weight: 700;
  }


  .mobile-bottom-nav__item--active::before {
    content: '';

    position: absolute;

    top: -5px;
    left: 50%;

    width: 28px;
    height: 3px;

    border-radius: 0 0 999px 999px;

    background: #dc2626;

    transform: translateX(-50%);
  }


  /* =====================================
     Icon
  ===================================== */

  .mobile-bottom-nav__icon-wrapper {
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;
  }


  /* =====================================
     Cart badge
  ===================================== */

  .mobile-bottom-nav__badge {
    position: absolute;

    top: -7px;
    right: -11px;

    display: flex;
    align-items: center;
    justify-content: center;

    min-width: 17px;
    height: 17px;

    padding: 0 4px;

    border: 2px solid #ffffff;
    border-radius: 999px;

    background: #dc2626;
    color: #ffffff;

    font-size: 9px;
    font-weight: 700;
    line-height: 1;
  }
}
</style>
