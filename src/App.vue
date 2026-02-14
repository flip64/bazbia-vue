<template>
  <div class="min-h-screen flex flex-col bg-gray-50 rtl">

    <!-- Loader -->
    <div v-if="loading" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div class="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Header -->
    <Header />

    <!-- Pages -->
    <main class="flex-1 container mx-auto px-4 py-6">
      <router-view />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Toast -->
    <transition name="fade">
      <div
        v-if="toast.show"
        class="fixed bottom-6 left-6 bg-black text-white px-5 py-3 rounded-lg shadow-lg z-50"
      >
        {{ toast.message }}
      </div>
    </transition>

    <!-- Modal -->
    <div v-if="modal.show" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div class="bg-white rounded-xl p-6 w-96 shadow-xl relative">

        <button
          class="absolute top-2 left-3 text-gray-500 hover:text-black text-xl"
          @click="closeModal"
        >
          ×
        </button>

        <h2 class="text-lg font-bold mb-3">{{ modal.title }}</h2>
        <p class="text-gray-600">{{ modal.content }}</p>

        <button
          class="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          @click="closeModal"
        >
          باشه
        </button>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import Header from "@/components/layout/header/Header.vue"
import Footer from "@/components/layout/Footer.vue"

/* ---------------- LOADER ---------------- */
const loading = ref(false)

/* ---------------- TOAST ---------------- */
const toast = reactive({
  show: false,
  message: ""
})

function showToast(msg: string) {
  toast.message = msg
  toast.show = true
  setTimeout(() => (toast.show = false), 2500)
}

/* ---------------- MODAL ---------------- */
const modal = reactive({h  show: false,
  title: "",
  content: ""
})

function openModal(title: string, content: string) {
  modal.title = title
  modal.content = content
  modal.show = true
}

function closeModal() {
  modal.show = false
}

/* Global access (اختیاری) */
defineExpose({
  showToast,
  openModal
})
</script>

<style scoped>
.rtl {
  direction: rtl;
  unicode-bidi: embed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
