import { ref } from "vue"

const loadingCount = ref(0) // 👈 مهم: برای چند درخواست همزمان
const loading = ref(false)

function startLoading() {
  loadingCount.value++
  loading.value = true
}

function stopLoading() {
  if (loadingCount.value > 0) {
    loadingCount.value--
  }

  if (loadingCount.value === 0) {
    loading.value = false
  }
}

function resetLoading() {
  loadingCount.value = 0
  loading.value = false
}

export function useLoading() {
  return {
    loading,
    startLoading,
    stopLoading,
    resetLoading,
  }
}
