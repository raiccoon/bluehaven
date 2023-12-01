<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref, defineProps, onMounted } from "vue";
import router from "../../router";

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

onMounted(async () => {
  await getClass();
});

const goToClass = async () => {
  void router.push({ path: `/classes/${props._id}` });
};
</script>

<template>
  <main>
    <button @click="goToClass" class="tile">
      <p class="className">{{ className }}</p>
    </button>
  </main>
</template>

<style scoped>
@import "@/assets/classes.css";
</style>
