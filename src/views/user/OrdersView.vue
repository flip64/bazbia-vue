<template>
  <div class="account-page">
    <div class="account-container">
      <!-- ================= Header ================= -->
      <section class="account-header">
        <div class="account-avatar">
          {{ userInitials }}
        </div>

        <div class="account-user">
          <p class="account-eyebrow">
            حساب کاربری
          </p>

          <h1 class="account-name">
            {{ userName }}
          </h1>

          <p
            v-if="user?.phone"
            class="account-phone"
            dir="ltr"
          >
            {{ user.phone }}
          </p>
        </div>
      </section>


      <!-- ================= User Info ================= -->
      <section class="account-card">
        <div class="section-heading">
          <div>
            <h2>اطلاعات حساب</h2>

            <p>
              اطلاعات ثبت‌شده برای حساب کاربری شما
            </p>
          </div>

          <UserRound
            :size="22"
            :stroke-width="1.8"
          />
        </div>

        <div
          v-if="user"
          class="info-grid"
        >
          <div class="info-item">
            <span class="info-label">
              نام
            </span>

            <strong>
              {{ firstName || 'ثبت نشده' }}
            </strong>
          </div>

          <div class="info-item">
            <span class="info-label">
              نام خانوادگی
            </span>

            <strong>
              {{ lastName || 'ثبت نشده' }}
            </strong>
          </div>

          <div class="info-item">
            <span class="info-label">
              شماره موبایل
            </span>

            <strong
              dir="ltr"
              class="ltr-value"
            >
              {{ user.phone || 'ثبت نشده' }}
            </strong>
          </div>

          <div class="info-item">
            <span class="info-label">
              ایمیل
            </span>

            <strong
              dir="ltr"
              class="ltr-value"
            >
              {{ user.email || 'ثبت نشده' }}
            </strong>
          </div>
        </div>

        <div
          v-else-if="loadingProfile"
          class="account-status"
        >
          در حال دریافت اطلاعات حساب...
        </div>

        <div
          v-else
          class="account-status account-status--error"
        >
          اطلاعات حساب در دسترس نیست.
        </div>
      </section>


      <!-- ================= Account Menu ================= -->
      <section class="account-card">
        <div class="section-heading">
          <div>
            <h2>مدیریت حساب</h2>

            <p>
              دسترسی سریع به بخش‌های حساب کاربری
            </p>
          </div>
        </div>

        <div class="account-menu">
          <!-- Orders -->
          <RouterLink
            :to="{ name: 'orders' }"
            class="account-menu__item"
          >
            <span class="account-menu__icon">
              <Package
                :size="22"
                :stroke-width="1.8"
              />
            </span>

            <span class="account-menu__content">
              <strong>
                سفارش‌های من
              </strong>

              <small>
                مشاهده سفارش‌ها و وضعیت خریدها
              </small>
            </span>

            <ChevronLeft
              class="account-menu__arrow"
              :size="20"
            />
          </RouterLink>


          <!-- Wishlist -->
          <RouterLink
            :to="{ name: 'wishlist' }"
            class="account-menu__item"
          >
            <span class="account-menu__icon">
              <Heart
                :size="22"
                :stroke-width="1.8"
              />
            </span>

            <span class="account-menu__content">
              <strong>
                علاقه‌مندی‌ها
              </strong>

              <small>
                محصولاتی که برای بعد ذخیره کرده‌اید
              </small>
            </span>

            <ChevronLeft
              class="account-menu__arrow"
              :size="20"
            />
          </RouterLink>


          <!-- Address -->
          <div
            class="
              account-menu__item
              account-menu__item--disabled
            "
          >
            <span class="account-menu__icon">
              <MapPin
                :size="22"
                :stroke-width="1.8"
              />
            </span>

            <span class="account-menu__content">
              <strong>
                آدرس‌های من
              </strong>

              <small>
                مدیریت آدرس‌های تحویل
              </small>
            </span>

            <span class="coming-soon">
              به‌زودی
            </span>
          </div>


          <!-- Security -->
          <div
            class="
              account-menu__item
              account-menu__item--disabled
            "
          >
            <span class="account-menu__icon">
              <ShieldCheck
                :size="22"
                :stroke-width="1.8"
              />
            </span>

            <span class="account-menu__content">
              <strong>
                امنیت حساب
              </strong>

              <small>
                مدیریت رمز عبور و امنیت ورود
              </small>
            </span>

            <span class="coming-soon">
              به‌زودی
            </span>
          </div>
        </div>
      </section>


      <!-- ================= Logout ================= -->
      <section class="account-card">
        <button
          type="button"
          class="logout-button"
          :disabled="authStore.loading"
          @click="handleLogout"
        >
          <LogOut
            :size="20"
            :stroke-width="1.8"
          />

          <span>
            {{
              authStore.loading
                ? 'در حال خروج...'
                : 'خروج از حساب کاربری'
            }}
          </span>
        </button>
      </section>
    </div>
  </div>
</template>


<script setup lang="ts">
import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  ChevronLeft,
  Heart,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  UserRound
} from 'lucide-vue-next'

import {
  RouterLink,
  useRouter
} from 'vue-router'

import {
  storeToRefs
} from 'pinia'

import {
  useAuthStore
} from '@/core/store/authStore'


const router = useRouter()

const authStore = useAuthStore()

const {
  user,
  userName,
  userInitials
} = storeToRefs(authStore)

const loadingProfile = ref(false)


/* =========================================
   User information
========================================= */

const firstName = computed(() => {
  if (user.value?.first_name) {
    return user.value.first_name
  }

  if (user.value?.full_name) {
    return (
      user.value.full_name
        .trim()
        .split(/\s+/)[0] || ''
    )
  }

  return ''
})


const lastName = computed(() => {
  if (user.value?.last_name) {
    return user.value.last_name
  }

  if (user.value?.full_name) {
    const parts =
      user.value.full_name
        .trim()
        .split(/\s+/)

    if (parts.length > 1) {
      return parts.slice(1).join(' ')
    }
  }

  return ''
})


/* =========================================
   Profile loading
========================================= */

onMounted(async () => {
  if (user.value) {
    return
  }

  loadingProfile.value = true

  try {
    await authStore.fetchUserProfile()
  } finally {
    loadingProfile.value = false
  }
})


/* =========================================
   Logout
========================================= */

async function handleLogout() {
  await authStore.logout()

  await router.replace({
    name: 'home'
  })
}
</script>


<style scoped>
.account-page {
  min-height: 70vh;

  padding: 24px 16px 40px;

  background: #f9fafb;
}


.account-container {
  width: 100%;
  max-width: 900px;

  margin: 0 auto;

  display: flex;
  flex-direction: column;

  gap: 18px;
}


/* =========================================
   Header
========================================= */

.account-header {
  display: flex;
  align-items: center;

  gap: 16px;

  padding: 22px;

  border: 1px solid #e5e7eb;
  border-radius: 18px;

  background: #ffffff;
}


.account-avatar {
  flex: 0 0 auto;

  width: 64px;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #15803d;

  color: #ffffff;

  font-size: 20px;
  font-weight: 800;
}


.account-user {
  min-width: 0;
}


.account-eyebrow {
  margin: 0 0 3px;

  color: #15803d;

  font-size: 12px;
  font-weight: 700;
}


.account-name {
  margin: 0;

  color: #1f2937;

  font-size: 22px;
  font-weight: 800;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.account-phone {
  margin: 5px 0 0;

  color: #6b7280;

  font-size: 13px;

  text-align: right;
}


/* =========================================
   Cards
========================================= */

.account-card {
  padding: 22px;

  border: 1px solid #e5e7eb;
  border-radius: 18px;

  background: #ffffff;
}


.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  margin-bottom: 20px;

  color: #15803d;
}


.section-heading h2 {
  margin: 0;

  color: #1f2937;

  font-size: 17px;
  font-weight: 800;
}


.section-heading p {
  margin: 5px 0 0;

  color: #6b7280;

  font-size: 13px;
}


/* =========================================
   Information
========================================= */

.info-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 12px;
}


.info-item {
  min-width: 0;

  padding: 14px 16px;

  border: 1px solid #e5e7eb;
  border-radius: 12px;

  background: #f9fafb;
}


.info-label {
  display: block;

  margin-bottom: 7px;

  color: #6b7280;

  font-size: 12px;
}


.info-item strong {
  display: block;

  color: #374151;

  font-size: 14px;
  font-weight: 700;

  overflow-wrap: anywhere;
}


.ltr-value {
  text-align: right;
}


.account-status {
  padding: 20px;

  border-radius: 12px;

  background: #f9fafb;

  color: #6b7280;

  text-align: center;

  font-size: 14px;
}


.account-status--error {
  color: #b91c1c;

  background: #fef2f2;
}


/* =========================================
   Menu
========================================= */

.account-menu {
  display: flex;
  flex-direction: column;
}


.account-menu__item {
  display: flex;
  align-items: center;

  min-height: 70px;

  padding: 12px 4px;

  border-bottom: 1px solid #f3f4f6;

  color: inherit;

  text-decoration: none;

  transition:
    background 0.18s ease,
    color 0.18s ease;
}


.account-menu__item:last-child {
  border-bottom: 0;
}


a.account-menu__item:hover {
  color: #15803d;
}


.account-menu__icon {
  flex: 0 0 auto;

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: 12px;

  border-radius: 12px;

  background: #f0fdf4;

  color: #15803d;
}


.account-menu__content {
  min-width: 0;

  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 4px;
}


.account-menu__content strong {
  color: #374151;

  font-size: 14px;
  font-weight: 700;
}


.account-menu__content small {
  color: #9ca3af;

  font-size: 12px;
}


.account-menu__arrow {
  flex: 0 0 auto;

  color: #9ca3af;
}


.account-menu__item--disabled {
  opacity: 0.65;

  cursor: default;
}


.coming-soon {
  flex: 0 0 auto;

  padding: 4px 8px;

  border-radius: 999px;

  background: #f3f4f6;

  color: #6b7280;

  font-size: 10px;
  font-weight: 600;
}


/* =========================================
   Logout
========================================= */

.logout-button {
  width: 100%;

  min-height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  border: 1px solid #fecaca;
  border-radius: 12px;

  background: #fff;

  color: #b91c1c;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.18s ease,
    border-color 0.18s ease;
}


.logout-button:hover {
  background: #fef2f2;

  border-color: #fca5a5;
}


.logout-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


/* =========================================
   Mobile
========================================= */

@media (max-width: 640px) {
  .account-page {
    padding:
      12px
      10px
      24px;
  }


  .account-container {
    gap: 12px;
  }


  .account-header {
    padding: 16px;

    border-radius: 14px;
  }


  .account-avatar {
    width: 54px;
    height: 54px;

    font-size: 17px;
  }


  .account-name {
    font-size: 18px;
  }


  .account-card {
    padding: 16px;

    border-radius: 14px;
  }


  .info-grid {
    grid-template-columns: 1fr;
  }


  .account-menu__item {
    min-height: 66px;
  }


  .account-menu__content small {
    font-size: 11px;
  }
}
</style>
