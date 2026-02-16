import { createApp } from "vue"
import App from "./App.vue"



import router from "@/core/router"
import { store } from "@/core/store"
import { registerPlugins } from "@/core/plugins"

import { useAuthStore } from "@/modules/auth/store/authStore"


const app = createApp(App)

app.use(store)
app.use(router)

const auth = useAuthStore()
if (auth.token)
  auth.fetchMe()

app.mount("#app")



     





registerPlugins(app)


