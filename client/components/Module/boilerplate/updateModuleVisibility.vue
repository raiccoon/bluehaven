<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref, onMounted } from "vue";

const _id = ref("");
const hidden = ref(false);
const displayMsg = ref(false);
const msg = ref("message");

const handleGetModule = async (_id: string) => {
  try {
    const moduleResults = await fetchy(`/api/modules/${_id}`, "GET");
    hidden.value = moduleResults.module.hidden;
  } catch (error) {
    // Handle errors if needed
  }
};

const toggleHidden = async () => {
  await fetchy(`/api/modules/${_id.value}/hidden`, "PUT", {
    body: { hidden: !hidden.value },
  });
  hidden.value = !hidden.value;
  msg.value = hidden.value ? "Module hidden successfully!" : "Module unhidden successfully!";
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  _id.value = "";
};

onMounted(async () => {
  if (_id.value !== "") {
    await handleGetModule(_id.value);
  }
});
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="toggleHidden">
        <input type="text" v-model="_id" placeholder="Module ObjectID" />
        <button type="submit">{{ hidden ? "Unhide Module" : "Hide Module" }}</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
