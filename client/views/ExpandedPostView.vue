<script setup lang="ts">
import ExpandedPost from "@/components/Post/ExpandedPost.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const props = defineProps(["postId"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>[author name here's post]</h1>
    <section>
      <ExpandedPost :post="props.postId" />
    </section>
    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
