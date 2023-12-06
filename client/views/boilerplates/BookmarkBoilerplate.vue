<script setup lang="ts">
import createBookmark from "@/components/Bookmark/boilerplate/createBookmark.vue";
import deleteBookmark from "@/components/Bookmark/boilerplate/deleteBookmark.vue";
import getBookmarkedPosts from "@/components/Bookmark/boilerplate/getBookmarkedPosts.vue";
import GetBookmarksByClass from "@/components/Bookmark/boilerplate/getBookmarksByClass.vue";
import GetBookmarksByModule from "@/components/Bookmark/boilerplate/getBookmarksByModule.vue";
</script>

<template>
  <main>
    <h1>Bookmark</h1>
    <div class="column">
      <createBookmark />
      <deleteBookmark />
      <getBookmarkedPosts />
      <GetBookmarksByModule />
      <GetBookmarksByClass />
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
