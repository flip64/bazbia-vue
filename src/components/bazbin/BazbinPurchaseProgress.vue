<!-- src/components/bazbin/BazbinPurchaseProgress.vue -->
<template>
  <div
    class="bazbin-box"
    :class="{ qualified: earnedBazbins > 0 }"
  >
    <div class="bazbin-head">
      <div class="bazbin-content">
        <strong v-if="earnedBazbins > 0">
          تبریک! {{ formatNumber(earnedBazbins) }}
          تخم بازبین هدیه می‌گیرید
        </strong>

        <strong v-else>
          {{ formatPrice(remainingAmount) }}
          تومان دیگر خرید کنید
        </strong>

        <p v-if="earnedBazbins > 0">
          با این خرید، {{ formatNumber(earnedBazbins) }}
           بازبین پس از پرداخت موفق صادر می‌شود.
        </p>

        <p v-else>
          با هر {{ formatPrice(targetAmount) }} تومان خرید،
          یک  بازبین هدیه می‌گیرید.
        </p>
      </div>

      <div class="bazbin-image-wrapper">
        <span
          v-if="earnedBazbins > 0"
          class="bazbin-count"
        >
          × {{ formatNumber(earnedBazbins) }}
        </span>

        <img
          :src="eggImage"
          alt="تخم بازبین"
          class="bazbin-egg"
        />
      </div>
    </div>

    <div class="next-reward">
      <span>
        پیشرفت برای
        {{ earnedBazbins > 0 ? 'بازبین بعدی' : ' اولین  بازبین' }}
      </span>

      <strong>
        {{ formatPrice(currentCycleAmount) }}
        از
        {{ formatPrice(targetAmount) }}
        تومان
      </strong>
    </div>

    <div
      class="progress"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="progressLabel"
    >
      <div
        class="progress__fill"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <div class="progress-values">
      <span>{{ formatNumber(progress) }}٪</span>

      <span>
        {{ formatPrice(remainingAmount) }}
        تومان تا تخم بازبین بعدی
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentAmount: number
  targetAmount?: number
  eggImage?: string
}

const props = withDefaults(defineProps<Props>(), {
  targetAmount: 2_000_000,
  eggImage: '/images/bazbin-egg.webp',
})

const normalizedAmount = computed(() =>
  Math.max(Number(props.currentAmount) || 0, 0),
)

const normalizedTarget = computed(() =>
  Math.max(Number(props.targetAmount) || 0, 1),
)

/**
 * تعداد تخم‌هایی که کاربر با مبلغ فعلی دریافت می‌کند.
 *
 * مثال:
 * 4,500,000 / 2,000,000 = 2 تخم
 */
const earnedBazbins = computed(() =>
  Math.floor(
    normalizedAmount.value / normalizedTarget.value,
  ),
)

/**
 * مبلغی که برای تخم بعدی محاسبه می‌شود.
 *
 * مثال:
 * خرید 4,500,000 تومان
 * مبلغ چرخه فعلی = 500,000 تومان
 */
const currentCycleAmount = computed(() =>
  normalizedAmount.value % normalizedTarget.value,
)

/**
 * مبلغ باقی‌مانده تا تخم بعدی.
 *
 * در مبلغ دقیقاً مضرب دو میلیون،
 * چرخه بعدی از صفر شروع می‌شود.
 */
const remainingAmount = computed(() =>
  normalizedTarget.value - currentCycleAmount.value,
)

const progress = computed(() =>
  Math.round(
    (
      currentCycleAmount.value /
      normalizedTarget.value
    ) * 100,
  ),
)

const progressLabel = computed(
  () =>
    `${progress.value} درصد پیشرفت برای ${
      earnedBazbins.value > 0
        ? 'تخم بازبین بعدی'
        : 'اولین تخم بازبین'
    }`,
)

const formatPrice = (value: number) =>
  new Intl.NumberFormat('fa-IR').format(value)

const formatNumber = (value: number) =>
  new Intl.NumberFormat('fa-IR').format(value)
</script>

<style scoped>
.bazbin-box {
  margin: 0.4rem 0 1.2rem;
  padding: 0.9rem;
  background: linear-gradient(135deg, #fffbeb, #fefce8);
  border: 1px solid #fde68a;
  border-radius: 15px;
}

.bazbin-box.qualified {
  background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
  border-color: #86efac;
}

.bazbin-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.bazbin-content {
  min-width: 0;
}

.bazbin-head strong {
  color: #92400e;
  font-size: 0.82rem;
  line-height: 1.8;
}

.bazbin-head p {
  margin: 0.25rem 0 0;
  color: #a16207;
  font-size: 0.72rem;
  line-height: 1.7;
}

.qualified .bazbin-head strong {
  color: #166534;
}

.qualified .bazbin-head p {
  color: #15803d;
}

.bazbin-image-wrapper {
  position: relative;
  flex-shrink: 0;
}

.bazbin-egg {
  display: block;
  width: 62px;
  height: 62px;
  object-fit: contain;
  filter: drop-shadow(
    0 5px 7px rgb(146 64 14 / 18%)
  );
}

.bazbin-count {
  position: absolute;
  top: -6px;
  right: -7px;
  z-index: 1;
  min-width: 25px;
  padding: 0.15rem 0.35rem;
  color: white;
  background: #16a34a;
  border: 2px solid white;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 900;
  text-align: center;
}

.next-reward {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  margin-bottom: 0.45rem;
  color: #92400e;
  font-size: 0.68rem;
}

.next-reward strong {
  font-size: 0.67rem;
}

.qualified .next-reward {
  color: #166534;
}

.progress {
  height: 9px;
  overflow: hidden;
  background: #fef3c7;
  border-radius: 999px;
}

.progress__fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    #facc15,
    #f59e0b
  );
  border-radius: inherit;
  transition: width 0.35s ease;
}

.qualified .progress {
  background: #dcfce7;
}

.qualified .progress__fill {
  background: linear-gradient(
    90deg,
    #22c55e,
    #16a34a
  );
}

.progress-values {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.4rem;
  color: #a16207;
  font-size: 0.67rem;
  font-weight: 700;
}

.qualified .progress-values {
  color: #15803d;
}

@media (max-width: 560px) {
  .bazbin-egg {
    width: 54px;
    height: 54px;
  }

  .next-reward {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.15rem;
  }
}
</style>
