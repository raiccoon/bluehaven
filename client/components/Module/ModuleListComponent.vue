<script setup lang="ts">
import ModuleComponent from "@/components/Module/ModuleComponent.vue";
import CreateModuleButton from "@/components/Module/CreateModuleButton.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
const props = defineProps(["classId"]);
let modules = ref<Array<Record<string, string>>>([]);
// const displayMsg = ref(false);
// const msg = ref("message");

const getModulesInClass = async () => {
  let moduleResults;
  try {
    moduleResults = await fetchy(`/api/classes/id/${props.classId}/modules`, "GET");
  } catch (_) {
    return;
  }
  modules.value = moduleResults;
};

onBeforeMount(async () => {
  await getModulesInClass();
  loaded.value = true;
});
</script>

<template>
  <CreateModuleButton :classId="props.classId" />
  <section class="modules" v-if="loaded && modules.length !== 0">
    <article v-for="module in modules" :key="module._id">
      <ModuleComponent :module="module" />
    </article>
  </section>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
section {
  flex-direction: column;
}
</style>
