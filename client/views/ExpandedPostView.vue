<script setup lang="ts">
import commentList from "@/components/Comment/commentList.vue";
import ExpandedPost from "@/components/Post/ExpandedPost.vue";
import { ref } from "vue";

let editing = ref("");

function updateEditing(id: string) {
  editing.value = id;
}
</script>

<template>
  <main>
    <h1>Module Name</h1>
    <section>
      <ExpandedPost v-if="editing !== $route.params.postId" :postId="$route.params.postId" :author="$route.query.author" />
      <commentList :parentId="$route.params.postId" />
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
section {
  display: flex;
  max-height: 70vh;
  overflow-y: auto;
  /* flex-direction: row; */
}
</style>
