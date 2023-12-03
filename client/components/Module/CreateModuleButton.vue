<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const props = defineProps({
  classId: {
    type: String,
    default: "",
  },
});

const isCreateModuleClicked = ref(false);
const name = ref("");
const description = ref("");

const displayMsg = ref(false);
const msg = ref("message");

const clickCreateModule = () => {
  displayMsg.value = false;
  isCreateModuleClicked.value = true;
};

const handleCreateModule = async (classId: string, name: string, description: string) => {
  let moduleResults;
  try {
    moduleResults = await fetchy("/api/modules", "POST", {
      body: { classId, name, description },
    });
  } catch (_) {
    return;
  }
  msg.value = moduleResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
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
      <form v-else @submit.prevent="handleCreateModule(props.classId, name, description)">
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
