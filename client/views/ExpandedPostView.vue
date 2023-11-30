<script setup lang="ts">
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
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
