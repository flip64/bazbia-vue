<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ text: string }>();
// Render a deliberately small text format without interpreting HTML.
const blocks = computed(() => props.text.split(/\n\s*\n/).filter(Boolean).map(text => {
  const lines = text.split("\n");
  if (lines.every(line => /^-\s+/.test(line))) return { kind: "list", lines: lines.map(line => line.replace(/^-\s+/, "")), text: "" };
  if (/^##\s+/.test(text)) return { kind: "heading", text: text.replace(/^##\s+/, ""), lines: [] };
  return { kind: "paragraph", text, lines: [] };
}));
</script>
<template><div class="coin-story"><template v-for="(block, index) in blocks" :key="index"><h3 v-if="block.kind === 'heading'">{{ block.text }}</h3><ul v-else-if="block.kind === 'list'"><li v-for="(line, n) in block.lines" :key="n">{{ line }}</li></ul><p v-else>{{ block.text }}</p></template></div></template>
