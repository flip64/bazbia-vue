<!-- src/components/categories/CategoryTree.vue -->
<template>
  <div class="category-tree">
    <div v-for="category in categories" :key="category.id" class="category-node">
      <div 
        class="category-node__item"
        :class="{ 
          'active': selectedSlug === category.slug,
          'has-children': category.subcategories?.length 
        }"
        @click="handleSelect(category)"
      >
        <div class="category-node__info">
          <button 
            v-if="category.subcategories?.length"
            class="category-node__toggle"
            @click.stop="handleToggle(category.id)"
          >
            <svg 
              viewBox="0 0 24 24" 
              width="16" 
              height="16"
              :style="{ transform: isExpanded(category.id) ? 'rotate(90deg)' : 'rotate(0)' }"
            >
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
          
          <span v-else class="category-node__bullet"></span>
          
          <span class="category-node__name">{{ category.name }}</span>
        </div>
        
        <span v-if="category.product_count" class="category-node__count">
          {{ category.product_count }}
        </span>
      </div>
      
      <transition name="expand">
        <div 
          v-if="category.subcategories?.length && isExpanded(category.id)" 
          class="category-node__children"
        >
          <CategoryTree
            :categories="category.subcategories"
            :selected-slug="selectedSlug"
            :expanded-cats="expandedCats"
            @select="handleChildSelect"
            @toggle="handleChildToggle"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/types/category.types'

// ========== Props ==========
const props = defineProps<{
  categories: Category[]
  selectedSlug: string
  expandedCats: number[]
}>()

// ========== Emits ==========
const emit = defineEmits<{
  (e: 'select', slug: string): void
  (e: 'toggle', categoryId: number): void
}>()

// ========== Methods ==========
const isExpanded = (categoryId: number): boolean => {
  return props.expandedCats.includes(categoryId)
}

const handleSelect = (category: Category) => {
  emit('select', category.slug)
}

const handleToggle = (categoryId: number) => {
  emit('toggle', categoryId)
}

const handleChildSelect = (slug: string) => {
  emit('select', slug)
}

const handleChildToggle = (categoryId: number) => {
  emit('toggle', categoryId)
}
</script>

<style scoped>
.category-tree {
  font-size: 0.95rem;
  width: 100%;
}

.category-node {
  width: 100%;
}

.category-node__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.5rem;
  width: 100%;
}

.category-node__item:hover {
  background: #f3f4f6;
}

.category-node__item.active {
  color: #8B5CF6;
  font-weight: 500;
  background: #f3e8ff;
}

.category-node__info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.category-node__toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #6b7280;
  border-radius: 0.25rem;
}

.category-node__toggle:hover {
  color: #8B5CF6;
  background: #e5e7eb;
}

.category-node__bullet {
  width: 4px;
  height: 4px;
  background: #d1d5db;
  border-radius: 50%;
  margin: 0 0.5rem;
}

.category-node__name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-node__children {
  margin-right: 1.5rem;
}

.category-node__count {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.15rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

@media (max-width: 768px) {
  .category-node__item {
    padding: 0.75rem;
  }
  
  .category-node__name {
    font-size: 0.9rem;
  }
}
</style>
