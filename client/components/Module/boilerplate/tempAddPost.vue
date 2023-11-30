<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const moduleID = ref("");
const postID = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleAddPost = async (post: string, module: string) => {
  let moduleResults;
  try {
    moduleResults = await fetchy(`/api/modules/${module}/posts`, "POST", {
      body: { post, module },
    });
  } catch (_) {
    return;
  }
  msg.value = moduleResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  moduleID.value = "";
  postID.value = "";
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleAddPost(postID, moduleID)">
        <input type="text" v-model="moduleID" placeholder="Module ID" />
        <input type="text" v-model="postID" placeholder="Post ID" />
        <button type="submit">Add Post</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
