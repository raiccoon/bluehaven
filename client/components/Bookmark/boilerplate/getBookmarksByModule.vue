<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const moduleId = ref("");

const displayMsg = ref(false);
const msg = ref("message");

const handleGetBookmarkByModule = async (moduleId: string) => {
  let bookmarkResults;
  try {
    bookmarkResults = await fetchy(`/api/modules/${moduleId}/posts/bookmarked`, "GET");
  } catch (_) {
    return;
  }
  msg.value = bookmarkResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  moduleId.value = "";
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleGetBookmarkByModule(moduleId)">
        <input type="text" v-model="moduleId" placeholder="Module Id" />
        <button type="submit">Get Bookmarks By Module</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
