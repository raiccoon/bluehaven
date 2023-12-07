<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ObjectId } from "mongodb";
import { onBeforeMount, ref } from "vue";

//this form is for adding labels to EXISTING comments (not for creating a new comment)

const error = ref("");

const props = defineProps(["comment"]);
const isAddLabelClicked = ref(false);

let labelsInClass = ref(); //all labels in class*
let selectedLabels = ref(); //labels selected by user in form*
let labelsOnComment = ref(); //labels on comment (before submission)

//get class of post (parent) of comment
//then get all labels for post
//then use those as the options for the form
//also get labels on comment and use those as the preselected values
//listen for select/remove events from multiselector and add/remove labels from comment accordingly???

const assignLabel = async (labelId: ObjectId) => {
  try {
    await fetchy(`/api/comments/${props.comment.parentId}/labels`, "POST", {
      body: { label: labelId },
    });
  } catch (_) {
    return;
  }
};

const removeLabel = async (labelId: ObjectId) => {
  try {
    await fetchy(`/api/comments/${props.comment.parentId}/labels`, "DELETE", {
      query: { label: labelId },
    });
  } catch (_) {
    return;
  }
};

const hasLabel = async (labelId: ObjectId) => {
  for (const label of labelsOnComment.value) {
    if (label._id === labelId) {
      return true;
    }
    return false;
  }
};

const handleLabelChanges = async () => {
  // for (const label of selectedLabels.value){
  //     if (await hasLabel(label._id)) {
  //     }
  // }
};

onBeforeMount(async () => {
  const classResult = await fetchy(`/api/comments/${props.comment._id}/class`, "GET");
  labelsInClass.value = await fetchy(`/api/classes/id/${classResult._id}/labels`, "GET");
  selectedLabels.value = await fetchy(`/api/comments/${props.comment._id}/labels`, "GET");
  labelsOnComment.value = [...selectedLabels.value]; //create a copy of labels on comment
});
</script>

<template>
  <!-- <input type="checkbox" v-for="label in labelsInClass" :key="label._id" value="label._id" />{{ label.name }}<br /> -->
  <form @submit.prevent="assignLabel(name)">
    <fieldset>
      <legend>What is Your Favorite Pet?</legend>
      <!-- <option v-for="module in modules" :key="module._id" :value="module._id">{{ module.name }}</option> -->
      <label v-for="label in labelsInClass" :key="label._id">
        <input type="checkbox" :value="label._id" />
        {{ label.name }}
      </label>
      <!-- <input type="checkbox" v-for="label in labelsInClass" :key="label._id" :value="label._id" />{{ label.name }}<br /> -->
      <input type="checkbox" name="favorite_pet" value="Cats" />Cats<br />
      <input type="checkbox" name="favorite_pet" value="Dogs" />Dogs<br />
      <input type="checkbox" name="favorite_pet" value="Birds" />Birds<br />
      <br />
      <!-- when submitting can just check what selections changed -->
      <input type="submit" value="Submit" />
    </fieldset>
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
