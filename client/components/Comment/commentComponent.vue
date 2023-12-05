<script setup lang="ts">
import commentList from "@/components/Comment/commentList.vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["comment"]);
const emit = defineEmits(["editComment", "refreshComments"]);
const { currentUsername } = storeToRefs(useUserStore());

const hasImage = ref(false);
const hasVideo = ref(false);
const viewOptions = ref(false);
const viewReplies = ref(false);

const deleteComment = async () => {
  try {
    await fetchy(`/api/comments/${props.comment._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshComments");
};

const toggleOptions = async () => {
  try {
    viewOptions.value = !viewOptions.value;
  } catch {
    return;
  }
};

const toggleReplies = async () => {
  try {
    viewReplies.value = !viewReplies.value;
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  try {
    if (props.comment.image !== "") {
      hasImage.value = true;
    }
    if (props.comment.video !== "") {
      hasVideo.value = true;
    }
  } catch (_) {
    return;
  }
});
</script>

<template>
  <div class="comment-header">
    <p class="author">{{ props.comment.author }}</p>
    <!-- placeholder for triple dots -->
    <button v-if="!viewOptions" class="options-button pure-button btn-small" @click="toggleOptions">Options</button>
    <menu class="options" v-if="viewOptions">
      <li><button v-if="props.comment.author == currentUsername" class="button-error btn-small pure-button" @click="deleteComment">Delete</button></li>
      <li><button v-if="props.comment.author == currentUsername" class="btn-small pure-button" @click="emit('editComment', props.comment._id)">Edit</button></li>
      <button class="options-button pure-button btn-small" @click="toggleOptions">Hide Options</button>
    </menu>
  </div>

  <img v-if="hasImage" class="postMedia image" :src="props.comment.image" />
  <video v-if="hasVideo" class="postMedia video" controls>
    <source v-if="hasVideo" :src="props.comment.video" type="video/mp4" />
  </video>

  <!-- truncate text, can view full text by expanding -->
  <p class="text single-line">{{ props.comment.content }}</p>
  <div class="base">
    <button v-if="!viewReplies" class="pure-button btn-small" @click="toggleReplies">View replies</button>
    <p v-if="viewReplies" class="replies">
      <button v-if="viewReplies" class="pure-button btn-small" @click="toggleReplies">Hide Replies</button>
      <commentList v-if="viewReplies" :parentId="props.comment._id" />
    </p>
    <article class="timestamp">
      <p v-if="props.comment.dateCreated !== props.comment.dateUpdated">Edited on: {{ formatDate(props.comment.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.comment.dateCreated) }}</p>
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

.options {
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

.comment-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.replies {
  display: flex;
  max-width: 200px;
  background-color: white;
  justify-content: center;
  flex-direction: column;
}
</style>
