<script setup lang="ts">
import AddClassButton from "@/components/Class/AddClassButton.vue";
import JoinClassButton from "@/components/Class/JoinClassButton.vue";
import ClassList from "@/components/Class/ClassList.vue";
</script>
<template>
  <main>
    <h1>Your Classes</h1>
    <section>
      <h2>Enrolled: Instructor</h2>
      <AddClassButton />
      <ClassList role="instruct" class="classList" />
    </section>
    <section>
      <h2>Enrolled: Student</h2>
      <JoinClassButton />
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
