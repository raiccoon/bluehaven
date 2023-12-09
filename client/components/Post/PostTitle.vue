<script setup lang="ts">
import { formatDate } from "@/utils/formatDate";
import router from "../../router";

const props = defineProps(["post", "fromPage"]);

const expandPost = async () => {
  if (props.fromPage === "bookmarks") {
    void router.push({
      path: `/expanded-post/${props.post._id}`,
      query: { source: "bookmarks" },
    });
  } else {
    void router.push({
      path: `/expanded-post/${props.post._id}`,
      query: { source: "class" },
    });
  }
};
</script>

<template>
  <button @click="expandPost">
    <div class="text">
      <h3 class="title">{{ props.post.title }}</h3>
      <p>By @{{ props.post.author }} on {{ formatDate(props.post.dateUpdated) }}</p>
    </div>
    <div class="button">
      <i class="material-symbols-outlined eye">open_in_full</i>
    </div>
  </button>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300&display=swap');
.text {
  font-family: 'Assistant', sans-serif;
}
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
.button {
  font-size: 6px;
  opacity: 0.5;
}
button {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #eff0f6ff;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button:hover {
  background-color: #c9cad3ff;
}
button:active {
  background-color: rgb(174, 175, 183);
}
.title {
  margin: 0px;
}
p {
  margin: 0px;
  color: rgb(100, 100, 100);
}
</style>
