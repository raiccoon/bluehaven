<script setup lang="ts">
import BookmarksByClassComponent from "@/components/Bookmark/BookmarksByClassComponent.vue";
</script>
<template>
  <main>
    <BookmarksByClassComponent :classId="$route.params.classId" />
  </main>
</template>
