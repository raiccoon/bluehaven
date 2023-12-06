<script setup lang="ts">
import Class from "@/components/Class/ClassComponent.vue";
import BackButton from "@/components/BackButton.vue";
</script>
<template>
  <main>
    <BackButton :routeName="'Classes'" />
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
