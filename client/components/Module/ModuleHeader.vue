<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { ref } from "vue";

const props = defineProps(["module"]);
const emits = defineEmits(["expand"]);

const isModuleClicked = ref(false);

const clickModule = () => {
  isModuleClicked.value = !isModuleClicked.value;
  emits("expand");
};
</script>

<template>
  <main>
    <div class="header">
      <div class="expand">
        <button class="button">Add Post</button>
        <button @click="clickModule" class="button">
          <p v-if="!isModuleClicked">Expand</p>
          <p v-else>Collapse</p>
        </button>
      </div>
      <div class="headerText">
        <h3 class="name">{{ props.module.name }}</h3>
        <p class="description">{{ props.module.description }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.name {
  margin: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 22px;
}
.description {
  margin: 15px;
  margin-top: 0px;
  font-size: 18px;
}
.header {
  border-radius: 8px;
  background-color: #a7d6f8ff;
  width: 100%;
  color: black;
  transition: background-color 0.1s ease;
  display: flex;
  flex-direction: column;
}
.expand {
  display: flex;
  justify-content: flex-end;
}

.button {
  margin-top: 5px;
  margin-right: 15px;
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
</style>
