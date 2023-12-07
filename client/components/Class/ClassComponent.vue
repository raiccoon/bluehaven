<script setup lang="ts">
import ClassHeader from "@/components/Class/ClassHeader.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ModuleListComponent from "../Module/ModuleListComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["classId"]);
const isAdmin = ref(false);

const checkIfAdmin = async () => {
  try {
    isAdmin.value = await fetchy(`/api/classes/id/${props.classId}/membership/isInstructor`, "GET", {
      query: { classId: props.classId, username: currentUsername.value },
    });
  } catch (_) {
    return;
  }
};

onBeforeMount(async () => {
  await checkIfAdmin();
});
</script>
<template>
  <main>
    <ClassHeader :classId="props.classId" :isAdmin="isAdmin" />
    <ModuleListComponent :classId="props.classId" :isAdmin="isAdmin" />
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
