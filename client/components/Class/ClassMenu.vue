<script setup lang="ts">
import AddInstructor from "@/components/Class/AddInstructorButton.vue";
import ArchiveClassButton from "@/components/Class/ArchiveClassButton.vue";
import LeaveClassButton from "@/components/Class/LeaveClassButton.vue";
import ViewBookmarksButton from "@/components/Class/ViewBookmarksButton.vue";
import ViewLabelsButton from "@/components/Class/ViewLabelsButton.vue";
import { ref } from "vue";
import router from "../../router";
import UnarchiveClassButton from "./UnarchiveClassButton.vue";

const props = defineProps(["classId", "isAdmin", "isArchived"]);
const isModuleClicked = ref(false);
const clickModule = () => {
  isModuleClicked.value = !isModuleClicked.value;
};
const viewBookmarks = async () => {
  void router.push({ path: `/classes/${props.classId}/bookmarks` });
};
</script>
<template>
  <button class="button" id="bookmark" @click="viewBookmarks">
    <ViewBookmarksButton />
  </button>
  <button v-if="!isAdmin" class="button">
    <LeaveClassButton :classId="props.classId" />
  </button>
  <div class="menu" v-if="isModuleClicked">
    <button v-if="isAdmin && !isArchived" class="button">
      <AddInstructor :classId="props.classId" />
    </button>
    <button v-if="isAdmin" class="button">
      <ViewLabelsButton :classId="props.classId" isArchived />
    </button>
    <button v-if="isAdmin && !isArchived" class="button">
      <ArchiveClassButton :classId="props.classId" />
    </button>
    <button v-if="isAdmin && isArchived" class="button">
      <UnarchiveClassButton :classId="props.classId" />
    </button>
  </div>
  <button v-if="isAdmin" @click="clickModule" class="buttonClick">
    <span v-if="!isModuleClicked">
      <div class="options-text">Options</div>
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
.menu {
  position: absolute;
  margin-right: 26px;
  margin-top: -10px;
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
</style>
