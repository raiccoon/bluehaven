<script setup lang="ts">
import commentList from "@/components/Comment/commentList.vue";
import ExpandedPost from "@/components/Post/ExpandedPost.vue";
</script>

<template>
  <main>
    <section>
      <ExpandedPost :postId="$route.params.postId" />
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
