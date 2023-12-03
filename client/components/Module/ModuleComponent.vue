<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";

const props = defineProps(["module"]);
</script>

<template>
  <p>{{ "Name: " + props.module.name }}</p>
  <p>{{ "Description: " + props.module.description }}</p>
  <PostListComponent :moduleId="props.module._id" />
</template>

<style scoped></style>
