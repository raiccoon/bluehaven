<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const isCreateModuleClicked = ref(false);
const classId = ref("");
const name = ref("");
const description = ref("");

const displayMsg = ref(false);
const msg = ref("message");

const clickCreateModule = () => {
  displayMsg.value = false;
  isCreateModuleClicked.value = true;
};

const handleCreateModule = async () => {
  // fetchy createModule(classId, name, description?)
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  classId.value = "";
  name.value = "";
  description.value = "";
  isCreateModuleClicked.value = false;
};

const handleCancel = () => {
  displayMsg.value = false;
  name.value = "";
  isCreateModuleClicked.value = false;
};
</script>

<template>
  <main>
    <div class="main">
      <button v-if="!isCreateModuleClicked" @click="clickCreateModule">Click here to create a module!</button>
      <form v-else @submit.prevent="handleCreateModule">
        <input type="text" v-model="classId" placeholder="Class Object Id" />
        <input type="text" v-model="name" placeholder="Module Name" />
        <input type="text" v-model="description" placeholder="Description (optional)" />
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
