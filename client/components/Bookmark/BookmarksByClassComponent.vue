<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import PostComponent from "../Post/PostComponent.vue";

const props = defineProps(["classId"]);
const loaded = ref(false);

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
  <div class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent :post="post" />
    </article>
  </div>
</template>

<style scoped>
@import "@/assets/boilerplate.css";
</style>
