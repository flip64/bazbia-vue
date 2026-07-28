// src/router/index.ts

import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'

import { checkoutGuard } from './checkoutGuard'
import { setupAuthGuard } from './guard'


const routes: RouteRecordRaw[] = [
  // =================================================
  // صفحه اصلی
  // =================================================
  {
    path: '/',
    name: 'home',

    component: () =>
      import('@/views/HomeView.vue'),

    meta: {
      requiresAuth: false,
      title: 'خانه',
    },
  },

  // =================================================
  // محصولات
  // =================================================
  {
    path: '/products',
    name: 'products',

    component: () =>
      import(
        '@/views/products/ProductsView.vue'
      ),

    meta: {
      requiresAuth: false,
      title: 'محصولات',
    },
  },

  {
    path: '/product/:slug',
    name: 'product-detail',

    component: () =>
      import(
        '@/views/products/ProductDetail.vue'
      ),

    meta: {
      requiresAuth: false,
      title: 'جزئیات محصول',
    },
  },

  // =================================================
  // دسته‌بندی‌ها
  // =================================================
  {
    path: '/categories',
    name: 'categories',

    component: () =>
      import(
        '@/views/categories/CategoriesView.vue'
      ),

    meta: {
      requiresAuth: false,
      title: 'دسته‌بندی‌ها',
    },
  },

  {
    path: '/category/:id',
    name: 'category-products',

    component: () =>
      import(
        '@/views/products/ProductsView.vue'
      ),

    meta: {
      requiresAuth: false,
      title: 'محصولات دسته‌بندی',
    },
  },

  // =================================================
  // سبد خرید
  // =================================================
  {
    path: '/cart',
    name: 'cart',

    component: () =>
      import(
        '@/views/cart/CartView.vue'
      ),

    meta: {
      requiresAuth: false,
      title: 'سبد خرید',
    },
  },

  // =================================================
  // مراحل تسویه‌حساب
  // =================================================
  {
    path: '/checkout',

    component: () =>
      import(
        '@/views/checkout/CheckoutLayout.vue'
      ),

    meta: {
      requiresAuth: true,
      title: 'تسویه حساب',
    },

    children: [
      {
        path: '',

        redirect: {
          name: 'checkout-customer',
        },
      },

      {
        path: 'customer',
        name: 'checkout-customer',

        component: () =>
          import(
            '@/views/checkout/CustomerInfoView.vue'
          ),

        beforeEnter: checkoutGuard,

        meta: {
          requiresAuth: true,
          title: 'اطلاعات مشتری',
        },
      },

      {
        path: 'address',
        name: 'checkout-address',

        component: () =>
          import(
            '@/views/checkout/AddressView.vue'
          ),

        beforeEnter: checkoutGuard,

        meta: {
          requiresAuth: true,
          title: 'انتخاب آدرس',
        },
      },

      {
        path: 'shipping',
        name: 'checkout-shipping',

        component: () =>
          import(
            '@/views/checkout/ShippingView.vue'
          ),

        beforeEnter: checkoutGuard,

        meta: {
          requiresAuth: true,
          title: 'روش ارسال',
        },
      },

      {
        path: 'review',
        name: 'checkout-review',

        component: () =>
          import(
            '@/views/checkout/ReviewOrderView.vue'
          ),

        beforeEnter: checkoutGuard,

        meta: {
          requiresAuth: true,
          title: 'بررسی سفارش',
        },
      },

      /*
       * این مسیر checkoutGuard ندارد.
       *
       * پس از ثبت سفارش، اطلاعات checkout و cart
       * پاک می‌شوند؛ بنابراین صفحه موفقیت نباید به
       * اطلاعات مراحل قبلی وابسته باشد.
       */
      {
        path: 'success/:orderId',
        name: 'checkout-success',

        component: () =>
          import(
            '@/views/checkout/CheckoutSuccessView.vue'
          ),

        meta: {
          requiresAuth: true,
          title: 'ثبت موفق سفارش',
        },

        props: true,
      },
    ],
  },

  // =================================================
  // نتیجه پرداخت
  // =================================================
  /*
   * این مسیر عمداً بیرون از children مربوط به checkout
   * قرار دارد و checkoutGuard نیز روی آن اجرا نمی‌شود.
   */
  {
    path: '/payment/verify',
    name: 'payment-verify',

    component: () =>
      import(
        '@/views/payment/PaymentVerifyView.vue'
      ),

    meta: {
      requiresAuth: true,
      title: 'نتیجه پرداخت',
    },
  },

  // =================================================
  // ورود و ثبت‌نام
  // =================================================
  {
    path: '/login',
    name: 'login',

    component: () =>
      import('@/views/Login.vue'),

    meta: {
      guestOnly: true,
      requiresAuth: false,
      title: 'ورود',
    },
  },

  {
    path: '/register',
    name: 'register',

    component: () =>
      import('@/views/Register.vue'),

    meta: {
      guestOnly: true,
      requiresAuth: false,
      title: 'ثبت‌نام',
    },
  },

  // =================================================
  // حساب کاربری
  // =================================================
  {
    path: '/profile',
    name: 'profile',

    component: () =>
      import(
        '@/views/user/ProfileView.vue'
      ),

    meta: {
      requiresAuth: true,
      title: 'پروفایل',
    },
  },

  {
    path: '/orders',
    name: 'orders',

    component: () =>
      import(
        '@/views/user/OrdersView.vue'
      ),

    meta: {
      requiresAuth: true,
      title: 'سفارش‌ها',
    },
  },

  {
    path: '/wishlist',
    name: 'wishlist',

    component: () =>
      import(
        '@/views/user/WishlistView.vue'
      ),

    meta: {
      requiresAuth: true,
      title: 'علاقه‌مندی‌ها',
    },
  },

  // =================================================
  // جستجو و تخفیف‌ها
  // =================================================
  {
    path: '/search',
    name: 'search',

    component: () =>
      import(
        '@/views/products/ProductsView.vue'
      ),

    meta: {
      requiresAuth: false,
      title: 'جستجو',
    },
  },

  {
    path: '/offers',
    name: 'offers',

    component: () =>
      import(
        '@/views/products/ProductsView.vue'
      ),

    meta: {
      requiresAuth: false,
      title: 'تخفیف‌ها',
    },
  },

  // =================================================
  // وبلاگ
  // =================================================
  {
    path: '/blog',
    name: 'blog',

    component: () =>
      import(
        '@/views/blog/BlogView.vue'
      ),

    meta: {
      requiresAuth: false,
      title: 'وبلاگ',
    },
  },

  {
    path: '/blog/:id',
    name: 'blog-post',

    component: () =>
      import(
        '@/views/blog/BlogPost.vue'
      ),

    meta: {
      requiresAuth: false,
      title: 'پست وبلاگ',
    },
  },

  // =================================================
  // صفحات عمومی
  // =================================================
  {
    path: '/contact',
    name: 'contact',

    component: () =>
      import('@/views/Contact.vue'),

    meta: {
      requiresAuth: false,
      title: 'تماس با ما',
    },
  },

  {
    path: '/about',
    name: 'about',

    component: () =>
      import('@/views/AboutView.vue'),

    meta: {
      requiresAuth: false,
      title: 'درباره ما',
    },
  },

  {
    path: '/faq',
    name: 'faq',

    component: () =>
      import('@/views/FAQ.vue'),

    meta: {
      requiresAuth: false,
      title: 'سوالات متداول',
    },
  },

  // =================================================
  // صفحه پیدا نشد
  // =================================================
  /*
   * این Route باید همیشه آخرین Route باشد.
   */
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',

    component: () =>
      import('@/views/NotFound.vue'),

    meta: {
      requiresAuth: false,
      title: 'صفحه یافت نشد',
    },
  },
]


const router = createRouter({
  history: createWebHistory(),

  routes,

  scrollBehavior(
    to,
    _from,
    savedPosition,
  ) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    return {
      top: 0,
      behavior: 'smooth',
    }
  },
})


/*
 * تنظیم عنوان صفحه.
 */
router.beforeEach(to => {
  const defaultTitle =
    'فروشگاه بازبیا'

  const pageTitle =
    typeof to.meta.title === 'string'
      ? to.meta.title
      : ''

  document.title = pageTitle
    ? `${pageTitle} | ${defaultTitle}`
    : defaultTitle

  return true
})


/*
 * بررسی ورود، مسیرهای requiresAuth و guestOnly.
 */
setupAuthGuard(router)


export default router
