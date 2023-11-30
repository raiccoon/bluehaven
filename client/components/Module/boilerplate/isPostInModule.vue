<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const moduleID = ref("");
const postID = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleIsPostInModule = async (module: string, post: string) => {
  let moduleResults;
  try {
    moduleResults = await fetchy(`/api/modules/${module}/posts/${post}/isInModule`, "GET");
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
      <form @submit.prevent="handleIsPostInModule(moduleID, postID)">
        <input type="text" v-model="moduleID" placeholder="Module ID" />
        <input type="text" v-model="postID" placeholder="Post ID" />
        <button type="submit">Check if Post in Module</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
