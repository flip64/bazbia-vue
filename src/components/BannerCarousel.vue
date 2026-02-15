<script setup>




import { ref, onMounted, onUnmounted } from "vue"

const props = defineProps({
  banners: { type: Array, required: true },
  interval: { type: Number, default: 4000 }
})

const current = ref(0)
let timer = null

const next = () => {
  current.value = (current.value + 1) % props.banners.length
}

const prev = () => {
  current.value =
    (current.value - 1 + props.banners.length) % props.banners.length
}

const go = (i) => (current.value = i)

const start = () => {
  stop()
  timer = setInterval(next, props.interval)
}

const stop = () => {
  if (timer) clearInterval(timer)
}

onMounted(start)
onUnmounted(stop)

// swipe mobile
let startX = 0
const touchStart = e => (startX = e.touches[0].clientX)
const touchEnd = e => {
  const diff = e.changedTouches[0].clientX - startX
  if (diff > 50) prev()
  if (diff < -50) next()
}
console.log('🎯 Banner 1 URL:', props.banners[0]?.image)
console.log('🎯 Banner 2 URL:', props.banners[1]?.image)
console.log('📦 All banners:', JSON.stringify(props.banners, null, 2))
</script>

<template>
  <div
    class="carousel"
    @mouseenter="stop"
    @mouseleave="start"
    @touchstart="touchStart"
    @touchend="touchEnd"
  >
    <!-- slides -->
    <div
      class="slides"
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <a
        v-for="(banner, i) in banners"
        :key="i"
        :href="banner.link || '#'"
        class="slide"
      >
        <img :src="banner.image" :alt="banner.title" />
      </a>
    </div>

    <!-- arrows -->
    <button class="nav prev" @click="prev">‹</button>
    <button class="nav next" @click="next">›</button>

    <!-- dots -->
    <div class="dots">
      <span
        v-for="(_, i) in banners"
        :key="i"
        :class="{ active: i === current }"
        @click="go(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: 16px;
}

.slides {
  display: flex;
  transition: transform 0.6s ease;
}

.slide {
  min-width: 100%;
}

.slide img {
  width: 100%;
  height: 320px;
  object-fit: cover;
}

/* arrows */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  font-size: 28px;
  padding: 8px 14px;
  cursor: pointer;
  border-radius: 50%;
  backdrop-filter: blur(6px);
}

.prev { left: 10px }
.next { right: 10px }

/* dots */
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
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
}

.dots span.active {
  background: #333;
}

/* responsive */
@media (max-width: 768px) {
  .slide img {
    height: 180px;
  }
}
</style>
