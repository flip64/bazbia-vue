<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b px-5 py-4"
      >
        <h3 class="text-lg font-bold text-gray-800">
          {{ title }}
        </h3>

        <button
          @click="emit('close')"
          class="text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="p-5 text-gray-700 whitespace-pre-line">
        {{ content }}
      </div>

      <!-- Footer -->
      <div class="flex justify-end border-t px-5 py-4">
        <button
          @click="emit('close')"
          class="rounded-xl bg-primary px-4 py-2 text-white hover:opacity-90"
        >
          متوجه شدم
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  content: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>
