<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import PostTitle from "../Post/PostTitle.vue";
import router from "@/router";

const props = defineProps(["classId"]);
const loaded = ref(false);

function goBack() {
  void router.push({ path: `/classes/${props.classId}` });
}

let posts = ref<Array<Record<string, string>>>([]);

const getBookmarks = async () => {
  let bookmarkResults;
  try {
    bookmarkResults = await fetchy(`/api/classes/id/${props.classId}/posts/bookmarked`, "GET");
  } catch (_) {
    return;
  }
  posts.value = bookmarkResults;
};

onBeforeMount(async () => {
  await getBookmarks();
  loaded.value = true;
});
</script>

<template>
  <main>
    <button class="back-button" @click="goBack()">
      <svg height="19.4px" viewBox="0 0 512 512" width="16px" xmlns="http://www.w3.org/2000/svg">
        <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 " />
      </svg>
      <p>Back</p>
    </button>
    <h1>Your Bookmarks</h1>
    <div class="posts" v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id">
        <PostTitle :post="post" />
      </article>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300&display=swap');
h1 {
  text-align: center;
  font-family: 'Assistant', sans-serif;
}
.back-button {
  background-color: transparent;
  color: black;
  padding: 0px;
  border: none;
  border-radius: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-family: 'Assistant', sans-serif;
}
.icon svg {
  fill: black;
  width: 13px;
  margin: 0px;
}
.back-button:hover {
  text-decoration: underline;
}
main {
  width: 900px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 1000px) {
    width: calc(100vw - 100px);
    max-width: 900px;
    margin-left: 50px;
    margin-right: 50px;
  }
}
.posts {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
