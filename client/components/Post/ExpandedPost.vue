<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { ObjectId } from "mongodb";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";
import ToggleBookmarkButton from "../Bookmark/ToggleBookmarkButton.vue";
import EditPostButton from "./EditPostButton.vue";

const hasImage = ref(false);
const hasVideo = ref(false);

const isBookmarked = ref(false);

const props = defineProps(["postId", "author"]);
const loaded = ref(false);

let post = ref();
let classId = ref();
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${post.value._id}`, "DELETE");
    //push to class of post instead
    void router.push({ path: `/classes/${classId.value}` });
  } catch {
    return;
  }
};

async function getPostById(_id: ObjectId) {
  let postResults;
  try {
    postResults = await fetchy(`/api/posts/${_id}`, "GET");
  } catch (_) {
    return;
  }
  post.value = postResults;

  try {
    if (post.value.image !== "") {
      hasImage.value = true;
    }
    if (post.value.video !== "") {
      hasVideo.value = true;
    }
  } catch (_) {
    return;
  }
}

async function isPostBookmarked(postId: string) {
  let bookmarkResults;
  try {
    bookmarkResults = await fetchy(`/api/bookmarks`, "GET", {
      query: { post: postId },
    });
  } catch (_) {
    return;
  }
  isBookmarked.value = bookmarkResults;
}

async function refreshBookmark(postId: string) {
  await isPostBookmarked(postId);
}

onBeforeMount(async () => {
  let classResult;
  try {
    await getPostById(props.postId);
    classResult = await fetchy(`/api/posts/${props.postId}/class`, "GET");
    classId.value = classResult._id;
    loaded.value = true;
  } catch (_) {
    return;
  }
  await refreshBookmark(props.postId);
});
</script>

<template>
  <main>
    <section class="article" v-if="loaded">
      <ToggleBookmarkButton @updatedBookmarkState="refreshBookmark(post._id)" :postId="post._id" :isBookmarked="isBookmarked" />
        <p class="author">{{ post.author }}</p>
        <p class="text single-line">{{ post.content }}</p>
      <div class="base">
        <menu>
        <!-- will implement editing within expanded view later? -->
          <li><EditPostButton :post="post" @editPost="getPostById(post._id)" /></li>
          <li><button v-if="post.author == currentUsername" class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
        </menu>
        <article class="timestamp">
          <p v-if="post.dateCreated !== post.dateUpdated">Edited on: {{ formatDate(post.dateUpdated) }}</p>
          <p v-else>Created on: {{ formatDate(post.dateCreated) }}</p>
        </article>
      </div>
    </section>
    <p v-else>Loading...</p>
  </main>

</template>

<style scoped>
main {
  border: solid black 1px;
  width: 400px;
}
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}
.article {
  border-radius: 15px;
  width: 100%;
  height: 100%;
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

menu {
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
  max-width: 500px;
  height: auto;
  align-self: center;
  text-align: center;
}
.text.single-line {
  white-space: nowrap;
  text-wrap: balance;
}
</style>
