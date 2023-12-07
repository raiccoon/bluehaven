<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const isCreateCommentClicked = ref(false);
const props = defineProps(["parent"]); //<------ can acquire from the postId in the expanded post's route (props??), hard coded for now
const content = ref("");
const image = ref("");
const video = ref("");

const displayMsg = ref(false);
const msg = ref("message");
const emit = defineEmits(["refreshComments"]);

const clickCreateComment = () => {
  displayMsg.value = false;
  isCreateCommentClicked.value = true;
};

const handleCreateComment = async (parent: string, content: string, image: string, video: string) => {
  let commentResults;
  try {
    commentResults = await fetchy("/api/comments", "POST", {
      body: { parent, content, image, video },
    });
  } catch (_) {
    return;
  }
  msg.value = commentResults;
  displayMsg.value = true;
  emit("refreshComments");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
  image.value = "";
  video.value = "";
};

const handleCancel = () => {
  displayMsg.value = false;
  content.value = "";
  image.value = "";
  video.value = "";
  isCreateCommentClicked.value = false;
};
</script>

<template>
  <section class="main">
    <button v-if="!isCreateCommentClicked" @click="clickCreateComment" class="pure-button">Click here to create a comment!</button>
    <form v-else @submit.prevent="handleCreateComment(props.parent, content, image, video)">
      <textarea type="text" v-model="image" id="media-link" placeholder="Image link (optional)"> </textarea>
      <textarea type="text" v-model="video" id="media-link" placeholder="Video link (optional)"> </textarea>
      <textarea type="text" v-model="content" placeholder="Comment content here"> </textarea>
      <div>
        <button type="submit" class="pure-button-primary pure-button">Create</button>
        <button type="button" class="pure-button">+ Add Labels</button>
        <button @click="handleCancel" class="pure-button">Cancel</button>
      </div>
    </form>
  </section>
  <!-- <p v-if="displayMsg">{{ msg }}</p> -->
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  gap: 0.5em;
  padding: 1em;
  flex-direction: column;
  gap: 0.5em;
  overflow-y: auto;
  max-height: 70vh;
  margin: 1em;
  /* not the proper way to make this a good size lol */
  width: 500px;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

button {
  margin: 1em;
  margin-right: 1rem;
}

#media-link {
  max-height: 20px;
}
</style>
