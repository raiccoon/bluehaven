<script setup lang="ts">
import BookmarksByClassComponent from "@/components/Bookmark/BookmarksByClassComponent.vue";
import router from "../router";

function goBack(classId: string) {
  void router.push({ path: `/classes/${classId}` });
}
</script>
<template>
  <main>
    <button @click="goBack($route.params.classId.toString())">Back</button>
    <BookmarksByClassComponent :classId="$route.params.classId" />
  </main>
</template>
<style scoped>
button {
  margin-top: 15px;
}
</style>
