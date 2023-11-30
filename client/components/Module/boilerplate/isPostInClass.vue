<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const classID = ref("");
const postID = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleIsPostInClass = async (classId: string, post: string) => {
  let moduleResults;
  try {
    moduleResults = await fetchy(`/api/classes/id/${classId}/posts/${post}/isInClass`, "GET");
  } catch (_) {
    return;
  }
  msg.value = moduleResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  classID.value = "";
  postID.value = "";
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleIsPostInClass(classID, postID)">
        <input type="text" v-model="classID" placeholder="Class ID" />
        <input type="text" v-model="postID" placeholder="Post ID" />
        <button type="submit">Check if Post in Class</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
