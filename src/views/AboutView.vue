<template>
  <div class="about-page">
    <!-- هدر صفحه -->
    <div class="about-header">
      <div class="about-header__container">
        <h1 class="about-header__title">درباره ما</h1>
        <p class="about-header__subtitle">
          با فروشگاه من بیشتر آشنا شوید
        </p>
      </div>
    </div>

    <div class="about-container">
      <!-- بخش معرفی -->
      <section class="about-section">
        <div class="about-content">
          <h2 class="about-section__title">داستان ما</h2>
          <p class="about-section__text">
            فروشگاه من در سال ۱۴۰۰ با هدف ارائه بهترین محصولات با کیفیت و قیمت مناسب شروع به کار کرد. 
            ما معتقدیم هر کسی شایسته بهترین‌هاست و به همین دلیل تلاش می‌کنیم تا محصولات با کیفیت را با 
            قیمتی منصفانه در اختیار شما عزیزان قرار دهیم.
          </p>
          <p class="about-section__text">
            تیم ما متشکل از افراد متخصص و با تجربه در حوزه‌های مختلف از جمله فناوری اطلاعات، 
            بازاریابی، و پشتیبانی مشتریان است. ما همواره در تلاشیم تا تجربه خریدی لذت‌بخش و 
            مطمئن را برای شما فراهم کنیم.
          </p>
        </div>
        <div class="about-image">
          <img src="https://via.placeholder.com/600x400?text=درباره+ما" alt="درباره ما">
        </div>
      </section>

      <!-- آمار و ارقام -->
      <section class="stats-section">
        <h2 class="stats-section__title">فروشگاه من در یک نگاه</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card__number">+۵,۰۰۰</div>
            <div class="stat-card__label">مشتری راضی</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__number">+۱۰,۰۰۰</div>
            <div class="stat-card__label">محصول</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__number">۴</div>
            <div class="stat-card__label">سال تجربه</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__number">۲۴/۷</div>
            <div class="stat-card__label">پشتیبانی</div>
          </div>
        </div>
      </section>

      <!-- تیم ما -->
      <section class="team-section">
        <h2 class="team-section__title">تیم ما</h2>
        <div class="team-grid">
          <div v-for="member in team" :key="member.id" class="team-card">
            <div class="team-card__image">
              <img :src="member.image" :alt="member.name">
            </div>
            <h3 class="team-card__name">{{ member.name }}</h3>
            <p class="team-card__role">{{ member.role }}</p>
          </div>
        </div>
      </section>

      <!-- ارزش‌ها -->
      <section class="values-section">
        <h2 class="values-section__title">ارزش‌های ما</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-card__icon">🎯</div>
            <h3 class="value-card__title">مشتری مداری</h3>
            <p class="value-card__text">رضایت مشتری اولویت اول ماست</p>
          </div>
          <div class="value-card">
            <div class="value-card__icon">✨</div>
            <h3 class="value-card__title">کیفیت</h3>
            <p class="value-card__text">ارائه بهترین کیفیت ممکن</p>
          </div>
          <div class="value-card">
            <div class="value-card__icon">🤝</div>
            <h3 class="value-card__title">اعتماد</h3>
            <p class="value-card__text">ساخت رابطه بلندمدت با مشتریان</p>
          </div>
          <div class="value-card">
            <div class="value-card__icon">💡</div>
            <h3 class="value-card__title">نوآوری</h3>
            <p class="value-card__text">همگام با تکنولوژی روز</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const team = [
  {
    id: 1,
    name: 'علی رضایی',
    role: 'مدیرعامل',
    image: 'https://via.placeholder.com/300x300?text=علی+رضایی'
  },
  {
    id: 2,
    name: 'مریم احمدی',
    role: 'مدیر بازاریابی',
    image: 'https://via.placeholder.com/300x300?text=مریم+احمدی'
  },
  {
    id: 3,
    name: 'سارا محمدی',
    role: 'مدیر پشتیبانی',
    image: 'https://via.placeholder.com/300x300?text=سارا+محمدی'
  },
  {
    id: 4,
    name: 'رضا کریمی',
    role: 'توسعه‌دهنده ارشد',
    image: 'https://via.placeholder.com/300x300?text=رضا+کریمی'
  }
]
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.about-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 3rem;
}

.about-header__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-header__title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.about-header__subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.about-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

/* بخش معرفی */
.about-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 4rem;
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.about-section__title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 1.5rem;
}

.about-section__text {
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.about-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

/* آمار */
.stats-section {
  text-align: center;
  margin-bottom: 4rem;
}

.stats-section__title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-card__number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-card__label {
  color: #6b7280;
  font-size: 1.1rem;
}

/* تیم */
.team-section {
  text-align: center;
  margin-bottom: 4rem;
}

.team-section__title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 2rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.team-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.team-card__image {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.team-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-card__name {
  font-size: 1.2rem;
  color: #374151;
  margin: 1rem 0 0.25rem;
}

.team-card__role {
  color: #6b7280;
  margin-bottom: 1rem;
}

/* ارزش‌ها */
.values-section {
  text-align: center;
  margin-bottom: 4rem;
}

.values-section__title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 2rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.value-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.value-card__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.value-card__title {
  font-size: 1.2rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.value-card__text {
  color: #6b7280;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .stats-grid,
  .team-grid,
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .about-section {
    grid-template-columns: 1fr;
    padding: 2rem;
  }

  .about-header__title {
    font-size: 2rem;
  }

  .stats-grid,
  .team-grid,
  .values-grid {
    grid-template-columns: 1fr;
  }

  .stat-card__number {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .about-header {
    padding: 3rem 0;
  }

  .about-header__title {
    font-size: 1.75rem;
  }

  .about-section__title {
    font-size: 1.5rem;
  }
}
</style>
