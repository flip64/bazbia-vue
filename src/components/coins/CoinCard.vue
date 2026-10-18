<script setup lang="ts">
import { Coins, ArrowLeft, Package } from "lucide-vue-next";
import { ref, watch } from "vue";
import type { CoinCard, CoinKind } from "@/types/coin.types";
import { money, number, calendars, safeURL } from "./format";
const props = defineProps<{ item: CoinCard; kind: CoinKind }>();
const broken = ref(false);
watch(
  () => props.item.image?.url,
  () => (broken.value = false),
);
</script>
<template>
  <RouterLink
    class="coin-card"
    :to="{
      name: kind === 'pack' ? 'coin-pack-detail' : 'coin-detail',
      params: { slug: item.slug },
    }"
  >
    <div class="coin-card__image">
      <img
        v-if="safeURL(item.image?.url) && !broken"
        :src="safeURL(item.image?.url)"
        :alt="item.image?.alt_text || item.name"
        loading="lazy"
        @error="broken = true"
      />
      <div v-else class="coin-placeholder">
        <Package v-if="kind === 'pack'" :size="60" /><Coins
          v-else
          :size="60"
        /><span>تصویر در دسترس نیست</span>
      </div>
      <span class="coin-badge" :class="{ muted: !item.in_stock }">{{
        item.in_stock ? "موجود" : "ناموجود"
      }}</span>
    </div>
    <div class="coin-card__body">
      <p class="coin-eyebrow">
        {{ item.issuer?.name || "چند کشور"
        }}<template v-if="item.period"> · {{ item.period.name }}</template>
      </p>
      <h2>{{ item.name }}</h2>
      <p class="coin-card__meta">
        {{
          kind === "pack"
            ? `${number(item.year)} ${calendars[item.calendar] || ""} · ${item.is_complete ? "مجموعه کامل" : "پک منتخب"}`
            : item.denomination_label || "سکه کلکسیونی"
        }}
      </p>
      <div class="coin-card__price">
        <span
          ><small>از </small><strong>{{ money(item.min_price) }}</strong>
          <small>تومان</small></span
        ><ArrowLeft :size="18" />
      </div>
      <span v-if="!item.in_stock" class="coin-note"
        >قیمت آخرین عرضه · قابل خرید نیست</span
      >
    </div>
  </RouterLink>
</template>
