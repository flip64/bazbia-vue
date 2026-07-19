<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const displayedPages = computed(() => {
  if (props.totalPages <= 5) {
    return Array.from(
      {
        length: props.totalPages,
      },
      (_, index) => index + 1,
    )
  }

  const pages = new Set<number>()

  pages.add(1)
  pages.add(props.totalPages)
  pages.add(props.currentPage)

  if (props.currentPage > 1) {
    pages.add(
      props.currentPage - 1,
    )
  }

  if (
    props.currentPage <
    props.totalPages
  ) {
    pages.add(
      props.currentPage + 1,
    )
  }

  return Array.from(pages).sort(
    (a, b) => a - b,
  )
})

const changePage = (
  page: number,
) => {
  if (
    page < 1 ||
    page > props.totalPages ||
    page === props.currentPage
  ) {
    return
  }

  emit('change', page)
}
</script>

<template>
  <nav class="pagination">
    <button
      type="button"
      class="pagination__button pagination__button--arrow"
      :disabled="currentPage === 1"
      @click="
        changePage(currentPage - 1)
      "
    >
      ‹
    </button>

    <template
      v-for="(page, index) in displayedPages"
      :key="page"
    >
      <span
        v-if="
          index > 0 &&
          page -
            displayedPages[index - 1] >
            1
        "
        class="pagination__dots"
      >
        …
      </span>

      <button
        type="button"
        class="pagination__button"
        :class="{
          'pagination__button--active':
            page === currentPage,
        }"
        @click="changePage(page)"
      >
        {{
          page.toLocaleString(
            'fa-IR',
          )
        }}
      </button>
    </template>

    <button
      type="button"
      class="pagination__button pagination__button--arrow"
      :disabled="
        currentPage === totalPages
      "
      @click="
        changePage(currentPage + 1)
      "
    >
      ›
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 30px;
}

.pagination__button {
  display: grid;
  place-items: center;
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  border: 1px solid #dbe5df;
  border-radius: 11px;
  background: white;
  color: #475569;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.pagination__button:hover:not(
    :disabled
  ) {
  border-color: #6ee7b7;
  color: #047857;
}

.pagination__button--active {
  border-color: #047857;
  background: #047857;
  color: white;
}

.pagination__button--arrow {
  font-size: 24px;
}

.pagination__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__dots {
  color: #94a3b8;
}
</style>
