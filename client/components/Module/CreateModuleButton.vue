<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";

const props = defineProps({
  classId: {
    type: String,
    default: "",
  },
});

const isCreateModuleClicked = ref(false);
const name = ref("");
const description = ref("");

const error = ref("");
const { toast } = storeToRefs(useToastStore());
const emit = defineEmits(["moduleCreated"]);

const clickCreateModule = () => {
  isCreateModuleClicked.value = true;
};

const handleCreateModule = async (classId: string, name: string, description: string) => {
  if (!name.trim()) {
    error.value = "Please enter a module name.";
    return;
  }
  try {
    await fetchy("/api/modules", "POST", {
      body: { classId, name, description },
    });
    emptyForm();
    emit("moduleCreated");
  } catch (e) {
    if (toast.value !== null) {
      error.value = toast.value.message;
    }
    return;
  }
};

const emptyForm = () => {
  name.value = "";
  description.value = "";
  error.value = "";
  isCreateModuleClicked.value = false;
};

const handleCancel = () => {
  name.value = "";
  description.value = "";
  error.value = "";
  isCreateModuleClicked.value = false;
};
</script>

<template>
  <main>
    <button class="click" @click="clickCreateModule">Create Module</button>
    <div class="modal-background" v-if="isCreateModuleClicked">
      <form @submit.prevent="handleCreateModule(props.classId, name, description)">
        <h3>Create a new module.</h3>
        <input type="text" v-model="name" placeholder="Module Name" />
        <input type="text" v-model="description" placeholder="Description (optional)" />
        <div class="modal-buttons">
          <button class="submit" type="submit">Create</button>
          <button class="cancel" @click="handleCancel">Cancel</button>
        </div>
        <div class="error" v-if="error">{{ error }}</div>
      </form>
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/popupButton.css";
</style>
