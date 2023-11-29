<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const moduleID = ref("");
const postID = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleIsPostInModule = async () => {
  // fetchy isPostInModule(moduleID, postID)
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
      <form @submit.prevent="handleIsPostInModule">
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
