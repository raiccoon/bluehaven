<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
const { logoutUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Start" });
}
</script>

<template>
  <button @click="logout">Log Out</button>
</template>

<style scoped>
button {
  font-size: large;
  color: black;
  text-decoration: none;
  transition: text-decoration 0.3s ease;
  background: transparent;
  border: none;
  border-radius: none;
}

button:hover {
  text-decoration: underline;
}
</style>
