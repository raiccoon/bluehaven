<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const _id = ref("");
// rn this will replace all the content, image, and video with null so like make sure you update them all lol
const content = ref();
const image = ref();
const video = ref();

const displayMsg = ref(false);
const msg = ref("message");

const handleUpdateComment = async (_id: string, content: string, image: string, video: string) => {
  let commentResults;
  try {
    commentResults = await fetchy(`/api/comments/${_id}`, "PATCH", { body: { update: { content: content, image: image, video: video } } });
  } catch (_) {
    return;
  }
  msg.value = commentResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  _id.value = "";
  content.value = "";
  image.value = "";
  content.value = "";
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleUpdateComment(_id, content, image, video)">
        <input type="text" v-model="_id" placeholder="CommentId" />
        <input type="text" v-model="content" placeholder="Content here" />
        <input type="text" v-model="image" placeholder="image link here" />
        <input type="text" v-model="video" placeholder="video link here" />
        <button type="submit">Update Comment</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
