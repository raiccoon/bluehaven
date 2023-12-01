<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const _id = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleDeleteComment = async (_id: string) => {
  let commentResults;
  try {
    commentResults = await fetchy(`/api/comments/${_id}`, "DELETE");
  } catch (_) {
    return;
  }
  msg.value = commentResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  _id.value = "";
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleDeleteComment(_id)">
        <input type="text" v-model="_id" placeholder="Comment ObjectID" />
        <button type="submit">Delete Comment</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
