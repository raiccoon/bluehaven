<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const _id = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleGetClassOfPost = async () => {
  // fetchy getClassOfPost(_id)
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
      <form @submit.prevent="handleGetClassOfPost">
        <input type="text" v-model="_id" placeholder="Post ObjectID" />
        <button type="submit">Get Class Of Post</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
