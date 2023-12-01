<script setup lang="ts">
import ClassHeader from "@/components/Class/ClassHeader.vue";
import { ref, onMounted } from "vue";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

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

onMounted(async () => {
  await checkIfAdmin();
});
</script>
<template>
  <main>
    <ClassHeader :classId="props.classId" :isAdmin="isAdmin" />
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
