<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const isCreateBookmarkClicked = ref(false);
const classId = ref("");
const post = ref("");

const displayMsg = ref(false);
const msg = ref("message");

const clickCreateBookmark = () => {
  displayMsg.value = false;
  isCreateBookmarkClicked.value = true;
};

const handleCreateBookmark = async (post: string, classId: string) => {
  let bookmarkResults;
  try {
    bookmarkResults = await fetchy("/api/bookmarks", "POST", {
      body: { post, classId },
    });
  } catch (_) {
    return;
  }
  msg.value = bookmarkResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  classId.value = "";
  post.value = "";
  isCreateBookmarkClicked.value = false;
};

const handleCancel = () => {
  displayMsg.value = false;
  isCreateBookmarkClicked.value = false;
};
</script>

<template>
  <main>
    <div class="main">
      <button v-if="!isCreateBookmarkClicked" @click="clickCreateBookmark">Click here to create a bookmark!</button>
      <form v-else @submit.prevent="handleCreateBookmark(post, classId)">
        <input type="text" v-model="post" placeholder="Post Object Id" />
        <input type="text" v-model="classId" placeholder="Class Object Id" />
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
