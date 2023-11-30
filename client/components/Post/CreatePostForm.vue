<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const image = ref("");
const video = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string, image: string, video: string) => {
  // put back ? and check if undefined here or set as empty string, then check for empty string
  try {
    console.log("image", image);
    await fetchy("/api/posts", "POST", {
      body: { content, image, video },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
  image.value = "";
  video.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(content, image, video)">
    <label for="content">Post Contents:</label>
    <textarea id="media-link" v-model="image" placeholder="Paste link to image media here!"> </textarea>
    <textarea id="media-link" v-model="video" placeholder="Paste link to video media here!"> </textarea>
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
</style>
