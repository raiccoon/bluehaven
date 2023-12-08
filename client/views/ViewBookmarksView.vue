<script setup lang="ts">
import BookmarksByClassComponent from "@/components/Bookmark/BookmarksByClassComponent.vue";

import router from "../router";

function goBack(classId: string) {
  void router.push({ path: `/classes/${classId}` });
}
</script>
<template>
  <main>
    <button class="back-button" @click="goBack($route.params.classId.toString())">
      <svg height="19.4px" viewBox="0 0 512 512" width="16px" xmlns="http://www.w3.org/2000/svg">
        <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 " />
      </svg>
      <p>Back</p>
    </button>
    <BookmarksByClassComponent :classId="$route.params.classId" />
  </main>
</template>
<style scoped>
.back-button {
  background-color: transparent;
  color: black;
  padding: 0px;
  border: none;
  border-radius: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
}
.icon svg {
  fill: black;
  width: 13px;
  margin: 0px;
}
.back-button:hover {
  text-decoration: underline;
}
</style>
