<script setup lang="ts">
import commentList from "@/components/Comment/commentList.vue";
import EditExpandedPost from "@/components/Post/EditExpandedPost.vue";
import ExpandedPost from "@/components/Post/ExpandedPost.vue";

import { ref } from "vue";

let editing = ref(false);

function startEdit() {
  editing.value = true;
}

function goBack() {
  editing.value = false;
}
</script>

<template>
  <main>
    <section>
      <ExpandedPost v-if="!editing" @editPost="startEdit" :postId="$route.params.postId" />
      <EditExpandedPost v-else @goBack="goBack" :postId="$route.params.postId" />
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
