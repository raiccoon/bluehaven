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
    <div class="main-container">
      <img class="logo" src="@/assets/images/logo.svg" alt="BlueHaven Logo" />
      <img class="title" src="@/assets/images/title.png" alt="BlueHaven Title" />
      <h2 class="subtitle">Begin your journey in collaborative learning.</h2>
      <div class="buttons">
        <router-link to="/login">
          <button class="fancyButton">Log In</button>
        </router-link>
        <router-link to="/register">
          <button class="fancyButton">Register</button>
        </router-link>
      </div>
    </div>
  </main>
</template>
<style scoped>
@import "@/assets/styles.css";
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.logo {
  width: 350px;
  height: 350px;
}
.title {
  width: 350px;
  height: auto;
}
.subtitle {
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 30px;
  text-align: center;
}
.buttons {
  display: flex;
  gap: 40px;
}
</style>
