<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import router from "../router";

function goBack() {
  void router.push({ name: "Classes" });
}
</script>
<template>
  <main>
    <button @click="goBack">Back</button>
    <CreatePostForm :classId="$route.params.classId" />
  </main>
</template>
<style scoped>
@import "@/assets/classes.css";
.classList {
  margin-top: 15px;
}
button {
  margin-top: 15px;
}
</style>
