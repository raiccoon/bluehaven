<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const isCreateClassClicked = ref(false);
const className = ref("");

const clickCreateClass = () => {
  isCreateClassClicked.value = true;
};

const handleCreateClass = async (className: string) => {
  try {
    await fetchy("/api/classes", "POST", {
      body: { className: className },
    });
  } catch (_) {
    return;
  }
  emptyForm();
};

const emptyForm = () => {
  className.value = "";
  isCreateClassClicked.value = false;
};

const handleCancel = () => {
  className.value = "";
  isCreateClassClicked.value = false;
};
</script>

<template>
  <main>
    <div class="main">
      <button v-if="!isCreateClassClicked" @click="clickCreateClass">Create a Class</button>
      <form v-else @submit.prevent="handleCreateClass(className)">
        <input type="text" v-model="className" placeholder="Name of your class" />
        <button type="submit">Create</button>
        <button @click="handleCancel">Cancel</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
