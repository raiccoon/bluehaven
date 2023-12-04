<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const error = ref("");
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  try {
    await createUser(username.value, password.value);
    await loginUser(username.value, password.value);
    void updateSession();
    void router.push({ name: "Classes" });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "An error occurred";
  }
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3 class="center">Register</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="center">
        <button type="submit" class="normalButton">Register</button>
      </div>
    </fieldset>
  </form>
  <div class="center" v-if="error">{{ error }}</div>
</template>

<style scoped>
@import "@/assets/styles.css";
h2 {
  margin-bottom: 20px;
}
.center {
  display: flex;
  justify-content: center;
}
button {
  margin-top: 20px;
}
</style>
