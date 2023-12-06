<script setup lang="ts">
import ModuleHeader from "@/components/Module/ModuleHeader.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
const props = defineProps(["module"]);
let posts = ref<Array<Record<string, string>>>([]);

const isModuleClicked = ref(false);

const clickModule = () => {
  isModuleClicked.value = !isModuleClicked.value;
};

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
  <main>
    <ModuleHeader :module="module" @expand="clickModule" />
    <div class="posts" v-if="isModuleClicked && loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id">
        <PostComponent :post="post" />
      </article>
    </div>
    <p v-else-if="isModuleClicked">No posts to show.</p>
  </main>
</template>

<style scoped>
main {
  width: 900px;
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
  width: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
article {
  background-color: #eff0f6ff;
  border-radius: 8px;
}
</style>
