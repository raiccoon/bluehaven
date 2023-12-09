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
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
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
