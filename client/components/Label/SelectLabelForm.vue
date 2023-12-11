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
    <label for="select-label">Filter comments by label:</label>
    <select id="selectedLabel" v-model="selectedLabel" placeholder="Label">
      <option :value="undefined">View all</option>
      <option v-for="label in labelsInClass" :key="label._id" :value="label._id">{{ label.name }}</option>
    </select>
    <input class="submit" type="submit" value="Submit" />
  </form>
</template>

<style scoped>
.submit {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color, border-color, color, box-shadow, filter;
  transition-duration: 0.3s;
  border: 1px solid transparent;
  letter-spacing: 2px;
  min-width: 70px;
  white-space: normal;
  text-align: center;
  padding: 5px 5px 5px;
  color: #5190bbff;
  box-shadow: inset 0 0 0 2px #d6eaf9ff;
  background-color: white;
  height: 40px;
}

#selectedLabel {
  padding: 0.3em;
  margin: 0.5em;
}
</style>
