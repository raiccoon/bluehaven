<script setup lang="ts">
import AddClassButton from "@/components/Class/AddClassButton.vue";
import JoinClassButton from "@/components/Class/JoinClassButton.vue";
import ClassTile from "@/components/Class/ClassTile.vue";
import { fetchy } from "@/utils/fetchy";
import { defineProps, onBeforeMount, ref } from "vue";

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
const handleRefresh = async () => {
  await getClasses();
};
onBeforeMount(async () => {
  await getClasses();
});
</script>

<template>
  <main>
    <div class="header" v-if="role === 'instruct'">
      <h2 class="enrolled">Enrolled: Instructor</h2>
      <AddClassButton @classCreated="handleRefresh" />
    </div>
    <div class="header" v-else>
      <h2 class="enrolled">Enrolled: Student</h2>
      <JoinClassButton @classJoined="handleRefresh" />
    </div>
    <div class="tile-container">
      <div v-if="classIDs.length === 0" class="placeholder">No classes to show.</div>
      <ClassTile v-for="classID in classIDs" :key="classID" :_id="classID" />
    </div>
  </main>
</template>

<style scoped>
@import "@/assets/classes.css";
.placeholder {
  width: 250px;
  height: 150px;
  margin: 20px;
}
.enrolled {
  margin-left: 20px;
}
.tile-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 920px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
}
.header {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  @media (max-width: 500px) {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
