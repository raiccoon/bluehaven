<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { ObjectId } from "mongodb";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["postId", "author"]);
const loaded = ref(false);
let post = ref();
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${post.value._id}`, "DELETE");
    void router.push({ path: `/home` });
  } catch {
    return;
  }
  emit("refreshPosts");
};

async function getPostById(_id: ObjectId) {
  let postResults;
  try {
    postResults = await fetchy(`/api/posts/${_id}`, "GET");
  } catch (_) {
    return;
  }
  post.value = postResults;
}

onBeforeMount(async () => {
  try {
    await getPostById(props.postId);
    loaded.value = true;
  } catch (_) {
    return;
  }
});
</script>

<template>
  <div v-if="loaded">
    <p class="author">{{ props.author }}</p>
    <!-- placeholder media -->
    <img class="postMedia" src="https://i.imgur.com/CWuBXGh.jpg" />
    <p>{{ post.content }}</p>
    <div class="base">
      <menu>
        <li><button v-if="props.author == currentUsername" class="btn-small pure-button" @click="emit('editPost', post._id)">Edit</button></li>
        <li><button v-if="props.author == currentUsername" class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="post.dateCreated !== post.dateUpdated">Edited on: {{ formatDate(post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(post.dateCreated) }}</p>
      </article>
    </div>
  </div>
  <h2 v-else>Loading...</h2>
</template>

<style scoped>
h2 {
  text-align: center;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}

.postMedia {
  max-width: 500px;
  height: auto;
  align-self: center;
  text-align: center;
}
.text.single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
