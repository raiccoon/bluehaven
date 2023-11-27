<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const { isLoggedIn } = storeToRefs(useUserStore());

const isJoinClassClicked = ref(false);
const joinCode = ref("");
const displayMsg = ref(false);
const msg = ref("message");
const clickJoinClass = () => {
  displayMsg.value = false;
  isJoinClassClicked.value = true;
};
const handleJoinClass = async (joinCode: string) => {
  let classResults;
  try {
    classResults = await fetchy(`/api/classes/joincode/${joinCode}/students`, "POST", {
      body: { joinCode },
    });
  } catch (_) {
    return;
  }
  msg.value = classResults;
  displayMsg.value = true;
  emptyForm();
};
const handleCancel = () => {
  displayMsg.value = false;
  emptyForm();
};
const emptyForm = () => {
  joinCode.value = "";
  isJoinClassClicked.value = false;
};
</script>

<template>
  <main>
    <section v-if="isLoggedIn">
      <div class="main">
        <button v-if="!isJoinClassClicked" @click="clickJoinClass">Click here to join a class!</button>
        <form v-else @submit.prevent="handleJoinClass(joinCode)">
          <input type="text" v-model="joinCode" placeholder="Join code for your class" />
          <button type="submit">Join</button>
          <button @click="handleCancel">Cancel</button>
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
