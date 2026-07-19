<script setup lang="ts">
defineProps<{
  title: string
  totalProducts: number
  ordering: string
  activeFiltersCount: number
}>()

const emit = defineEmits<{
  changeOrdering: [value: string]
  openFilters: []
}>()

const handleOrderingChange = (
  event: Event,
) => {
  const target =
    event.target as HTMLSelectElement

  emit(
    'changeOrdering',
    target.value,
  )
}
</script>

<template>
  <header class="products-toolbar">
    <div class="products-toolbar__start">
      <button
        type="button"
        class="mobile-filter-button"
        @click="emit('openFilters')"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M4 6h16M7 12h10M10 18h4"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        فیلترها

        <span
          v-if="activeFiltersCount"
          class="mobile-filter-button__count"
        >
          {{ activeFiltersCount }}
        </span>
      </button>

      <div>
        <h2 class="products-toolbar__title">
          {{ title }}
        </h2>

        <p class="products-toolbar__count">
          {{
            totalProducts.toLocaleString(
              'fa-IR',
            )
          }}
          محصول
        </p>
      </div>
    </div>

    <label class="sort-control">
      <span>مرتب‌سازی:</span>

      <select
        :value="ordering"
        @change="handleOrderingChange"
      >
        <option value="">
          پیش‌فرض
        </option>

        <option value="-created_at">
          جدیدترین
        </option>

        <option value="price">
          ارزان‌ترین
        </option>

        <option value="-price">
          گران‌ترین
        </option>
      </select>
    </label>
  </header>
</template>

<style scoped>
.products-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  margin-bottom: 18px;
  padding: 14px 18px;
  border: 1px solid #e6eee9;
  border-radius: 18px;
  background: white;
  box-shadow:
    0 10px 28px
    rgba(15, 23, 42, 0.045);
}

.products-toolbar__start {
  display: flex;
  align-items: center;
  gap: 12px;
}

.products-toolbar__title {
  margin: 0;
  color: #1e293b;
  font-size: 17px;
  font-weight: 900;
}

.products-toolbar__count {
  margin: 5px 0 0;
  color: #94a3b8;
  font-size: 12px;
}

.mobile-filter-button {
  display: none;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dbe5df;
  border-radius: 11px;
  background: #f8fafc;
  color: #475569;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
}

.mobile-filter-button svg {
  width: 18px;
  height: 18px;
}

.mobile-filter-button__count {
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  background: #059669;
  color: white;
  font-size: 10px;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #64748b;
  font-size: 12px;
}

.sort-control select {
  height: 41px;
  min-width: 150px;
  padding: 0 12px;
  border: 1px solid #dbe5df;
  border-radius: 11px;
  background: #f8fafc;
  color: #334155;
  font-family: inherit;
  outline: none;
  cursor: pointer;
}

@media (max-width: 960px) {
  .mobile-filter-button {
    display: inline-flex;
  }
}

@media (max-width: 720px) {
  .products-toolbar {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .products-toolbar__start {
    justify-content: space-between;
  }

  .sort-control {
    justify-content: space-between;
  }

  .sort-control select {
    flex: 1;
  }
}
</style>
