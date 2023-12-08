<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref, defineProps, onBeforeMount } from "vue";
import BackButton from "@/components/BackButton.vue";
import LeaveClassButton from "@/components/Class/LeaveClassButton.vue";
import ArchiveClassButton from "@/components/Class/ArchiveClassButton.vue";
import ViewLabelsButton from "@/components/Class/ViewLabelsButton.vue";
import ViewBookmarksButton from "@/components/Class/ViewBookmarksButton.vue";

import router from "../../router";

const props = defineProps(["classId", "isAdmin"]);

const className = ref("");
const joinCode = ref("");

const getClass = async () => {
  let response;
  try {
    response = await fetchy(`/api/classes/id/${props.classId}`, "GET", {
      query: { _id: props.classId },
    });
  } catch (_) {
    return;
  }
  className.value = response.className;
  joinCode.value = response.joinCode;
};

const viewBookmarks = async () => {
  void router.push({ path: `/classes/${props.classId}/bookmarks` });
};

onBeforeMount(async () => {
  await getClass();
});
</script>

<template>
  <main>
    <div class="options">
      <BackButton :routeName="'Classes'" />
      <div class="right">
        <button v-if="isAdmin" class="button">
          <ViewLabelsButton :classId="props.classId" />
        </button>
        <button v-else class="button" @click="viewBookmarks">
          <ViewBookmarksButton />
        </button>
        <button v-if="isAdmin" class="button">
          <ArchiveClassButton :classId="props.classId" />
        </button>
        <button v-else class="button">
          <LeaveClassButton :classId="props.classId" />
        </button>
      </div>
    </div>
    <h1>{{ className }}</h1>
    <p v-if="isAdmin">Join code: {{ joinCode }}</p>
  </main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");
.right {
  width: fit-content;
  display: flex;
}
.options {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.button {
  margin-top: 5px;
  margin-right: 15px;
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
h1 {
  margin-top: 5px;
}
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

p {
  margin: 0px;
  margin-bottom: 10px;
}
main {
  margin-top: 15px;
  width: 100%;
}
h1 {
  margin-bottom: 10px;
}
</style>
