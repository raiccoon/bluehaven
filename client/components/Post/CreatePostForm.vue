<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);

const props = defineProps(["classId"]);

const module = ref("");
const modules = ref<Array<Record<string, string>>>([]);

const content = ref("");
const image = ref("");
const video = ref("");
const emit = defineEmits(["refreshPosts"]);

const getModulesInClass = async (classId: string) => {
  let moduleResults;
  try {
    moduleResults = await fetchy(`/api/classes/id/${classId}/modules`, "GET");
  } catch (_) {
    return;
  }
  modules.value = moduleResults;
};

const createPost = async (module: string, content: string, image: string, video: string) => {
  // put back ? and check if undefined here or set as empty string, then check for empty string
  try {
    await fetchy("/api/posts", "POST", {
      body: { module, content, image, video },
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

onBeforeMount(async () => {
  await getModulesInClass(props.classId);
  loaded.value = true;
});
</script>

<template>
  <form v-if="loaded" @submit.prevent="createPost(module, content, image, video)">
    <label for="content">Post Contents:</label>
    <textarea id="media-link" v-model="image" placeholder="Paste link to image media here!"> </textarea>
    <textarea id="media-link" v-model="video" placeholder="Paste link to video media here!"> </textarea>
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <select id="collection" v-model="module">
      <option disabled value="">Add to module:</option>
      <option v-for="module in modules" :key="module._id" :value="module._id">{{ module.name }}</option>
    </select>
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  margin: 1em;
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
