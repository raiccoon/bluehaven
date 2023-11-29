<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";

const classObjectID = ref("");
const username = ref("");
const displayMsg = ref(false);
const msg = ref("message");

const handleInvite = async (classObjectId: string, username: string) => {
  let classResults;
  try {
    classResults = await fetchy(`/api/classes/id/${classObjectId}/instructors`, "POST", {
      body: { classId: classObjectId, inviteeName: username },
    });
  } catch (_) {
    return;
  }
  msg.value = classResults;
  displayMsg.value = true;
  emptyForm();
};

const emptyForm = () => {
  classObjectID.value = "";
  username.value = "";
};
</script>

<template>
  <main>
    <div class="main">
      <form @submit.prevent="handleInvite(classObjectID, username)">
        <input type="text" v-model="classObjectID" placeholder="Class Object ID" />
        <input type="text" v-model="username" placeholder="Invite by username" />
        <button type="submit">Invite</button>
      </form>
    </div>
    <p v-if="displayMsg">{{ msg }}</p>
  </main>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
