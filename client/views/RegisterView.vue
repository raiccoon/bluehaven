<script setup lang="ts">
import RegisterForm from "@/components/Login/RegisterForm.vue";
import BackButton from "@/components/BackButton.vue";
</script>

<template>
  <main>
    <div class="container">
      <BackButton :routeName="'Start'" />
      <RegisterForm />
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
