<script setup lang="ts">
import ClassList from "@/components/Class/ClassList.vue";
</script>
<template>
  <main>
    <section class="top">
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
.top {
  margin-top: 50px;
}
</style>
