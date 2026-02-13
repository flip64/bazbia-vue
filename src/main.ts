import { createApp } from "vue"
import App from "./App.vue"



import router from "@/core/router"
import { store } from "@/core/store"
import { registerPlugins } from "@/core/plugins"

import { useAuthStore } from "@/modules/auth/store/authStore"

const auth = useAuthStore()
if (auth.token)
  auth.fetchMe()



const app = createApp(App)

app.use(router)
app.use(store)

registerPlugins(app)

app.mount("#app")
