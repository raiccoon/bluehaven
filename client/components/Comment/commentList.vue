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
const props = defineProps(["parentId"]);
let pins = ref<Array<Record<string, string>>>([]);
let comments = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let viewComments = ref(false);

async function getComments(parentId: string) {
  let query: Record<string, string> = parentId !== undefined ? { parentId } : {};
  let commentResults;
  try {
    // originally passed in query instead of parentId in fetchy?
    commentResults = await fetchy(`/api/pins/comments/${parentId}`, "GET");
  } catch (_) {
    return;
  }
  comments.value = commentResults["UnPinned Comments"];
  pins.value = commentResults["Pinned Comments"];
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
    <article v-for="pinnedComment in pins" :key="pinnedComment._id">
      <commentComponent v-if="editing !== pinnedComment.comment" :comment="pinnedComment.comment" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" />
      <editCommentForm v-else :comment="pinnedComment" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" />
    </article>
    <article v-for="comment in comments" :key="comment._id">
      <commentComponent v-if="editing !== comment._id" :comment="comment" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" />
      <editCommentForm v-else :comment="comment" @refreshComments="getComments($props.parentId)" @editComment="updateEditing" />
    </article>
    <button class="pure-button" @click="toggleComments">Hide Comments</button>
  </section>
  <section v-else-if="viewComments !== true">
    <button class="pure-button" @click="toggleComments">View Comments</button>
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
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 70vh;
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
</style>
