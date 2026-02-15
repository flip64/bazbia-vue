// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { setupAuthGuard } from "./guard"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home.vue"),
    meta: { 
      requiresAuth: false,
      title: 'خانه'
    }
  },
  {
    path: "/products",
    name: "products",
    component: () => import("@/views/products/ProductsView.vue"),
    meta: { 
      requiresAuth: false,
      title: 'محصولات'
    }
  },
  {
    path: "/product/:id",
    name: "product-detail",
    component: () => import("@/views/products/ProductDetail.vue"),
    meta: { 
      requiresAuth: false,
      title: 'جزئیات محصول'
    }
  },
  {
    path: "/categories",
    name: "categories",
    component: () => import("@/views/categories/CategoriesView.vue"),
    meta: { 
      requiresAuth: false,
      title: 'دسته‌بندی‌ها'
    }
  },
  {
    path: "/category/:id",
    name: "category-products",
    component: () => import("@/views/products/ProductsView.vue"),
    meta: { 
      requiresAuth: false,
      title: 'محصولات دسته‌بندی'
    }
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/cart/CartView.vue"),
    meta: { 
      requiresAuth: false,
      title: 'سبد خرید'
    }
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("@/views/checkout/CheckoutView.vue"),
    meta: { 
      requiresAuth: true,
      title: 'تسویه حساب'
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/Login.vue"),
    meta: { 
      guestOnly: true,
      title: 'ورود'
    }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/pages/Register.vue"),
    meta: { 
      guestOnly: true,
      title: 'ثبت‌نام'
    }
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/user/ProfileView.vue"),
    meta: { 
      requiresAuth: true,
      title: 'پروفایل'
    }
  },
  {
    path: "/orders",
    name: "orders",
    component: () => import("@/views/user/OrdersView.vue"),
    meta: { 
      requiresAuth: true,
      title: 'سفارش‌ها'
    }
  },
  {
    path: "/wishlist",
    name: "wishlist",
    component: () => import("@/views/user/WishlistView.vue"),
    meta: { 
      requiresAuth: true,
      title: 'علاقه‌مندی‌ها'
    }
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/products/ProductsView.vue"),
    meta: { 
      requiresAuth: false,
      title: 'جستجو'
    }
  },
  {
    path: "/offers",
    name: "offers",
    component: () => import("@/views/products/ProductsView.vue"),
    meta: { 
      requiresAuth: false,
      title: 'تخفیف‌ها'
    }
  },
  {
    path: "/blog",
    name: "blog",
    component: () => import("@/views/blog/BlogView.vue"),
    meta: { 
      requiresAuth: false,
      title: 'وبلاگ'
    }
  },
  {
    path: "/blog/:id",
    name: "blog-post",
    component: () => import("@/views/blog/BlogPost.vue"),
    meta: { 
      requiresAuth: false,
      title: 'پست وبلاگ'
    }
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("@/pages/Contact.vue"),
    meta: { 
      requiresAuth: false,
      title: 'تماس با ما'
    }
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/pages/About.vue"),
    meta: { 
      requiresAuth: false,
      title: 'درباره ما'
    }
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("@/pages/FAQ.vue"),
    meta: { 
      requiresAuth: false,
      title: 'سوالات متداول'
    }
  },

  // 404 page - باید آخرین route باشه
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/NotFound.vue"),
    meta: { 
      title: 'صفحه یافت نشد'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { 
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// تنظیم title صفحه بر اساس meta
router.beforeEach((to, from, next) => {
  const defaultTitle = 'فروشگاه من'
  document.title = to.meta.title ? `${to.meta.title} | ${defaultTitle}` : defaultTitle
  next()
})

setupAuthGuard(router)

export default router
