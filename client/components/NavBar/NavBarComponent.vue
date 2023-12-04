<script setup lang="ts">
import MenuComponent from "@/components/NavBar/MenuComponent.vue";
import HeaderComponent from "@/components/NavBar/HeaderComponent.vue";
</script>

<template>
  <nav>
    <HeaderComponent />
    <MenuComponent />
  </nav>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@300&display=swap");
nav {
  padding: 1em 2em;
  background-color: #d6eaf9ff;
  display: flex;
  align-items: center;
  font-family: "Assistant", sans-serif;
}
</style>
