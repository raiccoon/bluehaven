<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const classObjectID = ref("");
const username = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleLookup = async (classObjectID: string, username: string) => {
  let classResults;
  try {
    classResults = await fetchy(`/api/classes/id/${classObjectID}/membership/isInstructor`, "GET", {
      query: { classId: classObjectID, username: username },
    });
  } catch (_) {
    return;
  }
  msg.value = classResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  classObjectID.value = "";
  username.value = "";
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleLookup(classObjectID, username)">
        <input type="text" v-model="classObjectID" placeholder="Class Object ID" />
        <input type="text" v-model="username" placeholder="Username" />
        <button type="submit">Check If Instructor</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
