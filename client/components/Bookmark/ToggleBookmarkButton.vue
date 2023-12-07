<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";

const props = defineProps(["postId", "isBookmarked"]);
const emit = defineEmits(["updatedBookmarkState"]);

const handleCreateBookmark = async () => {
  try {
    await fetchy("/api/bookmarks", "POST", {
      body: { post: props.postId },
    });
  } catch (_) {
    return;
  }

  emit("updatedBookmarkState");
};

const handleDeleteBookmark = async () => {
  try {
    await fetchy(`/api/bookmarks/`, "DELETE", {
      query: { post: props.postId },
    });
  } catch (_) {
    return;
  }

  emit("updatedBookmarkState");
};
</script>

<template>
  <main>
    <button v-if="props.isBookmarked" @click="handleDeleteBookmark">Remove Bookmark</button>
    <button v-else @click="handleCreateBookmark">Bookmark post</button>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
