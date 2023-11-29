<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const classObjectID = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleGetClass = async (classObjectID: string) => {
  let classResults;
  try {
    classResults = await fetchy(`/api/classes/id/${classObjectID}`, "GET", {
      query: { classId: classObjectID },
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
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleGetClass(classObjectID)">
        <input type="text" v-model="classObjectID" placeholder="Class ObjectID" />
        <button type="submit">Lookup</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
