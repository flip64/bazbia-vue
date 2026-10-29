<script setup lang="ts">
import { computed } from 'vue';
import ProductCard from '@/components/products/ProductCard.vue';
import type { Product } from '@/types/product.types';
import type { CoinCard, CoinKind } from '@/types/coin.types';
import { number, safeURL } from './format';
const props = defineProps<{ item: CoinCard; kind: CoinKind }>();
// Share the store card and its navigation; catalog cards never add a synthetic variant.
const product = computed(() => ({
  id: props.item.id,
  name: props.item.name + (props.item.mint_year == null ? '' : ` · ${number(props.item.mint_year)}`),
  slug: props.item.slug,
  thumb: safeURL(props.item.image?.url),
  price: props.item.min_price,
  in_stock: props.item.in_stock,
  variants: [{ id: 0, stock: props.item.in_stock ? 1 : 0 }],
  storefront: {
    kind: props.kind,
    url: `${props.kind === 'pack' ? '/coin-packs/' : props.item.is_group ? '/coins/groups/' : '/coins/'}${encodeURIComponent(props.item.slug)}`,
  },
}) as unknown as Product);
</script>
<template>
  <ProductCard :product="product" :catalog-only="item.min_price == null"
    :coin-meta="[item.issuer?.name, item.period?.name, item.denomination_label].filter(Boolean).join(' · ')"
    :secondary-image="safeURL(item.images?.[1]?.url)" :price-from="true" />
</template>
