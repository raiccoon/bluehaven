<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

//this form is for adding labels to EXISTING comments (not for creating a new comment)

const loaded = ref(false);
const props = defineProps(["comment", "labels"]);
const emit = defineEmits(["updatedLabels", "refreshComments", "closeLabelModal"]);

let labelsInClass = ref(); //all labels in class*
let selectedLabels = ref<Array<Record<string, string>>>([]); //labels selected by user in form*
let labelsOnComment = ref(props.labels); //labels on comment (before submission)
let classHasLabels = ref(false);

const updateLabels = async () => {
  await fetchy(`/api/comments/${props.comment._id}/labels/deleteAll`, "DELETE");
  await fetchy(`/api/comments/${props.comment._id}/labels/addMany`, "POST", {
    body: {
      labels: selectedLabels.value.map((label) => label._id),
    },
  });
  emit("updatedLabels");
  emit("refreshComments");
};

onBeforeMount(async () => {
  const classResult = await fetchy(`/api/comments/${props.comment._id}/class`, "GET");
  labelsInClass.value = await fetchy(`/api/classes/id/${classResult}/labels`, "GET");
  selectedLabels.value = [...labelsOnComment.value];
  console.log("labelsInClass.value.length", labelsInClass.value.length);
  classHasLabels.value = labelsInClass.value.length !== 0 ? true : false;
  console.log("classHasLabels.value", classHasLabels.value);
  loaded.value = true;
});
</script>

<template>
  <form v-if="loaded && classHasLabels" @submit.prevent="updateLabels">
    <div class="labels">
      <section v-for="label in labelsInClass" :key="label._id" class="scrollable">
        <input class="checkbox" type="checkbox" :id="label._id" :value="label" v-model="selectedLabels" />
        <div class="labelName">{{ label.name }}</div>
        <br />
      </section>
    </div>
    <div class="buttonSection">
      <input class="submit" type="submit" value="Submit" />
      <button @click="emit('closeLabelModal')" class="cancel" type="button">Cancel</button>
    </div>
  </form>
  <div v-if="loaded && !classHasLabels"><em>No labels associated with this class!</em></div>
</template>

<style scoped>
.scrollable {
  width: 100%;
  /* overflow-x: scroll; */
  overflow-y: hidden;
  white-space: nowrap;
}

.labels {
  max-height: 200px;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  display: none;
}
.close {
  font-size: 18px;
}
.labelName {
  display: inline-block;
  margin-left: 10px;
}
form {
  margin: 0px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 15px;
  box-shadow: inset 0 0 0 2px #d6eaf9ff;
  width: calc(100%-30px);
}
.buttonSection {
  width: 100%;
  display: flex;
  justify-content: space-between;
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
  letter-spacing: 1.5px;
  width: fit-content;
  height: fit-content;
  white-space: normal;
  text-align: center;
  padding: 5px 10px 5px;
  color: #5190bbff;
  box-shadow: inset 0 0 0 2px #d6eaf9ff;
  background-color: white;
}
.submit:hover {
  transform: scale(1.04);
}
.cancel {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color, border-color, color, box-shadow, filter;
  transition-duration: 0.3s;
  border: 1px solid transparent;
  letter-spacing: 1.5px;
  width: fit-content;
  height: fit-content;
  white-space: normal;
  text-align: center;
  padding: 5px 10px 5px;
  color: #888888;
  box-shadow: inset 0 0 0 2px #bbbbbb;
  background-color: transparent;
}
.cancel:hover {
  transform: scale(1.04);
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
