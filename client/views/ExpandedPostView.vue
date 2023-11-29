<script setup lang="ts">
import ExpandedPost from "@/components/Post/ExpandedPost.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Module Name</h1>
    <section>
      <ExpandedPost :postId="$route.params.postId" :author="$route.query.author" />
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
