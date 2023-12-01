<script setup lang="ts">
import addPin from "@/components/Pin/boilerplate/addPin.vue";
import deletePin from "@/components/Pin/boilerplate/deletePin.vue";
import getPostOnPins from "@/components/Pin/boilerplate/getPostOnPins.vue";
</script>

<template>
  <main>
    <h1>Pin</h1>
    <div class="column">
      <addPin />
      <deletePin />
      <getPostOnPins />
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
