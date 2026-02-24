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
        @click="$emit('select', category.slug)"
      >
        <div class="category-node__info">
          <button 
            v-if="category.subcategories?.length"
            class="category-node__toggle"
            @click.stop="$emit('toggle', category.id)"
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
            @select="$emit('select', $event)"
            @toggle="$emit('toggle', $event)"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/types/category.types'

defineProps<{
  categories: Category[]
  selectedSlug: string
  expandedCats: number[]
}>()

defineEmits<{
  (e: 'select', slug: string): void
  (e: 'toggle', categoryId: number): void
}>()

const isExpanded = (categoryId: number) => {
  return props.expandedCats.includes(categoryId)
}
</script>

<style scoped>
.category-tree {
  font-size: 0.95rem;
}

.category-node__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.5rem;
}

.category-node__item:hover {
  background: #f3f4f6;
}

.category-node__item.active {
  color: #8B5CF6;
  font-weight: 500;
}

.category-node__info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-node__toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.category-node__toggle:hover {
  color: #8B5CF6;
}

.category-node__bullet {
  width: 4px;
  height: 4px;
  background: #d1d5db;
  border-radius: 50%;
  margin: 0 0.5rem;
}

.category-node__children {
  margin-right: 1.5rem;
}

.category-node__count {
  font-size: 0.8rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.15rem 0.5rem;
  border-radius: 1rem;
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
</style>
