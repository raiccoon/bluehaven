<script setup lang="ts">
import MenuButton from "@/components/NavBar/MenuButton.vue";

import { ref, computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const showMenu = ref(false);
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
  const hamburger = document.getElementById("hamburger");
  if (showMenu.value) {
    hamburger?.classList.add("opened");
  } else {
    hamburger?.classList.remove("opened");
  }
};
const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
</script>

<template>
  <button id="hamburger" class="menu" @click="toggleMenu">
    <MenuButton />
  </button>
  <ul class="menu-items" :class="{ 'show-menu': showMenu }">
    <li>
      <RouterLink :to="{ name: 'Classes' }" :class="{ underline: currentRouteName == 'Classes' }"> Your Classes </RouterLink>
    </li>
    <li>
      <RouterLink :to="{ name: 'Boilerplate' }" :class="{ underline: currentRouteName == 'Boilerplate' }"> Boilerplate (for testing) </RouterLink>
    </li>
    <li>
      <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
    </li>
    <li>
      <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
a {
  font-size: large;
  color: black;
  text-decoration: none;
  transition: text-decoration 0.3s ease;
}

a:hover {
  text-decoration: underline;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}
.underline {
  font-weight: 900;
  text-decoration: underline;
}

@media (max-width: 800px) {
  .menu-items {
    display: none;
  }
  .show-menu {
    display: block;
  }
}
#hamburger {
  right: 1em;
  display: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}
@media (max-width: 800px) {
  #hamburger {
    display: flex;
  }
  ul.menu-items li {
    text-align: right;
  }
}
</style>
