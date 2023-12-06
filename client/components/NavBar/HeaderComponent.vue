<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
<template>
  <div>
    <RouterLink class="container" :to="{ name: 'Classes' }">
      <img class="title" src="@/assets/images/logo.svg" />
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
