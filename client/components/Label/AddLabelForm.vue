<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

const props = defineProps(["comment"]);
let name = ref("");

//get class of post (parent) of comment
//then get all labels for post
//then use those as the options for the form

const assignLabel = async (labels: string[]) => {
  //   try {
  //     // console.log("image", image);
  //     await fetchy(`/api/classes/id/${props.classId}/labels`, "POST", {
  //       body: { name },
  //     });
  //     //try console logging all labels in the class?
  //     const labelResults = await fetchy(`/api/classes/id/${props.classId}/labels`, "GET");
  //     console.log("labelResults", labelResults);
  //   } catch (_) {
  //     return;
  //   }
  //   emptyForm();
};

// const emptyForm = () => {
//   name.value = "";
// };

onBeforeMount(async () => {
  //beforemount stuff here
});
</script>

<template>
  <form @submit.prevent="assignLabel(name)">
    <fieldset>
      <legend>What is Your Favorite Pet?</legend>
      <!-- <option v-for="module in modules" :key="module._id" :value="module._id">{{ module.name }}</option> -->

      <!-- <input type="checkbox" v-for="label in labels" :key="label._id" value="label._id" />{{ label.name }}<br /> -->
      <input type="checkbox" name="favorite_pet" value="Cats" />Cats<br />
      <input type="checkbox" name="favorite_pet" value="Dogs" />Dogs<br />
      <input type="checkbox" name="favorite_pet" value="Birds" />Birds<br />
      <br />
      <input type="submit" value="Submit now" />
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
