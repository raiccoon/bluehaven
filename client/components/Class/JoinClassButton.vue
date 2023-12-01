<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const isJoinClassClicked = ref(false);
const joinCode = ref("");

const clickJoinClass = () => {
  isJoinClassClicked.value = true;
};

const handleJoinClass = async (joinCode: string) => {
  try {
    await fetchy(`/api/classes/joincode/${joinCode}/students`, "POST", {
      body: { joinCode },
    });
  } catch (_) {
    return;
  }
  emptyForm();
};

const handleCancel = () => {
  emptyForm();
};

const emptyForm = () => {
  joinCode.value = "";
  isJoinClassClicked.value = false;
};
</script>

<template>
  <main>
    <div class="main">
      <button v-if="!isJoinClassClicked" @click="clickJoinClass">Join a Class</button>
      <form v-else @submit.prevent="handleJoinClass(joinCode)">
        <input type="text" v-model="joinCode" placeholder="Join code for your class" />
        <button type="submit">Join</button>
        <button @click="handleCancel">Cancel</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
