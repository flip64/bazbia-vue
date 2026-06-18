<template>
  <div
    style="
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 9999;
      background: red;
      color: white;
      padding: 10px;
      font-weight: bold;
    "
  >
    current: {{ current }}
    <br>
    banners: {{ banners.length }}
  </div>  <div
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
        :key="i"
        class="slide"
      >
        <div
          style="
            position:absolute;
            top:20px;
            right:20px;
            background:blue;
            color:white;
            z-index:999;
            padding:8px;
            font-size:20px;
          "
        >
          slide {{ i }}
        </div>    <img
      :src="banner.image"
      :alt="banner.title"
    />
  </div>
</div>

<button
  class="nav prev"
  @click="prev"
>
  ‹
</button>

<button
  class="nav next"
  @click="next"
>
  ›
</button>

  </div>
</template>
