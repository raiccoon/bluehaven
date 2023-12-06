<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const classId = ref("");

const displayMsg = ref(false);
const msg = ref("message");

const handleGetBookmarkByClass = async (classId: string) => {
  let bookmarkResults;
  try {
    bookmarkResults = await fetchy(`/api/classes/id/${classId}/posts/bookmarked`, "GET");
  } catch (_) {
    return;
  }
  msg.value = bookmarkResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  classId.value = "";
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleGetBookmarkByClass(classId)">
        <input type="text" v-model="classId" placeholder="Class Id" />
        <button type="submit">Get Bookmarks By Class</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
