<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";

const error = ref("");
const { toast } = storeToRefs(useToastStore());
const emit = defineEmits(["classJoined"]);
const isJoinClassClicked = ref(false);
const joinCode = ref("");

const clickJoinClass = () => {
  isJoinClassClicked.value = true;
};

const handleJoinClass = async (joinCode: string) => {
  if (!joinCode.trim()) {
    error.value = "Please enter a join code.";
    return;
  }
  try {
    await fetchy(`/api/classes/joincode/${joinCode}/students`, "POST", {
      body: { joinCode },
    });
    emptyForm();
    emit("classJoined");
  } catch (e) {
    if (toast.value !== null) {
      error.value = toast.value.message;
    }
    return;
  }
};

const emptyForm = () => {
  joinCode.value = "";
  error.value = "";
  isJoinClassClicked.value = false;
};

const handleCancel = () => {
  joinCode.value = "";
  error.value = "";
  isJoinClassClicked.value = false;
};
</script>

<template>
  <main>
    <button class="click" @click="clickJoinClass">Join a Class</button>
    <div class="modal-background" v-if="isJoinClassClicked">
      <div class="modal-content">
        <form @submit.prevent="handleJoinClass(joinCode)">
          <h3>Enter the class join code.</h3>
          <input type="text" v-model="joinCode" placeholder="Join code" />
          <div class="modal-buttons">
            <button class="submit" type="submit">Join</button>
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
