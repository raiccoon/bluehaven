<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const displayMsg = ref(false);
const msg = ref("message");

const getBookmarks = async () => {
  let bookmarkResults;
  try {
    bookmarkResults = await fetchy("/api/bookmarks", "GET");
  } catch (_) {
    return;
  }
  msg.value = bookmarkResults;
  displayMsg.value = true;
};
</script>

<template>
  <main>
    <button @click="getBookmarks">Click to see all the posts you have bookmarked</button>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
