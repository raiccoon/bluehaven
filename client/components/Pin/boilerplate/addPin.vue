<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const isAddPinClicked = ref(false);
const postId = ref("");
const commentId = ref("");

const displayMsg = ref(false);
const msg = ref("message");

const clickAddPin = () => {
  displayMsg.value = false;
  isAddPinClicked.value = true;
};

const handleAddPin = async (postId: string, commentId: string) => {
  // fetchy createModule(classId, name, description?)
  let moduleResults;
  try {
    moduleResults = await fetchy("/api/pins", "POST", {
      body: { postId, commentId },
    });
  } catch (_) {
    return;
  }
  msg.value = moduleResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  postId.value = "";
  commentId.value = "";
  isAddPinClicked.value = false;
};

const handleCancel = () => {
  displayMsg.value = false;
  //   name.value = "";
  isAddPinClicked.value = false;
};
</script>

<template>
  <main>
    <div class="main">
      <button v-if="!isAddPinClicked" @click="clickAddPin">Click here to create a pin!</button>
      <form v-else @submit.prevent="handleAddPin(postId, commentId)">
        <input type="text" v-model="postId" placeholder="Post Object Id" />
        <input type="text" v-model="commentId" placeholder="Comment Object" />
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
