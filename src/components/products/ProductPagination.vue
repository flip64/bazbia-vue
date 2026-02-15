<template>
  <div class="product-pagination" v-if="totalPages > 1">
    <button 
      class="product-pagination__btn"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      قبلی
    </button>

    <div class="product-pagination__pages">
      <button 
        v-for="page in displayedPages" 
        :key="page"
        class="product-pagination__page"
        :class="{ 'product-pagination__page--active': page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </div>

    <button 
      class="product-pagination__btn"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      بعدی
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits(['update:currentPage', 'page-change'])

const displayedPages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= props.totalPages; i++) {
    if (i === 1 || i === props.totalPages || (i >= props.currentPage - delta && i <= props.currentPage + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...
