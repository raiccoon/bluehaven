<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import BackButton from "@/components/BackButton.vue";
</script>

<template>
  <main>
    <div class="container">
      <BackButton :routeName="'Start'" />
      <LoginForm />
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/styles.css";
.container {
  display: flex;
  flex-direction: column;
}
</style>
