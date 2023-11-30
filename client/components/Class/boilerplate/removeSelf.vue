<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const classObjectID = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const removeSelf = async (classObjectID: string) => {
  let classResults;
  try {
    classResults = await fetchy(`/api/classes/id/${classObjectID}/membership`, "DELETE", {
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
      <form @submit.prevent="removeSelf(classObjectID)">
        <input type="text" v-model="classObjectID" placeholder="Class ObjectID" />
        <button type="submit">Click to remove yourself from this class</button>
      </form>
      <p v-if="displayMsg">{{ msg }}</p>
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
