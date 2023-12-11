<script setup lang="ts">
import CreateCommentButton from "@/components/Comment/CreateCommentButton.vue";
import EditCommentButton from "@/components/Comment/EditCommentButton.vue";
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
      <CreateCommentButton :parent="props.parentId" :isReply="props.isReplies" @refreshComments="getComments($props.parentId)" />
      <div class="filterPlusComments" v-if="comments.length || pinnedComments.length">
        <SelectLabelForm v-if="!isReplies" :postId="props.parentId" @filterByLabel="getComments" />
        <div class="comment-section" v-if="viewComments">
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
            <commentComponent
              v-if="editing !== comment._id"
              :comment="comment"
              :isPinned="false"
              :isReply="props.isReplies"
              @refreshComments="getComments($props.parentId)"
              @editComment="updateEditing"
            />
            <EditCommentButton v-else :comment="comment" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" />
          </article>
        </div>
      </div>
      <div class="noCommentsMessage" v-else>
        <p>No comments found</p>
      </div>
    </div>
    <div class="bigButton" v-else>
      <button v-if="isReplies" @click="toggleComments">Reply Section</button>
      <button v-else @click="toggleComments">Comment Section</button>
    </div>
    <section class="hideButtons" v-if="viewComments">
      <button v-if="isReplies" @click="toggleComments">Collapse Replies</button>
      <button v-else @click="toggleComments">Collapse Comments</button>
    </section>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
}
.container {
  border: solid rgb(255, 0, 0) 1px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  height: 100%;
  box-sizing: border-box;
}
.filterPlusComments {
  border: solid rgb(0, 185, 34) 1px;
  height: calc(100% - 63px);
}

.comment-section {
  border: solid rgb(0, 249, 249) 1px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: calc(100% - 44px);
  overflow-y: scroll;
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
  width: 85%;
  max-width: 550px;
}
</style>
