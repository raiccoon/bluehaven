<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { RouterLink } from "vue-router";
import router from "@/router";
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
  if (isLoggedIn.value) {
    void router.push("/home");
  }
});
</script>
<template>
  <main>
    <div class="container">
      <div class="header">
        <img src="@/assets/images/logo.png" alt="BlueHaven Logo" />
        <div class="text">
          <h1>BlueHaven - A platform for collaborative learning</h1>
        </div>
      </div>
      <div class="buttons">
        <router-link to="/login">
          <button>Log In</button>
        </router-link>
        <router-link to="/register">
          <button>Register</button>
        </router-link>
      </div>
    </div>
  </main>
</template>
<style scoped>
main {
  display: flex;
  justify-content: center;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
</style>
