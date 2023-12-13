<script setup lang="ts">
const props = defineProps(["authorName", "isEdited", "isInstructorEdited", "dateCreated", "dateUpdated", "isInstructor", "isAuthor"]);
</script>
<template>
  <div class="everything">
    <div class="created">
      <p>
        <i>{{ isAuthor || isInstructor ? "by @" + authorName + " on" : "" }} {{ dateCreated }}</i>
      </p>
    </div>
    <div class="edited" v-if="isEdited">
      <p>
        <!-- <i>{{ isInstructorEdited ? "instructor " : "" }}{{ isEdited ? "edited on " + dateUpdated : "" }}</i> -->
        <i>{{ isInstructorEdited ? "instructor edited " : "" }}{{}}</i>
      </p>
    </div>
  </div>
</template>

<style scoped>
.everything {
  font-size: 14px;
  color: rgb(165, 165, 165);
}
</style>
