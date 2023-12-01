<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const isCreateCommentClicked = ref(false);
const parent = ref("");
const content = ref("");
const image = ref("");
const video = ref("");

const displayMsg = ref(false);
const msg = ref("message");

const clickCreateComment = () => {
  displayMsg.value = false;
  isCreateCommentClicked.value = true;
};

const handleCreateComment = async (parent: string, content: string, image: string, video: string) => {
  let commentResults;
  try {
    commentResults = await fetchy("/api/comments", "POST", {
      body: { parent, content, image, video },
    });
  } catch (_) {
    return;
  }
  msg.value = commentResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  parent.value = "";
  content.value = "";
  image.value = "";
  video.value = "";
};

const handleCancel = () => {
  displayMsg.value = false;
  parent.value = "";
  content.value = "";
  image.value = "";
  video.value = "";
  isCreateCommentClicked.value = false;
};
</script>

<template>
  <main>
    <div class="main">
      <button v-if="!isCreateCommentClicked" @click="clickCreateComment">Click here to create a comment!</button>
      <form v-else @submit.prevent="handleCreateComment(classId, name, description)">
        <input type="text" v-model="parent" placeholder="Parent Post Id" />
        <input type="text" v-model="content" placeholder="Comment content here" />
        <input type="text" v-model="image" placeholder="Image link (optional)" />
        <input type="text" v-model="video" placeholder="Video link (optional)" />
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
