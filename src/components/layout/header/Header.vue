<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import "./Header.css"

const drawer = ref(false)
const cartCount = ref(3)
const userMenu = ref(false)

const menuItems = [
  {
    title: "محصولات",
    subItems: [
      { title: "موبایل", link: "/products/mobile" },
      { title: "لپ‌تاپ", link: "/products/laptop" },
      { title: "ساعت هوشمند", link: "/products/watch" },
    ],
  },
  { title: "دسته‌بندی", link: "/categories" },
  { title: "برندها", link: "/brands" },
  { title: "تماس", link: "/contact" },
]

// scroll shadow effect
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<template>
  <!-- APP BAR -->
  <v-app-bar
    app
    class="header-bar"
    :class="{ scrolled }"
    elevation="3"
    prominent
  >
    <v-app-bar-nav-icon class="mobile-menu" @click="drawer = true" />

    <v-toolbar-title class="header-logo">BAZBIA</v-toolbar-title>

    <div class="desktop-menu">
      <v-menu
        v-for="item in menuItems"
        :key="item.title"
        offset-y
        open-on-hover
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ props }">
          <v-btn variant="text" class="header-btn" v-bind="props">
            {{ item.title }}
          </v-btn>
        </template>

        <v-list v-if="item.subItems">
          <v-list-item
            v-for="sub in item.subItems"
            :key="sub.title"
            :title="sub.title"
          />
        </v-list>
      </v-menu>
    </div>

    <v-spacer />

    <v-text-field
      class="header-search desktop-menu"
      density="compact"
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      placeholder="جستجو در محصولات..."
      hide-details
    />

    <v-btn icon>
      <v-badge :content="cartCount" color="red" overlap class="header-badge">
        <v-icon>mdi-cart</v-icon>
      </v-badge>
    </v-btn>

    <v-menu v-model="userMenu" bottom left>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item title="ورود" />
        <v-list-item title="ثبت‌نام" />
        <v-list-item title="پروفایل" />
      </v-list>
    </v-menu>
  </v-app-bar>

  <!-- موبایل drawer با انیمیشن -->
  <v-navigation-drawer v-model="drawer" temporary location="left">
    <v-list>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        <v-list-group v-if="item.subItems" no-action>
          <v-list-item
            v-for="sub in item.subItems"
            :key="sub.title"
          >
            <v-list-item-title>{{ sub.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
