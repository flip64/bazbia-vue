<template>
  <main class="not-found-page">
    <div class="not-found-page__pattern"></div>

    <section class="not-found-card">
      <div class="not-found-card__visual">
        <div class="error-illustration">
          <div class="error-illustration__circle"></div>

          <div class="shopping-bag">
            <span class="shopping-bag__handle"></span>
            <span class="shopping-bag__logo">ب</span>
          </div>

          <div class="floating-box floating-box--one"></div>
          <div class="floating-box floating-box--two"></div>

          <div class="magnifier">
            <span class="magnifier__glass">؟</span>
            <span class="magnifier__handle"></span>
          </div>

          <span class="spark spark--one">✦</span>
          <span class="spark spark--two">✦</span>
          <span class="spark spark--three">✦</span>
        </div>
      </div>

      <div class="not-found-card__content">
        <span class="not-found-card__badge">
          خطای ۴۰۴
        </span>

        <h1 class="not-found-card__title">
          این صفحه در
          <span>بازبیا</span>
          پیدا نشد
        </h1>

        <p class="not-found-card__description">
          ممکن است آدرس صفحه تغییر کرده باشد، محصول حذف شده باشد
          یا لینک واردشده صحیح نباشد.
        </p>

        <div class="not-found-card__code">
          <span>۴</span>
          <span class="not-found-card__code-center">۰</span>
          <span>۴</span>
        </div>

        <div class="not-found-card__actions">
          <RouterLink
            to="/"
            class="not-found-button not-found-button--primary"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 11.5 12 4l9 7.5"></path>
              <path d="M5 10.5V20h14v-9.5"></path>
              <path d="M9 20v-6h6v6"></path>
            </svg>

            بازگشت به صفحه اصلی
          </RouterLink>

          <RouterLink
            to="/products"
            class="not-found-button not-found-button--secondary"
          >
            مشاهده محصولات
          </RouterLink>
        </div>

        <div class="not-found-card__help">
          <span>
            هنوز چیزی پیدا نکردید؟
          </span>

          <RouterLink to="/contact">
            با پشتیبانی تماس بگیرید
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found-page {
  --not-found-primary: #059669;
  --not-found-primary-dark: #047857;
  --not-found-primary-deep: #064e3b;
  --not-found-primary-light: #ecfdf5;
  --not-found-accent: #f59e0b;
  --not-found-text: #1f2937;
  --not-found-muted: #6b7280;
  --not-found-border: #e5e7eb;
  --not-found-surface: #ffffff;

  position: relative;
  min-height: calc(100vh - 140px);
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: 48px 20px;
  direction: rtl;
  color: var(--not-found-text);
  background:
    radial-gradient(
      circle at top right,
      rgba(5, 150, 105, 0.12),
      transparent 30rem
    ),
    radial-gradient(
      circle at bottom left,
      rgba(245, 158, 11, 0.1),
      transparent 25rem
    ),
    #f8fafc;
}

.not-found-page__pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(
      rgba(15, 23, 42, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(15, 23, 42, 0.03) 1px,
      transparent 1px
    );
  background-size: 42px 42px;
  mask-image:
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.7),
      transparent
    );
}

.not-found-card {
  position: relative;
  z-index: 1;
  width: min(1100px, 100%);
  display: grid;
  grid-template-columns:
    minmax(320px, 0.9fr)
    minmax(0, 1.1fr);
  overflow: hidden;
  border: 1px solid rgba(5, 150, 105, 0.12);
  border-radius: 32px;
  background: var(--not-found-surface);
  box-shadow:
    0 30px 80px rgba(15, 23, 42, 0.1);
}

.not-found-card__visual {
  min-height: 540px;
  display: grid;
  place-items: center;
  padding: 48px;
  background:
    linear-gradient(
      145deg,
      var(--not-found-primary-deep),
      var(--not-found-primary)
    );
}

.error-illustration {
  position: relative;
  width: 340px;
  height: 340px;
}

.error-illustration__circle {
  position: absolute;
  inset: 20px;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  animation: rotate-circle 18s linear infinite;
}

.shopping-bag {
  position: absolute;
  right: 50%;
  bottom: 62px;
  width: 145px;
  height: 155px;
  display: grid;
  place-items: center;
  transform: translateX(50%);
  border-radius: 20px 20px 30px 30px;
  background: #ffffff;
  box-shadow:
    0 24px 45px rgba(0, 0, 0, 0.18);
  animation: bag-float 4s ease-in-out infinite;
}

.shopping-bag__handle {
  position: absolute;
  top: -34px;
  width: 74px;
  height: 50px;
  border: 10px solid #ffffff;
  border-bottom: 0;
  border-radius: 45px 45px 0 0;
}

.shopping-bag__logo {
  color: var(--not-found-primary-dark);
  font-size: 4.2rem;
  font-weight: 900;
}

.floating-box {
  position: absolute;
  border-radius: 14px;
  box-shadow:
    0 18px 28px rgba(0, 0, 0, 0.14);
}

.floating-box--one {
  width: 72px;
  height: 72px;
  right: 16px;
  bottom: 45px;
  transform: rotate(12deg);
  background: #fbbf24;
  animation: box-one-float 5s ease-in-out infinite;
}

.floating-box--two {
  width: 58px;
  height: 58px;
  left: 25px;
  top: 66px;
  transform: rotate(-12deg);
  background: #d1fae5;
  animation: box-two-float 4.5s ease-in-out infinite;
}

.magnifier {
  position: absolute;
  top: 32px;
  right: 45px;
  width: 95px;
  height: 95px;
  animation: magnifier-float 4s ease-in-out infinite;
}

.magnifier__glass {
  position: absolute;
  width: 75px;
  height: 75px;
  display: grid;
  place-items: center;
  border: 8px solid #ffffff;
  border-radius: 50%;
  color: #ffffff;
  font-size: 2.1rem;
  font-weight: 900;
}

.magnifier__handle {
  position: absolute;
  width: 18px;
  height: 65px;
  right: 0;
  bottom: -22px;
  border-radius: 20px;
  transform: rotate(-45deg);
  transform-origin: top;
  background: #ffffff;
}

.spark {
  position: absolute;
  color: #fbbf24;
  font-size: 1.8rem;
  animation: spark-pulse 2.3s ease-in-out infinite;
}

.spark--one {
  top: 18px;
  left: 22px;
}

.spark--two {
  right: 8px;
  top: 172px;
  animation-delay: 0.7s;
}

.spark--three {
  left: 38px;
  bottom: 40px;
  animation-delay: 1.1s;
}

.not-found-card__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding:
    clamp(34px, 6vw, 70px);
}

.not-found-card__badge {
  align-self: flex-start;
  display: inline-flex;
  margin-bottom: 18px;
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--not-found-primary-dark);
  background: var(--not-found-primary-light);
  font-size: 0.84rem;
  font-weight: 900;
}

.not-found-card__title {
  margin: 0;
  color: var(--not-found-text);
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 900;
  line-height: 1.5;
  letter-spacing: -0.04em;
}

.not-found-card__title span {
  color: var(--not-found-primary);
}

.not-found-card__description {
  max-width: 600px;
  margin: 18px 0 0;
  color: var(--not-found-muted);
  font-size: 1rem;
  line-height: 2;
}

.not-found-card__code {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 30px 0;
  color: var(--not-found-primary-dark);
  font-size: clamp(3.8rem, 8vw, 6.5rem);
  font-weight: 900;
  line-height: 1;
}

.not-found-card__code-center {
  display: grid;
  place-items: center;
  width: 88px;
  height: 88px;
  border: 7px solid var(--not-found-primary);
  border-radius: 50%;
  color: transparent;
  background:
    radial-gradient(
      circle,
      var(--not-found-primary-light) 0%,
      var(--not-found-primary-light) 50%,
      transparent 51%
    );
}

.not-found-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.not-found-button {
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 14px;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.not-found-button:hover {
  transform: translateY(-2px);
}

.not-found-button svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.not-found-button--primary {
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      var(--not-found-primary-dark),
      var(--not-found-primary)
    );
  box-shadow:
    0 14px 28px rgba(5, 150, 105, 0.23);
}

.not-found-button--primary:hover {
  box-shadow:
    0 18px 34px rgba(5, 150, 105, 0.3);
}

.not-found-button--secondary {
  border-color: var(--not-found-border);
  color: var(--not-found-text);
  background: #ffffff;
}

.not-found-button--secondary:hover {
  border-color: rgba(5, 150, 105, 0.35);
  color: var(--not-found-primary-dark);
  background: var(--not-found-primary-light);
}

.not-found-card__help {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 26px;
  color: var(--not-found-muted);
  font-size: 0.87rem;
}

.not-found-card__help a {
  color: var(--not-found-primary-dark);
  font-weight: 900;
  text-decoration: none;
}

.not-found-card__help a:hover {
  text-decoration: underline;
}

@keyframes rotate-circle {
  to {
    transform: rotate(360deg);
  }
}

@keyframes bag-float {
  0%,
  100% {
    transform:
      translateX(50%)
      translateY(0);
  }

  50% {
    transform:
      translateX(50%)
      translateY(-10px);
  }
}

@keyframes box-one-float {
  0%,
  100% {
    transform:
      rotate(12deg)
      translateY(0);
  }

  50% {
    transform:
      rotate(17deg)
      translateY(-12px);
  }
}

@keyframes box-two-float {
  0%,
  100% {
    transform:
      rotate(-12deg)
      translateY(0);
  }

  50% {
    transform:
      rotate(-8deg)
      translateY(10px);
  }
}

@keyframes magnifier-float {
  0%,
  100% {
    transform:
      rotate(0)
      translateY(0);
  }

  50% {
    transform:
      rotate(5deg)
      translateY(-8px);
  }
}

@keyframes spark-pulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.8);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@media (max-width: 900px) {
  .not-found-card {
    grid-template-columns: 1fr;
  }

  .not-found-card__visual {
    min-height: 390px;
    padding: 30px;
  }

  .error-illustration {
    transform: scale(0.88);
  }

  .not-found-card__content {
    text-align: center;
  }

  .not-found-card__badge {
    align-self: center;
  }

  .not-found-card__description {
    margin-right: auto;
    margin-left: auto;
  }

  .not-found-card__code,
  .not-found-card__actions,
  .not-found-card__help {
    justify-content: center;
  }
}

@media (max-width: 560px) {
  .not-found-page {
    padding: 24px 12px;
  }

  .not-found-card {
    border-radius: 22px;
  }

  .not-found-card__visual {
    min-height: 320px;
    padding: 18px;
  }

  .error-illustration {
    width: 280px;
    height: 280px;
    transform: scale(0.82);
  }

  .not-found-card__content {
    padding: 30px 20px 36px;
  }

  .not-found-card__code {
    margin: 24px 0;
  }

  .not-found-card__code-center {
    width: 66px;
    height: 66px;
    border-width: 6px;
  }

  .not-found-card__actions,
  .not-found-button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .error-illustration *,
  .not-found-button {
    animation: none !important;
    transition: none !important;
  }
}
</style>
