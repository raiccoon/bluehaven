<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const isCreateClassClicked = ref(false);
const className = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const clickCreateClass = () => {
  displayMsg.value = false;
  isCreateClassClicked.value = true;
};

const handleCreateClass = async (className: string) => {
  let classResults;
  try {
    classResults = await fetchy("/api/classes", "POST", {
      body: { className: className },
    });
  } catch (_) {
    return;
  }
  msg.value = classResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  className.value = "";
  isCreateClassClicked.value = false;
};

const handleCancel = () => {
  displayMsg.value = false;
  className.value = "";
  isCreateClassClicked.value = false;
};
</script>

<template>
  <main>
    <div class="main">
      <button v-if="!isCreateClassClicked" @click="clickCreateClass">Click here to create a class!</button>
      <form v-else @submit.prevent="handleCreateClass(className)">
        <input type="text" v-model="className" placeholder="Name of your class" />
        <button type="submit">Create</button>
        <button @click="handleCancel">Cancel</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
