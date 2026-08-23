import { createApp } from "vue"

import App from "./App.vue"

import router from "@/core/router"
import { store } from "@/core/store"
import { registerPlugins } from "@/core/plugins"
import { useAuthStore } from "@/core/store/authStore"

import "@/assets/tailwind.css"
import "./style.css"

const app = createApp(App)

app.use(store)
app.use(router)

registerPlugins(app)

const auth = useAuthStore()

if (auth.accessToken) {
  auth.fetchUserProfile().catch((error) => {
    console.error("خطا در دریافت اطلاعات کاربر:", error)
  })
}

app.mount("#app")