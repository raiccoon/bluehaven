<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import AllClassesBoilerplate from "@/views/boilerplates/AllClassesBoilerplate.vue";
import ModuleBoilerplate from "@/views/boilerplates/ModuleBoilerplate.vue";
import { storeToRefs } from "pinia";
import PinBoilerPlate from "./PinBoilerPlate.vue";
import BookmarkBoilerplate from "@/views/boilerplates/BookmarkBoilerplate.vue";

import { onMounted, ref } from "vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const showComponent = ref("");
const allComponents: Record<string, any> = {
  Class: AllClassesBoilerplate,
  Module: ModuleBoilerplate,
  Pin: PinBoilerPlate,
  Bookmark: BookmarkBoilerplate,
};
onMounted(() => {
  const savedComponent = localStorage.getItem("selectedComponent");
  if (savedComponent && allComponents[savedComponent]) {
    showComponent.value = savedComponent;
  }
});
const saveSelectedComponent = (componentKey: string) => {
  showComponent.value = componentKey;
  localStorage.setItem("selectedComponent", componentKey);
};
</script>

<template>
  <main v-if="isLoggedIn">
    <h1>Boilerplate for testing purposes</h1>
    <div v-if="!showComponent" class="column">
      <button v-for="(component, key) in allComponents" :key="key" @click="saveSelectedComponent(key)">Click to view {{ key }} boilerplate</button>
    </div>
    <div v-else class="column">
      <button @click="saveSelectedComponent('')">Back</button>
      <component :is="allComponents[showComponent]" v-if="showComponent !== ''" />
    </div>
  </main>
  <div v-else>Please log in</div>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
