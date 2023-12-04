<script setup lang="ts">
import createComment from "@/components/Comment/boilerplate/createComment.vue";
import deleteComment from "@/components/Comment/boilerplate/deleteComment.vue";
import getClassOfComment from "@/components/Comment/boilerplate/getClassOfComment.vue";
import getComments from "@/components/Comment/boilerplate/getComments.vue";
import getParentOfComment from "@/components/Comment/boilerplate/getParentOfComment.vue";

import updateComment from "@/components/Comment/boilerplate/updateComment.vue";
</script>

<template>
  <main>
    <h1>Comment</h1>
    <div class="column">
      <createComment />
      <getComments />
      <getParentOfComment />
      <updateComment />
      <deleteComment />
      <getClassOfComment />
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
