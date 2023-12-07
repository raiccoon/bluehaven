<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";
const error = ref("");
const { toast } = storeToRefs(useToastStore());

const emit = defineEmits(["classCreated"]);
const isCreateClassClicked = ref(false);
const className = ref("");

const clickCreateClass = () => {
  isCreateClassClicked.value = true;
};

const handleCreateClass = async (className: string) => {
  if (!className.trim()) {
    error.value = "Please enter a class name.";
    return;
  }
  try {
    await fetchy("/api/classes", "POST", {
      body: { className: className },
    });
    emptyForm();
    emit("classCreated");
  } catch (e) {
    if (toast.value !== null) {
      error.value = toast.value.message;
    }
    return;
  }
};

const emptyForm = () => {
  className.value = "";
  error.value = "";
  isCreateClassClicked.value = false;
};

const handleCancel = () => {
  className.value = "";
  error.value = "";
  isCreateClassClicked.value = false;
};
</script>

<template>
  <main>
    <button class="click" @click="clickCreateClass">Create a Class</button>
    <div class="modal-background" v-if="isCreateClassClicked">
      <div class="modal-content">
        <form @submit.prevent="handleCreateClass(className)">
          <h3>Create a new class</h3>
          <input type="text" v-model="className" placeholder="Class name" />
          <div class="modal-buttons">
            <button class="submit" type="submit">Create</button>
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
