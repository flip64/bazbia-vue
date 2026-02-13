<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "../store/authStore"

const auth = useAuthStore()

const email = ref("")
const password = ref("")

const submit = () => {
  auth.login({ email: email.value, password: password.value })
}
</script>

<template>
  <div>
    <h2>Login</h2>
    <input v-model="email" placeholder="email" />
    <input v-model="password" type="password" placeholder="password" />
    <button @click="submit">Login</button>
  </div>
</template>
