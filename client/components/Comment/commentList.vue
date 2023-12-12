<script setup lang="ts">
import CreateCommentButton from "@/components/Comment/CreateCommentButton.vue";
import commentComponent from "@/components/Comment/commentComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import SelectLabelForm from "../Label/SelectLabelForm.vue";

const loaded = ref(false);
const props = defineProps(["parentId", "isReplies"]);
let pinnedComments = ref<Array<Record<string, string>>>([]);
let comments = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let viewComments = ref(false);
let isInstructor = ref(false);

async function getComments(parentId: string, filterByLabel?: string) {
  let query: Record<string, string> = filterByLabel !== undefined ? { filterByLabel } : {};
  let commentResults;
  try {
    commentResults = await fetchy(`/api/posts/${parentId}/comments`, "GET", { query });
  } catch (_) {
    return;
  }
  comments.value = commentResults["UnPinned Comments"];
  pinnedComments.value = commentResults["Pinned Comments"];
  editing.value = "";
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
  <div class="main" v-if="loaded">
    <div class="container" v-if="viewComments">
      <div @click="toggleComments" class="hideButton">Hide</div>
      <CreateCommentButton :parent="props.parentId" :isReply="props.isReplies" @refreshComments="getComments($props.parentId)" />
      <SelectLabelForm v-if="!isReplies" :postId="props.parentId" @filterByLabel="getComments" />
      <div class="comment-section" v-if="(comments.length || pinnedComments.length) && viewComments">
        <article v-for="pinnedComment in pinnedComments" :key="pinnedComment._id">
          <commentComponent
            v-if="editing !== pinnedComment._id"
            :comment="pinnedComment"
            :isPinned="true"
            :isReply="false"
            @refreshComments="getComments($props.parentId)"
            @editComment="updateEditing"
          />
          <EditCommentButton v-else :comment="pinnedComment" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" />
        </article>
        <article v-for="comment in comments" :key="comment._id">
          <commentComponent v-if="editing !== comment._id" :comment="comment" :isPinned="false" :isReply="props.isReplies" @editComment="updateEditing" />
          <!-- <EditCommentButton v-else :comment="comment" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" /> -->
        </article>
      </div>
      <div class="noCommentsMessage" v-if="!(comments.length || pinnedComments.length)">
        <p v-if="isReplies">No replies found</p>
        <p v-else>No comments found</p>
      </div>
    </div>
    <div class="bigboycontainer" v-else>
      <div class="viewRepliesContainer">
        <button v-if="isReplies" class="viewReplies" @click="toggleComments">View Replies</button>
      </div>
      <div class="bigboy" v-if="!isReplies" @click="toggleComments">
        <p class="commentSectionText">
          <span class="comment">View</span><br />
          <span class="comment">Comment</span><br />
          <span class="section">Section</span><br />
          <i class="material-symbols-outlined eye">double_arrow</i>
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap");
.viewRepliesContainer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.viewReplies {
  background-color: transparent;
  border: none;
  color: rgb(81, 174, 245);
  padding: 0px;
}

.viewReplies:hover {
  text-decoration: underline;
}
.hideButton {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 30px;
  margin-top: 5px;
}
.hideButton:hover {
  text-decoration: underline;
  cursor: pointer;
}
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
.commentSectionText {
  margin-left: 10px;
  margin-right: 10px;
  text-align: center;
}
.bigboycontainer {
  height: 100%;
  width: 100%;
  border-radius: 8px;
}
.bigboy {
  height: 100%;
  width: 100%;
  border-radius: 8px;
  background-color: #eff0f6ff;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.bigboy:hover {
  background-color: rgb(180, 204, 227);
}
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
.container {
  border: solid rgb(0, 115, 255) 1px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.comment-section {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: calc(100% - 140px);
  overflow-y: scroll;
  width: 300px;
  margin-left: 20px;
  margin-right: 20px;
}

article {
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border: solid 2px #d6eaf9ff;
  border-radius: 8px;
  padding: 1em;
  width: 88%;
  max-width: 550px;
  margin-bottom: 5px;
}
</style>
