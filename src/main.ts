import { createApp } from "vue"
import App from "./App.vue"




import router from "@/core/router"
import { store } from "@/core/store"
import { registerPlugins } from "@/core/plugins"

import { useAuthStore } from "@/core/store/authStore"
import "./style.css"

const app = createApp(App)

app.use(store)
app.use(router)

const auth = useAuthStore()
if (auth.token)
  auth.fetchMe()



registerPlugins(app)
app.mount("#app")


