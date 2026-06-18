<template>
  <div
    class="carousel"
    @mouseenter="stop"
    @mouseleave="start"
    @touchstart="touchStart"
    @touchend="touchEnd"
  >
    <div
      class="slides"
      :style="{
        transform: `translateX(-${current * 100}%)`
      }"
    >
      <div
        v-for="(banner, i) in banners"
        :key="banner.id || i"
        class="slide"
      >
        <img
          :src="banner.image"
          :alt="banner.title || 'banner'"
        />
      </div>
    </div><button
  v-if="banners.length > 1"
  class="nav prev"
  @click="prev"
>
  ‹
</button>

<button
  v-if="banners.length > 1"
  class="nav next"
  @click="next"
>
  ›
</button>

<div
  v-if="banners.length > 1"
  class="dots"
>
  <span
    v-for="(_, i) in banners"
    :key="i"
    :class="{ active: i === current }"
    @click="go(i)"
  />
</div>

  </div>
</template><script setup>
import { ref, onMounted, onUnmounted, watch } from "vue"

const props = defineProps({
  banners: {
    type: Array,
    default: () => []
  },
  interval: {
    type: Number,
    default: 4000
  }
})

const current = ref(0)
let timer = null

const next = () => {
  if (!props.banners.length) return
  current.value = (current.value + 1) % props.banners.length
}

const prev = () => {
  if (!props.banners.length) return
  current.value =
    (current.value - 1 + props.banners.length) %
    props.banners.length
}

const go = (index) => {
  current.value = index
}

const stop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const start = () => {
  stop()

  if (props.banners.length <= 1) return

  timer = setInterval(() => {
    next()
  }, props.interval)
}

watch(
  () => props.banners.length,
  () => {
    current.value = 0
    start()
  }
)

onMounted(start)
onUnmounted(stop)

let startX = 0

const touchStart = (e) => {
  startX = e.touches[0].clientX
}

const touchEnd = (e) => {
  const diff = e.changedTouches[0].clientX - startX

  if (diff > 50) prev()
  if (diff < -50) next()
}
</script><style scoped>
.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
}

.slides {
  display: flex;
  transition: transform 0.5s ease;
}

.slide {
  width: 100%;
  flex: 0 0 100%;
}

.slide img {
  display: block;
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  z-index: 10;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dots span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #d1d5db;
  cursor: pointer;
}

.dots span.active {
  background: #2563eb;
}

@media (max-width: 768px) {
  .slide img {
    height: 180px;
  }
}
</style>
