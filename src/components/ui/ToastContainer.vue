<template>
  <div class="toast-container">
    <div
      v-for="t in toast.toasts"
      :key="t.id"
      class="toast"
      :class="t.type"
      @click="toast.remove(t.id)"
    >
      {{ t.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/composables/useToast"
const toast = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
}

.toast {
  padding: 12px 16px;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  animation: slide .25s ease;
}

.success { background: #16a34a }
.error { background: #dc2626 }
.info { background: #2563eb }
.warning { background: #f59e0b }

@keyframes slide {
  from { opacity:0; transform: translateX(40px)}
  to { opacity:1; transform: translateX(0)}
}
</style>