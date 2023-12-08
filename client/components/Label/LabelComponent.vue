<script setup lang="ts">
import { onBeforeMount } from "vue";

const props = defineProps(["label"]);

onBeforeMount(async () => {
  //beforemount stuff here
});
</script>

<template>
  <div class="label">{{ label.name }}</div>
</template>

<style scoped>
.label {
  background-color: var(--base-bg);
}
</style>
