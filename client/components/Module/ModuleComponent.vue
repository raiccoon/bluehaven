<script setup lang="ts">
import ModuleHeader from "@/components/Module/ModuleHeader.vue";
import PostTitle from "@/components/Post/PostTitle.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["module", "isAdmin", "isArchived"]);
const emits = defineEmits(["deleteModule"]);
let loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
const moduleId = props.module._id;

const isModuleClicked = ref(localStorage.getItem(`isModuleClicked_${moduleId}`) === "true" || false);

const clickModule = () => {
  isModuleClicked.value = !isModuleClicked.value;
  localStorage.setItem(`isModuleClicked_${moduleId}`, isModuleClicked.value.toString());
};

const expand = () => {
  isModuleClicked.value = true;
  localStorage.setItem(`isModuleClicked_${moduleId}`, isModuleClicked.value.toString());
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

const deleteModule = () => {
  emits("deleteModule");
};

onBeforeMount(async () => {
  await getPostsInModule();
  loaded.value = true;

  if (localStorage.getItem(`isModuleClicked_${moduleId}`) === "true") {
    isModuleClicked.value = true;
  }
});
</script>

<template>
  <main>
    <ModuleHeader :module="module" :isAdmin="isAdmin" :isArchived="isArchived" @expandMe="expand" @toggleClick="clickModule" @refreshPosts="getPostsInModule()" @deleteModule="deleteModule" />
    <div class="posts" v-if="isModuleClicked && loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id">
        <PostTitle :post="post" :fromPage="'class'" />
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
</style>
