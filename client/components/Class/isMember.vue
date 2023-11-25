<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const { isLoggedIn } = storeToRefs(useUserStore());

const classObjectID = ref("");
const username = ref("");
const displayMsg = ref(false);
const msg = ref("message");
const handleLookup = async (classObjectID: string, username: string) => {
  let classResults;
  try {
    classResults = await fetchy(`/api/classes/${classObjectID}/membership/isMember`, "GET", {
      query: { classId: classObjectID, username: username },
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
    <section v-if="isLoggedIn">
      <div class="main">
        <form @submit.prevent="handleLookup(classObjectID, username)">
          <input type="text" v-model="classObjectID" placeholder="Class Object ID" />
          <input type="text" v-model="username" placeholder="Username" />
          <button type="submit">Check If Instructor OR Student</button>
        </form>
      </div>
      <p v-if="displayMsg">{{ msg }}</p>
    </section>
  </main>
</template>

<style scoped>
p {
  margin: 0px;
  text-align: center;
}
h1 {
  text-align: center;
}
button {
  width: fit-content;
}
.main {
  display: flex;
  justify-content: center;
}
section {
  display: flex;
  flex-direction: column;
}
</style>
