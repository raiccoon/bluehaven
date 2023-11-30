<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const displayMsg = ref(false);
const msg = ref("message");

const getClasses = async () => {
  let classResults;
  try {
    classResults = await fetchy("/api/classes/instruct", "GET");
  } catch (_) {
    return;
  }
  msg.value = classResults;
  displayMsg.value = true;
};
</script>

<template>
  <main>
    <button @click="getClasses">Click to see all classes you instruct</button>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
