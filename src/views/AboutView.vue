<template>
  <main class="about-page">
    <!-- Hero -->
    <section class="about-hero">
      <div class="about-hero__shape about-hero__shape--one"></div>
      <div class="about-hero__shape about-hero__shape--two"></div>

      <div class="about-container about-hero__content">
        <span class="about-hero__badge">
          درباره فروشگاه بازبیا
        </span>

        <h1 class="about-hero__title">
          بازبیا؛
          <span>انتخابی که تکرار می‌کنید</span>
        </h1>

        <p class="about-hero__description">
          ما در بازبیا تلاش می‌کنیم تجربه‌ای ساده، مطمئن و لذت‌بخش
          از خرید اینترنتی برای شما بسازیم؛ از انتخاب محصول تا
          پرداخت، ارسال و پشتیبانی پس از خرید.
        </p>

        <div class="about-hero__actions">
          <RouterLink
            to="/products"
            class="hero-button hero-button--primary"
          >
            مشاهده محصولات
          </RouterLink>

          <RouterLink
            to="/contact"
            class="hero-button hero-button--secondary"
          >
            ارتباط با ما
          </RouterLink>
        </div>
      </div>
    </section>

    <div class="about-container">
      <!-- Story -->
      <section class="story-section">
        <div class="story-section__content">
          <span class="section-eyebrow">
            داستان بازبیا
          </span>

          <h2 class="section-title">
            فروشگاهی برای خرید دوباره و دوباره
          </h2>

          <p class="story-text">
            بازبیا با هدف ایجاد یک فروشگاه اینترنتی قابل اعتماد شکل
            گرفت؛ فروشگاهی که در آن انتخاب محصول، بررسی قیمت، ثبت
            سفارش و دریافت کالا ساده، شفاف و قابل پیگیری باشد.
          </p>

          <p class="story-text">
            تمرکز ما فقط روی فروش نیست. ما تلاش می‌کنیم اطلاعات
            محصولات را دقیق ارائه کنیم، قیمت‌ها را منصفانه نگه داریم،
            سفارش‌ها را با دقت آماده کنیم و در تمام مراحل خرید پاسخ‌گوی
            مشتریان باشیم.
          </p>

          <div class="story-features">
            <div class="story-feature">
              <span class="story-feature__icon">✓</span>

              <div>
                <strong>اطلاعات شفاف محصولات</strong>
                <small>مشخصات، قیمت و موجودی به‌روز</small>
              </div>
            </div>

            <div class="story-feature">
              <span class="story-feature__icon">✓</span>

              <div>
                <strong>خرید آسان و امن</strong>
                <small>ثبت سفارش و پرداخت مطمئن</small>
              </div>
            </div>

            <div class="story-feature">
              <span class="story-feature__icon">✓</span>

              <div>
                <strong>پشتیبانی واقعی</strong>
                <small>همراهی قبل و بعد از خرید</small>
              </div>
            </div>
          </div>
        </div>

        <div class="story-visual">
          <div class="story-visual__main">
            <div class="brand-mark">
              <span class="brand-mark__name">
                بازبیا
              </span>

              <span class="brand-mark__slogan">
                جایی برای خرید دوباره و دوباره
              </span>
            </div>

            <div class="shopping-illustration">
              <div class="shopping-bag">
                <span>ب</span>
              </div>

              <div class="shopping-box shopping-box--one"></div>
              <div class="shopping-box shopping-box--two"></div>
            </div>
          </div>

          <div class="story-floating-card story-floating-card--top">
            <span class="floating-card__icon">🛡️</span>

            <div>
              <strong>خرید مطمئن</strong>
              <small>پرداخت امن و پیگیری سفارش</small>
            </div>
          </div>

          <div class="story-floating-card story-floating-card--bottom">
            <span class="floating-card__icon">📦</span>

            <div>
              <strong>ارسال منظم</strong>
              <small>بسته‌بندی دقیق سفارش‌ها</small>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="stats-section">
        <div class="section-heading">
          <span class="section-eyebrow">
            بازبیا در یک نگاه
          </span>

          <h2 class="section-title">
            هر روز در مسیر بهترشدن
          </h2>

          <p class="section-description">
            این مسیر با اعتماد مشتریان و تلاش برای بهبود مستمر ادامه
            پیدا می‌کند.
          </p>
        </div>

        <div class="stats-grid">
          <article
            v-for="stat in stats"
            :key="stat.label"
            class="stat-card"
          >
            <div class="stat-card__icon">
              {{ stat.icon }}
            </div>

            <strong class="stat-card__number">
              {{ stat.number }}
            </strong>

            <span class="stat-card__label">
              {{ stat.label }}
            </span>

            <small class="stat-card__description">
              {{ stat.description }}
            </small>
          </article>
        </div>
      </section>

      <!-- Mission -->
      <section class="mission-section">
        <div class="mission-card mission-card--primary">
          <div class="mission-card__icon">
            🎯
          </div>

          <span class="mission-card__eyebrow">
            مأموریت ما
          </span>

          <h2 class="mission-card__title">
            ساده‌ترکردن خرید اینترنتی
          </h2>

          <p class="mission-card__text">
            هدف ما فراهم‌کردن تجربه‌ای شفاف و قابل اعتماد است تا
            مشتری با آرامش محصول موردنیاز خود را انتخاب و خریداری کند.
          </p>
        </div>

        <div class="mission-card">
          <div class="mission-card__icon">
            👁️
          </div>

          <span class="mission-card__eyebrow">
            چشم‌انداز ما
          </span>

          <h2 class="mission-card__title">
            تبدیل‌شدن به انتخاب همیشگی مشتری
          </h2>

          <p class="mission-card__text">
            می‌خواهیم بازبیا فروشگاهی باشد که مشتری پس از یک تجربه
            خوب، برای خریدهای بعدی دوباره به آن مراجعه کند.
          </p>
        </div>
      </section>

      <!-- Values -->
      <section class="values-section">
        <div class="section-heading">
          <span class="section-eyebrow">
            اصول کاری ما
          </span>

          <h2 class="section-title">
            ارزش‌هایی که بازبیا بر اساس آن‌ها ساخته شده
          </h2>
        </div>

        <div class="values-grid">
          <article
            v-for="value in values"
            :key="value.title"
            class="value-card"
          >
            <div class="value-card__icon">
              {{ value.icon }}
            </div>

            <h3 class="value-card__title">
              {{ value.title }}
            </h3>

            <p class="value-card__text">
              {{ value.description }}
            </p>
          </article>
        </div>
      </section>

      <!-- Process -->
      <section class="process-section">
        <div class="process-section__content">
          <span class="section-eyebrow">
            تجربه خرید
          </span>

          <h2 class="section-title">
            از انتخاب تا دریافت سفارش، همراه شما هستیم
          </h2>

          <p class="section-description">
            فرایند خرید در بازبیا طوری طراحی شده که در هر مرحله
            اطلاعات موردنیاز شما واضح و در دسترس باشد.
          </p>
        </div>

        <div class="process-list">
          <article
            v-for="(step, index) in processSteps"
            :key="step.title"
            class="process-item"
          >
            <div class="process-item__number">
              {{ index + 1 }}
            </div>

            <div class="process-item__content">
              <h3>
                {{ step.title }}
              </h3>

              <p>
                {{ step.description }}
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- Support -->
      <section class="support-section">
        <div class="support-section__content">
          <span class="support-section__eyebrow">
            همراه شما هستیم
          </span>

          <h2 class="support-section__title">
            سؤال یا پیشنهادی دارید؟
          </h2>

          <p class="support-section__text">
            تیم پشتیبانی بازبیا آماده پاسخ‌گویی به سؤال‌ها،
            پیشنهادها و مشکلات شماست.
          </p>
        </div>

        <div class="support-section__actions">
          <RouterLink
            to="/contact"
            class="support-button support-button--primary"
          >
            تماس با بازبیا
          </RouterLink>

          <a
            href="tel:+989224274970"
            class="support-button support-button--secondary"
          >
            ۰۹۲۲۴۲۷۴۹۷۰
          </a>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
interface StatItem {
  icon: string
  number: string
  label: string
  description: string
}

interface ValueItem {
  icon: string
  title: string
  description: string
}

interface ProcessStep {
  title: string
  description: string
}

const stats: StatItem[] = [
  {
    icon: '🛍️',
    number: '+۶۵۰',
    label: 'محصول فروشگاه',
    description: 'تنوع محصولات در دسته‌بندی‌های مختلف'
  },
  {
    icon: '📦',
    number: 'هر روز',
    label: 'پیگیری سفارش‌ها',
    description: 'بررسی و آماده‌سازی منظم سفارش‌ها'
  },
  {
    icon: '💬',
    number: 'پاسخ‌گو',
    label: 'پشتیبانی مشتریان',
    description: 'همراهی در مراحل قبل و بعد از خرید'
  },
  {
    icon: '🔒',
    number: 'امن',
    label: 'پرداخت اینترنتی',
    description: 'پرداخت از طریق درگاه معتبر'
  }
]

const values: ValueItem[] = [
  {
    icon: '🤝',
    title: 'اعتماد',
    description:
      'ساخت رابطه‌ای شفاف و بلندمدت با مشتریان، مهم‌ترین سرمایه ماست.'
  },
  {
    icon: '✨',
    title: 'کیفیت',
    description:
      'در انتخاب، معرفی، بسته‌بندی و ارسال محصولات به کیفیت اهمیت می‌دهیم.'
  },
  {
    icon: '⚖️',
    title: 'قیمت منصفانه',
    description:
      'تلاش می‌کنیم محصولات را با قیمت منطقی و اطلاعات دقیق عرضه کنیم.'
  },
  {
    icon: '💚',
    title: 'مشتری‌مداری',
    description:
      'رضایت و تجربه خوب مشتری، معیار اصلی تصمیم‌گیری‌های ماست.'
  }
]

const processSteps: ProcessStep[] = [
  {
    title: 'انتخاب محصول',
    description:
      'محصولات را بررسی و با توجه به مشخصات، قیمت و موجودی انتخاب می‌کنید.'
  },
  {
    title: 'ثبت سفارش',
    description:
      'آدرس و اطلاعات ارسال را وارد کرده و سفارش خود را ثبت می‌کنید.'
  },
  {
    title: 'پرداخت امن',
    description:
      'پرداخت از طریق درگاه اینترنتی معتبر و امن انجام می‌شود.'
  },
  {
    title: 'بسته‌بندی و ارسال',
    description:
      'سفارش بررسی، بسته‌بندی و برای ارسال به آدرس شما آماده می‌شود.'
  }
]
</script>

<style scoped>
.about-page {
  --about-primary: #059669;
  --about-primary-dark: #047857;
  --about-primary-deep: #064e3b;
  --about-primary-light: #ecfdf5;
  --about-accent: #f59e0b;
  --about-text: #1f2937;
  --about-muted: #6b7280;
  --about-border: #e5e7eb;
  --about-surface: #ffffff;
  --about-background: #f8fafc;

  min-height: 100vh;
  overflow: hidden;
  direction: rtl;
  color: var(--about-text);
  background:
    radial-gradient(
      circle at top right,
      rgba(5, 150, 105, 0.07),
      transparent 28rem
    ),
    var(--about-background);
}

.about-container {
  width: min(1280px, calc(100% - 32px));
  margin: 0 auto;
}

/* Hero */
.about-hero {
  position: relative;
  isolation: isolate;
  min-height: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      var(--about-primary-deep) 0%,
      var(--about-primary-dark) 52%,
      var(--about-primary) 100%
    );
}

.about-hero::before {
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

.about-hero__shape {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
}

.about-hero__shape--one {
  width: 380px;
  height: 380px;
  top: -190px;
  left: -90px;
  background: rgba(255, 255, 255, 0.08);
}

.about-hero__shape--two {
  width: 280px;
  height: 280px;
  right: 5%;
  bottom: -170px;
  background: rgba(245, 158, 11, 0.17);
}

.about-hero__content {
  padding-top: 80px;
  padding-bottom: 80px;
  text-align: center;
}

.about-hero__badge {
  display: inline-flex;
  margin-bottom: 20px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.86rem;
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.about-hero__title {
  max-width: 880px;
  margin: 0 auto;
  font-size: clamp(2.25rem, 7vw, 4.4rem);
  font-weight: 900;
  line-height: 1.35;
  letter-spacing: -0.045em;
}

.about-hero__title span {
  display: block;
  color: #fbbf24;
}

.about-hero__description {
  max-width: 760px;
  margin: 24px auto 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 1.06rem;
  line-height: 2;
}

.about-hero__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.hero-button,
.support-button {
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 23px;
  border: 1px solid transparent;
  border-radius: 13px;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.hero-button:hover,
.support-button:hover {
  transform: translateY(-2px);
}

.hero-button--primary {
  color: var(--about-primary-dark);
  background: #ffffff;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.16);
}

.hero-button--secondary {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.09);
}

/* Shared */
.section-heading {
  max-width: 730px;
  margin: 0 auto 38px;
  text-align: center;
}

.section-eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--about-primary);
  font-size: 0.86rem;
  font-weight: 900;
}

.section-title {
  margin: 0;
  color: var(--about-text);
  font-size: clamp(1.65rem, 4vw, 2.35rem);
  font-weight: 900;
  line-height: 1.55;
}

.section-description {
  margin: 13px 0 0;
  color: var(--about-muted);
  line-height: 1.95;
}

/* Story */
.story-section {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr);
  align-items: center;
  gap: 58px;
  padding: 90px 0;
}

.story-text {
  margin: 18px 0 0;
  color: #4b5563;
  line-height: 2.1;
}

.story-features {
  display: grid;
  gap: 14px;
  margin-top: 28px;
}

.story-feature {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px 16px;
  border: 1px solid var(--about-border);
  border-radius: 13px;
  background: var(--about-surface);
}

.story-feature__icon {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--about-primary-dark);
  background: var(--about-primary-light);
  font-weight: 900;
}

.story-feature strong,
.story-feature small {
  display: block;
}

.story-feature strong {
  color: var(--about-text);
}

.story-feature small {
  margin-top: 4px;
  color: var(--about-muted);
}

.story-visual {
  position: relative;
  min-height: 450px;
  display: grid;
  place-items: center;
}

.story-visual__main {
  position: relative;
  width: min(100%, 430px);
  min-height: 390px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 38px;
  border-radius: 32px;
  color: #ffffff;
  background:
    linear-gradient(
      145deg,
      var(--about-primary-deep),
      var(--about-primary)
    );
  box-shadow: 0 26px 70px rgba(6, 78, 59, 0.2);
}

.story-visual__main::before {
  content: '';
  position: absolute;
  width: 230px;
  height: 230px;
  left: -90px;
  bottom: -100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.09);
}

.brand-mark__name,
.brand-mark__slogan {
  display: block;
}

.brand-mark__name {
  font-size: 2.5rem;
  font-weight: 900;
}

.brand-mark__slogan {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.72);
}

.shopping-illustration {
  position: relative;
  min-height: 190px;
}

.shopping-bag {
  position: absolute;
  right: 50%;
  bottom: 0;
  width: 145px;
  height: 155px;
  display: grid;
  place-items: center;
  transform: translateX(50%);
  border-radius: 18px 18px 25px 25px;
  color: var(--about-primary-dark);
  background: #ffffff;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.16);
}

.shopping-bag::before {
  content: '';
  position: absolute;
  width: 70px;
  height: 45px;
  top: -28px;
  border: 9px solid #ffffff;
  border-bottom: 0;
  border-radius: 45px 45px 0 0;
}

.shopping-bag span {
  font-size: 3.1rem;
  font-weight: 900;
}

.shopping-box {
  position: absolute;
  border-radius: 12px;
  background: #fbbf24;
}

.shopping-box--one {
  width: 75px;
  height: 75px;
  right: 20px;
  bottom: 20px;
  transform: rotate(9deg);
}

.shopping-box--two {
  width: 58px;
  height: 58px;
  left: 25px;
  bottom: 48px;
  transform: rotate(-12deg);
  background: #d1fae5;
}

.story-floating-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 205px;
  padding: 14px;
  border: 1px solid var(--about-border);
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.11);
}

.story-floating-card--top {
  top: 45px;
  left: -25px;
}

.story-floating-card--bottom {
  right: -20px;
  bottom: 25px;
}

.floating-card__icon {
  font-size: 1.6rem;
}

.story-floating-card strong,
.story-floating-card small {
  display: block;
}

.story-floating-card strong {
  color: var(--about-text);
  font-size: 0.87rem;
}

.story-floating-card small {
  margin-top: 4px;
  color: var(--about-muted);
  font-size: 0.73rem;
}

/* Stats */
.stats-section {
  padding: 70px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  min-height: 220px;
  padding: 25px;
  border: 1px solid var(--about-border);
  border-radius: 20px;
  background: var(--about-surface);
  box-shadow: 0 13px 38px rgba(15, 23, 42, 0.045);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(5, 150, 105, 0.3);
  box-shadow: 0 20px 42px rgba(15, 23, 42, 0.08);
}

.stat-card__icon {
  width: 51px;
  height: 51px;
  display: grid;
  place-items: center;
  margin-bottom: 22px;
  border-radius: 15px;
  background: var(--about-primary-light);
  font-size: 1.5rem;
}

.stat-card__number,
.stat-card__label,
.stat-card__description {
  display: block;
}

.stat-card__number {
  color: var(--about-primary-dark);
  font-size: 1.75rem;
  font-weight: 900;
}

.stat-card__label {
  margin-top: 7px;
  color: var(--about-text);
  font-weight: 900;
}

.stat-card__description {
  margin-top: 8px;
  color: var(--about-muted);
  line-height: 1.8;
}

/* Mission */
.mission-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  padding: 50px 0 80px;
}

.mission-card {
  min-height: 310px;
  padding: 35px;
  border: 1px solid var(--about-border);
  border-radius: 25px;
  background: var(--about-surface);
}

.mission-card--primary {
  color: #ffffff;
  border: 0;
  background:
    linear-gradient(
      145deg,
      var(--about-primary-deep),
      var(--about-primary-dark)
    );
}

.mission-card__icon {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  margin-bottom: 28px;
  border-radius: 16px;
  background: var(--about-primary-light);
  font-size: 1.65rem;
}

.mission-card--primary .mission-card__icon {
  background: rgba(255, 255, 255, 0.12);
}

.mission-card__eyebrow {
  display: block;
  margin-bottom: 10px;
  color: var(--about-primary);
  font-size: 0.82rem;
  font-weight: 900;
}

.mission-card--primary .mission-card__eyebrow {
  color: #fbbf24;
}

.mission-card__title {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 900;
  line-height: 1.6;
}

.mission-card__text {
  margin: 17px 0 0;
  color: var(--about-muted);
  line-height: 2;
}

.mission-card--primary .mission-card__text {
  color: rgba(255, 255, 255, 0.8);
}

/* Values */
.values-section {
  padding: 70px 0;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.value-card {
  padding: 27px 24px;
  border: 1px solid var(--about-border);
  border-radius: 20px;
  background: var(--about-surface);
  text-align: center;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
}

.value-card__icon {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  margin: 0 auto 18px;
  border-radius: 18px;
  background: var(--about-primary-light);
  font-size: 1.7rem;
}

.value-card__title {
  margin: 0;
  color: var(--about-text);
  font-size: 1.08rem;
  font-weight: 900;
}

.value-card__text {
  margin: 11px 0 0;
  color: var(--about-muted);
  line-height: 1.9;
}

/* Process */
.process-section {
  display: grid;
  grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
  gap: 55px;
  align-items: start;
  padding: 75px 0;
}

.process-list {
  display: grid;
  gap: 14px;
}

.process-item {
  display: flex;
  align-items: flex-start;
  gap: 17px;
  padding: 20px;
  border: 1px solid var(--about-border);
  border-radius: 16px;
  background: var(--about-surface);
}

.process-item__number {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  color: #ffffff;
  background: var(--about-primary);
  font-weight: 900;
}

.process-item__content h3 {
  margin: 0;
  color: var(--about-text);
  font-size: 1rem;
  font-weight: 900;
}

.process-item__content p {
  margin: 7px 0 0;
  color: var(--about-muted);
  line-height: 1.85;
}

/* Support */
.support-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin: 65px 0 85px;
  padding: 42px;
  overflow: hidden;
  border-radius: 28px;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      var(--about-primary-deep),
      var(--about-primary)
    );
}

.support-section__eyebrow {
  display: inline-block;
  margin-bottom: 8px;
  color: #fbbf24;
  font-size: 0.82rem;
  font-weight: 900;
}

.support-section__title {
  margin: 0;
  font-size: clamp(1.55rem, 4vw, 2.1rem);
  font-weight: 900;
}

.support-section__text {
  max-width: 600px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.9;
}

.support-section__actions {
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.support-button--primary {
  color: var(--about-primary-dark);
  background: #ffffff;
}

.support-button--secondary {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.09);
  direction: ltr;
}

/* Responsive */
@media (max-width: 1050px) {
  .story-section {
    grid-template-columns: 1fr;
  }

  .story-visual {
    margin-top: 15px;
  }

  .stats-grid,
  .values-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .process-section {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 760px) {
  .about-container {
    width: min(100% - 24px, 1280px);
  }

  .about-hero {
    min-height: 440px;
  }

  .about-hero__content {
    padding-top: 60px;
    padding-bottom: 60px;
  }

  .about-hero__description {
    font-size: 0.94rem;
  }

  .story-section {
    padding: 65px 0;
  }

  .story-visual {
    min-height: 400px;
  }

  .story-floating-card--top {
    top: 15px;
    left: 0;
  }

  .story-floating-card--bottom {
    right: 0;
    bottom: 8px;
  }

  .mission-section {
    grid-template-columns: 1fr;
  }

  .support-section {
    align-items: flex-start;
    flex-direction: column;
    padding: 30px 24px;
  }
}

@media (max-width: 520px) {
  .about-hero__actions,
  .hero-button {
    width: 100%;
  }

  .stats-grid,
  .values-grid {
    grid-template-columns: 1fr;
  }

  .story-visual__main {
    min-height: 360px;
    padding: 28px;
  }

  .story-floating-card {
    position: relative;
    inset: auto;
    width: 100%;
    margin-top: 12px;
  }

  .story-visual {
    display: block;
    min-height: auto;
  }

  .mission-card {
    min-height: auto;
    padding: 27px 22px;
  }

  .support-section__actions,
  .support-button {
    width: 100%;
  }
}
</style>
