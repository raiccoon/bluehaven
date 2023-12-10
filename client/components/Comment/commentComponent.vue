<script setup lang="ts">
import commentList from "@/components/Comment/commentList.vue";
// import labelsOnComment from "@/components/Label/labelsOnComment.vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import AddLabelForm from "../Label/AddLabelForm.vue";

const props = defineProps(["comment", "isPinned", "isReply"]);
const emit = defineEmits(["editComment", "refreshComments"]);
const { currentUsername } = storeToRefs(useUserStore());

const hasImage = ref(false);
const hasVideo = ref(false);
const viewOptions = ref(false);
const viewReplies = ref(false);
let isInstructor = ref(false);

const labels = ref<Array<Record<string, string>>>([]);

const isAddLabelModelOpen = ref(false);

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

const togglePin = async () => {
  try {
    if (props.isPinned) {
      await fetchy(`/api/pins/comment/${props.comment._id}`, "DELETE");
    } else {
      await fetchy("/api/pins", "POST", {
        body: { postId: props.comment.parentId, commentId: props.comment._id },
      });
    }
  } catch {
    return;
  }
  emit("refreshComments");
};

const toggleLabelModal = async () => {
  isAddLabelModelOpen.value = !isAddLabelModelOpen.value;
};

const getLabelsOnComment = async () => {
  try {
    labels.value = await fetchy(`/api/comments/${props.comment._id}/labels`, "GET");
    emit("refreshComments");
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
    if (!props.isReply) {
      const classObj = await fetchy(`/api/posts/${props.comment.parentId}/class`, "GET");
      isInstructor.value = await fetchy(`/api/classes/id/${classObj._id}/membership/isInstructor`, "GET", {
        query: { username: currentUsername.value },
      });
    }
  } catch (_) {
    return;
  }
  await getLabelsOnComment();
});
</script>

<template>
  <div class="comment-header">
    <div class="user-info">
      <div class="author">{{ props.comment.author }}</div>
      <em v-if="isPinned">(pinned)</em>
    </div>

    <!-- placeholder for triple dots -->
    <button v-if="!viewOptions" class="options-button pure-button btn-small" @click="toggleOptions">Options</button>
    <menu class="options" v-if="viewOptions">
      <li><button v-if="props.comment.author == currentUsername" class="button-error btn-small pure-button" @click="deleteComment">Delete</button></li>
      <li><button v-if="props.comment.author == currentUsername" class="btn-small pure-button" @click="emit('editComment', props.comment._id)">Edit</button></li>
      <li><button class="btn-small pure-button" @click="toggleLabelModal">Add Label</button></li>
      <li v-if="isPinned && isInstructor"><button class="btn-small pure-button" @click="togglePin">Unpin</button></li>
      <li v-if="!isPinned && isInstructor"><button class="btn-small pure-button" @click="togglePin">Pin</button></li>
      <button class="options-button pure-button btn-small" @click="toggleOptions">Hide Options</button>
    </menu>
  </div>

  <!-- <labelsOnComment :comment="props.comment" /> -->
  <div class="label-list">
    <div class="label-item" v-for="label in labels" :key="label._id">{{ label.name }}</div>
  </div>

  <img v-if="hasImage" class="postMedia image" :src="props.comment.image" />
  <video v-if="hasVideo" class="postMedia video" controls>
    <source v-if="hasVideo" :src="props.comment.video" type="video/mp4" />
  </video>

  <!-- truncate text, can view full text by expanding -->
  <p class="text single-line">{{ props.comment.content }}</p>
  <div class="base">
    <commentList :parentId="props.comment._id" :isReplies="true" />
    <article class="timestamp">
      <p v-if="props.comment.dateCreated !== props.comment.dateUpdated">Edited on: {{ formatDate(props.comment.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.comment.dateCreated) }}</p>
    </article>
  </div>

  <AddLabelForm v-if="isAddLabelModelOpen" @updatedLabels="getLabelsOnComment" :comment="comment" :labels="labels" />
  <!-- {{ labels.map((label) => label.name) }} -->
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
  justify-content: center;
  flex-direction: column;
}

.label {
  background-color: gray;
  padding: 0.5rem;
  border-radius: 10%;
  color: white;
}

.user-info {
  display: flex;
  flex-direction: row;
  gap: 1em;
}

button {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color, border-color, color, box-shadow, filter;
  transition-duration: 0.3s;
  border: 1px solid transparent;
  letter-spacing: 2px;
  min-width: 70px;
  white-space: normal;
  text-align: center;
  padding: 5px 5px 5px;
  color: #5190bbff;
  box-shadow: inset 0 0 0 2px #d6eaf9ff;
  background-color: white;
  height: 40px;
}

.label-list {
  display: flex;
  flex-direction: row;
  max-width: 100%;
  overflow-x: scroll;
}

.label-item {
  font-size: 12px;
  background-color: #d6eaf9ff;
  border-radius: 30%;
  padding: 0.5em;
  margin-left: 0.5em;
  margin-right: 0.5em;
}
</style>
