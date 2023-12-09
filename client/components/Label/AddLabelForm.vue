<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

//this form is for adding labels to EXISTING comments (not for creating a new comment)

const loaded = ref(false);
const props = defineProps(["comment", "labels"]);
const emit = defineEmits(["updatedLabels"]);

let labelsInClass = ref(); //all labels in class*
let selectedLabels = ref<Array<Record<string, string>>>([]); //labels selected by user in form*
let labelsOnComment = ref(props.labels); //labels on comment (before submission)

const updateLabels = async () => {
  await fetchy(`/api/comments/${props.comment._id}/labels/deleteAll`, "DELETE");
  await fetchy(`/api/comments/${props.comment._id}/labels/addMany`, "POST", {
    body: {
      labels: selectedLabels.value.map((label) => label._id),
    },
  });
  emit("updatedLabels");
};

onBeforeMount(async () => {
  const classResult = await fetchy(`/api/comments/${props.comment._id}/class`, "GET");
  labelsInClass.value = await fetchy(`/api/classes/id/${classResult}/labels`, "GET");
  selectedLabels.value = [...labelsOnComment.value];
  loaded.value = true;
});
</script>

<template>
  <form v-if="loaded" @submit.prevent="updateLabels">
    <section v-for="label in labelsInClass" :key="label._id">
      <input type="checkbox" :id="label._id" :value="label" v-model="selectedLabels" />
      {{ label.name }}
      <br />
    </section>
    <input type="submit" value="Submit" />
  </form>
</template>

<style scoped>
form {
  margin: 1em;
  background-color: white;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  box-shadow: inset 0 0 0 2px #d6eaf9ff;
}

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

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

#media-link {
  max-height: 20px;
}

.media-button {
  max-width: 10rem;
}
</style>
