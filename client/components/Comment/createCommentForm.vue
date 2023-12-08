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
  isCreateCommentClicked.value = false;
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
    <button v-if="!isCreateCommentClicked" @click="clickCreateComment" class="pure-button">Create a comment!</button>
    <form v-else @submit.prevent="handleCreateComment(props.parent, content, image, video)">
      <textarea type="text" v-model="image" id="media-link" placeholder="Image link (optional)"> </textarea>
      <textarea type="text" v-model="video" id="media-link" placeholder="Video link (optional)"> </textarea>
      <textarea type="text" v-model="content" placeholder="Comment content here"> </textarea>
      <div>
        <button type="submit" class="pure-button-primary pure-button">Create</button>
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
  /* width: 500px; */
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
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color, border-color, color, box-shadow, filter;
  transition-duration: 0.3s;
  border: 1px solid transparent;
  letter-spacing: 2px;
  min-width: 115px;
  white-space: normal;
  text-align: center;
  padding: 5px 5px 5px;
  color: #fff;
  box-shadow: inset 0 0 0 2px #5190bbff;
  background-color: #5190bbff;
  height: 40px;
}

#media-link {
  max-height: 20px;
}
</style>
