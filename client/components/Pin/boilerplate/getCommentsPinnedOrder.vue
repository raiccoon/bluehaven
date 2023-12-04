<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const isAddPinClicked = ref(false);
const postId = ref("");

const displayMsg = ref(false);
const msg = ref("message");

const clickAddPin = () => {
  displayMsg.value = false;
  isAddPinClicked.value = true;
};

const handleGetPins = async (postId: string) => {
  // fetchy createModule(classId, name, description?)
  let moduleResults;
  try {
    moduleResults = await fetchy(`/api/pins/comments/${postId}`, "GET");
  } catch (_) {
    return;
  }
  msg.value = moduleResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  postId.value = "";
  isAddPinClicked.value = false;
};

const handleCancel = () => {
  displayMsg.value = false;
  isAddPinClicked.value = false;
};
</script>

<template>
  <main>
    <div class="main">
      <button v-if="!isAddPinClicked" @click="clickAddPin">Click here to get all comments sorted by pin order!</button>
      <form v-else @submit.prevent="handleGetPins(postId)">
        <input type="text" v-model="postId" placeholder="Post Object Id" />
        <button type="submit">Submit</button>
        <button @click="handleCancel">Cancel</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
