<template>
  <div class="account-page">
    <div class="account-container">

      <!-- =====================================
           وضعیت بارگذاری
      ====================================== -->
      <div
        v-if="loadingProfile"
        class="account-loading"
      >
        <div class="loading-spinner"></div>

        <span>
          در حال دریافت اطلاعات حساب...
        </span>
      </div>


      <!-- =====================================
           خطا
      ====================================== -->
      <div
        v-else-if="profileError"
        class="account-error"
      >
        <CircleAlert
          :size="28"
          :stroke-width="1.8"
        />

        <div>
          <strong>
            دریافت اطلاعات حساب انجام نشد
          </strong>

          <p>
            {{ profileError }}
          </p>
        </div>

        <button
          type="button"
          class="retry-button"
          @click="loadProfile"
        >
          تلاش دوباره
        </button>
      </div>


      <template v-else>

        <!-- =====================================
             Header
        ====================================== -->
        <section class="account-header">

          <div class="account-avatar">
            <img
              v-if="user?.avatar"
              :src="user.avatar"
              :alt="displayName"
              class="account-avatar__image"
            >

            <span v-else>
              {{ userInitials }}
            </span>
          </div>


          <div class="account-user">

            <p class="account-eyebrow">
              حساب کاربری
            </p>

            <h1 class="account-name">
              {{ displayName }}
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


        <!-- =====================================
             اطلاعات حساب
        ====================================== -->
        <section class="account-card">

          <div class="section-heading">

            <div>
              <h2>
                اطلاعات حساب
              </h2>

              <p>
                اطلاعات ثبت‌شده در حساب کاربری شما
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

            <!-- نام -->
            <div class="info-item">

              <span class="info-label">
                نام
              </span>

              <strong>
                {{ firstName || 'ثبت نشده' }}
              </strong>

            </div>


            <!-- نام خانوادگی -->
            <div class="info-item">

              <span class="info-label">
                نام خانوادگی
              </span>

              <strong>
                {{ lastName || 'ثبت نشده' }}
              </strong>

            </div>


            <!-- شماره موبایل -->
            <div class="info-item">

              <span class="info-label">
                شماره موبایل
              </span>

              <strong
                class="ltr-value"
                dir="ltr"
              >
                {{ user.phone || 'ثبت نشده' }}
              </strong>

            </div>


            <!-- ایمیل -->
            <div class="info-item">

              <span class="info-label">
                ایمیل
              </span>

              <strong
                class="ltr-value"
                dir="ltr"
              >
                {{ user.email || 'ثبت نشده' }}
              </strong>

            </div>

          </div>

        </section>


        <!-- =====================================
             مدیریت حساب
        ====================================== -->
        <section class="account-card">

          <div class="section-heading">

            <div>
              <h2>
                مدیریت حساب
              </h2>

              <p>
                دسترسی سریع به بخش‌های حساب کاربری
              </p>
            </div>

          </div>


          <div class="account-menu">

            <!-- ================= سفارش‌ها ================= -->
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


            <!-- ================= علاقه‌مندی‌ها ================= -->
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


            <!-- ================= آدرس‌ها ================= -->
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


            <!-- ================= امنیت ================= -->
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


        <!-- =====================================
             خروج
        ====================================== -->
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

      </template>

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
  CircleAlert,
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


/* =========================================
   Store / Router
========================================= */

const router = useRouter()

const authStore = useAuthStore()


const {
  user,
  userName,
  userInitials
} = storeToRefs(authStore)


/* =========================================
   State
========================================= */

const loadingProfile = ref(true)

const profileError = ref('')


/* =========================================
   Display name
========================================= */

const displayName = computed(() => {

  if (user.value?.full_name?.trim()) {
    return user.value.full_name.trim()
  }

  const fullName = [
    user.value?.first_name,
    user.value?.last_name
  ]
    .filter(Boolean)
    .join(' ')
    .trim()


  if (fullName) {
    return fullName
  }


  return userName.value || 'کاربر بازبیا'
})


/* =========================================
   First name
========================================= */

const firstName = computed(() => {

  if (user.value?.first_name?.trim()) {
    return user.value.first_name.trim()
  }


  if (user.value?.full_name?.trim()) {

    const parts =
      user.value.full_name
        .trim()
        .split(/\s+/)


    return parts[0] || ''
  }


  return ''
})


/* =========================================
   Last name
========================================= */

const lastName = computed(() => {

  if (user.value?.last_name?.trim()) {
    return user.value.last_name.trim()
  }


  if (user.value?.full_name?.trim()) {

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
   Load profile from backend
========================================= */

async function loadProfile() {

  loadingProfile.value = true

  profileError.value = ''


  try {

    const profile =
      await authStore.fetchUserProfile()


    if (!profile) {

      profileError.value =
        'اطلاعات پروفایل از سرور دریافت نشد.'

      return
    }


    console.log(
      '✅ پروفایل از بک‌اند دریافت شد:',
      profile
    )

  } catch (error) {

    console.error(
      '❌ خطا در دریافت پروفایل:',
      error
    )


    profileError.value =
      'ارتباط با سرور برای دریافت اطلاعات حساب برقرار نشد.'

  } finally {

    loadingProfile.value = false

  }
}


/* =========================================
   Mount
========================================= */

onMounted(async () => {

  /*
   * عمداً شرط
   *
   * if (user.value) return
   *
   * اینجا وجود ندارد.
   *
   * بنابراین هر بار صفحه پروفایل باز شود
   * اطلاعات تازه از بک‌اند دریافت می‌شود.
   */

  await loadProfile()

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

/* =========================================
   Page
========================================= */

.account-page {
  min-height: 70vh;

  padding:
    24px
    16px
    40px;

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
   Loading
========================================= */

.account-loading {
  min-height: 250px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 14px;

  color: #6b7280;

  font-size: 14px;
}


.loading-spinner {
  width: 36px;
  height: 36px;

  border:
    3px solid
    #dcfce7;

  border-top-color:
    #15803d;

  border-radius: 50%;

  animation:
    account-spin
    0.8s
    linear
    infinite;
}


@keyframes account-spin {

  to {
    transform: rotate(360deg);
  }

}


/* =========================================
   Error
========================================= */

.account-error {
  display: flex;
  align-items: center;

  gap: 14px;

  padding: 20px;

  border:
    1px solid
    #fecaca;

  border-radius: 14px;

  background: #fef2f2;

  color: #b91c1c;
}


.account-error div {
  flex: 1;
}


.account-error strong {
  display: block;

  margin-bottom: 4px;
}


.account-error p {
  margin: 0;

  color: #7f1d1d;

  font-size: 13px;
}


.retry-button {
  flex: 0 0 auto;

  padding:
    8px
    14px;

  border: 0;
  border-radius: 9px;

  background: #b91c1c;

  color: #fff;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
}


/* =========================================
   Header
========================================= */

.account-header {
  display: flex;
  align-items: center;

  gap: 16px;

  padding: 22px;

  border:
    1px solid
    #e5e7eb;

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

  overflow: hidden;

  border-radius: 50%;

  background: #15803d;

  color: #ffffff;

  font-size: 20px;
  font-weight: 800;
}


.account-avatar__image {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


.account-user {
  min-width: 0;
}


.account-eyebrow {
  margin:
    0
    0
    3px;

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
  margin:
    5px
    0
    0;

  color: #6b7280;

  font-size: 13px;

  text-align: right;
}


/* =========================================
   Cards
========================================= */

.account-card {
  padding: 22px;

  border:
    1px solid
    #e5e7eb;

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
  margin:
    5px
    0
    0;

  color: #6b7280;

  font-size: 13px;
}


/* =========================================
   Information
========================================= */

.info-grid {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 12px;
}


.info-item {
  min-width: 0;

  padding:
    14px
    16px;

  border:
    1px solid
    #e5e7eb;

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

  padding:
    12px
    4px;

  border-bottom:
    1px solid
    #f3f4f6;

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

  padding:
    4px
    8px;

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

  border:
    1px solid
    #fecaca;

  border-radius: 12px;

  background: #ffffff;

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


  .account-error {
    flex-wrap: wrap;
  }


  .retry-button {
    width: 100%;
  }

}
</style>
