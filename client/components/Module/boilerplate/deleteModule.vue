<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const _id = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleDeleteModule = async (_id: string) => {
  let moduleResults;
  try {
    moduleResults = await fetchy(`/api/modules/${_id}`, "DELETE");
  } catch (_) {
    return;
  }
  msg.value = moduleResults;
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
      <form @submit.prevent="handleDeleteModule(_id)">
        <input type="text" v-model="_id" placeholder="Module ObjectID" />
        <button type="submit">Delete Module</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
