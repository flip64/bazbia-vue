<template>
  <div class="not-found">
    <div class="not-found__container">
      <div class="not-found__content">
        <h1 class="not-found__title">۴۰۴</h1>
        <h2 class="not-found__subtitle">صفحه مورد نظر یافت نشد</h2>
        <p class="not-found__text">
          متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
        </p>
        <div class="not-found__actions">
          <router-link to="/" class="not-found__btn not-found__btn--primary">
            بازگشت به خانه
          </router-link>
          <router-link to="/products" class="not-found__btn not-found__btn--secondary">
            مشاهده محصولات
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// صفحه ۴۰۴
</script>

<style scoped>
.not-found {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.not-found__container {
  max-width: 600px;
  width: 100%;
}

.not-found__content {
  text-align: center;
  color: white;
}

.not-found__title {
  font-size: 8rem;
  font-weight: bold;
  margin: 0;
  line-height: 1;
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.not-found__subtitle {
  font-size: 2rem;
  margin: 1rem 0;
}

.not-found__text {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.not-found__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.not-found__btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.not-found__btn--primary {
  background: white;
  color: #667eea;
}

.not-found__btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.not-found__btn--secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.not-found__btn--secondary:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .not-found__title {
    font-size: 6rem;
  }

  .not-found__subtitle {
    font-size: 1.5rem;
  }

  .not-found__actions {
    flex-direction: column;
  }
}
</style>
