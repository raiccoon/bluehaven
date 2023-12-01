<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const _id = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleDeleteBookmark = async (_id: string) => {
  let bookmarkResults;
  try {
    bookmarkResults = await fetchy(`/api/bookmarks/${_id}`, "DELETE");
  } catch (_) {
    return;
  }
  msg.value = bookmarkResults;
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
      <form @submit.prevent="handleDeleteBookmark(_id)">
        <input type="text" v-model="_id" placeholder="Bookmark ObjectID" />
        <button type="submit">Delete Bookmark</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
