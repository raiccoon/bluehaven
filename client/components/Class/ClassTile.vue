<script setup lang="ts">
import { defineProps } from "vue";
import router from "../../router";

const props = defineProps(["classObject"]);

const goToClass = async () => {
  void router.push({ path: `/classes/${props.classObject._id}` });
};
</script>

<template>
  <main>
    <button @click="goToClass" class="tile">
      <p class="className">{{ props.classObject.className }}</p>
    </button>
  </main>
</template>

<style scoped>
@import "@/assets/classes.css";
.tile {
  width: 250px;
  height: 150px;
  background-color: #a7d6f8ff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  border-radius: 8px;
  border: 0px;
  transition: background-color 0.1s ease;
}
.tile:hover {
  background-color: #96bad4ff;
}
.className {
  font-size: 1.2em;
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
