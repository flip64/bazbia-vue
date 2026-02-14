import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useAuthStore = defineStore("auth", () => {
  // state
  const user = ref(null)
  const token = ref(localStorage.getItem("token") || null)
  const loading = ref(false)

  // getters
  const isAuthenticated = computed(() => !!token.value)

  // actions
  function setUser(data: any) {
    user.value = data
  }

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem("token", newToken)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem("token")
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    setUser,
    setToken,
    logout
  }
})
