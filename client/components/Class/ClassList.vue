<script setup lang="ts">
import ClassTile from "@/components/Class/ClassTile.vue";
import { fetchy } from "@/utils/fetchy";
import { defineProps, onMounted, ref } from "vue";

const props = defineProps({
  role: String,
});
const classIDs = ref<string[]>([]);

const getClasses = async () => {
  try {
    const response = await fetchy(`/api/classes/${props.role}`, "GET");
    classIDs.value = response.classes.map((classItem: { _id: String }) => classItem._id);
  } catch (error) {
    console.error("Error fetching classes:", error);
  }
};

onMounted(async () => {
  await getClasses();
});
</script>

<template>
  <main>
    <div class="tile-container">
      <ClassTile v-for="classID in classIDs" :key="classID" :_id="classID" />
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/classes.css";
.tile-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
</style>
