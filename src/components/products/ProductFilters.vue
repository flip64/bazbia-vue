<script setup lang="ts">
import { computed, ref } from 'vue'

import type { Category } from '@/types/category.types'

const props = defineProps<{
  categories: Category[]
  loading: boolean
  mobileOpen: boolean
  activeFiltersCount: number

  category: string
  inStock: boolean
  hasDiscount: boolean
  minPrice: string
  maxPrice: string
}>()

const emit = defineEmits<{
  'update:category': [value: string]
  'update:inStock': [value: boolean]
  'update:hasDiscount': [value: boolean]
  'update:minPrice': [value: string]
  'update:maxPrice': [value: string]

  apply: []
  clear: []
  close: []
  selectCategory: [slug: string]
}>()

const categorySearch = ref('')
const expandedCategories = ref<number[]>([])

const localMinPrice = computed({
  get: () => props.minPrice,

  set: value => {
    emit('update:minPrice', value)
  },
})

const localMaxPrice = computed({
  get: () => props.maxPrice,

  set: value => {
    emit('update:maxPrice', value)
  },
})

const localInStock = computed({
  get: () => props.inStock,

  set: value => {
    emit('update:inStock', value)
    emit('apply')
  },
})

const localHasDiscount = computed({
  get: () => props.hasDiscount,

  set: value => {
    emit('update:hasDiscount', value)
    emit('apply')
  },
})

const filteredCategories = computed(() => {
  const search =
    categorySearch.value
      .trim()
      .toLowerCase()

  if (!search) {
    return props.categories
  }

  const filterTree = (
    categories: Category[],
  ): Category[] => {
    return categories.reduce<Category[]>(
      (result, category) => {
        const children = filterTree(
          category.subcategories ?? [],
        )

        const matches =
          category.name
            .toLowerCase()
            .includes(search)

        if (
          matches ||
          children.length > 0
        ) {
          result.push({
            ...category,
            subcategories: children,
          })
        }

        return result
      },
      [],
    )
  }

  return filterTree(props.categories)
})

const toggleCategory = (
  category: Category,
) => {
  if (
    !category.subcategories?.length
  ) {
    emit(
      'selectCategory',
      category.slug,
    )

    return
  }

  if (
    expandedCategories.value.includes(
      category.id,
    )
  ) {
    expandedCategories.value =
      expandedCategories.value.filter(
        id => id !== category.id,
      )

    return
  }

  expandedCategories.value.push(
    category.id,
  )
}

const selectCategory = (
  slug: string,
) => {
  emit('update:category', slug)
  emit('selectCategory', slug)
}

const clearCategory = () => {
  emit('update:category', '')
  emit('selectCategory', '')
}
</script>

<template>
  <aside
    class="filters-panel"
    :class="{
      'filters-panel--open':
        mobileOpen,
    }"
  >
    <div class="filters-panel__header">
      <div>
        <h2 class="filters-panel__title">
          فیلتر محصولات
        </h2>

        <span
          v-if="activeFiltersCount"
          class="filters-panel__count"
        >
          {{
            activeFiltersCount.toLocaleString(
              'fa-IR',
            )
          }}
          فیلتر فعال
        </span>
      </div>

      <button
        type="button"
        class="filters-panel__close"
        @click="emit('close')"
      >
        ×
      </button>
    </div>

    <!-- دسته‌بندی -->
    <div class="filter-group">
      <div class="filter-group__heading">
        <h3 class="filter-group__title">
          دسته‌بندی‌ها
        </h3>

        <button
          v-if="category"
          type="button"
          class="filter-group__reset"
          @click="clearCategory"
        >
          حذف
        </button>
      </div>

      <input
        v-model="categorySearch"
        type="search"
        class="category-search"
        placeholder="جستجوی دسته‌بندی..."
      />

      <div
        v-if="loading"
        class="filter-loading"
      >
        <span class="spinner"></span>
      </div>

      <div
        v-else
        class="categories-list"
      >
        <div
          v-for="item in filteredCategories"
          :key="item.id"
          class="category-item"
        >
          <button
            type="button"
            class="category-row"
            :class="{
              'category-row--active':
                category === item.slug,
            }"
            @click="toggleCategory(item)"
          >
            <span class="category-row__name">
              {{ item.name }}
            </span>

            <span
              class="category-row__count"
            >
              {{
                Number(
                  item.products_count || 0,
                ).toLocaleString('fa-IR')
              }}
            </span>

            <svg
              v-if="
                item.subcategories?.length
              "
              class="category-row__arrow"
              :class="{
                'category-row__arrow--open':
                  expandedCategories.includes(
                    item.id,
                  ),
              }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <div
            v-if="
              item.subcategories?.length &&
              expandedCategories.includes(
                item.id,
              )
            "
            class="subcategories"
          >
            <button
              v-for="subcategory in item.subcategories"
              :key="subcategory.id"
              type="button"
              class="subcategory"
              :class="{
                'subcategory--active':
                  category ===
                  subcategory.slug,
              }"
              @click="
                selectCategory(
                  subcategory.slug,
                )
              "
            >
              <span>
                {{ subcategory.name }}
              </span>

              <span>
                {{
                  Number(
                    subcategory.products_count ||
                      0,
                  ).toLocaleString(
                    'fa-IR',
                  )
                }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- قیمت -->
    <div class="filter-group">
      <h3 class="filter-group__title">
        محدوده قیمت
      </h3>

      <div class="price-inputs">
        <label class="price-field">
          <span>حداقل قیمت</span>

          <input
            v-model="localMinPrice"
            type="number"
            min="0"
            placeholder="۰"
          />
        </label>

        <label class="price-field">
          <span>حداکثر قیمت</span>

          <input
            v-model="localMaxPrice"
            type="number"
            min="0"
            placeholder="بدون محدودیت"
          />
        </label>
      </div>

      <button
        type="button"
        class="apply-price-button"
        @click="emit('apply')"
      >
        اعمال محدوده قیمت
      </button>
    </div>

    <!-- وضعیت -->
    <div class="filter-group">
      <h3 class="filter-group__title">
        وضعیت محصول
      </h3>

      <label class="switch-row">
        <span class="switch-row__label">
          فقط محصولات موجود
        </span>

        <input
          v-model="localInStock"
          type="checkbox"
        />

        <span class="switch"></span>
      </label>

      <label class="switch-row">
        <span class="switch-row__label">
          فقط محصولات تخفیف‌دار
        </span>

        <input
          v-model="localHasDiscount"
          type="checkbox"
        />

        <span class="switch"></span>
      </label>
    </div>

    <button
      type="button"
      class="clear-all-button"
      @click="emit('clear')"
    >
      پاک کردن همه فیلترها
    </button>
  </aside>
</template>

<style scoped>
.filters-panel {
  position: sticky;
  top: 18px;
  padding: 20px;
  border: 1px solid #e6eee9;
  border-radius: 20px;
  background: white;
  box-shadow:
    0 14px 35px
    rgba(15, 23, 42, 0.06);
}

.filters-panel__header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf2ef;
}

.filters-panel__title {
  margin: 0;
  color: #1f2937;
  font-size: 17px;
  font-weight: 900;
}

.filters-panel__count {
  display: block;
  margin-top: 6px;
  color: #059669;
  font-size: 11px;
  font-weight: 700;
}

.filters-panel__close {
  display: none;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 23px;
  cursor: pointer;
}

.filter-group {
  padding: 20px 0;
  border-bottom: 1px solid #edf2ef;
}

.filter-group__heading {
  display: flex;
  justify-content: space-between;
}

.filter-group__title {
  margin: 0 0 14px;
  color: #334155;
  font-size: 14px;
  font-weight: 900;
}

.filter-group__reset {
  margin-bottom: 14px;
  border: 0;
  background: transparent;
  color: #dc2626;
  font-family: inherit;
  cursor: pointer;
}

.category-search {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 0 12px;
  border: 1px solid #dfe7e2;
  border-radius: 11px;
  background: #f8fafc;
  font-family: inherit;
  outline: none;
}

.categories-list {
  max-height: 330px;
  overflow-y: auto;
}

.category-row {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  gap: 8px;
  padding: 0 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #475569;
  font-family: inherit;
  cursor: pointer;
}

.category-row:hover,
.category-row--active {
  background: #ecfdf5;
  color: #047857;
}

.category-row__name {
  flex: 1;
  text-align: right;
  font-size: 13px;
  font-weight: 700;
}

.category-row__count {
  color: #94a3b8;
  font-size: 11px;
}

.category-row__arrow {
  width: 15px;
  transition: 0.2s;
}

.category-row__arrow--open {
  transform: rotate(180deg);
}

.subcategories {
  margin: 5px 14px 8px 0;
  padding-right: 10px;
  border-right: 2px solid #d1fae5;
}

.subcategory {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 8px 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-family: inherit;
  cursor: pointer;
}

.subcategory:hover,
.subcategory--active {
  background: #f0fdf4;
  color: #047857;
}

.price-inputs {
  display: grid;
  gap: 10px;
}

.price-field {
  display: grid;
  gap: 6px;
}

.price-field span {
  color: #64748b;
  font-size: 11px;
}

.price-field input {
  width: 100%;
  height: 40px;
  padding: 0 11px;
  border: 1px solid #dfe7e2;
  border-radius: 10px;
  background: #f8fafc;
  font-family: inherit;
  outline: none;
}

.apply-price-button {
  width: 100%;
  height: 40px;
  margin-top: 12px;
  border: 0;
  border-radius: 11px;
  background: #ecfdf5;
  color: #047857;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
}

.switch-row {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 43px;
  cursor: pointer;
}

.switch-row input {
  position: absolute;
  opacity: 0;
}

.switch-row__label {
  flex: 1;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}

.switch {
  position: relative;
  width: 40px;
  height: 23px;
  border-radius: 999px;
  background: #cbd5e1;
  transition: 0.2s;
}

.switch::after {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: white;
  content: '';
  transition: 0.2s;
}

.switch-row input:checked + .switch {
  background: #059669;
}

.switch-row input:checked
  + .switch::after {
  transform: translateX(-17px);
}

.clear-all-button {
  width: 100%;
  height: 43px;
  margin-top: 18px;
  border: 1px solid #fecaca;
  border-radius: 12px;
  background: #fff7f7;
  color: #dc2626;
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
}

.filter-loading {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.spinner {
  width: 25px;
  height: 25px;
  border: 3px solid #d1fae5;
  border-top-color: #059669;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 960px) {
  .filters-panel {
    position: fixed;
    z-index: 1001;
    top: 0;
    right: 0;
    width: min(340px, 88vw);
    height: 100dvh;
    overflow-y: auto;
    border-radius: 0;
    transform: translateX(110%);
    transition: transform 0.25s;
  }

  .filters-panel--open {
    transform: translateX(0);
  }

  .filters-panel__close {
    display: block;
  }
}
</style>
