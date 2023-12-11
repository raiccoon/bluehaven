<script setup lang="ts">
import BackButton from "@/components/BackButton.vue";
import ClassMenu from "@/components/Class/ClassMenu.vue";
import { defineProps } from "vue";

const props = defineProps(["isAdmin", "classObj", "isArchived"]);
</script>

<template>
  <main>
    <div class="options">
      <BackButton :routeName="'Classes'" />
      <div class="right">
        <ClassMenu :isAdmin="isAdmin" :classId="props.classObj._id" :isArchived="isArchived" />
      </div>
    </div>
    <h1>{{ props.classObj.className }}</h1>
    <p v-if="isAdmin">Join code: {{ props.classObj.joinCode }}</p>
  </main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");
.right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.options {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 24px;
}
.button {
  background-color: transparent;
  color: black;
  padding: 0px;
  border: none;
  border-radius: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
}
.button:hover {
  text-decoration: underline;
}
h1 {
  margin-top: 5px;
}
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

p {
  margin: 0px;
  margin-bottom: 10px;
}
main {
  margin-top: 15px;
  width: 100%;
}
h1 {
  margin-bottom: 10px;
}
</style>
