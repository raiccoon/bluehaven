<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const expandPost = async () => {
  console.log(`HELLO ${props.post._id}`);
  void router.push({ path: `/expanded-post/${props.post._id}` });
};
</script>

<template>
  <p class="author">{{ props.post.author }}</p>
  <!-- placeholder media -->
  <img class="postMedia" src="https://i.imgur.com/CWuBXGh.jpg" />
  <!-- truncate text, can view full text by expanding -->
  <p class="text single-line">{{ props.post.content }}</p>
  <div class="base">
    <menu>
      <!-- expand button takes you to the large post view -->
      <li><button class="btn-small pure-button" @click="expandPost">Expand</button></li>
      <li><button v-if="props.post.author == currentUsername" class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button v-if="props.post.author == currentUsername" class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
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
  max-width: 100px;
  height: auto;
  align-self: center;
}
.text.single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
