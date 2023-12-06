<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref, defineProps, onBeforeMount } from "vue";
import router from "../../router";

const loaded = ref(false);
const props = defineProps({
  _id: {
    type: String,
    default: "",
  },
});

const className = ref("");
const joinCode = ref("");

const getClass = async () => {
  let response;
  try {
    response = await fetchy(`/api/classes/id/${props._id}`, "GET", {
      query: { classId: props._id },
    });
  } catch (_) {
    return;
  }
  className.value = response.className;
  joinCode.value = response.joinCode;
};

onBeforeMount(async () => {
  await getClass();
  loaded.value = true;
});

const goToClass = async () => {
  void router.push({ path: `/classes/${props._id}` });
};
</script>

<template>
  <main>
    <button v-if="loaded" @click="goToClass" class="tile">
      <p class="className">{{ className }}</p>
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
