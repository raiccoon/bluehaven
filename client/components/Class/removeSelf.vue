<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const { isLoggedIn } = storeToRefs(useUserStore());

const classObjectID = ref("");
const displayMsg = ref(false);
const msg = ref("message");
const removeSelf = async (classObjectID: string) => {
  let classResults;
  try {
    classResults = await fetchy(`/api/classes/id/${classObjectID}/membership`, "DELETE", {
      query: { classId: classObjectID },
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
};
</script>

<template>
  <main>
    <section v-if="isLoggedIn">
      <div class="main">
        <form @submit.prevent="removeSelf(classObjectID)">
          <input type="text" v-model="classObjectID" placeholder="Class ObjectID" />
          <button type="submit">Click to remove yourself from this class</button>
        </form>
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
