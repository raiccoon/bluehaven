<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
const props = defineProps(["module"]);
let posts = ref<Array<Record<string, string>>>([]);

const getPostsInModule = async () => {
  let moduleResults;
  try {
    moduleResults = await fetchy(`/api/modules/${props.module._id}/posts`, "GET");
  } catch (_) {
    return;
  }
  posts.value = moduleResults;
};

onBeforeMount(async () => {
  await getPostsInModule();
  loaded.value = true;
});
</script>

<template>
  <p>{{ "Name: " + props.module.name }}</p>
  <p>{{ "Description: " + props.module.description }}</p>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent :post="post" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p {
  margin: 0 auto;
  max-width: 60em;
}
</style>
