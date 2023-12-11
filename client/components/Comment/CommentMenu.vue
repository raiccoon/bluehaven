<script setup lang="ts">
import EditCommentButton from "@/components/Comment/EditCommentButton.vue";
import { ref } from "vue";

const props = defineProps(["comment", "viewOptions", "isInstructor", "isAuthor", "isPinned"]);
const emit = defineEmits(["toggleOptions", "deleteComment", "editComment", "openLabelModal", "togglePin", "refreshComments"]);

const isMenuOpen = ref(false);
const clickModule = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>
<template>
  <div class="menu-container">
    <div class="menu" v-if="isMenuOpen">
      <button @click="emit('togglePin')" v-if="isInstructor" class="button">
        {{ isPinned ? "Unpin" : "Pin" }}
      </button>
      <button
        @click="
          emit('openLabelModal');
          isMenuOpen = false;
        "
        v-if="isInstructor || isAuthor"
        class="button"
      >
        Add Label
      </button>
      <EditCommentButton v-if="isInstructor || isAuthor" :comment="comment" @refreshComments="emit('refreshComments')" @editComment="emit('editComment')" />
      <button @click="emit('deleteComment')" v-if="isInstructor || isAuthor" class="button">Delete</button>
    </div>
  </div>

  <button v-if="!viewOptions && (isInstructor || isAuthor)" @click="clickModule" class="buttonClick">
    <span v-if="!isMenuOpen">
      <!-- <div class="options-text">Options</div> -->
      <i class="material-symbols-outlined close">more_vert</i>
    </span>
    <span v-else>
      <i class="material-symbols-outlined close">close</i>
    </span>
  </button>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");

#bookmark {
  margin-right: 10px;
}
.buttonClick:hover {
  .close {
    transform: scale(1.1);
  }
  .options-text {
    text-decoration: underline;
  }
}

.menu-container {
  position: relative;
  width: 0;
  height: 0;
}

.menu {
  position: absolute;
  margin-left: -112px;
  margin-top: -5px;
  padding: 20px;
  width: fit-content;
  height: fit-content;
  z-index: 99999;
  border-radius: 20px;
  background-color: #eff0f6ff;
  box-shadow: 0px 4px 10px rgb(147, 168, 177);
  transition: all 0.6s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  gap: 10px;
}
.options {
  height: 24px;
  display: flex;
  align-items: center;
}
span {
  display: flex;
  align-items: center;
}
.button,
.buttonClick {
  background-color: transparent;
  color: black;
  padding: 0px;
  border: none;
  border-radius: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
}
.button:hover {
  text-decoration: underline;
}
.buttonClick:hover {
  .options {
    text-decoration: underline;
  }
}
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
.close {
  font-size: 18px;
}
</style>
