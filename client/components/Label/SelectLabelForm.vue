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
    <div class="submitButton">
      <button class="submit" type="submit" value="Submit">Submit</button>
    </div>
  </form>
</template>

<style scoped>
form {
  margin-left: 15px;
  margin-right: 15px;
  width: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #d6eaf9ff;
  padding: 20px;
  border: solid black 1px;
  border-radius: 8px;
  margin-bottom: 15px;
  padding-bottom: 15px;
}
select {
  width: 260px;
}
select#selectedLabel {
  margin-bottom: 0px;
  background-color: white;
}
.submitButton {
  width: 100%;
  display: flex;
  justify-content: center;
}
.submit {
  text-align: center;
  background-color: transparent;
  border: none;
  transform: background-color 0.3s ease;
  margin: 7px;
  margin-bottom: 0px;
}
.submit:hover {
  text-decoration: underline;
}
</style>
