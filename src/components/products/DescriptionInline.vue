<template>
  <template v-for="(part, index) in parts" :key="index">
    <a
      v-if="part.href"
      :href="part.href"
      class="description-link"
    >{{ part.text }}</a>
    <template v-else>{{ part.text }}</template>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { parseDescriptionLinks } from '@/utils/descriptionLinks'

const props = defineProps<{ text: string }>()
const parts = computed(() => parseDescriptionLinks(props.text))
</script>

<style scoped>
.description-link {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 3px;
  overflow-wrap: anywhere;
}

.description-link:hover {
  color: #1d4ed8;
}
</style>
