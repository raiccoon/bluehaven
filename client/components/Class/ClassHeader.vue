<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref, defineProps, onBeforeMount } from "vue";
import BackButton from "@/components/BackButton.vue";
import ClassMenu from "@/components/Class/ClassMenu.vue";

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

onBeforeMount(async () => {
  await getClass();
});
</script>

<template>
  <main>
    <div class="options">
      <BackButton :routeName="'Classes'" />
      <div class="right">
        <ClassMenu :isAdmin="isAdmin" :classId="props.classId" />
        <!-- <button v-if="isAdmin" class="button">
          <AddInstructor :classId="props.classId" />
        </button>
        <button v-if="isAdmin" class="button">
          <ViewLabelsButton :classId="props.classId" />
        </button>
        <button class="button" @click="viewBookmarks">
          <ViewBookmarksButton />
        </button>
        <button v-if="isAdmin" class="button">
          <ArchiveClassButton :classId="props.classId" />
        </button>
        <button v-else class="button">
          <LeaveClassButton :classId="props.classId" />
        </button> -->
      </div>
    </div>
    <h1>{{ className }}</h1>
    <p v-if="isAdmin">Join code: {{ joinCode }}</p>
  </main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");
.right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.options {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 24px;
}
.button {
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
