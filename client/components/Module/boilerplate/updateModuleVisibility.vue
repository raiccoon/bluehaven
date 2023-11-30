<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const _id = ref("");
const hidden = ref(false);
const displayMsg = ref(false);
const msg = ref("message");

const handleGetModule = async (_id: string, hidden: boolean) => {
  let moduleResults;
  try {
    moduleResults = await fetchy(`/api/modules/${_id}/hidden`, "PUT", {
      body: { hidden },
    });
  } catch (_) {
    return;
  }
  msg.value = moduleResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  _id.value = "";
  hidden.value = false;
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleGetModule(_id, hidden)">
        <input type="text" v-model="_id" placeholder="Module ObjectID" />
        <input type="checked" v-model="hidden" />
        <button type="submit">Hide?</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
