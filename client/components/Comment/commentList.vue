<script setup lang="ts">
import commentComponent from "@/components/Comment/commentComponent.vue";
import createCommentForm from "@/components/Comment/createCommentForm.vue";
import editCommentForm from "@/components/Comment/editCommentForm.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
// import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
// const props = defineProps(["parentId"]);
// const props = defineProps({ parentId: { type: String, required: true }, isReplies: { type: Boolean, default: false } });
const props = defineProps(["parentId", "isReplies"]);
let pinnedComments = ref<Array<Record<string, string>>>([]);
let comments = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let viewComments = ref(false);

async function getComments(parentId: string) {
  let query: Record<string, string> = parentId !== undefined ? { parentId } : {};
  let commentResults;
  try {
    // originally passed in query instead of parentId in fetchy?
    commentResults = await fetchy(`/api/pins/comments/${parentId}`, "GET");
    // console.log("commentResults", commentResults);
  } catch (_) {
    return;
  }
  comments.value = commentResults["UnPinned Comments"];
  pinnedComments.value = commentResults["Pinned Comments"];
  // console.log("comments.value", comments.value);
  // console.log("pinnedComments.value", pinnedComments.value);
}

function updateEditing(id: string) {
  editing.value = id;
}

function toggleComments() {
  viewComments.value = !viewComments.value;
}

onBeforeMount(async () => {
  await getComments(props.parentId);
  loaded.value = true;
});
</script>

<template>
  <section class="comments" v-if="loaded && viewComments === true">
    <createCommentForm :parent="props.parentId" @refreshComments="getComments($props.parentId)" />
    <!-- putting pinned comments first, need to troubleshoot pins -->
    <article v-for="pinnedComment in pinnedComments" :key="pinnedComment._id">
      <commentComponent v-if="editing !== pinnedComment._id" :comment="pinnedComment" :isPinned="true" :isReply="false" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" />
      <editCommentForm v-else :comment="pinnedComment" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" />
    </article>
    <article v-for="comment in comments" :key="comment._id">
      <commentComponent v-if="editing !== comment._id" :comment="comment" :isPinned="false" :isReply="props.isReplies" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" />
      <editCommentForm v-else :comment="comment" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" />
    </article>
    <button v-if="isReplies" class="pure-button btn-small" @click="toggleComments">Hide Replies</button>
    <button v-else class="comment-visibility pure-button" @click="toggleComments">Hide Comments</button>
  </section>
  <section v-else-if="viewComments !== true">
    <button v-if="isReplies" class="pure-button btn-small view-comments" @click="toggleComments">View Replies</button>
    <button v-else class="comment-visibility pure-button view-comments" @click="toggleComments">View Comments</button>
  </section>
  <p v-else-if="loaded">No comments found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  /* max-width: 60em; */
  width: 70%;
  max-width: 750px;
}

article {
  background-color: white;
  border-radius: 1em;
  border-width: 2px;
  border-style: solid;
  border-color: #d6eaf9ff;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  /* width: 70vh; */
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  /* max-width: 70em; */
}

.view-comments {
  gap: 1em;
  margin: 1em;
}

button {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 10px;
  max-width: 100px;
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

.comment-visibility {
  font-size: 14px;
}
</style>
