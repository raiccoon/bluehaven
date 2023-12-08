<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

const props = defineProps(["classId"]);
let labels = ref<Array<Record<string, string>>>([]);

onBeforeMount(async () => {
  //beforemount stuff here
});
</script>

<template>
  <div>filler text</div>
</template>

<style scoped></style>
