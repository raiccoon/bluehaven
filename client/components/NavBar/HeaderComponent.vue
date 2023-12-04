<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="container">
    <img class="title" src="@/assets/images/logo.svg" />
    <RouterLink :to="{ name: 'Home' }">
      <img class="title" src="@/assets/images/title.png" />
    </RouterLink>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
img {
  height: 2em;
}
.title {
  display: inline;
}
@media (max-width: 800px) {
  .title {
    display: none;
  }
}
</style>
