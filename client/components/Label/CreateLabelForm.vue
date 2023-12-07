<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["classId"]);
let name = ref("");

const createLabel = async (name: string) => {
  try {
    // console.log("image", image);
    await fetchy(`/api/classes/id/${props.classId}/labels`, "POST", {
      body: { name },
    });

    //try console logging all labels in the class?
    const labelResults = await fetchy(`/api/classes/id/${props.classId}/labels`, "GET");
    console.log("labelResults", labelResults);
  } catch (_) {
    return;
  }
  emptyForm();
};

const emptyForm = () => {
  name.value = "";
};

onBeforeMount(async () => {
  //beforemount stuff here
});
</script>

<template>
  <form @submit.prevent="createLabel(name)">
    <label for="content">Create new label:</label>
    <textarea id="media-link" v-model="name" placeholder="Label name"> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Label</button>
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
