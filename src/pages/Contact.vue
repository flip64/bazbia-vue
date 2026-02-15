<template>
  <div class="contact-page">
    <!-- هدر صفحه -->
    <div class="contact-header">
      <div class="contact-header__container">
        <h1 class="contact-header__title">تماس با ما</h1>
        <p class="contact-header__subtitle">
          برای ارتباط با تیم پشتیبانی می‌توانید از راه‌های زیر اقدام کنید
        </p>
      </div>
    </div>

    <div class="contact-container">
      <!-- اطلاعات تماس -->
      <div class="contact-info">
        <h2 class="contact-info__title">اطلاعات تماس</h2>
        
        <div class="contact-info__grid">
          <!-- آدرس -->
          <div class="contact-card">
            <div class="contact-card__icon">📍</div>
            <h3 class="contact-card__title">آدرس</h3>
            <p class="contact-card__text">
              تهران، خیابان ولیعصر، خیابان شهید بهشتی، پلاک ۱۲۳
            </p>
          </div>

          <!-- تلفن -->
          <div class="contact-card">
            <div class="contact-card__icon">📞</div>
            <h3 class="contact-card__title">تلفن پشتیبانی</h3>
            <p class="contact-card__text">
              <a href="tel:02112345678">۰۲۱-۱۲۳۴۵۶۷۸</a>
            </p>
            <p class="contact-card__text">
              <a href="tel:02187654321">۰۲۱-۸۷۶۵۴۳۲۱</a>
            </p>
          </div>

          <!-- ایمیل -->
          <div class="contact-card">
            <div class="contact-card__icon">✉️</div>
            <h3 class="contact-card__title">ایمیل</h3>
            <p class="contact-card__text">
              <a href="mailto:support@example.com">support@example.com</a>
            </p>
            <p class="contact-card__text">
              <a href="mailto:info@example.com">info@example.com</a>
            </p>
          </div>

          <!-- ساعات کاری -->
          <div class="contact-card">
            <div class="contact-card__icon">🕒</div>
            <h3 class="contact-card__title">ساعات کاری</h3>
            <p class="contact-card__text">شنبه تا چهارشنبه: ۹ صبح تا ۶ عصر</p>
            <p class="contact-card__text">پنجشنبه: ۹ صبح تا ۲ بعدازظهر</p>
            <p class="contact-card__text">جمعه: تعطیل</p>
          </div>
        </div>
      </div>

      <!-- فرم تماس -->
      <div class="contact-form-section">
        <h2 class="contact-form__title">فرم تماس</h2>
        <p class="contact-form__subtitle">
          سوالات، پیشنهادات یا انتقادات خود را با ما در میان بگذارید
        </p>

        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-row">
            <!-- نام -->
            <div class="form-group">
              <label for="name">نام و نام خانوادگی</label>
              <input 
                type="text" 
                id="name"
                v-model="form.name"
                placeholder="نام و نام خانوادگی خود را وارد کنید"
                required
              >
            </div>

            <!-- ایمیل -->
            <div class="form-group">
              <label for="email">ایمیل</label>
              <input 
                type="email" 
                id="email"
                v-model="form.email"
                placeholder="example@email.com"
                required
              >
            </div>
          </div>

          <!-- تلفن -->
          <div class="form-group">
            <label for="phone">شماره تماس (اختیاری)</label>
            <input 
              type="tel" 
              id="phone"
              v-model="form.phone"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            >
          </div>

          <!-- موضوع -->
          <div class="form-group">
            <label for="subject">موضوع</label>
            <select id="subject" v-model="form.subject" required>
              <option value="">موضوع را انتخاب کنید</option>
              <option value="support">پشتیبانی فنی</option>
              <option value="sales">مشاوره خرید</option>
              <option value="complaint">شکایت</option>
              <option value="suggestion">پیشنهاد</option>
              <option value="other">سایر</option>
            </select>
          </div>

          <!-- پیام -->
          <div class="form-group">
            <label for="message">پیام</label>
            <textarea 
              id="message"
              v-model="form.message"
              rows="5"
              placeholder="پیام خود را بنویسید..."
              required
            ></textarea>
          </div>

          <!-- دکمه ارسال -->
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading"
          >
            <span v-if="!loading">ارسال پیام</span>
            <span v-else>در حال ارسال...</span>
          </button>
        </form>
      </div>

      <!-- نقشه (اختیاری) -->
      <div class="contact-map">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d404.123456789!2d51.123456!3d35.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDA3JzI0LjQiTiA1McKwMDcnNDQuNCJF!5e0!3m2!1sen!2s!4v1234567890"
          width="100%"
          height="400"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          title="نقشه فروشگاه"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const handleSubmit = async () => {
  loading.value = true

  try {
    // شبیه‌سازی ارسال به سرور
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('پیام ارسال شد:', form.value)
    
    // پاک کردن فرم
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
    
    alert('پیام شما با موفقیت ارسال شد')
    
  } catch (error) {
    console.error('خطا در ارسال پیام:', error)
    alert('خطا در ارسال پیام. لطفا دوباره تلاش کنید')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.contact-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 3rem;
}

.contact-header__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-header__title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.contact-header__subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.contact-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

/* اطلاعات تماس */
.contact-info {
  margin-bottom: 4rem;
}

.contact-info__title {
  font-size: 2rem;
  color: #374151;
  text-align: center;
  margin-bottom: 2rem;
}

.contact-info__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.contact-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.contact-card__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.contact-card__title {
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 1rem;
}

.contact-card__text {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.contact-card__text a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-card__text a:hover {
  color: #5a67d8;
  text-decoration: underline;
}

/* فرم تماس */
.contact-form-section {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 4rem;
}

.contact-form__title {
  font-size: 2rem;
  color: #374151;
  text-align: center;
  margin-bottom: 0.5rem;
}

.contact-form__subtitle {
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
}

.contact-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* نقشه */
.contact-map {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .contact-header__title {
    font-size: 2rem;
  }

  .contact-form-section {
    padding: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .contact-info__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .contact-header {
    padding: 3rem 0;
  }

  .contact-header__title {
    font-size: 1.75rem;
  }

  .contact-form-section {
    padding: 1.5rem;
  }
}
</style>
