<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const displayMsg = ref(false);
const msg = ref("message");
const getClasses = () => {
  //  msg.value = getClassesInstruct()
  displayMsg.value = true;
};
</script>

<template>
  <main>
    <section v-if="isLoggedIn">
      <div class="main">
        <button @click="getClasses">Click to see all classes you instruct</button>
        <p v-if="displayMsg">{{ msg }}</p>
      </div>
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
  flex-direction: column;
  align-items: center;
}
section {
  display: flex;
  flex-direction: column;
}
</style>
