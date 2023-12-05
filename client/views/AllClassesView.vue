<script setup lang="ts">
import ClassList from "@/components/Class/ClassList.vue";
</script>
<template>
  <main>
    <h1>Your Classes</h1>
    <section>
      <ClassList role="instruct" class="classList" />
    </section>
    <section>
      <ClassList role="enroll" class="classList" />
    </section>
  </main>
</template>
<style scoped>
@import "@/assets/classes.css";
.classList {
  margin-top: 15px;
}
</style>
