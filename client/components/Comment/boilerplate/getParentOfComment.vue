<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const _id = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleGetParentOfComment = async (_id: string) => {
  let parentResults;
  try {
    parentResults = await fetchy(`/api/parent/${_id}`, "GET");
  } catch (_) {
    return;
  }
  msg.value = parentResults;
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
      <form @submit.prevent="handleGetParentOfComment(_id)">
        <input type="text" v-model="_id" placeholder="Post ObjectID" />
        <button type="submit">Get Parent Of Comment</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
