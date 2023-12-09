<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const props = defineProps(["module"]);
const emit = defineEmits(["toggleVisibility"]);
const showMessage = ref(false);
const visibilityMessage = ref("");

function showHideMessage(visibility: string) {
  if (visibility === "hidden") {
    visibilityMessage.value = "This module is hidden. Click to publish.";
  } else {
    visibilityMessage.value = "This module is published. Click to hide.";
  }
  showMessage.value = true;
}

function hideMessage() {
  showMessage.value = false;
}
const isButtonClicked = ref(false);

const clickButton = () => {
  isButtonClicked.value = true;
};

const toggleModuleVisibility = async () => {
  try {
    await fetchy(`/api/modules/${props.module._id}/hidden`, "PUT", {
      body: { hidden: !props.module.hidden },
    });
    emit("toggleVisibility");
    hideMessage();
    isButtonClicked.value = false;
  } catch (_) {
    return;
  }
};
const handleCancel = () => {
  isButtonClicked.value = false;
};
</script>
<template>
  <h3 class="name">
    {{ module.name }}
    <i v-if="module.hidden" class="material-symbols-outlined eye" @mouseover="showHideMessage('hidden')" @click="clickButton" @mouseleave="hideMessage">visibility_off</i>
    <i v-else class="material-symbols-outlined eye" @mouseover="showHideMessage('visible')" @click="clickButton" @mouseleave="hideMessage">visibility</i>
    <span v-if="showMessage" class="visibility-message" :class="{ show: showMessage }">{{ visibilityMessage }}</span>
  </h3>
  <div class="modal-background" v-if="isButtonClicked">
    <div class="modal-content">
      <form @submit.prevent="toggleModuleVisibility()">
        <div class="text">
          <h3 class="message" v-if="props.module.hidden">Are you sure you want to publish this module?</h3>
          <h3 class="message" v-else>Are you sure you want to hide this module?</h3>
        </div>
        <div class="modal-buttons">
          <button class="submit" type="submit">
            <p v-if="props.module.hidden">Publish</p>
            <p v-else>Hide</p>
          </button>
          <button class="cancel" type="button" @click="handleCancel">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@300&display=swap");
.name {
  display: flex;
  align-items: center;
  margin: 15px;
  margin-top: 0px;
  margin-bottom: 5px;
  font-size: 22px;
}
.message {
  margin-bottom: 0px;
  text-align: center;
}
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}
form {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  width: 300px;
  height: 120px;
  margin-left: auto;
  margin-right: auto;
}
.modal-buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.visibility-message {
  font-family: "Assistant", sans-serif;
  font-size: 14px;
  text-decoration: none;
  margin-left: 5px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
}

.visibility-message.show {
  opacity: 0.6;
}

.eye {
  margin-left: 5px;
  font-size: 16px;
  opacity: 0.5;
  transition: opacity 0.2s ease-in-out;
}

.eye:hover {
  opacity: 0.6;
  cursor: pointer;
}

.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
.submit {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color, border-color, color, box-shadow, filter;
  transition-duration: 0.3s;
  border: 1px solid transparent;
  letter-spacing: 2px;
  min-width: 115px;
  white-space: normal;
  text-align: center;
  padding: 5px 5px 5px;
  color: #fff;
  box-shadow: inset 0 0 0 2px #5190bbff;
  background-color: #5190bbff;
  height: 40px;
}
.submit:hover {
  transform: scale(1.04);
}
.cancel {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color, border-color, color, box-shadow, filter;
  transition-duration: 0.3s;
  border: 1px solid transparent;
  letter-spacing: 2px;
  min-width: 115px;
  white-space: normal;
  text-align: center;
  padding: 5px 5px 5px;
  color: #888888;
  box-shadow: inset 0 0 0 2px #888888;
  background-color: transparent;
  height: 40px;
}
.cancel:hover {
  transform: scale(1.04);
}
</style>
