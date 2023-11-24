<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const isCreateClassClicked = ref(false);
const className = ref("");
const displayMsg = ref(false);
const msg = ref("message");
const clickCreateClass = () => {
  displayMsg.value = false;
  isCreateClassClicked.value = true;
};
const handleCreateClass = () => {
  //  msg.value = createClass(className.value)
  displayMsg.value = true;
  className.value = "";
  isCreateClassClicked.value = false;
};
const handleCancel = () => {
  displayMsg.value = false;
  className.value = "";
  isCreateClassClicked.value = false;
};
</script>

<template>
  <main>
    <section v-if="isLoggedIn">
      <div class="main">
        <button v-if="!isCreateClassClicked" @click="clickCreateClass">Click here to create a class!</button>
        <form v-else @submit.prevent="handleCreateClass">
          <input type="text" v-model="className" placeholder="Name of your class" />
          <button type="submit">Create</button>
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
