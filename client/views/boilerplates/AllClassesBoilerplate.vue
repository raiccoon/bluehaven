<script setup lang="ts">
import CreateClassForm from "@/components/Class/boilerplate/CreateClassForm.vue";
import GetClass from "@/components/Class/boilerplate/GetClass.vue";
import InviteInstructor from "@/components/Class/boilerplate/InviteInstructor.vue";
import JoinClassForm from "@/components/Class/boilerplate/JoinClassForm.vue";
import isInstructor from "@/components/Class/boilerplate/isInstructor.vue";
import isStudent from "@/components/Class/boilerplate/isStudent.vue";
import isMember from "@/components/Class/boilerplate/isMember.vue";
import getClassesInstruct from "@/components/Class/boilerplate/getClassesInstruct.vue";
import getClassesEnroll from "@/components/Class/boilerplate/getClassesEnroll.vue";
import removeSelf from "@/components/Class/boilerplate/removeSelf.vue";
</script>

<template>
  <main>
    <h1>All Classes</h1>
    <div class="column">
      <CreateClassForm />
      <GetClass />
      <InviteInstructor />
      <JoinClassForm />
      <isInstructor />
      <isStudent />
      <isMember />
      <getClassesInstruct />
      <getClassesEnroll />
      <removeSelf />
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
