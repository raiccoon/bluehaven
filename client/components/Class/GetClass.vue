<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const classObjectID = ref("");
const displayMsg = ref(false);
const msg = ref("message");
const handleGetClass = () => {
  //  msg.value = getClass(classObjectID.value)
  displayMsg.value = true;
  classObjectID.value = "";
};
</script>

<template>
  <main>
    <section v-if="isLoggedIn">
      <div class="main">
        <form @submit.prevent="handleGetClass">
          <input type="text" v-model="classObjectID" placeholder="Class ObjectID" />
          <button type="submit">Lookup</button>
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
