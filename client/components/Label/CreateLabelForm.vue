<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
const error = ref("");

const props = defineProps(["classId"]);
const isCreateLabelClicked = ref(false);
let name = ref("");

const clickCreateLabel = () => {
  isCreateLabelClicked.value = true;
};

const handleCreateLabel = async (name: string) => {
  if (!name.trim()) {
    error.value = "Please enter a label name.";
    return;
  }
  try {
    await fetchy(`/api/classes/id/${props.classId}/labels`, "POST", {
      body: { name },
    });
    isCreateLabelClicked.value = false;

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

const handleCancel = () => {
  name.value = "";
  error.value = "";
  isCreateLabelClicked.value = false;
};

onBeforeMount(async () => {
  //beforemount stuff here
});
</script>

<template>
  <main>
    <button class="click" @click="clickCreateLabel">Create a Label</button>
    <div class="modal-background" v-if="isCreateLabelClicked">
      <div class="modal-content">
        <form @submit.prevent="handleCreateLabel(name)">
          <h3>Create a new label</h3>
          <input type="text" id="media-link" v-model="name" placeholder="Label name" />
          <div class="modal-buttons">
            <button type="submit" class="submit">Create Label</button>
            <button class="cancel" type="button" @click="handleCancel">Cancel</button>
          </div>
          <div class="error" v-if="error">{{ error }}</div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/popupButton.css";
</style>
