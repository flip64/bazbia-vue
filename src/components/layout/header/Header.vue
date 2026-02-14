<template>
  <header class="header">

    <div class="header__container">

      <!-- logo -->
      <div class="header__logo" @click="goHome">
        <div class="header__logoBox">B</div>
        <span class="header__logoText">{{ logoText }}</span>
      </div>

      <!-- search -->
      <div class="header__search">
        <input
          v-model="search"
          placeholder="جستجوی محصول، برند، دسته‌بندی..."
          class="header__searchInput"
        />
        <span class="header__searchIcon">🔍</span>
      </div>

      <!-- actions -->
      <div class="header__actions">

        <button class="header__icon">❤</button>

        <button class="header__icon header__cart">
          🛒
          <span v-if="cartCount" class="header__badge">
            {{ cartCount }}
          </span>
        </button>

        <button class="header__icon">👤</button>

      </div>

    </div>

    <!-- nav -->
    <nav class="header__nav">

      <div
        v-for="cat in categories"
        :key="cat.name"
        class="header__navItem"
      >
        {{ cat.icon }} {{ cat.name }}

        <div v-if="cat.children" class="header__dropdown">
          <div
            v-for="sub in cat.children"
            :key="sub"
            class="header__dropdownItem"
          >
            {{ sub }}
          </div>
        </div>

      </div>

    </nav>

  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import "./header.css"

const props = withDefaults(defineProps<{
  logoText?: string
  cartItems?: number
}>(),{
  logoText:"بازبیا",
  cartItems:2
})

const router = useRouter()
const search = ref("")
const cartCount = computed(()=> props.cartItems)

function goHome(){
  router.push("/")
}

const categories = ref([
  {name:"دیجیتال",icon:"📱",children:["موبایل","لپ‌تاپ","هدفون"]},
  {name:"پوشاک",icon:"👕",children:["مردانه","زنانه"]},
  {name:"خانه",icon:"🏠"},
  {name:"کتاب",icon:"📚"}
])
</script>
