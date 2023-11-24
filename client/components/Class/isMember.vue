<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const classObjectID = ref("");
const username = ref("");
const displayMsg = ref(false);
const msg = ref("message");
const handleLookup = () => {
  //  msg.value = isMember(classObjectID.value, username.value)
  displayMsg.value = true;
  classObjectID.value = "";
  username.value = "";
};
</script>

<template>
  <main>
    <section v-if="isLoggedIn">
      <div class="main">
        <form @submit.prevent="handleLookup">
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
