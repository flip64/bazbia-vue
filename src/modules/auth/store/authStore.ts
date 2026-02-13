import { defineStore } from "pinia"
import { loginRequest, registerRequest, getMeRequest } from "../api/authApi"
import type { User } from "../types/user"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("token") || null,
    loading: false
  }),

  getters: {
    isAuth: state => !!state.token
  },

  actions: {

    async login(data:{email:string,password:string}) {
      this.loading = true
      try {
        const res = await loginRequest(data)
        this.token = res.data.token
        localStorage.setItem("token", this.token!)
        await this.fetchMe()
      } finally {
        this.loading = false
      }
    },

    async register(data:{name:string,email:string,password:string}) {
      await registerRequest(data)
    },

    async fetchMe() {
      const res = await getMeRequest()
      this.user = res.data
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem("token")
    }
  }
})
