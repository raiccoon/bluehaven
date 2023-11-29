<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const moduleID = ref("");
const postID = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleRelocatePost = async () => {
  // fetchy relocatePost(postID, moduleID)
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
      <form @submit.prevent="handleRelocatePost">
        <input type="text" v-model="moduleID" placeholder="Module ID" />
        <input type="text" v-model="postID" placeholder="Post ID" />
        <button type="submit">Relocate Post</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
