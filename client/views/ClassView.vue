<script setup lang="ts">
import Class from "@/components/Class/ClassComponent.vue";
// delete label form later
</script>
<template>
  <main>
    <Class :classId="$route.params.classId" />
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
