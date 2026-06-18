<template>
  <div
    class="carousel"
    @mouseenter="stop"
    @mouseleave="start"
    @touchstart="touchStart"
    @touchend="touchEnd"
  >
    <div
      class="track"
      :style="{
        transform: `translateX(-${current * 100}%)`
      }"
    >
      <div
        v-for="(banner, i) in banners"
        :key="banner.id || i"
        class="slide"
      >
        <div class="debug">
          {{ i }}
        </div>    <img :src="banner.image" />
  </div>
</div>

<button class="nav prev" @click="prev">‹</button>
<button class="nav next" @click="next">›</button>

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

const start = () => {
  stop()
  if (props.banners.length <= 1) return

  timer = setInterval(next, props.interval)
}

const stop = () => {
  if (timer) clearInterval(timer)
}

watch(() => props.banners.length, () => {
  current.value = 0
  start()
})

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

.track {
  display: flex;
  width: 100%;
  transition: transform 0.5s ease;
}

.slide {
  flex: 0 0 100%;
  position: relative;
}

.slide img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.debug {
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  padding: 4px 8px;
  z-index: 10;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.7);
  border: none;
  padding: 8px 12px;
  cursor: pointer;
}

.prev { left: 10px }
.next { right: 10px }
</style>
