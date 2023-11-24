<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import CreateClassForm from "@/components/Class/CreateClassForm.vue";
import GetClass from "@/components/Class/GetClass.vue";
import InviteInstructor from "@/components/Class/InviteInstructor.vue";
import JoinClassForm from "@/components/Class/JoinClassForm.vue";
import isInstructor from "@/components/Class/isInstructor.vue";
import isStudent from "@/components/Class/isStudent.vue";
import isMember from "@/components/Class/isMember.vue";
import getClassesInstruct from "@/components/Class/getClassesInstruct.vue";
import getClassesEnroll from "@/components/Class/getClassesEnroll.vue";
import removeSelf from "@/components/Class/removeSelf.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>All Classes</h1>
    <section v-if="isLoggedIn">
      <div class="main">
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
    </section>
    <section v-else>
      <h1>Please login!</h1>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
section {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}
</style>
