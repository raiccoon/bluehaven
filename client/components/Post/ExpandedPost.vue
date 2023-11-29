<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { ObjectId } from "mongodb";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["postId"]);
let post = ref();
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${post.value._id}`, "DELETE");
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
  } catch (_) {
    return;
  }
});
</script>

<template>
  <p class="author">{{ post.value.author }}</p>
  <!-- placeholder media -->
  <img class="postMedia" src="https://i.imgur.com/CWuBXGh.jpg" />
  <p>{{ post.value.content }}</p>
  <div class="base">
    <menu>
      <li><button v-if="post.value.author == currentUsername" class="btn-small pure-button" @click="emit('editPost', post.value._id)">Edit</button></li>
      <li><button v-if="post.value.author == currentUsername" class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="post.value.dateCreated !== post.value.dateUpdated">Edited on: {{ formatDate(post.value.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(post.value.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
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
}
.text.single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
