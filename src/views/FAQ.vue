<template>
  <div class="faq-page">
    <!-- هدر صفحه -->
    <div class="faq-header">
      <div class="faq-header__container">
        <h1 class="faq-header__title">پرسش‌های متداول</h1>
        <p class="faq-header__subtitle">
          پاسخ سوالات رایج شما در مورد خرید از فروشگاه
        </p>
      </div>
    </div>

    <div class="faq-container">
      <!-- دسته‌بندی سوالات -->
      <div class="faq-categories">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="faq-category"
          :class="{ 'faq-category--active': activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- لیست سوالات -->
      <div class="faq-list">
        <div 
          v-for="faq in filteredFaqs" 
          :key="faq.id"
          class="faq-item"
        >
          <button 
            class="faq-question"
            @click="toggleFaq(faq.id)"
          >
            <span>{{ faq.question }}</span>
            <span class="faq-icon">{{ openItems.includes(faq.id) ? '−' : '+' }}</span>
          </button>
          
          <transition name="fade">
            <div 
              v-if="openItems.includes(faq.id)" 
              class="faq-answer"
            >
              {{ faq.answer }}
            </div>
          </transition>
        </div>
      </div>

      <!-- بخش تماس -->
      <div class="faq-contact">
        <h2>پاسخ سوال خود را پیدا نکردید؟</h2>
        <p>با تیم پشتیبانی ما تماس بگیرید</p>
        <div class="faq-contact__buttons">
          <router-link to="/contact" class="faq-contact__btn">
            فرم تماس
          </router-link>
          <a href="tel:02112345678" class="faq-contact__btn faq-contact__btn--outline">
            تماس تلفنی
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('all')
const openItems = ref<number[]>([])

const categories = ref([
  { id: 'all', name: 'همه' },
  { id: 'account', name: 'حساب کاربری' },
  { id: 'order', name: 'سفارش‌ها' },
  { id: 'payment', name: 'پرداخت' },
  { id: 'shipping', name: 'ارسال' },
  { id: 'return', name: 'مرجوعی' }
])

const faqs = ref([
  // حساب کاربری
  {
    id: 1,
    category: 'account',
    question: 'چگونه می‌توانم در سایت ثبت‌نام کنم؟',
    answer: 'برای ثبت‌نام در سایت، روی گزینه "ورود/ثبت‌نام" در بالای صفحه کلیک کنید. سپس گزینه "ثبت‌نام" را انتخاب کرده و فرم مربوطه را پر کنید. بعد از تأیید ایمیل یا شماره موبایل، ثبت‌نام شما تکمیل می‌شود.'
  },
  {
    id: 2,
    category: 'account',
    question: 'رمز عبور خود را فراموش کرده‌ام، چه کنم؟',
    answer: 'در صفحه ورود، گزینه "رمز عبور را فراموش کرده‌اید؟" را کلیک کنید. ایمیل یا شماره موبایل خود را وارد کنید تا لینک بازیابی رمز برای شما ارسال شود.'
  },
  {
    id: 3,
    category: 'account',
    question: 'چگونه می‌توانم اطلاعات حساب خود را ویرایش کنم؟',
    answer: 'پس از ورود به حساب کاربری، به بخش "پروفایل" بروید. در آنجا می‌توانید اطلاعات شخصی، آدرس‌ها و سایر تنظیمات حساب خود را ویرایش کنید.'
  },

  // سفارش‌ها
  {
    id: 4,
    category: 'order',
    question: 'چگونه می‌توانم سفارش خود را پیگیری کنم؟',
    answer: 'برای پیگیری سفارش، وارد حساب کاربری خود شوید و به بخش "سفارش‌های من" بروید. در آنجا وضعیت سفارش خود را مشاهده می‌کنید. همچنین کد رهگیری پس از ارسال برای شما پیامک می‌شود.'
  },
  {
    id: 5,
    category: 'order',
    question: 'آیا می‌توانم سفارش خود را لغو کنم؟',
    answer: 'بله، تا قبل از ارسال سفارش می‌توانید آن را لغو کنید. برای این کار به بخش "سفارش‌های من" بروید و گزینه لغو سفارش را انتخاب کنید. پس از ارسال سفارش، لغو فقط از طریق تماس با پشتیبانی امکان‌پذیر است.'
  },

  // پرداخت
  {
    id: 6,
    category: 'payment',
    question: 'چه روش‌های پرداختی دارید؟',
    answer: 'روش‌های پرداخت ما شامل: پرداخت آنلاین با تمام کارت‌های عضو شتاب، پرداخت در محل (برای برخی مناطق) و کارت به کارت می‌باشد.'
  },
  {
    id: 7,
    category: 'payment',
    question: 'آیا پرداخت در محل امکان‌پذیر است؟',
    answer: 'بله، در برخی مناطق پرداخت در محل امکان‌پذیر است. هنگام ثبت سفارش، اگر آدرس شما تحت پوشش باشد، گزینه "پرداخت در محل" نمایش داده می‌شود.'
  },

  // ارسال
  {
    id: 8,
    category: 'shipping',
    question: 'هزینه ارسال چقدر است؟',
    answer: 'هزینه ارسال بستگی به نوع ارسال (عادی یا اکسپرس) و آدرس شما دارد. معمولاً هزینه ارسال عادی رایگان و ارسال اکسپرس ۵۰,۰۰۰ تومان است.'
  },
  {
    id: 9,
    category: 'shipping',
    question: 'مدت زمان ارسال چقدر است؟',
    answer: 'ارسال عادی بین ۳ تا ۵ روز کاری و ارسال اکسپرس ۴۸ ساعته انجام می‌شود.'
  },

  // مرجوعی
  {
    id: 10,
    category: 'return',
    question: 'شرایط مرجوعی کالا چیست؟',
    answer: 'شما تا ۷ روز پس از دریافت سفارش، در صورت وجود مشکل فنی یا مغایرت با مشخصات اعلام شده، می‌توانید کالا را مرجوع کنید. کالا باید در بسته‌بندی اصلی و بدون استفاده باشد.'
  },
  {
    id: 11,
    category: 'return',
    question: 'هزینه مرجوعی با کیست؟',
    answer: 'اگر مشکل فنی یا مغایرت از طرف فروشگاه باشد، هزینه مرجوعی با ماست. در غیر این صورت، هزینه بر عهده مشتری می‌باشد.'
  }
])

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'all') {
    return faqs.value
  }
  return faqs.value.filter(faq => faq.category === activeCategory.value)
})

const toggleFaq = (id: number) => {
  if (openItems.value.includes(id)) {
    openItems.value = openItems.value.filter(item => item !== id)
  } else {
    openItems.value.push(id)
  }
}
</script>

<style scoped>
.faq-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.faq-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 3rem;
}

.faq-header__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.faq-header__title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.faq-header__subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

/* دسته‌بندی‌ها */
.faq-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.faq-category {
  padding: 0.5rem 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 9999px;
  font-size: 0.95rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-category:hover {
  border-color: #667eea;
  color: #667eea;
}

.faq-category--active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

/* لیست سوالات */
.faq-list {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.faq-item {
  border-bottom: 1px solid #f0f0f0;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: white;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: right;
  font-size: 1.05rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.3s ease;
}

.faq-question:hover {
  background: #f9fafb;
}

.faq-icon {
  font-size: 1.5rem;
  color: #667eea;
  margin-right: 1rem;
}

.faq-answer {
  padding: 0 1.5rem 1.25rem;
  color: #6b7280;
  line-height: 1.8;
}

/* انیمیشن */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* بخش تماس */
.faq-contact {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.faq-contact h2 {
  font-size: 1.5rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.faq-contact p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.faq-contact__buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.faq-contact__btn {
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.faq-contact__btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.faq-contact__btn--outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.faq-contact__btn--outline:hover {
  background: #667eea;
  color: white;
}

@media (max-width: 640px) {
  .faq-header__title {
    font-size: 2rem;
  }

  .faq-categories {
    gap: 0.5rem;
  }

  .faq-category {
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }

  .faq-question {
    padding: 1rem;
    font-size: 0.95rem;
  }

  .faq-answer {
    padding: 0 1rem 1rem;
    font-size: 0.9rem;
  }

  .faq-contact {
    padding: 2rem;
  }

  .faq-contact__buttons {
    flex-direction: column;
  }
}
</style>
