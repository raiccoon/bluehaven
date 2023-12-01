<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const parentId = ref("");
const displayMsg = ref(false);
const msg = ref("message");

// parent might have to be renamed _id?
const handleGetComments = async (parentId?: string) => {
  let query: Record<string, string> = parentId !== undefined ? { parentId } : {};
  let commentResults;
  try {
    commentResults = await fetchy(`/api/comments/`, "GET", { query });
  } catch (_) {
    return;
  }
  msg.value = commentResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  parent.value = "";
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleGetComments(parentId)">
        <input type="text" v-model="parentId" placeholder="Parent post ObjectID" />
        <button type="submit">Lookup</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
