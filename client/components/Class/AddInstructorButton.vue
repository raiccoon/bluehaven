<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";

const { toast } = storeToRefs(useToastStore());
const error = ref("");
const props = defineProps(["classId"]);
const username = ref("");

const isButtonClicked = ref(false);

const clickButton = () => {
  isButtonClicked.value = true;
};

const handleAddInstructor = async (username: string) => {
  try {
    await fetchy(`/api/classes/id/${props.classId}/instructors`, "POST", {
      body: { classId: props.classId, inviteeName: username },
    });
    isButtonClicked.value = false;
  } catch (e) {
    if (toast.value !== null) {
      error.value = toast.value.message;
    }
    return;
  }
};

const handleCancel = () => {
  isButtonClicked.value = false;
};
</script>

<template>
  <div>
    <div @click="clickButton">Add Instructor</div>
    <div class="modal-background" v-if="isButtonClicked">
      <div class="modal-content">
        <form @submit.prevent="handleAddInstructor(username)">
          <h3>Add an instructor to this class</h3>
          <input type="text" id="media-link" v-model="username" placeholder="Instructor username" />
          <div class="modal-buttons">
            <button type="submit" class="submit">Add</button>
            <button class="cancel" type="button" @click="handleCancel">Cancel</button>
          </div>
          <div class="error" v-if="error">{{ error }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/popupButton.css";
</style>
