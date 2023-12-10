<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["comment"]);
let labels = ref<Array<Record<string, string>>>([]);
const loaded = ref(false);

const getLabelsOnComment = async () => {
  let labelResults;
  try {
    labelResults = await fetchy(`/api/comments/${props.comment._id}/labels`, "GET");
  } catch (_) {
    return;
  }
  labels.value = labelResults;
};

onBeforeMount(async () => {
  await getLabelsOnComment();
  loaded.value = true;
});
</script>

<template>
  <menu class="row">
    <div class="label-item" v-for="label in labels" :key="label._id">{{ label.name }}</div>
  </menu>
</template>

<style scoped></style>
