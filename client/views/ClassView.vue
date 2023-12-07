<script setup lang="ts">
import Class from "@/components/Class/ClassComponent.vue";
// delete label form later
import CreateLabelForm from "@/components/Label/CreateLabelForm.vue";
</script>
<template>
  <main>
    <Class :classId="$route.params.classId" />

    <!-- for testing only, delete later -->
    <CreateLabelForm :classId="$route.params.classId" />
    <!-- end testing for create label -->
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
