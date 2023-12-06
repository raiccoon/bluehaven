<script setup lang="ts">
import CreateModuleButton from "@/components/Module/CreateModuleButton.vue";
import ModuleComponent from "@/components/Module/ModuleComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
const props = defineProps(["classId"]);
let modules = ref<Array<Record<string, string>>>([]);

const getModulesInClass = async () => {
  let moduleResults;
  try {
    moduleResults = await fetchy(`/api/classes/id/${props.classId}/modules`, "GET");
  } catch (_) {
    return;
  }
  modules.value = moduleResults;
};
const handleRefresh = async () => {
  await getModulesInClass();
};
onBeforeMount(async () => {
  await getModulesInClass();
  loaded.value = true;
});
</script>

<template>
  <main>
    <CreateModuleButton :classId="props.classId" @moduleCreated="handleRefresh" />
    <section class="modules" v-if="loaded && modules.length !== 0">
      <article v-for="module in modules" :key="module._id">
        <ModuleComponent :module="module" />
      </article>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modules {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
