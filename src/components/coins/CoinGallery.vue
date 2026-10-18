<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Coins } from "lucide-vue-next";
import type { CoinImage } from "@/types/coin.types";
import { safeURL, views } from "./format";
const props = defineProps<{
  images: CoinImage[];
  title: string;
  itemNames?: Record<number, string>;
}>();
const selected = ref(0);
const broken = ref(false);
const active = computed(() => props.images[selected.value]);
watch(
  () => props.images,
  () => {
    selected.value = 0;
    broken.value = false;
  },
);
watch(active, () => (broken.value = false));
</script>
<template>
  <section class="coin-gallery" aria-label="تصاویر نمونه انتخاب‌شده">
    <a
      v-if="active && safeURL(active.url) && !broken"
      class="coin-gallery__main"
      :href="safeURL(active.url)"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="بازکردن تصویر در اندازه اصلی"
    >
      <img
        :src="safeURL(active.url)"
        :alt="
          active.alt_text ||
          `${title} ـ ${views[active.view_type || ''] || 'تصویر'}`
        "
        @error="broken = true"
      />
      <span
        >{{ views[active.view_type || ""] || "تصویر نمونه" }} · بزرگ‌نمایی
        ↗</span
      >
    </a>
    <div v-else class="coin-gallery__main coin-placeholder">
      <Coins :size="70" />
      <p>تصویر در دسترس نیست</p>
    </div>
    <div
      v-if="images.length"
      class="coin-gallery__thumbnails"
      aria-label="انتخاب نما"
    >
      <button
        v-for="(image, index) in images"
        :key="image.id"
        type="button"
        :class="{ active: selected === index }"
        :aria-pressed="selected === index"
        @click="selected = index"
      >
        <img
          v-if="safeURL(image.url)"
          :src="safeURL(image.url)"
          alt=""
          loading="lazy"
        />
        <span
          >{{ views[image.view_type || ""] || "تصویر"
          }}<template
            v-if="image.pack_item_id && itemNames?.[image.pack_item_id]"
          >
            · {{ itemNames[image.pack_item_id] }}</template
          ></span
        >
      </button>
    </div>
    <p v-if="active?.caption" class="coin-note">{{ active.caption }}</p>
  </section>
</template>
