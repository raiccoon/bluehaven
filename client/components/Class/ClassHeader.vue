<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref, defineProps, onMounted } from "vue";

const props = defineProps(["classId", "isAdmin"]);

const className = ref("");
const joinCode = ref("");

const getClass = async () => {
  let response;
  try {
    response = await fetchy(`/api/classes/id/${props.classId}`, "GET", {
      query: { _id: props.classId },
    });
  } catch (_) {
    return;
  }
  className.value = response.className;
  joinCode.value = response.joinCode;
};

const removeSelf = async () => {
  try {
    await fetchy(`/api/classes/id/${props.classId}/membership`, "DELETE", {
      query: { classId: props.classId },
    });
  } catch (_) {
    return;
  }
};

onMounted(async () => {
  await getClass();
});
</script>

<template>
  <main>
    <h1>{{ className }}</h1>
    <p v-if="isAdmin">Join code: {{ joinCode }}</p>
    <button @click="removeSelf">Leave Class</button>
  </main>
</template>

<style scoped>
@import "@/assets/classes.css";
p {
  margin: 0px;
  margin-bottom: 10px;
}
</style>
