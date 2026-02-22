<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits(['update:currentPage', 'page-change'])

const displayedPages = computed(() => {
  const delta = 2
  const range:number[] = []
  const rangeWithDots:(number|string)[] = []
  let l:number | undefined

  for (let i = 1; i <= props.totalPages; i++) {
    if (
      i === 1 ||
      i === props.totalPages ||
      (i >= props.currentPage - delta && i <= props.currentPage + delta)
    ) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l !== undefined) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push("...")
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

function changePage(page:number) {
  if (page < 1 || page > props.totalPages) return
  emit("update:currentPage", page)
  emit("page-change", page)
}
</script>