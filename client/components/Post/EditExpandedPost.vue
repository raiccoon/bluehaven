<script setup lang="ts">
import { formatDate } from "@/utils/formatDate";
import { ObjectId } from "mongodb";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["postId"]);
const loaded = ref(false);

let post = ref();
const emit = defineEmits(["goBack"]);

const content = ref("");
const image = ref("");
const video = ref("");

async function getPostById(_id: ObjectId) {
  let postResults;
  try {
    postResults = await fetchy(`/api/posts/${_id}`, "GET");
  } catch (_) {
    return;
  }
  post.value = postResults;
  content.value = post.value.content;
  image.value = post.value.image;
  video.value = post.value.video;
}

const editPost = async (content: string, image: string, video: string) => {
  try {
    await fetchy(`/api/posts/${props.postId}`, "PATCH", { body: { update: { content: content, image: image, video: video } } });
  } catch (e) {
    return;
  }
  emit("goBack");
};

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
  <section class="article" v-if="loaded">
    <form @submit.prevent="editPost(content, image, video)">
      <p class="author">{{ post.author }}</p>
      <textarea id="media-link" v-model="image" placeholder="Paste link to image here!"> </textarea>
      <textarea id="media-link" v-model="video" placeholder="Paste link to video here!"> </textarea>
      <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
      <div class="base">
        <menu>
          <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
          <li><button class="btn-small pure-button" @click="emit('goBack')">Cancel</button></li>
        </menu>
        <p v-if="post.dateCreated !== post.dateUpdated" class="timestamp">Edited on: {{ formatDate(post.dateUpdated) }}</p>
        <p v-else class="timestamp">Created on: {{ formatDate(post.dateCreated) }}</p>
      </div>
    </form>
  </section>
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
.article {
  margin: 1em;
  max-width: 45%;
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  overflow-y: auto;
  max-height: 70vh;
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
  white-space: nowrap;
  text-wrap: balance;
}
</style>
