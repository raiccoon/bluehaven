<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const imageLink = ref("");
const videoLink = ref("");
const imageLink = ref("");
const videoLink = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string, imageLink: string, videoLink: string) => {
  // put back ? and check if undefined here or set as empty string, then check for empty string
const createPost = async (content: string, imageLink: string, videoLink: string) => {
  // put back ? and check if undefined here or set as empty string, then check for empty string
  try {
    await fetchy("/api/posts", "POST", {
      body: { content, imageLink, videoLink },
      body: { content, imageLink, videoLink },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(content, imageLink, videoLink)">
  <form @submit.prevent="createPost(content, imageLink, videoLink)">
    <label for="content">Post Contents:</label>
    <textarea id="media-link" v-model="imageLink" placeholder="Paste link to image media here!"> </textarea>
    <textarea id="media-link" v-model="videoLink" placeholder="Paste link to video media here!"> </textarea>
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

#media-link {
  max-height: 20px;
}

.media-button {
  max-width: 10rem;
}

#media-link {
  max-height: 20px;
}

.media-button {
  max-width: 10rem;
}
</style>
