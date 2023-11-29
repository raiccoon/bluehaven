<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

// const props = defineProps(["postId"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>[author name here's post]</h1>
    <section>
      <p>{{ $route.params }}</p>
      <ExpandedPost :_id="$route.params" />
    </section>
    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
