<script setup lang="ts">
import ClassHeader from "@/components/Class/ClassHeader.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ModuleListComponent from "../Module/ModuleListComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["classId"]);

const classObj = ref<Record<string, string>>();
const isAdmin = ref(false);
const isArchived = ref();
const loaded = ref(false);

const checkIfAdmin = async () => {
  try {
    isAdmin.value = await fetchy(`/api/classes/id/${props.classId}/membership/isInstructor`, "GET", {
      query: { classId: props.classId, username: currentUsername.value },
    });
  } catch (_) {
    return;
  }
};

const getClass = async () => {
  let response;
  try {
    response = await fetchy(`/api/classes/id/${props.classId}`, "GET");
  } catch (_) {
    return;
  }
  classObj.value = response;
  isArchived.value = classObj.value!.archived;
};

onBeforeMount(async () => {
  await checkIfAdmin();
  await getClass();
  loaded.value = true;
});
</script>
<template>
  <main v-if="loaded">
    <ClassHeader :classObj="classObj" :isAdmin="isAdmin" :isArchived="isArchived" />
    <ModuleListComponent :classId="props.classId" :isAdmin="isAdmin" :isArchived="isArchived" />
  </main>
</template>
<style scoped>
@import "@/assets/classes.css";
.classList {
  margin-top: 15px;
}
button {
  margin-top: 15px;
}
</style>
