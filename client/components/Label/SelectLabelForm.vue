<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

//this form is for adding labels to EXISTING comments (not for creating a new comment)

const loaded = ref(false);
const props = defineProps(["postId"]);
const emit = defineEmits(["filterByLabel"]);

let labelsInClass = ref(); //all labels in class*
let selectedLabel = ref(""); //labels selected by user in form*

onBeforeMount(async () => {
  const classResult = await fetchy(`/api/posts/${props.postId}/class`, "GET");
  labelsInClass.value = await fetchy(`/api/classes/id/${classResult._id}/labels`, "GET");
  loaded.value = true;
});
</script>

<template>
  <form v-if="loaded" @submit.prevent="emit('filterByLabel', props.postId, selectedLabel)">
    <select id="selectedLabel" v-model="selectedLabel" placeholder="Label">
      <option :value="undefined">View all</option>
      <option v-for="label in labelsInClass" :key="label._id" :value="label._id">{{ label.name }}</option>
    </select>
    <input type="submit" value="Submit" />
  </form>
</template>

<style scoped></style>
