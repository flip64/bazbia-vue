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

<style scoped>
.header{
  position:sticky;
  top:0;
  z-index:999;
  backdrop-filter:blur(10px);
  background:rgba(255,255,255,.85);
  border-bottom:1px solid #e5e7eb;
  font-family:system-ui;
}

/* container */
.header__container{
  max-width:1200px;
  margin:auto;
  padding:0 16px;
  height:64px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

/* logo */
.header__logo{
  display:flex;
  align-items:center;
  gap:10px;
  cursor:pointer;
}

.header__logoBox{
  width:38px;
  height:38px;
  border-radius:12px;
  background:linear-gradient(135deg,#2563eb,#60a5fa);
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:bold;
  transition:.25s;
}

.header__logo:hover .header__logoBox{
  transform:scale(1.05);
}

.header__logoText{
  font-weight:700;
  color:#374151;
}

/* search */
.header__search{
  flex:1;
  max-width:520px;
  position:relative;
}

.header__searchInput{
  width:100%;
  padding:12px 45px 12px 16px;
  border-radius:16px;
  border:1px solid transparent;
  background:#f3f4f6;
  transition:.25s;
}

.header__searchInput:focus{
  outline:none;
  background:white;
  border-color:#3b82f6;
  box-shadow:0 0 0 4px #dbeafe;
}

.header__searchIcon{
  position:absolute;
  right:15px;
  top:50%;
  transform:translateY(-50%);
  opacity:.6;
}

/* actions */
.header__actions{
  display:flex;
  gap:8px;
}

.header__icon{
  width:42px;
  height:42px;
  border-radius:14px;
  border:none;
  background:none;
  font-size:18px;
  cursor:pointer;
  transition:.2s;
}

.header__icon:hover{
  background:#eff6ff;
  color:#2563eb;
}

/* cart badge */
.header__cart{
  position:relative;
}

.header__badge{
  position:absolute;
  top:-3px;
  right:-3px;
  background:#ef4444;
  color:white;
  font-size:11px;
  width:18px;
  height:18px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
}

/* nav */
.header__nav{
  max-width:1200px;
  margin:auto;
  padding:6px 16px 12px;
  display:flex;
  gap:24px;
  font-size:14px;
  font-weight:500;
}

.header__navItem{
  position:relative;
  cursor:pointer;
  color:#374151;
}

.header__navItem:hover{
  color:#2563eb;
}

/* dropdown */
.header__dropdown{
  position:absolute;
  top:30px;
  background:white;
  border-radius:16px;
  box-shadow:0 10px 25px rgba(0,0,0,.08);
  padding:10px;
  width:180px;
  opacity:0;
  pointer-events:none;
  transform:translateY(10px);
  transition:.25s;
}

.header__navItem:hover .header__dropdown{
  opacity:1;
  pointer-events:auto;
  transform:translateY(0);
}

.header__dropdownItem{
  padding:10px;
  border-radius:10px;
  transition:.2s;
}

.header__dropdownItem:hover{
  background:#eff6ff;
  color:#2563eb;
}
</style>
