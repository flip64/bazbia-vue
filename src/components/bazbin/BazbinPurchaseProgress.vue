<!-- src/components/bazbin/BazbinPurchaseProgress.vue -->
<template>
  <div
    class="bazbin-box"
    :class="{ complete: isCompleted }"
  >
    <div class="bazbin-head">
      <div>
        <strong v-if="isCompleted">
          تبریک! یک تخم بازبین هدیه می‌گیرید
        </strong>

        <strong v-else>
          {{ formatPrice(remainingAmount) }}
          تومان دیگر خرید کنید
        </strong>

        <p v-if="isCompleted">
          هدیه پس از پرداخت موفق سفارش صادر می‌شود.
        </p>

        <p v-else>
          تا یک تخم بازبین هدیه بگیرید.
        </p>
      </div>

      <img
        :src="eggImage"
        alt="تخم بازبین"
        class="bazbin-egg"
      />
    </div>

    <div
      class="progress"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="progress__fill"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <div class="progress-values">
      <span>{{ formatPrice(currentAmount) }} تومان</span>

      <span>
        {{ formatPrice(targetAmount) }} تومان
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

const remainingAmount = computed(() =>
  Math.max(props.targetAmount - props.currentAmount, 0),
)

const progress = computed(() => {
  if (props.targetAmount <= 0) {
    return 100
  }

  return Math.min(
    Math.max(
      (props.currentAmount / props.targetAmount) * 100,
      0,
    ),
    100,
  )
})

const isCompleted = computed(
  () => props.currentAmount >= props.targetAmount,
)

const formatPrice = (value: number) =>
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

.bazbin-box.complete {
  background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
  border-color: #86efac;
}

.bazbin-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.8rem;
}

.bazbin-head strong {
  color: #92400e;
  font-size: 0.82rem;
}

.bazbin-head p {
  margin: 0.25rem 0 0;
  color: #a16207;
  font-size: 0.72rem;
  line-height: 1.7;
}

.complete .bazbin-head strong {
  color: #166534;
}

.complete .bazbin-head p {
  color: #15803d;
}

.bazbin-egg {
  width: 62px;
  height: 62px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 5px 7px rgb(146 64 14 / 18%));
}

.progress {
  height: 9px;
  overflow: hidden;
  background: #fef3c7;
  border-radius: 999px;
}

.progress__fill {
  height: 100%;
  min-width: 2%;
  background: linear-gradient(90deg, #facc15, #f59e0b);
  border-radius: inherit;
  transition: width 0.35s ease;
}

.complete .progress__fill {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.progress-values {
  display: flex;
  justify-content: space-between;
  margin-top: 0.4rem;
  color: #a16207;
  font-size: 0.67rem;
  font-weight: 700;
}

.complete .progress-values {
  color: #15803d;
}

@media (max-width: 560px) {
  .bazbin-egg {
    width: 54px;
    height: 54px;
  }
}
</style>
