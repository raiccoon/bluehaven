<script setup lang="ts">
import ClassHeader from "@/components/Class/ClassHeader.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import ModuleListComponent from "../Module/ModuleListComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["classId"]);
const isAdmin = ref(false);

function createPost() {
  void router.push({ path: `/classes/${props.classId.toString()}/createPost` });
}

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
    <button v-if="isAdmin" @click="createPost">Create Post</button>
    <ModuleListComponent v-if="isAdmin" :classId="props.classId" />
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
