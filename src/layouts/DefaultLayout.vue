<template>
  <div class="min-h-screen flex flex-col bg-gray-50 rtl">

    <!-- Global Loading -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
    >
      <div class="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Header -->
    <Header />

    <!-- Page Content -->
    <main class="flex-1 container mx-auto px-4 py-6">
      <router-view />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Toasts -->
    <ToastContainer :toasts="toasts" />

    <!-- Modal -->
    <Modal
      v-if="modal.show"
      :title="modal.title"
      :content="modal.content"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/layout/header/Header.vue"
import Footer from "@/components/layout/Footer.vue"
import ToastContainer from "@/components/ui/ToastContainer.vue"


import { useLoading } from "@/composables/useLoading"
import { useToast } from "@/composables/useToast"
import { useModal } from "@/composables/useModal"

/* ---------------- GLOBAL STATE ---------------- */

const { loading } = useLoading()
const { toasts } = useToast()

const { modal, closeModal } = useModal()
</script>
