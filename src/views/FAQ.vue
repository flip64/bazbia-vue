<template>
  <main class="faq-page">
    <!-- Hero -->
    <section class="faq-hero">
      <div class="faq-hero__shape faq-hero__shape--one"></div>
      <div class="faq-hero__shape faq-hero__shape--two"></div>

      <div class="faq-container faq-hero__content">
        <span class="faq-hero__badge">
          مرکز راهنمای بازبیا
        </span>

        <h1 class="faq-hero__title">
          پرسش‌های
          <span>متداول</span>
        </h1>

        <p class="faq-hero__description">
          پاسخ سریع سؤال‌های رایج درباره حساب کاربری، سفارش،
          پرداخت، ارسال و مرجوعی کالا را اینجا پیدا کنید.
        </p>

        <div class="faq-search">
          <svg
            class="faq-search__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="16.5" y1="16.5" x2="21" y2="21"></line>
          </svg>

          <input
            v-model.trim="searchQuery"
            type="search"
            placeholder="سؤال خود را جست‌وجو کنید..."
            aria-label="جست‌وجوی پرسش‌های متداول"
          >

          <button
            v-if="searchQuery"
            type="button"
            class="faq-search__clear"
            aria-label="پاک‌کردن جست‌وجو"
            @click="searchQuery = ''"
          >
            ×
          </button>
        </div>
      </div>
    </section>

    <div class="faq-container">
      <!-- Categories -->
      <section class="faq-navigation">
        <div class="faq-categories">
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            class="faq-category"
            :class="{
              'faq-category--active':
                activeCategory === category.id
            }"
            @click="selectCategory(category.id)"
          >
            <span class="faq-category__icon">
              {{ category.icon }}
            </span>

            <span>
              {{ category.name }}
            </span>

            <small>
              {{ getCategoryCount(category.id) }}
            </small>
          </button>
        </div>
      </section>

      <!-- Main FAQ -->
      <section class="faq-main">
        <div class="faq-main__header">
          <div>
            <span class="section-eyebrow">
              راهنمای خرید
            </span>

            <h2 class="section-title">
              {{ activeCategoryTitle }}
            </h2>

            <p class="section-description">
              روی هر سؤال بزنید تا پاسخ آن نمایش داده شود.
            </p>
          </div>

          <span class="faq-result-count">
            {{ filteredFaqs.length }} سؤال
          </span>
        </div>

        <div
          v-if="filteredFaqs.length"
          class="faq-list"
        >
          <article
            v-for="faq in filteredFaqs"
            :key="faq.id"
            class="faq-item"
            :class="{
              'faq-item--open': openItem === faq.id
            }"
          >
            <button
              type="button"
              class="faq-question"
              :aria-expanded="openItem === faq.id"
              :aria-controls="`faq-answer-${faq.id}`"
              @click="toggleFaq(faq.id)"
            >
              <span class="faq-question__content">
                <span class="faq-question__number">
                  {{ toPersianNumber(faq.id) }}
                </span>

                <span class="faq-question__text">
                  {{ faq.question }}
                </span>
              </span>

              <span class="faq-question__icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <line
                    v-if="openItem !== faq.id"
                    x1="12"
                    y1="5"
                    x2="12"
                    y2="19"
                  ></line>
                </svg>
              </span>
            </button>

            <Transition name="faq-expand">
              <div
                v-if="openItem === faq.id"
                :id="`faq-answer-${faq.id}`"
                class="faq-answer"
              >
                <div class="faq-answer__inner">
                  <span class="faq-answer__label">
                    پاسخ بازبیا
                  </span>

                  <p>
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </Transition>
          </article>
        </div>

        <div
          v-else
          class="faq-empty"
        >
          <div class="faq-empty__icon">
            🔍
          </div>

          <h3>
            نتیجه‌ای پیدا نشد
          </h3>

          <p>
            عبارت جست‌وجو یا دسته‌بندی دیگری را امتحان کنید.
          </p>

          <button
            type="button"
            @click="resetFilters"
          >
            نمایش همه سؤال‌ها
          </button>
        </div>
      </section>

      <!-- Quick help -->
      <section class="quick-help">
        <article class="quick-help__card">
          <div class="quick-help__icon">
            📦
          </div>

          <div>
            <h3>
              پیگیری سفارش
            </h3>

            <p>
              وضعیت سفارش خود را از بخش حساب کاربری بررسی کنید.
            </p>
          </div>

          <RouterLink to="/user/orders">
            سفارش‌های من
          </RouterLink>
        </article>

        <article class="quick-help__card">
          <div class="quick-help__icon">
            💳
          </div>

          <div>
            <h3>
              مشکل پرداخت
            </h3>

            <p>
              در صورت کسر وجه و ثبت‌نشدن سفارش با پشتیبانی تماس بگیرید.
            </p>
          </div>

          <RouterLink to="/contact">
            ثبت درخواست
          </RouterLink>
        </article>

        <article class="quick-help__card">
          <div class="quick-help__icon">
            📞
          </div>

          <div>
            <h3>
              پشتیبانی تلفنی
            </h3>

            <p>
              شنبه تا پنجشنبه از ساعت ۹ تا ۲۱ پاسخ‌گوی شما هستیم.
            </p>
          </div>

          <a href="tel:+989224274970">
            ۰۹۲۲۴۲۷۴۹۷۰
          </a>
        </article>
      </section>

      <!-- Contact -->
      <section class="faq-contact">
        <div class="faq-contact__content">
          <span class="faq-contact__badge">
            نیاز به راهنمایی بیشتر دارید؟
          </span>

          <h2 class="faq-contact__title">
            پاسخ سؤال خود را پیدا نکردید؟
          </h2>

          <p class="faq-contact__description">
            تیم پشتیبانی بازبیا آماده است تا مشکل شما را بررسی کند
            و در سریع‌ترین زمان ممکن پاسخ دهد.
          </p>
        </div>

        <div class="faq-contact__actions">
          <RouterLink
            to="/contact"
            class="faq-contact__button faq-contact__button--primary"
          >
            ارسال پیام
          </RouterLink>

          <a
            href="tel:+989224274970"
            class="faq-contact__button faq-contact__button--secondary"
          >
            تماس با پشتیبانی
          </a>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type CategoryId =
  | 'all'
  | 'account'
  | 'order'
  | 'payment'
  | 'shipping'
  | 'return'

interface CategoryItem {
  id: CategoryId
  name: string
  icon: string
}

interface FaqItem {
  id: number
  category: Exclude<CategoryId, 'all'>
  question: string
  answer: string
}

const activeCategory = ref<CategoryId>('all')
const openItem = ref<number | null>(null)
const searchQuery = ref('')

const categories: CategoryItem[] = [
  {
    id: 'all',
    name: 'همه سؤال‌ها',
    icon: '✨'
  },
  {
    id: 'account',
    name: 'حساب کاربری',
    icon: '👤'
  },
  {
    id: 'order',
    name: 'سفارش‌ها',
    icon: '🛍️'
  },
  {
    id: 'payment',
    name: 'پرداخت',
    icon: '💳'
  },
  {
    id: 'shipping',
    name: 'ارسال',
    icon: '🚚'
  },
  {
    id: 'return',
    name: 'مرجوعی',
    icon: '↩️'
  }
]

const faqs: FaqItem[] = [
  {
    id: 1,
    category: 'account',
    question: 'چگونه در بازبیا ثبت‌نام کنم؟',
    answer:
      'از بخش ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید. پس از دریافت و تأیید کد یک‌بارمصرف، حساب کاربری شما فعال می‌شود.'
  },
  {
    id: 2,
    category: 'account',
    question: 'چگونه وارد حساب کاربری خود شوم؟',
    answer:
      'شماره موبایلی را که هنگام ثبت‌نام استفاده کرده‌اید وارد کنید. اگر برای حساب شما رمز عبور تعریف شده باشد با رمز وارد می‌شوید؛ در غیر این صورت کد تأیید برای شما ارسال می‌شود.'
  },
  {
    id: 3,
    category: 'account',
    question: 'چگونه اطلاعات و آدرس خود را ویرایش کنم؟',
    answer:
      'پس از ورود، وارد بخش حساب کاربری شوید. در قسمت پروفایل و آدرس‌ها می‌توانید اطلاعات شخصی، شماره تماس و نشانی‌های خود را اضافه یا ویرایش کنید.'
  },
  {
    id: 4,
    category: 'order',
    question: 'چگونه سفارش خود را ثبت کنم؟',
    answer:
      'محصول موردنظر را به سبد خرید اضافه کنید، وارد مرحله تسویه‌حساب شوید، آدرس و روش ارسال را انتخاب کنید و پس از بررسی مبلغ نهایی، پرداخت را انجام دهید.'
  },
  {
    id: 5,
    category: 'order',
    question: 'چگونه وضعیت سفارش را پیگیری کنم؟',
    answer:
      'وارد حساب کاربری شوید و بخش سفارش‌های من را باز کنید. وضعیت فعلی سفارش، مبلغ، اقلام خریداری‌شده و اطلاعات ارسال در آن بخش نمایش داده می‌شود.'
  },
  {
    id: 6,
    category: 'order',
    question: 'آیا امکان لغو سفارش وجود دارد؟',
    answer:
      'تا زمانی که سفارش وارد مرحله آماده‌سازی یا ارسال نشده باشد، ممکن است امکان لغو وجود داشته باشد. برای بررسی سریع وضعیت، از بخش سفارش‌ها یا پشتیبانی بازبیا اقدام کنید.'
  },
  {
    id: 7,
    category: 'payment',
    question: 'پرداخت سفارش چگونه انجام می‌شود؟',
    answer:
      'پرداخت سفارش به‌صورت آنلاین و از طریق درگاه امن بانکی انجام می‌شود. تمام کارت‌های عضو شبکه شتاب که رمز پویا دارند قابل استفاده هستند.'
  },
  {
    id: 8,
    category: 'payment',
    question: 'وجه از حسابم کم شده ولی سفارش ثبت نشده است؛ چه کنم؟',
    answer:
      'ابتدا چند دقیقه صبر کنید و بخش سفارش‌های من را بررسی کنید. اگر سفارش ثبت نشده بود، معمولاً مبلغ طبق روال بانکی بازگردانده می‌شود. همچنین می‌توانید مشخصات تراکنش را برای پشتیبانی ارسال کنید.'
  },
  {
    id: 9,
    category: 'payment',
    question: 'آیا پرداخت در محل امکان‌پذیر است؟',
    answer:
      'در حال حاضر روش اصلی پرداخت در بازبیا، پرداخت آنلاین از طریق درگاه بانکی است. در صورت فعال‌شدن پرداخت در محل، این گزینه هنگام تسویه‌حساب نمایش داده می‌شود.'
  },
  {
    id: 10,
    category: 'shipping',
    question: 'هزینه ارسال چگونه محاسبه می‌شود؟',
    answer:
      'هزینه ارسال بر اساس مقصد، روش ارسال، وزن، ابعاد و تعداد بسته‌های سفارش محاسبه می‌شود. مبلغ دقیق پیش از پرداخت در صفحه تسویه‌حساب نمایش داده خواهد شد.'
  },
  {
    id: 11,
    category: 'shipping',
    question: 'سفارش چه زمانی ارسال می‌شود؟',
    answer:
      'زمان آماده‌سازی و ارسال به موجودی کالا، مقصد و روش حمل بستگی دارد. پس از تحویل سفارش به شرکت حمل، اطلاعات رهگیری در اختیار شما قرار می‌گیرد.'
  },
  {
    id: 12,
    category: 'shipping',
    question: 'آیا امکان تغییر آدرس پس از ثبت سفارش وجود دارد؟',
    answer:
      'اگر سفارش هنوز وارد مرحله ارسال نشده باشد، برای بررسی امکان تغییر آدرس سریعاً با پشتیبانی تماس بگیرید. پس از ارسال، تغییر نشانی معمولاً امکان‌پذیر نیست.'
  },
  {
    id: 13,
    category: 'return',
    question: 'در چه شرایطی می‌توانم کالا را مرجوع کنم؟',
    answer:
      'در صورت مغایرت کالا با سفارش، آسیب‌دیدگی هنگام تحویل یا وجود ایراد قابل تأیید، درخواست خود را همراه با توضیحات و تصویر کالا برای پشتیبانی ارسال کنید.'
  },
  {
    id: 14,
    category: 'return',
    question: 'برای ثبت درخواست مرجوعی چه اطلاعاتی لازم است؟',
    answer:
      'شماره سفارش، نام کالا، دلیل مرجوعی و در صورت امکان تصاویر بسته‌بندی و مشکل کالا را ارسال کنید تا درخواست سریع‌تر بررسی شود.'
  },
  {
    id: 15,
    category: 'return',
    question: 'هزینه بازگرداندن کالا بر عهده چه کسی است؟',
    answer:
      'اگر مغایرت یا ایراد کالا از طرف فروشگاه تأیید شود، هزینه بازگشت مطابق نتیجه بررسی بر عهده فروشگاه خواهد بود. در سایر موارد شرایط به‌صورت جداگانه اعلام می‌شود.'
  }
]

const normalizedSearchQuery = computed(() => {
  return searchQuery.value
    .trim()
    .toLocaleLowerCase('fa')
})

const filteredFaqs = computed(() => {
  return faqs.filter((faq) => {
    const matchesCategory =
      activeCategory.value === 'all' ||
      faq.category === activeCategory.value

    if (!matchesCategory) {
      return false
    }

    if (!normalizedSearchQuery.value) {
      return true
    }

    const searchableText =
      `${faq.question} ${faq.answer}`
        .toLocaleLowerCase('fa')

    return searchableText.includes(
      normalizedSearchQuery.value
    )
  })
})

const activeCategoryTitle = computed(() => {
  if (searchQuery.value.trim()) {
    return 'نتایج جست‌وجو'
  }

  return categories.find(
    category => category.id === activeCategory.value
  )?.name ?? 'همه سؤال‌ها'
})

const selectCategory = (categoryId: CategoryId): void => {
  activeCategory.value = categoryId
  openItem.value = null
}

const toggleFaq = (id: number): void => {
  openItem.value =
    openItem.value === id
      ? null
      : id
}

const resetFilters = (): void => {
  activeCategory.value = 'all'
  searchQuery.value = ''
  openItem.value = null
}

const getCategoryCount = (
  categoryId: CategoryId
): string => {
  const count =
    categoryId === 'all'
      ? faqs.length
      : faqs.filter(
          faq => faq.category === categoryId
        ).length

  return toPersianNumber(count)
}

const toPersianNumber = (
  value: number
): string => {
  return String(value).replace(
    /\d/g,
    digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]
  )
}

watch(
  () => searchQuery.value,
  () => {
    openItem.value = null
  }
)
</script>

<style scoped>
.faq-page {
  --faq-primary: #059669;
  --faq-primary-dark: #047857;
  --faq-primary-deep: #064e3b;
  --faq-primary-light: #ecfdf5;
  --faq-accent: #f59e0b;
  --faq-text: #1f2937;
  --faq-muted: #6b7280;
  --faq-border: #e5e7eb;
  --faq-surface: #ffffff;
  --faq-background: #f8fafc;

  min-height: 100vh;
  overflow: hidden;
  direction: rtl;
  color: var(--faq-text);
  background:
    radial-gradient(
      circle at top right,
      rgba(5, 150, 105, 0.07),
      transparent 28rem
    ),
    var(--faq-background);
}

.faq-container {
  width: min(1050px, calc(100% - 32px));
  margin: 0 auto;
}

/* Hero */
.faq-hero {
  position: relative;
  isolation: isolate;
  min-height: 450px;
  overflow: hidden;
  display: flex;
  align-items: center;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      var(--faq-primary-deep) 0%,
      var(--faq-primary-dark) 52%,
      var(--faq-primary) 100%
    );
}

.faq-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image:
    linear-gradient(
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px
    );
  background-size: 44px 44px;
}

.faq-hero__shape {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
}

.faq-hero__shape--one {
  width: 370px;
  height: 370px;
  top: -190px;
  left: -90px;
  background: rgba(255, 255, 255, 0.08);
}

.faq-hero__shape--two {
  width: 270px;
  height: 270px;
  right: 5%;
  bottom: -165px;
  background: rgba(245, 158, 11, 0.16);
}

.faq-hero__content {
  padding-top: 70px;
  padding-bottom: 70px;
  text-align: center;
}

.faq-hero__badge {
  display: inline-flex;
  margin-bottom: 18px;
  padding: 8px 15px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  font-weight: 900;
  backdrop-filter: blur(8px);
}

.faq-hero__title {
  margin: 0;
  font-size: clamp(2.4rem, 7vw, 4.4rem);
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: -0.045em;
}

.faq-hero__title span {
  color: #fbbf24;
}

.faq-hero__description {
  max-width: 700px;
  margin: 20px auto 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.02rem;
  line-height: 2;
}

.faq-search {
  position: relative;
  width: min(650px, 100%);
  margin: 32px auto 0;
}

.faq-search input {
  width: 100%;
  min-height: 58px;
  box-sizing: border-box;
  padding: 0 52px 0 46px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 17px;
  color: var(--faq-text);
  background: #ffffff;
  font: inherit;
  font-size: 0.96rem;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.17);
}

.faq-search input:focus {
  outline: none;
  border-color: #fbbf24;
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.17),
    0 0 0 4px rgba(251, 191, 36, 0.18);
}

.faq-search__icon {
  position: absolute;
  top: 50%;
  right: 18px;
  width: 21px;
  height: 21px;
  transform: translateY(-50%);
  fill: none;
  stroke: var(--faq-primary);
  stroke-width: 2;
  stroke-linecap: round;
}

.faq-search__clear {
  position: absolute;
  top: 50%;
  left: 13px;
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  transform: translateY(-50%);
  border: 0;
  border-radius: 50%;
  color: var(--faq-muted);
  background: #f3f4f6;
  font-size: 1.3rem;
  cursor: pointer;
}

/* Categories */
.faq-navigation {
  padding: 55px 0 24px;
}

.faq-categories {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.faq-category {
  min-height: 105px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 14px 10px;
  border: 1px solid var(--faq-border);
  border-radius: 17px;
  color: var(--faq-muted);
  background: var(--faq-surface);
  font: inherit;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.faq-category:hover {
  transform: translateY(-3px);
  border-color: rgba(5, 150, 105, 0.35);
  color: var(--faq-primary-dark);
}

.faq-category--active {
  border-color: var(--faq-primary);
  color: #ffffff;
  background:
    linear-gradient(
      145deg,
      var(--faq-primary-dark),
      var(--faq-primary)
    );
  box-shadow: 0 13px 26px rgba(5, 150, 105, 0.2);
}

.faq-category__icon {
  font-size: 1.55rem;
}

.faq-category span:not(.faq-category__icon) {
  font-size: 0.83rem;
  font-weight: 900;
}

.faq-category small {
  color: inherit;
  font-size: 0.72rem;
  opacity: 0.75;
}

/* Shared */
.section-eyebrow {
  display: inline-block;
  margin-bottom: 8px;
  color: var(--faq-primary);
  font-size: 0.82rem;
  font-weight: 900;
}

.section-title {
  margin: 0;
  color: var(--faq-text);
  font-size: clamp(1.55rem, 4vw, 2.15rem);
  font-weight: 900;
}

.section-description {
  margin: 10px 0 0;
  color: var(--faq-muted);
  line-height: 1.9;
}

/* FAQ */
.faq-main {
  padding: 35px 0 65px;
}

.faq-main__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}

.faq-result-count {
  flex: 0 0 auto;
  padding: 8px 13px;
  border-radius: 999px;
  color: var(--faq-primary-dark);
  background: var(--faq-primary-light);
  font-size: 0.8rem;
  font-weight: 900;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.faq-item {
  overflow: hidden;
  border: 1px solid var(--faq-border);
  border-radius: 17px;
  background: var(--faq-surface);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.035);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.faq-item--open {
  border-color: rgba(5, 150, 105, 0.38);
  box-shadow: 0 15px 36px rgba(5, 150, 105, 0.08);
}

.faq-question {
  width: 100%;
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 20px;
  border: 0;
  color: var(--faq-text);
  background: transparent;
  font: inherit;
  text-align: right;
  cursor: pointer;
}

.faq-question__content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.faq-question__number {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: var(--faq-primary-dark);
  background: var(--faq-primary-light);
  font-size: 0.78rem;
  font-weight: 900;
}

.faq-item--open .faq-question__number {
  color: #ffffff;
  background: var(--faq-primary);
}

.faq-question__text {
  font-weight: 900;
  line-height: 1.8;
}

.faq-question__icon {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--faq-primary);
  background: var(--faq-primary-light);
}

.faq-question__icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.faq-answer {
  overflow: hidden;
}

.faq-answer__inner {
  margin: 0 20px 20px;
  padding: 18px 20px;
  border-right: 3px solid var(--faq-primary);
  border-radius: 12px 0 0 12px;
  background: #f9fafb;
}

.faq-answer__label {
  display: inline-block;
  margin-bottom: 7px;
  color: var(--faq-primary-dark);
  font-size: 0.77rem;
  font-weight: 900;
}

.faq-answer p {
  margin: 0;
  color: var(--faq-muted);
  line-height: 2;
}

/* Animation */
.faq-expand-enter-active,
.faq-expand-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.faq-expand-enter-from,
.faq-expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Empty */
.faq-empty {
  padding: 55px 25px;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
  background: var(--faq-surface);
  text-align: center;
}

.faq-empty__icon {
  font-size: 2.8rem;
}

.faq-empty h3 {
  margin: 14px 0 0;
  font-size: 1.25rem;
}

.faq-empty p {
  margin: 8px 0 20px;
  color: var(--faq-muted);
}

.faq-empty button {
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  color: #ffffff;
  background: var(--faq-primary);
  font: inherit;
  font-weight: 900;
  cursor: pointer;
}

/* Quick help */
.quick-help {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 15px 0 70px;
}

.quick-help__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 220px;
  padding: 24px;
  border: 1px solid var(--faq-border);
  border-radius: 19px;
  background: var(--faq-surface);
}

.quick-help__icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  border-radius: 15px;
  background: var(--faq-primary-light);
  font-size: 1.55rem;
}

.quick-help h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 900;
}

.quick-help p {
  flex: 1;
  margin: 9px 0 18px;
  color: var(--faq-muted);
  line-height: 1.85;
}

.quick-help a {
  color: var(--faq-primary-dark);
  font-size: 0.85rem;
  font-weight: 900;
  text-decoration: none;
}

/* Contact */
.faq-contact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 85px;
  padding: 42px;
  overflow: hidden;
  border-radius: 27px;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      var(--faq-primary-deep),
      var(--faq-primary)
    );
}

.faq-contact__badge {
  display: inline-block;
  margin-bottom: 9px;
  color: #fbbf24;
  font-size: 0.8rem;
  font-weight: 900;
}

.faq-contact__title {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2.1rem);
  font-weight: 900;
}

.faq-contact__description {
  max-width: 600px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.9;
}

.faq-contact__actions {
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.faq-contact__button {
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 21px;
  border: 1px solid transparent;
  border-radius: 13px;
  font-weight: 900;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.faq-contact__button:hover {
  transform: translateY(-2px);
}

.faq-contact__button--primary {
  color: var(--faq-primary-dark);
  background: #ffffff;
}

.faq-contact__button--secondary {
  border-color: rgba(255, 255, 255, 0.27);
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

/* Responsive */
@media (max-width: 900px) {
  .faq-categories {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .quick-help {
    grid-template-columns: 1fr;
  }

  .quick-help__card {
    min-height: auto;
  }

  .faq-contact {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .faq-container {
    width: min(100% - 24px, 1050px);
  }

  .faq-hero {
    min-height: 420px;
  }

  .faq-hero__content {
    padding-top: 55px;
    padding-bottom: 55px;
  }

  .faq-hero__description {
    font-size: 0.92rem;
  }

  .faq-categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .faq-main__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .faq-question {
    padding: 15px;
  }

  .faq-question__number {
    display: none;
  }

  .faq-answer__inner {
    margin-right: 15px;
    margin-left: 15px;
    padding: 15px;
  }

  .faq-contact {
    padding: 30px 22px;
  }

  .faq-contact__actions,
  .faq-contact__button {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .faq-categories {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-page *,
  .faq-page *::before,
  .faq-page *::after {
    scroll-behavior: auto !important;
    animation: none !important;
    transition: none !important;
  }
}
</style>
