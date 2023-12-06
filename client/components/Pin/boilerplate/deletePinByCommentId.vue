<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const _id = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleDeletePinByCommentId = async (_id: string) => {
  let pinResults;
  try {
    pinResults = await fetchy(`/api/pins/comment/${_id}`, "DELETE");
  } catch (_) {
    return;
  }
  msg.value = pinResults;
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
      <form @submit.prevent="handleDeletePinByCommentId(_id)">
        <input type="text" v-model="_id" placeholder="Pin ObjectID" />
        <button type="submit">Delete Pin by Comment Id</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
